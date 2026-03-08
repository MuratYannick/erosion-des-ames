'use strict';

/**
 * Unit tests for sanctionExpirationService.
 *
 * All Sequelize models are fully mocked — no real database is involved.
 * The mock for UserSanction replicates the chaining pattern used by Sequelize
 * scopes: UserSanction.scope('expired').findAll().
 *
 * NOTE: jest.config.js sets resetMocks: true, which resets jest.fn()
 * implementations (but not the module registry) between tests. To survive
 * this, the mock module exposes plain objects with jest.fn() properties that
 * are re-configured in each beforeEach. The scope() entry point uses a plain
 * function (not a jest.fn()) so that it always delegates to the current
 * mockFindAll reference regardless of resets.
 */

// ─── Shared mock functions — declared here so tests can reconfigure them ───

const mockFindAll = jest.fn();
const mockSanctionUpdate = jest.fn();
const mockUserUpdate = jest.fn();
const mockModerationLog = jest.fn();

// Models must be mocked BEFORE the service is required so that the service
// module picks up the mocked version when its own require('../models') executes.
jest.mock('../../../models', () => ({
  UserSanction: {
    // Plain function (not jest.fn()) so that resetMocks does not wipe it out.
    // It always delegates to mockFindAll which is reconfigured in each beforeEach.
    scope: () => ({ findAll: mockFindAll }),
  },
  User: {
    update: mockUserUpdate,
  },
  ModerationAction: {
    log: mockModerationLog,
  },
}));

const { expireOutdatedSanctions } = require('../../../services/sanctionExpirationService');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a minimal fake UserSanction instance whose update() method is
 * backed by mockSanctionUpdate (shared) unless overridden.
 */
