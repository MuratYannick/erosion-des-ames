'use strict';

// Mocks AVANT les imports
jest.mock('../../../models', () => ({
  Character: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Ethnicity: {
    findByPk: jest.fn(),
  },
  Faction: {
    findByPk: jest.fn(),
  },
  Clan: {
    findByPk: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

// Mock de asyncHandler : la version réelle ne retourne pas la Promise interne,
// ce qui cause un problème de timing dans les tests unitaires directs.
// Ce mock retourne la Promise pour que `await handler(req, res, next)` attende
// correctement la résolution (y compris les `catch(next)` en cas d'erreur).
jest.mock('../../../middlewares/errorHandler', () => {
  const actual = jest.requireActual('../../../middlewares/errorHandler');
  return {
    ...actual,
    asyncHandler: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
  };
});

const {
  getAll,
  getById,
  create,
  update,
  submit,
  approve,
  reject,
  remove,
} = require('../../../controllers/characterController');

const { Character, Ethnicity, Faction, Clan, User } = require('../../../models');
const { ApiError } = require('../../../middlewares/errorHandler');

/**
 * Helper pour créer un faux environnement req/res/next
 */
const makeReqResNext = (params = {}, body = {}, query = {}, user = null) => {
  const req = { params, body, query, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

/**
 * Crée un personnage mock avec les méthodes d'instance
 */
const makeMockCharacter = (overrides = {}) => ({
  id: 1,
  name: 'Aelindra',
  userId: 'user-uuid-1234',
  status: 'draft',
  isActive: true,
  ethnicityId: 1,
  factionId: null,
  clanId: null,
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  approve: jest.fn().mockResolvedValue(true),
  reject: jest.fn().mockResolvedValue(true),
  changed: jest.fn().mockReturnValue(false),
  ...overrides,
});

describe('characterController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getAll ─────────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('devrait retourner uniquement les personnages approved + isActive pour le public', async () => {
      const mockChars = [makeMockCharacter({ status: 'approved' })];
      Character.findAll.mockResolvedValue(mockChars);

      // Pas d'utilisateur authentifié
      const { req, res, next } = makeReqResNext({}, {}, {}, null);

      await getAll(req, res, next);

      expect(Character.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          isActive: true,
          status: 'approved',
        }),
      }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait permettre au staff de voir tous les personnages', async () => {
      Character.findAll.mockResolvedValue([]);

      const { req, res, next } = makeReqResNext({}, {}, {}, { role: 'ADMIN', id: 'admin-uuid' });

      await getAll(req, res, next);

      // Pas de filtre status/isActive imposé
      const callArgs = Character.findAll.mock.calls[0][0];
      expect(callArgs.where).not.toHaveProperty('status');
      expect(callArgs.where).not.toHaveProperty('isActive');
    });

    it('devrait accepter les filtres status pour le staff', async () => {
      Character.findAll.mockResolvedValue([]);

      const { req, res, next } = makeReqResNext({}, {}, { status: 'pending' }, { role: 'ADMIN', id: 'admin-uuid' });

      await getAll(req, res, next);

      expect(Character.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ status: 'pending' }),
      }));
    });

    it('devrait montrer tous les personnages d\'un joueur pour ses propres requêtes', async () => {
      const userId = 'user-uuid-1234';
      Character.findAll.mockResolvedValue([]);

      // Joueur qui consulte ses propres personnages
      const { req, res, next } = makeReqResNext({}, {}, { userId }, { id: userId, role: 'PLAYER' });

      await getAll(req, res, next);

      expect(Character.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }));
    });
  });

  // ─── getById ────────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('devrait retourner un personnage approved pour le public', async () => {
      const mockChar = makeMockCharacter({ status: 'approved', isActive: true });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, null);

      await getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: { character: mockChar },
      }));
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: '999' });

      await getById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('devrait retourner 404 pour un personnage non-approved pour le public', async () => {
      const mockChar = makeMockCharacter({ status: 'pending', isActive: true });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, null);

      await getById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('devrait permettre au staff de voir les personnages non-approved', async () => {
      const mockChar = makeMockCharacter({ status: 'pending', isActive: true });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, { role: 'ADMIN' });

      await getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait retourner 404 pour un personnage inactif pour le public', async () => {
      const mockChar = makeMockCharacter({ status: 'approved', isActive: false });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, null);

      await getById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    const validBody = {
      name: 'Korrak',
      ethnicityId: 1,
    };

    it('devrait créer un personnage avec succès', async () => {
      const mockEthnicity = { id: 1, name: 'Humain' };
      const mockChar = makeMockCharacter({ name: 'Korrak', status: 'draft' });

      Ethnicity.findByPk.mockResolvedValue(mockEthnicity);
      Character.findOne.mockResolvedValue(null); // Pas de doublon
      Character.create.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({}, validBody, {}, { role: 'ADMIN', id: 'admin-uuid' });

      await create(req, res, next);

      expect(Character.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: expect.stringContaining('créé'),
      }));
    });

    it('devrait retourner 400 si l\'ethnie n\'existe pas', async () => {
      Ethnicity.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({}, validBody);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 409 si un personnage avec ce nom existe déjà', async () => {
      Ethnicity.findByPk.mockResolvedValue({ id: 1 });
      Character.findOne.mockResolvedValue({ id: 99, name: 'Korrak' }); // Doublon

      const { req, res, next } = makeReqResNext({}, validBody);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(409);
    });

    it('devrait retourner 400 si la faction n\'existe pas', async () => {
      Ethnicity.findByPk.mockResolvedValue({ id: 1 });
      Faction.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({}, { ...validBody, factionId: 99 });

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 400 si le clan n\'existe pas', async () => {
      Ethnicity.findByPk.mockResolvedValue({ id: 1 });
      Clan.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({}, { ...validBody, clanId: 99 });

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 400 si l\'utilisateur assigné n\'existe pas', async () => {
      Ethnicity.findByPk.mockResolvedValue({ id: 1 });
      User.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({}, { ...validBody, userId: 'nonexistent-user' });

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('devrait mettre à jour un personnage existant', async () => {
      const mockChar = makeMockCharacter();
      Character.findByPk.mockResolvedValue(mockChar);
      Character.findOne.mockResolvedValue(null); // Pas de doublon de nom

      const { req, res, next } = makeReqResNext({ id: '1' }, { name: 'NouveauNom' });

      await update(req, res, next);

      expect(mockChar.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'NouveauNom' }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: '999' }, { name: 'Test' });

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('devrait retourner 409 si le nouveau nom est déjà pris', async () => {
      const mockChar = makeMockCharacter({ id: 1 });
      Character.findByPk.mockResolvedValue(mockChar);
      // Un autre personnage a ce nom
      Character.findOne.mockResolvedValue({ id: 2, name: 'NomExistant' });

      const { req, res, next } = makeReqResNext({ id: '1' }, { name: 'NomExistant' });

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(409);
    });

    it('devrait retourner 400 si la nouvelle ethnie n\'existe pas', async () => {
      const mockChar = makeMockCharacter();
      Character.findByPk.mockResolvedValue(mockChar);
      Character.findOne.mockResolvedValue(null);
      Ethnicity.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: '1' }, { ethnicityId: 99 });

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  // ─── submit ─────────────────────────────────────────────────────────────────

  describe('submit', () => {
    it('devrait soumettre un personnage en statut draft', async () => {
      const mockChar = makeMockCharacter({ status: 'draft' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' });

      await submit(req, res, next);

      expect(mockChar.update).toHaveBeenCalledWith({ status: 'pending', rejectionReason: null });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('soumis'),
      }));
    });

    it('devrait soumettre un personnage en statut rejected', async () => {
      const mockChar = makeMockCharacter({ status: 'rejected' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' });

      await submit(req, res, next);

      expect(mockChar.update).toHaveBeenCalledWith({ status: 'pending', rejectionReason: null });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait retourner 400 si le personnage est en statut pending', async () => {
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' });

      await submit(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 400 si le personnage est déjà approved', async () => {
      const mockChar = makeMockCharacter({ status: 'approved' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' });

      await submit(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: '999' });

      await submit(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  // ─── approve ────────────────────────────────────────────────────────────────

  describe('approve', () => {
    it('devrait approuver un personnage en statut pending', async () => {
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const adminUser = { id: 'admin-uuid', role: 'ADMIN' };
      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, adminUser);

      await approve(req, res, next);

      expect(mockChar.approve).toHaveBeenCalledWith(adminUser.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('approuvé'),
      }));
    });

    it('devrait retourner 400 si le personnage n\'est pas en statut pending', async () => {
      const mockChar = makeMockCharacter({ status: 'draft' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, { id: 'admin-uuid' });

      await approve(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: '999' }, {}, {}, { id: 'admin-uuid' });

      await approve(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  // ─── reject ─────────────────────────────────────────────────────────────────

  describe('reject', () => {
    it('devrait rejeter un personnage en statut pending avec une raison', async () => {
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext(
        { id: '1' },
        { rejectionReason: 'La fiche de personnage est incomplète, veuillez détailler l\'historique.' },
        {},
        { id: 'admin-uuid' }
      );

      await reject(req, res, next);

      expect(mockChar.reject).toHaveBeenCalledWith(
        'La fiche de personnage est incomplète, veuillez détailler l\'historique.'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('rejeté'),
      }));
    });

    it('devrait retourner 400 si le personnage n\'est pas en statut pending', async () => {
      const mockChar = makeMockCharacter({ status: 'approved' });
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext(
        { id: '1' },
        { rejectionReason: 'Raison valide de rejet.' },
        {},
        { id: 'admin-uuid' }
      );

      await reject(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext(
        { id: '999' },
        { rejectionReason: 'Raison' },
        {},
        { id: 'admin-uuid' }
      );

      await reject(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  // ─── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('devrait supprimer un personnage (soft delete)', async () => {
      const mockChar = makeMockCharacter();
      Character.findByPk.mockResolvedValue(mockChar);

      const { req, res, next } = makeReqResNext({ id: '1' }, {}, {}, { id: 'admin-uuid', role: 'ADMIN' });

      await remove(req, res, next);

      expect(mockChar.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: expect.stringContaining('supprimé'),
      }));
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: '999' }, {}, {}, { id: 'admin-uuid', role: 'ADMIN' });

      await remove(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });
});
