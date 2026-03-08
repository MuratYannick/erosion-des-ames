'use strict';

// ---------------------------------------------------------------------------
// Mocks AVANT les imports — requis pour le hoisting Jest
// ---------------------------------------------------------------------------

// asyncHandler mock : retourne la Promise interne pour que
// `await handler(req, res, next)` attende la résolution complète,
// y compris le catch(next) en cas d'erreur.
jest.mock('../../../middlewares/errorHandler', () => {
  const actual = jest.requireActual('../../../middlewares/errorHandler');
  return {
    ...actual,
    asyncHandler: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
  };
});

jest.mock('../../../models', () => ({
  ForumCategory: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  ForumTopic: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  ForumPost: {
    update: jest.fn(),
    findOne: jest.fn(),
  },
  User: {},
  ModerationAction: {
    log: jest.fn(),
  },
  // sequelize.transaction doit être un jest.fn() — son implémentation
  // est restaurée dans beforeEach car resetMocks:true l'efface entre tests.
  sequelize: {
    transaction: jest.fn(),
  },
}));

// Mock du service de permissions : par défaut tout le monde a la permission.
// L'implémentation est également restaurée dans beforeEach.
jest.mock('../../../services/categoryPermissionService', () => ({
  hasPermissionOrNoRestrictions: jest.fn(),
  userHasPermission: jest.fn(),
  getCategoryPermissionsForUser: jest.fn(),
}));

// ---------------------------------------------------------------------------
// Imports post-mock
// ---------------------------------------------------------------------------

const { moveTopic, mergeTopics } = require('../../../controllers/adminForumController');
const { ForumCategory, ForumTopic, ForumPost, ModerationAction, sequelize } = require('../../../models');
const categoryPermissionService = require('../../../services/categoryPermissionService');
// Import actual errorHandler to wire it into next() so that ApiError throws
// are translated to res.status().json() calls, matching the real Express chain.
const { errorHandler } = require('../../../middlewares/errorHandler');

// ---------------------------------------------------------------------------
// Shared mock transaction object (constant reference, not re-created per test)
// ---------------------------------------------------------------------------

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a mock req/res/next triple.
 *
 * `next` is wired to the real errorHandler so that `throw ApiError.xxx()`
 * inside controllers produces the expected res.status(xxx).json(...) call,
 * exactly as Express would in production.
 *
 * @param {object} params  - req.params
 * @param {object} body    - req.body
 * @param {object} [user]  - req.user (defaults to ADMIN)
 */