function makeSanction(overrides = {}) {
  return {
    id: 1,
    userId: 'user-uuid-aabbccdd',
    type: 'mute',
    reason: 'Comportement inapproprie',
    expiresAt: new Date('2026-03-07T12:00:00Z'),
    update: mockSanctionUpdate,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('sanctionExpirationService', () => {
  describe('expireOutdatedSanctions', () => {

    // ── 1. No expired sanctions ────────────────────────────────────────────

    describe('when there are no expired sanctions', () => {
      beforeEach(() => {
        mockFindAll.mockResolvedValue([]);
      });

      it('should return 0 without calling sanction.update', async () => {
        const count = await expireOutdatedSanctions();

        expect(count).toBe(0);
        expect(mockSanctionUpdate).not.toHaveBeenCalled();
      });

      it('should not call User.update when there is nothing to expire', async () => {
        await expireOutdatedSanctions();

        expect(mockUserUpdate).not.toHaveBeenCalled();
      });

      it('should not create any ModerationAction audit entry', async () => {
        await expireOutdatedSanctions();

        expect(mockModerationLog).not.toHaveBeenCalled();
      });
    });

    // ── 2. Expiring a mute ─────────────────────────────────────────────────

    describe('when a mute sanction expires', () => {
      let muteSanction;

      beforeEach(() => {
        muteSanction = makeSanction({ id: 10, type: 'mute' });
        mockFindAll.mockResolvedValue([muteSanction]);
        mockSanctionUpdate.mockResolvedValue(muteSanction);
        mockModerationLog.mockResolvedValue({});
      });

      it('should set isActive to false on the sanction', async () => {
        await expireOutdatedSanctions();

        expect(mockSanctionUpdate).toHaveBeenCalledWith({ isActive: false });
      });

      it('should NOT re-activate the user account', async () => {
        await expireOutdatedSanctions();

        expect(mockUserUpdate).not.toHaveBeenCalled();
      });

      it('should return 1', async () => {
        const count = await expireOutdatedSanctions();

        expect(count).toBe(1);
      });

      it('should create a ModerationAction audit entry with the correct fields', async () => {
        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledTimes(1);
        expect(mockModerationLog).toHaveBeenCalledWith({
          actionType: 'expire_sanction',
          moderatorId: null,
          targetUserId: muteSanction.userId,
          targetId: muteSanction.id,
          targetType: 'user_sanction',
          reason: expect.stringContaining('mute'),
          details: {
            sanctionType: 'mute',
            expiresAt: muteSanction.expiresAt,
            originalReason: muteSanction.reason,
          },
        });
      });
    });

    // ── 3. Expiring a ban ──────────────────────────────────────────────────

    describe('when a ban sanction expires', () => {
      let banSanction;

      beforeEach(() => {
        banSanction = makeSanction({
          id: 20,
          type: 'ban',
          userId: 'user-uuid-banned-0001',
        });
        mockFindAll.mockResolvedValue([banSanction]);
        mockSanctionUpdate.mockResolvedValue(banSanction);
        mockUserUpdate.mockResolvedValue([1]);
        mockModerationLog.mockResolvedValue({});
      });

      it('should set isActive to false on the sanction', async () => {
        await expireOutdatedSanctions();

        expect(mockSanctionUpdate).toHaveBeenCalledWith({ isActive: false });
      });

      it('should re-activate the banned user account', async () => {
        await expireOutdatedSanctions();

        expect(mockUserUpdate).toHaveBeenCalledTimes(1);
        expect(mockUserUpdate).toHaveBeenCalledWith(
          { isActive: true },
          { where: { id: banSanction.userId } }
        );
      });

      it('should return 1', async () => {
        const count = await expireOutdatedSanctions();

        expect(count).toBe(1);
      });

      it('should create a ModerationAction audit entry with actionType "expire_sanction"', async () => {
        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledWith(
          expect.objectContaining({
            actionType: 'expire_sanction',
            moderatorId: null,
            targetUserId: banSanction.userId,
            targetId: banSanction.id,
            targetType: 'user_sanction',
          })
        );
      });

      it('should include ban details in the ModerationAction', async () => {
        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledWith(
          expect.objectContaining({
            details: {
              sanctionType: 'ban',
              expiresAt: banSanction.expiresAt,
              originalReason: banSanction.reason,
            },
          })
        );
      });
    });

    // ── 4. Multiple sanctions processed independently ──────────────────────

    describe('when multiple sanctions have expired', () => {
      let muteSanction;
      let banSanction;
      let otherMute;

      beforeEach(() => {
        muteSanction = makeSanction({ id: 31, type: 'mute', userId: 'user-muted-0001' });
        banSanction = makeSanction({ id: 32, type: 'ban', userId: 'user-banned-0002' });
        otherMute = makeSanction({ id: 33, type: 'mute', userId: 'user-muted-0003' });
        mockFindAll.mockResolvedValue([muteSanction, banSanction, otherMute]);
        mockSanctionUpdate.mockResolvedValue({});
        mockUserUpdate.mockResolvedValue([1]);
        mockModerationLog.mockResolvedValue({});
      });

      it('should return the total number of processed sanctions', async () => {
        const count = await expireOutdatedSanctions();

        expect(count).toBe(3);
      });

      it('should call sanction.update once per sanction', async () => {
        await expireOutdatedSanctions();

        expect(mockSanctionUpdate).toHaveBeenCalledTimes(3);
      });

      it('should re-activate only the banned users (not the muted ones)', async () => {
        await expireOutdatedSanctions();

        // Only the ban should trigger User.update
        expect(mockUserUpdate).toHaveBeenCalledTimes(1);
        expect(mockUserUpdate).toHaveBeenCalledWith(
          { isActive: true },
          { where: { id: banSanction.userId } }
        );
      });

      it('should create one ModerationAction per sanction', async () => {
        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledTimes(3);
      });

      it('should log each sanction with its own targetId and targetUserId', async () => {
        await expireOutdatedSanctions();

        const logCalls = mockModerationLog.mock.calls.map((c) => c[0]);

        expect(logCalls).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ targetId: 31, targetUserId: 'user-muted-0001' }),
            expect.objectContaining({ targetId: 32, targetUserId: 'user-banned-0002' }),
            expect.objectContaining({ targetId: 33, targetUserId: 'user-muted-0003' }),
          ])
        );
      });
    });

    // ── 5. Per-sanction error does not abort the batch ─────────────────────

    describe('when one sanction throws an error during processing', () => {
      let goodSanction;
      let failingSanction;
      let anotherGoodSanction;

      beforeEach(() => {
        // A dedicated mock for the failing sanction so we can make its update reject.
        const failingUpdateMock = jest.fn().mockRejectedValue(new Error('DB write error'));

        goodSanction = makeSanction({ id: 41, type: 'mute', userId: 'user-ok-0001' });
        failingSanction = {
          ...makeSanction({ id: 42, type: 'mute', userId: 'user-fail-0002' }),
          update: failingUpdateMock,
        };
        anotherGoodSanction = makeSanction({ id: 43, type: 'ban', userId: 'user-ok-0003' });

        mockFindAll.mockResolvedValue([goodSanction, failingSanction, anotherGoodSanction]);
        // mockSanctionUpdate covers goodSanction (id 41) and anotherGoodSanction (id 43)
        mockSanctionUpdate.mockResolvedValue({});
        mockUserUpdate.mockResolvedValue([1]);
        mockModerationLog.mockResolvedValue({});
      });

      it('should still process the remaining sanctions', async () => {
        const count = await expireOutdatedSanctions();

        // Only 2 out of 3 succeed (the failing one is skipped)
        expect(count).toBe(2);
      });

      it('should call update on the sanctions that do not fail', async () => {
        await expireOutdatedSanctions();

        // mockSanctionUpdate is shared by goodSanction and anotherGoodSanction
        expect(mockSanctionUpdate).toHaveBeenCalledTimes(2);
      });

      it('should still re-activate the user for the successful ban', async () => {
        await expireOutdatedSanctions();

        expect(mockUserUpdate).toHaveBeenCalledWith(
          { isActive: true },
          { where: { id: anotherGoodSanction.userId } }
        );
      });

      it('should still log ModerationActions for the successful sanctions', async () => {
        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledTimes(2);
      });

      it('should log the per-sanction error to console.error', async () => {
        await expireOutdatedSanctions();

        // console.error is globally mocked as jest.fn() via tests/setup.js
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('id=42'),
          expect.any(Error)
        );
      });
    });

    // ── 6. Outer findAll failure returns 0 gracefully ──────────────────────

    describe('when the initial findAll query fails', () => {
      beforeEach(() => {
        mockFindAll.mockRejectedValue(new Error('Connection refused'));
      });

      it('should return 0 and not throw', async () => {
        const count = await expireOutdatedSanctions();

        expect(count).toBe(0);
      });

      it('should log the outer error to console.error', async () => {
        await expireOutdatedSanctions();

        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('récupération des sanctions expirées'),
          expect.any(Error)
        );
      });

      it('should not attempt to update any sanction or user', async () => {
        await expireOutdatedSanctions();

        expect(mockSanctionUpdate).not.toHaveBeenCalled();
        expect(mockUserUpdate).not.toHaveBeenCalled();
        expect(mockModerationLog).not.toHaveBeenCalled();
      });
    });

    // ── 7. ModerationAction.log — system action semantics ─────────────────

    describe('audit trail — system action semantics', () => {
      it('should always pass moderatorId: null to ModerationAction.log', async () => {
        const sanction = makeSanction({ id: 51, type: 'mute' });
        mockFindAll.mockResolvedValue([sanction]);
        mockSanctionUpdate.mockResolvedValue({});
        mockModerationLog.mockResolvedValue({});

        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledWith(
          expect.objectContaining({ moderatorId: null })
        );
      });

      it('should always use targetType: "user_sanction"', async () => {
        const sanction = makeSanction({ id: 52, type: 'ban', userId: 'user-uuid-check' });
        mockFindAll.mockResolvedValue([sanction]);
        mockSanctionUpdate.mockResolvedValue({});
        mockUserUpdate.mockResolvedValue([1]);
        mockModerationLog.mockResolvedValue({});

        await expireOutdatedSanctions();

        expect(mockModerationLog).toHaveBeenCalledWith(
          expect.objectContaining({ targetType: 'user_sanction' })
        );
      });

      it('should include the sanction type in the reason string', async () => {
        const sanction = makeSanction({ id: 53, type: 'ban' });
        mockFindAll.mockResolvedValue([sanction]);
        mockSanctionUpdate.mockResolvedValue({});
        mockUserUpdate.mockResolvedValue([1]);
        mockModerationLog.mockResolvedValue({});

        await expireOutdatedSanctions();

        const { reason } = mockModerationLog.mock.calls[0][0];
        expect(reason).toContain('ban');
      });

      it('should preserve the original reason from the sanction in details', async () => {
        const sanction = makeSanction({
          id: 54,
          type: 'mute',
          reason: 'Spam repetitif dans le forum',
        });
        mockFindAll.mockResolvedValue([sanction]);
        mockSanctionUpdate.mockResolvedValue({});
        mockModerationLog.mockResolvedValue({});

        await expireOutdatedSanctions();

        const { details } = mockModerationLog.mock.calls[0][0];
        expect(details.originalReason).toBe('Spam repetitif dans le forum');
      });

      it('should preserve the expiresAt date from the sanction in details', async () => {
        const expiry = new Date('2026-03-01T00:00:00Z');
        const sanction = makeSanction({ id: 55, type: 'mute', expiresAt: expiry });
        mockFindAll.mockResolvedValue([sanction]);
        mockSanctionUpdate.mockResolvedValue({});
        mockModerationLog.mockResolvedValue({});

        await expireOutdatedSanctions();

        const { details } = mockModerationLog.mock.calls[0][0];
        expect(details.expiresAt).toBe(expiry);
      });
    });

  });
});

