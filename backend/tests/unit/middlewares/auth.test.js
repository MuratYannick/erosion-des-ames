'use strict';

const { authenticate, authorize, optionalAuth } = require('../../../middlewares/auth');
const { signToken } = require('../../../utils/jwt');
const { User } = require('../../../models');

// Mock du modèle User
jest.mock('../../../models', () => ({
  User: {
    scope: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup des objets request/response
    req = {
      headers: {},
      user: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();

    // Setup du mock User.scope
    User.scope.mockReturnValue({
      findByPk: User.findByPk,
    });
  });

  describe('authenticate', () => {
    it('devrait attacher req.user avec un token valide', async () => {
      const userId = 'user-123';
      const token = signToken(userId);
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(User.scope).toHaveBeenCalledWith('active');
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait rejeter sans header Authorization', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentification requise',
          code: 'NO_TOKEN',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter avec un header Authorization vide', async () => {
      req.headers.authorization = '';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentification requise',
          code: 'NO_TOKEN',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter sans le préfixe Bearer', async () => {
      req.headers.authorization = 'InvalidPrefix token123';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentification requise',
          code: 'NO_TOKEN',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter avec un token invalide', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Le token est invalide',
          code: 'INVALID_TOKEN',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      const userId = 'nonexistent-user';
      const token = signToken(userId);

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Utilisateur non trouvé ou inactif',
          code: 'USER_NOT_FOUND',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait utiliser le scope active pour filtrer les utilisateurs', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockResolvedValue({ id: userId });

      await authenticate(req, res, next);

      expect(User.scope).toHaveBeenCalledWith('active');
    });

    it('devrait gérer les erreurs de base de données', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Erreur lors de l\'authentification',
          code: 'AUTH_ERROR',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait gérer les espaces dans le token', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      req.headers.authorization = `Bearer  ${token}  `;
      User.findByPk.mockResolvedValue({ id: userId });

      await authenticate(req, res, next);

      // Devrait échouer car le token contient des espaces
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('authorize', () => {
    it('devrait accepter un utilisateur avec le bon rôle', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait accepter un utilisateur avec un des rôles autorisés', () => {
      req.user = { role: 'moderator' };
      const middleware = authorize('admin', 'moderator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait rejeter un utilisateur avec un rôle insuffisant', () => {
      req.user = { role: 'user' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Accès refusé. Permissions insuffisantes.',
          code: 'FORBIDDEN',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter si req.user n\'est pas défini', () => {
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentification requise',
          code: 'NOT_AUTHENTICATED',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter si req.user est null', () => {
      req.user = null;
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait être sensible à la casse des rôles', () => {
      req.user = { role: 'Admin' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait gérer plusieurs rôles correctement', () => {
      req.user = { role: 'user' };
      const middleware = authorize('admin', 'moderator', 'user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('devrait attacher req.user avec un token valide', async () => {
      const userId = 'user-123';
      const token = signToken(userId);
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockResolvedValue(mockUser);

      await optionalAuth(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait passer sans erreur si aucun token n\'est fourni', async () => {
      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait passer sans erreur avec un token invalide', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait définir req.user à null si l\'utilisateur n\'existe pas', async () => {
      const userId = 'nonexistent-user';
      const token = signToken(userId);

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockResolvedValue(null);

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait passer sans erreur en cas d\'erreur de base de données', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait utiliser le scope active', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      req.headers.authorization = `Bearer ${token}`;
      User.findByPk.mockResolvedValue({ id: userId });

      await optionalAuth(req, res, next);

      expect(User.scope).toHaveBeenCalledWith('active');
    });

    it('devrait gérer un header Authorization mal formaté', async () => {
      req.headers.authorization = 'InvalidFormat';

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
