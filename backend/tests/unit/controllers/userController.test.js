'use strict';

// Mocks AVANT les imports
// Fix asyncHandler : retourner la Promise pour que `await handler(req, res, next)` attende l'exécution
jest.mock('../../../middlewares/errorHandler', () => {
  const actual = jest.requireActual('../../../middlewares/errorHandler');
  return {
    ...actual,
    asyncHandler: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
  };
});

jest.mock('../../../models', () => ({
  User: {
    findByPk: jest.fn(),
    scope: jest.fn(),
  },
  Character: {
    findAndCountAll: jest.fn(),
  },
  ForumTopic: {
    count: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  ForumPost: {
    count: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  ForumCategory: {},
  Faction: {},
  Ethnicity: {},
  Clan: {},
}));

const {
  getPublicProfile,
  getUserCharacters,
  getUserPosts,
  getUserTopics,
} = require('../../../controllers/userController');

const { User, Character, ForumTopic, ForumPost } = require('../../../models');
const { ApiError } = require('../../../middlewares/errorHandler');

/**
 * Helper pour créer un faux environnement req/res/next
 */
const makeReqResNext = (params = {}, query = {}, user = null, headers = {}) => {
  const req = { params, query, user, headers };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    end: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getPublicProfile ───────────────────────────────────────────────────────

  describe('getPublicProfile', () => {
    it('devrait retourner le profil public d\'un utilisateur existant', async () => {
      const mockUserData = {
        id: 'user-uuid-1234',
        username: 'TestUser',
        avatar: null,
        role: 'PLAYER',
        createdAt: new Date(),
        isActive: true,
        selectedCharacter: null,
      };

      User.findByPk.mockResolvedValue(mockUserData);
      ForumTopic.count.mockResolvedValue(5);
      ForumPost.count.mockResolvedValue(12);

      const { req, res, next } = makeReqResNext({ id: 'user-uuid-1234' });

      await getPublicProfile(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith('user-uuid-1234', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          user: mockUserData,
          stats: {
            topicCount: 5,
            postCount: 12,
          },
        }),
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait appeler next avec une ApiError 404 si l\'utilisateur n\'existe pas', async () => {
      User.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: 'nonexistent-uuid' });

      await getPublicProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('devrait inclure le compte de topics et posts dans les stats', async () => {
      User.findByPk.mockResolvedValue({ id: 'user-uuid-1234', username: 'TestUser' });
      ForumTopic.count.mockResolvedValue(0);
      ForumPost.count.mockResolvedValue(0);

      const { req, res, next } = makeReqResNext({ id: 'user-uuid-1234' });

      await getPublicProfile(req, res, next);

      expect(ForumTopic.count).toHaveBeenCalledWith({ where: { userId: 'user-uuid-1234' } });
      expect(ForumPost.count).toHaveBeenCalledWith({ where: { userId: 'user-uuid-1234' } });
    });

    it('devrait appeler next avec une erreur si une exception est levée', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      const { req, res, next } = makeReqResNext({ id: 'user-uuid-1234' });

      await getPublicProfile(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ─── getUserCharacters ──────────────────────────────────────────────────────

  describe('getUserCharacters', () => {
    const userId = 'user-uuid-1234';

    it('devrait retourner la liste paginée des personnages d\'un utilisateur', async () => {
      const mockCharacters = [
        { id: 1, name: 'Aelindra', status: 'approved', isActive: true },
        { id: 2, name: 'Korrak', status: 'approved', isActive: true },
      ];

      User.findByPk.mockResolvedValue({ id: userId });
      Character.findAndCountAll.mockResolvedValue({ count: 2, rows: mockCharacters });

      const { req, res, next } = makeReqResNext({ id: userId }, { page: '1', limit: '20' });

      await getUserCharacters(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          items: mockCharacters,
          total: 2,
          page: 1,
          totalPages: 1,
          limit: 20,
        }),
      }));
    });

    it('devrait filtrer les personnages approved + isActive pour les non-propriétaires', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      Character.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      // req.user est null (non authentifié)
      const { req, res, next } = makeReqResNext({ id: userId }, {}, null);

      await getUserCharacters(req, res, next);

      expect(Character.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          status: 'approved',
          isActive: true,
          userId,
        }),
      }));
    });

    it('devrait afficher tous les personnages pour le propriétaire', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      Character.findAndCountAll.mockResolvedValue({ count: 3, rows: [] });

      // req.user.id === userId => propriétaire
      const { req, res, next } = makeReqResNext({ id: userId }, {}, { id: userId });

      await getUserCharacters(req, res, next);

      const callArgs = Character.findAndCountAll.mock.calls[0][0];
      // Le filtre status et isActive ne doit pas être dans where pour le propriétaire
      expect(callArgs.where).not.toHaveProperty('status');
      expect(callArgs.where).not.toHaveProperty('isActive');
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      User.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: 'nonexistent' });

      await getUserCharacters(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('devrait utiliser les paramètres de pagination page et limit', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      Character.findAndCountAll.mockResolvedValue({ count: 50, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId }, { page: '3', limit: '10' });

      await getUserCharacters(req, res, next);

      expect(Character.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 10,
        offset: 20, // (3 - 1) * 10
      }));
    });

    it('devrait utiliser les valeurs par défaut (page=1, limit=20) si non fournis', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      Character.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId });

      await getUserCharacters(req, res, next);

      expect(Character.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 20,
        offset: 0,
      }));
    });

    it('devrait calculer correctement totalPages', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      Character.findAndCountAll.mockResolvedValue({ count: 47, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId }, { page: '1', limit: '20' });

      await getUserCharacters(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          totalPages: 3, // Math.ceil(47/20)
        }),
      }));
    });
  });

  // ─── getUserPosts ───────────────────────────────────────────────────────────

  describe('getUserPosts', () => {
    const userId = 'user-uuid-1234';

    it('devrait retourner la liste paginée des posts d\'un utilisateur', async () => {
      const mockPosts = [
        { id: 10, content: 'Post 1', userId },
        { id: 11, content: 'Post 2', userId },
      ];

      User.findByPk.mockResolvedValue({ id: userId });
      ForumPost.findAndCountAll.mockResolvedValue({ count: 2, rows: mockPosts });

      const { req, res, next } = makeReqResNext({ id: userId });

      await getUserPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          items: mockPosts,
          total: 2,
        }),
      }));
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      User.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: 'nonexistent' });

      await getUserPosts(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('devrait filtrer les posts par userId', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      ForumPost.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId });

      await getUserPosts(req, res, next);

      expect(ForumPost.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId },
      }));
    });

    it('devrait respecter les paramètres de pagination', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      ForumPost.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId }, { page: '2', limit: '5' });

      await getUserPosts(req, res, next);

      expect(ForumPost.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 5,
        offset: 5, // (2 - 1) * 5
      }));
    });
  });

  // ─── getUserTopics ──────────────────────────────────────────────────────────

  describe('getUserTopics', () => {
    const userId = 'user-uuid-1234';

    it('devrait retourner la liste paginée des sujets d\'un utilisateur', async () => {
      const mockTopics = [
        { id: 1, title: 'Topic 1', userId },
      ];

      User.findByPk.mockResolvedValue({ id: userId });
      ForumTopic.findAndCountAll.mockResolvedValue({ count: 1, rows: mockTopics });

      const { req, res, next } = makeReqResNext({ id: userId });

      await getUserTopics(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          items: mockTopics,
          total: 1,
        }),
      }));
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      User.findByPk.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext({ id: 'nonexistent' });

      await getUserTopics(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('devrait filtrer les topics par userId', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      ForumTopic.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId });

      await getUserTopics(req, res, next);

      expect(ForumTopic.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId },
      }));
    });

    it('devrait respecter les paramètres de pagination', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      ForumTopic.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId }, { page: '2', limit: '10' });

      await getUserTopics(req, res, next);

      expect(ForumTopic.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        limit: 10,
        offset: 10,
      }));
    });

    it('devrait retourner une liste vide si l\'utilisateur n\'a aucun sujet', async () => {
      User.findByPk.mockResolvedValue({ id: userId });
      ForumTopic.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const { req, res, next } = makeReqResNext({ id: userId });

      await getUserTopics(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          items: [],
          total: 0,
          totalPages: 0,
        }),
      }));
    });
  });
});