/*
 * ============================================================================
 * Coverage summary
 * ============================================================================
 *
 * Happy paths covered:
 *   - Zero sanctions found             → returns 0, no side-effects
 *   - One mute expires                 → isActive set to false, user NOT reactivated
 *   - One ban expires                  → isActive set to false, user IS reactivated
 *   - Multiple mixed sanctions         → each processed independently, correct count
 *
 * Error / edge cases covered:
 *   - Per-sanction error               → does not abort the loop; other sanctions
 *                                        are still processed; count reflects only
 *                                        successful ones; error logged to console
 *   - Outer findAll rejection          → returns 0, does not throw, logs error
 *
 * Audit trail (ModerationAction.log) covered:
 *   - moderatorId always null          → system-action semantics verified
 *   - targetType always 'user_sanction'
 *   - actionType always 'expire_sanction'
 *   - details.sanctionType, .expiresAt, .originalReason all forwarded correctly
 *   - reason string contains the sanction type
 *   - Multiple sanctions → one log entry per sanction, each with correct ids
 *
 * Recommendations for complementary testing:
 *   - Integration test: run a real DB query with the 'expired' scope against a
 *     seeded dataset to verify the SQL filter (isActive=true, expiresAt <= NOW())
 *     matches only the expected rows.
 *   - Integration test: verify that a banned user's isActive column is actually
 *     set to true in the database after the job runs end-to-end.
 *   - Manual / E2E test: start the cron job (expireSanctionsJob) and confirm the
 *     log line "[expireSanctionsJob] X sanction(s) expirée(s)" appears after the
 *     first tick when expired records exist.
 * ============================================================================
 */