const makeReqResNext = (params = {}, body = {}, user = null) => {
  const req = {
    params,
    body,
    path: '/test',
    method: 'PATCH',
    user: user ?? { id: 'admin-uuid', role: 'ADMIN' },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  // Wire next to errorHandler so ApiError instances are properly formatted
  const next = jest.fn((err) => {
    if (err) errorHandler(err, req, res, () => {});
  });
  return { req, res, next };
};

/**
 * Creates a mock ForumTopic instance with writable properties and jest methods.
 */
const makeMockTopic = (overrides = {}) => ({
  id: 1,
  categoryId: 10,
  title: 'Test topic',
  postCount: 5,
  lastPostId: 50,
  lastPostAt: new Date('2026-01-01'),
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  reload: jest.fn().mockResolvedValue(true),
  ...overrides,
});

/**
 * Creates a mock ForumCategory instance.
 */
const makeMockCategory = (overrides = {}) => ({
  id: 10,
  name: 'General',
  topicCount: 3,
  postCount: 15,
  lastPostId: 50,
  update: jest.fn().mockResolvedValue(true),
  ...overrides,
});

// ---------------------------------------------------------------------------
// Global beforeEach — restore implementations wiped by resetMocks:true
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Restore sequelize.transaction to execute the callback synchronously
  sequelize.transaction.mockImplementation((cb) => cb(mockTransaction));

  // Restore permission service defaults (everyone has permission)
  categoryPermissionService.hasPermissionOrNoRestrictions.mockResolvedValue(true);
  categoryPermissionService.userHasPermission.mockResolvedValue(true);
  categoryPermissionService.getCategoryPermissionsForUser.mockResolvedValue({});

  // Restore ModerationAction.log
  ModerationAction.log.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// moveTopic
// ---------------------------------------------------------------------------

describe('adminForumController.moveTopic', () => {
  const SOURCE_CATEGORY_ID = 10;
  const DEST_CATEGORY_ID = 20;
  const TOPIC_ID = '1';

  // Local mutable instances — re-created per test
  let sourceTopic;
  let sourceCategory;
  let destCategory;

  beforeEach(() => {
    sourceTopic = makeMockTopic({ id: 1, categoryId: SOURCE_CATEGORY_ID, postCount: 5 });
    sourceCategory = makeMockCategory({ id: SOURCE_CATEGORY_ID, topicCount: 3, postCount: 15 });
    destCategory = makeMockCategory({
      id: DEST_CATEGORY_ID,
      name: 'Annonces',
      topicCount: 1,
      postCount: 4,
    });

    ForumTopic.findByPk.mockImplementation((id) =>
      String(id) === String(sourceTopic.id)
        ? Promise.resolve(sourceTopic)
        : Promise.resolve(null)
    );

    ForumCategory.findByPk.mockImplementation((id) => {
      if (String(id) === String(SOURCE_CATEGORY_ID)) return Promise.resolve(sourceCategory);
      if (String(id) === String(DEST_CATEGORY_ID)) return Promise.resolve(destCategory);
      return Promise.resolve(null);
    });
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  describe('happy path', () => {
    it('should return 200 and move the topic to the destination category', async () => {
      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('Annonces'),
        })
      );
    });

    it('should update topic.categoryId to the destination category', async () => {
      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(sourceTopic.update).toHaveBeenCalledWith(
        { categoryId: DEST_CATEGORY_ID },
        expect.objectContaining({ transaction: mockTransaction })
      );
    });

    it('should decrement topicCount and postCount on the source category', async () => {
      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(sourceCategory.update).toHaveBeenCalledWith(
        {
          topicCount: 2,  // max(0, 3 - 1)
          postCount: 10,  // max(0, 15 - 5)
        },
        expect.objectContaining({ transaction: mockTransaction })
      );
    });

    it('should increment topicCount and postCount on the destination category', async () => {
      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(destCategory.update).toHaveBeenCalledWith(
        {
          topicCount: 2,  // 1 + 1
          postCount: 9,   // 4 + 5
        },
        expect.objectContaining({ transaction: mockTransaction })
      );
    });

    it('should log a ModerationAction with move_topic type', async () => {
      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID, reason: 'Hors-sujet' }
      );

      await moveTopic(req, res, next);

      expect(ModerationAction.log).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: 'move_topic',
          targetId: sourceTopic.id,
          reason: 'Hors-sujet',
          details: expect.objectContaining({
            fromCategoryId: SOURCE_CATEGORY_ID,
            toCategoryId: DEST_CATEGORY_ID,
          }),
        })
      );
    });

    it('should clamp source topicCount and postCount to 0 when they would go negative', async () => {
      // Edge case: source category already has counters at 0
      sourceCategory.topicCount = 0;
      sourceCategory.postCount = 0;
      sourceTopic.postCount = 3;

      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(sourceCategory.update).toHaveBeenCalledWith(
        { topicCount: 0, postCount: 0 },
        expect.anything()
      );
    });
  });

  // ── Error cases ────────────────────────────────────────────────────────────

  describe('error cases', () => {
    it('should return 404 when the topic does not exist', async () => {
      ForumTopic.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext(
        { id: '999' },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      // No DB writes should occur
      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    it('should return 400 when the destination category is the same as the current one', async () => {
      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: SOURCE_CATEGORY_ID } // same as topic.categoryId
      );

      await moveTopic(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    it('should return 400 when the destination category does not exist', async () => {
      ForumCategory.findByPk.mockImplementation((id) => {
        if (String(id) === String(SOURCE_CATEGORY_ID)) return Promise.resolve(sourceCategory);
        return Promise.resolve(null); // destination not found
      });

      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: 9999 }
      );

      await moveTopic(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    it('should return 403 when user lacks move_topic permission on source category', async () => {
      // First permission call (source check) → denied; second (dest check) → allowed
      categoryPermissionService.hasPermissionOrNoRestrictions
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID },
        { id: 'moderator-uuid', role: 'MODERATOR' }
      );

      await moveTopic(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    it('should return 403 when user lacks move_topic permission on destination category', async () => {
      // First call (source) → allowed; second (dest) → denied
      categoryPermissionService.hasPermissionOrNoRestrictions
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID },
        { id: 'moderator-uuid', role: 'MODERATOR' }
      );

      await moveTopic(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(sequelize.transaction).not.toHaveBeenCalled();
    });

    it('should return 500 when an unexpected database error occurs inside the transaction', async () => {
      const dbError = new Error('DB connection lost');
      sourceTopic.update.mockRejectedValue(dbError);

      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      // next is called with the raw error, which is then handled by errorHandler → 500
      expect(next).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── Edge case: source category missing in DB ───────────────────────────────

  describe('source category not found in DB', () => {
    it('should still update the destination category when source category is missing', async () => {
      // The controller has an `if (sourceCategory)` guard — the transaction should proceed
      ForumCategory.findByPk.mockImplementation((id) => {
        if (String(id) === String(DEST_CATEGORY_ID)) return Promise.resolve(destCategory);
        return Promise.resolve(null); // source category missing
      });

      const { req, res, next } = makeReqResNext(
        { id: TOPIC_ID },
        { categoryId: DEST_CATEGORY_ID }
      );

      await moveTopic(req, res, next);

      expect(destCategory.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

// ---------------------------------------------------------------------------
// mergeTopics
// ---------------------------------------------------------------------------

describe('adminForumController.mergeTopics', () => {
  const SOURCE_TOPIC_ID = 1;
  const TARGET_TOPIC_ID = 2;
  const SHARED_CATEGORY_ID = 10;

  let sourceTopic;
  let targetTopic;
  let sharedCategory;
  let lastPost;

  beforeEach(() => {
    sourceTopic = makeMockTopic({
      id: SOURCE_TOPIC_ID,
      title: 'Ancien sujet',
      categoryId: SHARED_CATEGORY_ID,
      postCount: 3,
    });

    targetTopic = makeMockTopic({
      id: TARGET_TOPIC_ID,
      title: 'Sujet cible',
      categoryId: SHARED_CATEGORY_ID,
      postCount: 7,
      lastPostId: 70,
      lastPostAt: new Date('2026-01-10'),
    });

    sharedCategory = makeMockCategory({
      id: SHARED_CATEGORY_ID,
      topicCount: 5,
      postCount: 40,
    });

    lastPost = {
      id: 99,
      topicId: TARGET_TOPIC_ID,
      createdAt: new Date('2026-02-01'),
    };

    ForumTopic.findByPk.mockImplementation((id) => {
      if (String(id) === String(SOURCE_TOPIC_ID)) return Promise.resolve(sourceTopic);
      if (String(id) === String(TARGET_TOPIC_ID)) return Promise.resolve(targetTopic);
      return Promise.resolve(null);
    });

    ForumCategory.findByPk.mockResolvedValue(sharedCategory);

    ForumPost.update.mockResolvedValue([3]); // 3 rows affected
    ForumPost.findOne.mockResolvedValue(lastPost);
  });

  // ── Happy path: same category ──────────────────────────────────────────────

  describe('merging two topics in the same category', () => {
    it('should return 200 with the updated target topic', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('Ancien sujet'),
          data: expect.objectContaining({ topic: targetTopic }),
        })
      );
    });

    it('should transfer all posts from source topic to target topic', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(ForumPost.update).toHaveBeenCalledWith(
        { topicId: TARGET_TOPIC_ID },
        expect.objectContaining({
          where: { topicId: SOURCE_TOPIC_ID },
          transaction: mockTransaction,
        })
      );
    });

    it('should update target topic postCount to the sum of both topics', async () => {
      // source: 3 posts + target: 7 posts = 10
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(targetTopic.update).toHaveBeenCalledWith(
        expect.objectContaining({ postCount: 10 }),
        expect.anything()
      );
    });

    it('should update target topic lastPostId with the most recent post after merge', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(targetTopic.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lastPostId: lastPost.id,
          lastPostAt: lastPost.createdAt,
        }),
        expect.anything()
      );
    });

    it('should query ForumPost.findOne on the target topic ordered by createdAt DESC', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(ForumPost.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { topicId: TARGET_TOPIC_ID },
          order: [['createdAt', 'DESC']],
        })
      );
    });

    it('should only decrement topicCount on the shared category — NOT postCount', async () => {
      // Same category: posts remain in the same category, only one topic disappears
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      // topicCount: max(0, 5 - 1) = 4
      expect(sharedCategory.update).toHaveBeenCalledWith(
        { topicCount: 4 },
        expect.objectContaining({ transaction: mockTransaction })
      );

      // postCount must NOT be included when both topics are in the same category
      const allCalls = sharedCategory.update.mock.calls;
      for (const [payload] of allCalls) {
        expect(payload).not.toHaveProperty('postCount');
      }
    });

    it('should soft-delete the source topic', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(sourceTopic.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ transaction: mockTransaction })
      );
    });

    it('should reload the target topic before sending the response', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(targetTopic.reload).toHaveBeenCalled();
    });

    it('should log a ModerationAction with merge_topics type and correct details', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        {
          sourceTopicId: SOURCE_TOPIC_ID,
          targetTopicId: TARGET_TOPIC_ID,
          reason: 'Doublon',
        }
      );

      await mergeTopics(req, res, next);

      expect(ModerationAction.log).toHaveBeenCalledWith(
        expect.objectContaining({
          actionType: 'merge_topics',
          targetId: TARGET_TOPIC_ID,
          reason: 'Doublon',
          details: expect.objectContaining({
            sourceTopicId: SOURCE_TOPIC_ID,
            targetTopicId: TARGET_TOPIC_ID,
          }),
        })
      );
    });
  });

  // ── Happy path: different categories ──────────────────────────────────────

  describe('merging two topics from different categories', () => {
    const SOURCE_CAT_ID = 10;
    const TARGET_CAT_ID = 20;

    let sourceCategoryDiff;
    let targetCategoryDiff;

    beforeEach(() => {
      sourceTopic.categoryId = SOURCE_CAT_ID;
      targetTopic.categoryId = TARGET_CAT_ID;

      sourceCategoryDiff = makeMockCategory({
        id: SOURCE_CAT_ID,
        topicCount: 4,
        postCount: 20,
      });

      targetCategoryDiff = makeMockCategory({
        id: TARGET_CAT_ID,
        topicCount: 2,
        postCount: 12,
      });

      ForumCategory.findByPk.mockImplementation((id) => {
        if (String(id) === String(SOURCE_CAT_ID)) return Promise.resolve(sourceCategoryDiff);
        if (String(id) === String(TARGET_CAT_ID)) return Promise.resolve(targetCategoryDiff);
        return Promise.resolve(null);
      });
    });

    it('should decrement both topicCount and postCount on the source category', async () => {
      // source: topicCount=4, postCount=20 ; sourceTopic.postCount=3
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(sourceCategoryDiff.update).toHaveBeenCalledWith(
        {
          topicCount: 3,  // max(0, 4 - 1)
          postCount: 17,  // max(0, 20 - 3)
        },
        expect.objectContaining({ transaction: mockTransaction })
      );
    });

    it('should NOT modify the target category counters', async () => {
      // The controller does not adjust the target category in a cross-category merge
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(targetCategoryDiff.update).not.toHaveBeenCalled();
    });

    it('should still return 200 and merge correctly across categories', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should clamp source category postCount to 0 when topic has more posts than the counter', async () => {
      // Edge case: counter inconsistency — sourceTopic.postCount > category.postCount
      sourceCategoryDiff.postCount = 1;
      sourceTopic.postCount = 5;

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(sourceCategoryDiff.update).toHaveBeenCalledWith(
        expect.objectContaining({ postCount: 0 }), // clamped via Math.max(0, ...)
        expect.anything()
      );
    });
  });

  // ── Error cases ────────────────────────────────────────────────────────────

  describe('error cases', () => {
    it('should return 400 when sourceTopicId equals targetTopicId', async () => {
      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: 5, targetTopicId: 5 }
      );

      await mergeTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
      // No DB lookup should happen at all
      expect(ForumTopic.findByPk).not.toHaveBeenCalled();
    });

    it('should return 404 when the source topic does not exist', async () => {
      ForumTopic.findByPk.mockImplementation((id) => {
        if (String(id) === String(TARGET_TOPIC_ID)) return Promise.resolve(targetTopic);
        return Promise.resolve(null); // source not found
      });

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should return 404 when the target topic does not exist', async () => {
      ForumTopic.findByPk.mockImplementation((id) => {
        if (String(id) === String(SOURCE_TOPIC_ID)) return Promise.resolve(sourceTopic);
        return Promise.resolve(null); // target not found
      });

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should return 403 when user lacks merge_topic permission on source category', async () => {
      categoryPermissionService.hasPermissionOrNoRestrictions
        .mockResolvedValueOnce(false) // source check → denied
        .mockResolvedValueOnce(true); // target check would pass but is never reached

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID },
        { id: 'moderator-uuid', role: 'MODERATOR' }
      );

      await mergeTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(ForumPost.update).not.toHaveBeenCalled();
    });

    it('should return 403 when user lacks merge_topic permission on target category', async () => {
      categoryPermissionService.hasPermissionOrNoRestrictions
        .mockResolvedValueOnce(true)   // source → allowed
        .mockResolvedValueOnce(false); // target → denied

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID },
        { id: 'moderator-uuid', role: 'MODERATOR' }
      );

      await mergeTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(ForumPost.update).not.toHaveBeenCalled();
    });

    it('should return 500 when an unexpected database error occurs during the transaction', async () => {
      const dbError = new Error('Deadlock detected');
      ForumPost.update.mockRejectedValue(dbError);

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      // next is called with the raw error, which is then handled by errorHandler → 500
      expect(next).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('should keep the current target lastPostId when ForumPost.findOne returns null', async () => {
      // All posts might be soft-deleted; the controller falls back to existing values
      ForumPost.findOne.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(targetTopic.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lastPostId: targetTopic.lastPostId,  // unchanged
          lastPostAt: targetTopic.lastPostAt,  // unchanged
        }),
        expect.anything()
      );
    });

    it('should call hasPermissionOrNoRestrictions with the correct categoryId for each topic', async () => {
      sourceTopic.categoryId = 10;
      targetTopic.categoryId = 20;

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      ForumCategory.findByPk.mockResolvedValue(sharedCategory);

      await mergeTopics(req, res, next);

      // First permission check must use source category id
      expect(categoryPermissionService.hasPermissionOrNoRestrictions).toHaveBeenNthCalledWith(
        1,
        expect.anything(), // req.user
        sourceTopic.categoryId,
        'merge_topic'
      );

      // Second permission check must use target category id
      expect(categoryPermissionService.hasPermissionOrNoRestrictions).toHaveBeenNthCalledWith(
        2,
        expect.anything(), // req.user
        targetTopic.categoryId,
        'merge_topic'
      );
    });

    it('should clamp shared category topicCount to 0 when it is already at zero', async () => {
      sharedCategory.topicCount = 0;

      const { req, res, next } = makeReqResNext(
        {},
        { sourceTopicId: SOURCE_TOPIC_ID, targetTopicId: TARGET_TOPIC_ID }
      );

      await mergeTopics(req, res, next);

      expect(sharedCategory.update).toHaveBeenCalledWith(
        { topicCount: 0 }, // max(0, 0 - 1) = 0
        expect.anything()
      );
    });
  });
});

