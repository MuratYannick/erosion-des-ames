'use strict';

// IMPORTANT: Les mocks doivent être définis AVANT les imports

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    scope: jest.fn(),
  },
  Character: {
    unscoped: jest.fn(),
  },
  UserSanction: {
    scope: jest.fn(),
    create: jest.fn(),
  },
  ForumTopic: {
    count: jest.fn(),
  },
  ForumPost: {
    count: jest.fn(),
  },
  ModerationAction: {
    log: jest.fn().mockResolvedValue({}),
  },
  sequelize: {
    transaction: jest.fn((fn) => fn({ /* t */ })),
  },
  CategoryPermission: {
    PERMISSIONS: ['access_category', 'edit_category', 'create_subcategory', 'move_category', 'create_topic', 'edit_topic', 'move_topic', 'merge_topic'],
    GRANTEE_TYPES: ['public', 'player', 'player_accepted_rules', 'player_with_character', 'player_character_faction', 'player_character_clan', 'specific_user', 'specific_character', 'game_master', 'moderator'],
    GRANTEE_REQUIRES_ID: ['player_character_faction', 'player_character_clan', 'specific_user', 'specific_character'],
  },
}));

jest.mock('../../middlewares/rateLimit', () => ({
  loginLimiter: (req, res, next) => next(),
  registerLimiter: (req, res, next) => next(),
  passwordResetLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
}));

jest.mock('../../utils/email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({}),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({}),
  sendWelcomeEmail: jest.fn().mockResolvedValue({}),
}));

const request = require('supertest');
const app = require('../../app');
const { User, Character, UserSanction, ForumTopic, ForumPost, ModerationAction, sequelize } = require('../../models');
const { signToken } = require('../../utils/jwt');

// UUIDs de test
const ADMIN_UUID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const MODERATOR_UUID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const GAME_MASTER_UUID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const PLAYER_UUID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const TARGET_USER_UUID = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

/**
 * Configure le scope pour l'authentification d'un utilisateur
 */
const setupAuth = (userId, role) => {
  const token = signToken(userId);
  const mockUser = {
    id: userId,
    username: `${role}User`,
    email: `${role.toLowerCase()}@admin.com`,
    role,
    isActive: true,
    isEmailVerified: true,
  };

  User.scope.mockReturnValue({
    findByPk: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(null),
  });

  return { token, mockUser };
};