/*
 * ---------------------------------------------------------------------------
 * COVERAGE SUMMARY
 * ---------------------------------------------------------------------------
 *
 * moveTopic:
 *   Happy path:
 *     - 200 response with destination category name in message
 *     - topic.categoryId updated to destination (inside transaction)
 *     - source category topicCount/postCount decremented
 *     - destination category topicCount/postCount incremented
 *     - ModerationAction.log called with correct payload (including reason)
 *     - counter clamping to 0 (source already at 0)
 *
 *   Error cases:
 *     - 404 when topic not found
 *     - 400 when destination === current category
 *     - 400 when destination category not found in DB
 *     - 403 when missing move_topic permission on source category
 *     - 403 when missing move_topic permission on destination category
 *     - next(err) propagation on DB failure inside transaction
 *
 *   Edge case:
 *     - source category missing → `if (sourceCategory)` guard exercised;
 *       destination still updated, 200 returned
 *
 * mergeTopics:
 *   Same-category merge:
 *     - 200 response with source and target topic titles in message
 *     - ForumPost.update transfers posts to target topicId
 *     - target topic postCount = source + target (sum)
 *     - target topic lastPostId/lastPostAt set from most recent post
 *     - ForumPost.findOne queried with correct where + order
 *     - shared category: only topicCount decremented, postCount NOT touched
 *     - source topic soft-deleted via destroy()
 *     - target topic reloaded after transaction
 *     - ModerationAction.log with correct payload and reason
 *
 *   Cross-category merge:
 *     - source category: both topicCount and postCount decremented
 *     - target category: update NOT called (controller does not adjust it)
 *     - 200 response
 *     - counter clamping to 0 when postCount would go negative
 *
 *   Error cases:
 *     - 400 when sourceTopicId === targetTopicId (no DB calls made)
 *     - 404 when source topic not found
 *     - 404 when target topic not found
 *     - 403 when missing merge_topic permission on source category
 *     - 403 when missing merge_topic permission on target category
 *     - next(err) propagation on DB failure inside transaction
 *
 *   Edge cases:
 *     - null lastPost → target keeps existing lastPostId/lastPostAt
 *     - permission service called with the exact categoryId for each topic
 *     - topicCount clamped to 0 when category already at zero
 *
 * Notes on resetMocks:true (jest.config.js):
 *   All jest.fn() implementations provided in jest.mock() factories are wiped
 *   before each test. The global beforeEach re-injects the default
 *   implementations for sequelize.transaction, categoryPermissionService
 *   methods, and ModerationAction.log to avoid silent no-ops.
 *
 * Recommendations for additional manual/integration testing:
 *   - Verify PATCH /api/admin/forum/topics/:id/move route is wired with
 *     authenticate + authorize + validate middleware stack.
 *   - Verify PATCH /api/admin/forum/topics/merge similarly.
 *   - Integration test with a real DB to confirm Sequelize transaction rollback
 *     on partial failure (e.g. ModerationAction.log throwing after topic.update).
 *   - Once forumCountersService.recalculateCategoryLastPost is integrated into
 *     the controller, add assertions verifying it is called for both source and
 *     destination categories in moveTopic, and for the relevant categories in
 *     mergeTopics.
 * ---------------------------------------------------------------------------
 */