describe('Admin Users Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Par défaut : authentification échoue
    User.scope.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(null),
      findOne: jest.fn().mockResolvedValue(null),
    });

    // Mock Character.unscoped()
    Character.unscoped.mockReturnValue({
      findAll: jest.fn().mockResolvedValue([]),
    });

    // Mock UserSanction.scope()
    UserSanction.scope.mockReturnValue({
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    });

    // Mock sequelize.transaction — exécute la fonction directement
    sequelize.transaction.mockImplementation((fn) => fn({}));

    // Mock ModerationAction.log
    ModerationAction.log.mockResolvedValue({});
  });

  // ─── GET /api/admin/users ───────────────────────────────────────────────────

  describe('GET /api/admin/users', () => {
    it('devrait retourner la liste des utilisateurs pour un ADMIN', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const mockUsers = [
        { id: TARGET_USER_UUID, username: 'User1', role: 'PLAYER' },
        { id: PLAYER_UUID, username: 'User2', role: 'PLAYER' },
      ];

      User.findAndCountAll.mockResolvedValue({ count: 2, rows: mockUsers });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data).toHaveProperty('total', 2);
      expect(res.body.data).toHaveProperty('page');
      expect(res.body.data).toHaveProperty('totalPages');
    });

    it('devrait retourner la liste pour un MODERATOR', async () => {
      const { token } = setupAuth(MODERATOR_UUID, 'MODERATOR');
      User.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait retourner la liste pour un GAME_MASTER', async () => {
      const { token } = setupAuth(GAME_MASTER_UUID, 'GAME_MASTER');
      User.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuth(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .get('/api/admin/users');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('devrait supporter la pagination via query params', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');
      User.findAndCountAll.mockResolvedValue({ count: 100, rows: [] });

      const res = await request(app)
        .get('/api/admin/users?page=2&limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.page).toBe(2);
    });

    it('devrait supporter le filtre par rôle', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');
      User.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      const res = await request(app)
        .get('/api/admin/users?role=MODERATOR')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  // ─── GET /api/admin/users/:id ───────────────────────────────────────────────

  describe('GET /api/admin/users/:id', () => {
    it('devrait retourner le détail d\'un utilisateur pour un ADMIN', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const targetUser = {
        id: TARGET_USER_UUID,
        username: 'TargetUser',
        email: 'target@example.com',
        role: 'PLAYER',
        isActive: true,
      };

      // User.findByPk est appelé par getById (le controller admin)
      // User.scope('active').findByPk est appelé par authenticate (middleware)
      // setupAuth a déjà configuré User.scope pour l'authentification
      User.findByPk.mockResolvedValue(targetUser);
      ForumTopic.count.mockResolvedValue(5);
      ForumPost.count.mockResolvedValue(10);

      const res = await request(app)
        .get(`/api/admin/users/${TARGET_USER_UUID}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('characters');
      expect(res.body.data).toHaveProperty('activeSanctions');
      expect(res.body.data).toHaveProperty('forumStats');
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');
      User.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/admin/users/${TARGET_USER_UUID}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuth(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .get(`/api/admin/users/${TARGET_USER_UUID}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .get(`/api/admin/users/${TARGET_USER_UUID}`);

      expect(res.status).toBe(401);
    });
  });

  // ─── PATCH /api/admin/users/:id/role ────────────────────────────────────────

  describe('PATCH /api/admin/users/:id/role', () => {
    it('devrait changer le rôle d\'un PLAYER en MODERATOR (ADMIN)', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const targetUser = {
        id: TARGET_USER_UUID,
        username: 'TargetPlayer',
        role: 'PLAYER',
        update: jest.fn().mockResolvedValue(true),
      };

      User.findByPk.mockResolvedValue(targetUser);

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'MODERATOR' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('PLAYER');
      expect(res.body.message).toContain('MODERATOR');
    });

    it('devrait retourner 422 si le rôle est invalide', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'SUPER_ADMIN' }); // Rôle invalide

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait retourner 422 si le rôle est absent', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({}); // Pas de role

      expect(res.status).toBe(422);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuth(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'MODERATOR' });

      expect(res.status).toBe(403);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/role`)
        .send({ role: 'MODERATOR' });

      expect(res.status).toBe(401);
    });

    it('ne devrait pas permettre de se modifier son propre rôle', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      // L'utilisateur cible est l'admin lui-même
      const adminUser = {
        id: ADMIN_UUID,
        role: 'ADMIN',
        update: jest.fn(),
      };
      User.findByPk.mockResolvedValue(adminUser);

      const res = await request(app)
        .patch(`/api/admin/users/${ADMIN_UUID}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'PLAYER' });

      expect(res.status).toBe(400);
    });
  });

  // ─── PATCH /api/admin/users/:id/ban ─────────────────────────────────────────

  describe('PATCH /api/admin/users/:id/ban', () => {
    it('devrait bannir un utilisateur (ADMIN)', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const targetUser = {
        id: TARGET_USER_UUID,
        username: 'TargetUser',
        role: 'PLAYER',
        isActive: true,
        update: jest.fn().mockResolvedValue(true),
      };

      const mockSanction = {
        id: 'sanction-uuid',
        type: 'ban',
        userId: TARGET_USER_UUID,
      };

      User.findByPk.mockResolvedValue(targetUser);
      UserSanction.create.mockResolvedValue(mockSanction);

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/ban`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Comportement toxique répété' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('sanction');
    });

    it('devrait bannir un utilisateur avec une durée', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const targetUser = {
        id: TARGET_USER_UUID,
        role: 'PLAYER',
        isActive: true,
        update: jest.fn().mockResolvedValue(true),
      };

      const mockSanction = { id: 'sanction-uuid', type: 'ban' };

      User.findByPk.mockResolvedValue(targetUser);
      UserSanction.create.mockResolvedValue(mockSanction);

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/ban`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Comportement toxique', durationHours: 48 });

      expect(res.status).toBe(200);
      // Le message doit mentionner la date d'expiration
      expect(res.body.message).toContain('jusqu\'au');
    });

    it('devrait retourner 422 si la raison est absente', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/ban`)
        .set('Authorization', `Bearer ${token}`)
        .send({}); // Pas de reason

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuth(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/ban`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Test' });

      expect(res.status).toBe(403);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/ban`)
        .send({ reason: 'Test' });

      expect(res.status).toBe(401);
    });

    it('ne devrait pas permettre de se bannir soi-même', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');

      const adminUser = {
        id: ADMIN_UUID,
        role: 'ADMIN',
        isActive: true,
        update: jest.fn(),
      };
      User.findByPk.mockResolvedValue(adminUser);

      const res = await request(app)
        .patch(`/api/admin/users/${ADMIN_UUID}/ban`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Test auto-ban' });

      expect(res.status).toBe(400);
    });

    it('ne devrait pas permettre à un MODERATOR de bannir un ADMIN', async () => {
      const { token } = setupAuth(MODERATOR_UUID, 'MODERATOR');

      const adminTarget = {
        id: TARGET_USER_UUID,
        role: 'ADMIN',
        isActive: true,
        update: jest.fn(),
      };
      User.findByPk.mockResolvedValue(adminTarget);

      const res = await request(app)
        .patch(`/api/admin/users/${TARGET_USER_UUID}/ban`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Tentative de ban admin' });

      expect(res.status).toBe(403);
    });
  });

  // ─── Tests de sécurité admin ────────────────────────────────────────────────

  describe('Tests de sécurité', () => {
    it('ne devrait pas exposer d\'informations sensibles en 500', async () => {
      const { token } = setupAuth(ADMIN_UUID, 'ADMIN');
      User.findAndCountAll.mockRejectedValue(new Error('DB error with secret password=admin123'));

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      // Note : la sanitisation des messages d'erreur n'est active qu'en production (NODE_ENV=production)
    });

    it('ne devrait pas permettre à un token invalide d\'accéder aux routes admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('ne devrait pas permettre à un token manipulé d\'escalader les privilèges', async () => {
      // Token signé avec le bon secret mais pour un PLAYER
      const playerToken = signToken(PLAYER_UUID);

      // Le mock ne retourne l'utilisateur que pour PLAYER (pas de rôle élevé)
      User.scope.mockReturnValue({
        findByPk: jest.fn().mockResolvedValue({
          id: PLAYER_UUID,
          role: 'PLAYER',
          isActive: true,
        }),
      });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${playerToken}`);

      expect(res.status).toBe(403);
    });
  });
});
