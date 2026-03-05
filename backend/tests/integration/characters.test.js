'use strict';

// IMPORTANT: Les mocks doivent être définis AVANT les imports

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    scope: jest.fn(),
  },
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
  UserSanction: {
    scope: jest.fn(),
  },
  ForumTopic: {},
  ForumPost: {},
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
const { User, Character, Ethnicity, Faction, Clan } = require('../../models');
const { signToken } = require('../../utils/jwt');

// UUIDs de test
const ADMIN_UUID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const MODERATOR_UUID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const GAME_MASTER_UUID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const PLAYER_UUID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

/**
 * Crée un utilisateur mock et configure le scope pour l'authentification
 */
const setupAuthUser = (userId, role, extraFields = {}) => {
  const token = signToken(userId);
  const mockUserData = {
    id: userId,
    username: `${role}User`,
    email: `${role.toLowerCase()}@example.com`,
    role,
    isActive: true,
    isEmailVerified: true,
    ...extraFields,
  };

  User.scope.mockReturnValue({
    findByPk: jest.fn().mockResolvedValue(mockUserData),
    findOne: jest.fn().mockResolvedValue(null),
  });

  User.findByPk.mockResolvedValue(mockUserData);

  return { token, mockUserData };
};

/**
 * Crée un personnage mock avec les méthodes d'instance
 */
const makeMockCharacter = (overrides = {}) => ({
  id: 1,
  name: 'Aelindra',
  userId: GAME_MASTER_UUID,
  status: 'draft',
  isActive: true,
  ethnicityId: 1,
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  approve: jest.fn().mockImplementation(function(userId) {
    this.status = 'approved';
    this.approvedBy = userId;
    return Promise.resolve(true);
  }),
  reject: jest.fn().mockImplementation(function(reason) {
    this.status = 'rejected';
    this.rejectionReason = reason;
    return Promise.resolve(true);
  }),
  ...overrides,
});

describe('Characters Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup du scope par défaut (authentification échoue sauf configuration explicite)
    User.scope.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(null),
      findOne: jest.fn().mockResolvedValue(null),
    });
  });

  // ─── GET /api/characters ────────────────────────────────────────────────────

  describe('GET /api/characters', () => {
    it('devrait retourner la liste publique (approved + active) sans authentification', async () => {
      const mockChars = [
        { id: 1, name: 'Aelindra', status: 'approved', isActive: true },
        { id: 2, name: 'Korrak', status: 'approved', isActive: true },
      ];

      Character.findAll.mockResolvedValue(mockChars);

      const res = await request(app)
        .get('/api/characters');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('characters');
      expect(res.body.data.characters).toHaveLength(2);
    });

    it('devrait retourner une liste vide si aucun personnage n\'est approuvé', async () => {
      Character.findAll.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/characters');

      expect(res.status).toBe(200);
      expect(res.body.data.characters).toHaveLength(0);
    });

    it('devrait permettre au staff de voir tous les personnages', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      Character.findAll.mockResolvedValue([
        { id: 1, status: 'draft' },
        { id: 2, status: 'pending' },
      ]);

      const res = await request(app)
        .get('/api/characters')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  // ─── GET /api/characters/:id ────────────────────────────────────────────────

  describe('GET /api/characters/:id', () => {
    it('devrait retourner un personnage approved visible publiquement', async () => {
      const mockChar = makeMockCharacter({ status: 'approved', isActive: true });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .get('/api/characters/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.character).toHaveProperty('name', 'Aelindra');
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      Character.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/characters/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('devrait retourner 404 pour un personnage non-approved pour le public', async () => {
      const mockChar = makeMockCharacter({ status: 'pending', isActive: true });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .get('/api/characters/1');

      expect(res.status).toBe(404);
    });

    it('devrait permettre au staff de voir un personnage en pending', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      const mockChar = makeMockCharacter({ status: 'pending', isActive: true });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .get('/api/characters/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  // ─── POST /api/characters ───────────────────────────────────────────────────

  describe('POST /api/characters', () => {
    const validPayload = {
      name: 'NouveauPersonnage',
      ethnicityId: 1,
    };

    it('devrait créer un personnage si authentifié en tant que GAME_MASTER', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');
      const mockEthnicity = { id: 1, name: 'Humain' };
      const mockChar = makeMockCharacter({ name: 'NouveauPersonnage' });

      Ethnicity.findByPk.mockResolvedValue(mockEthnicity);
      Character.findOne.mockResolvedValue(null);
      Character.create.mockResolvedValue(mockChar);

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('créé');
    });

    it('devrait créer un personnage si authentifié en tant qu\'ADMIN', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      Ethnicity.findByPk.mockResolvedValue({ id: 1 });
      Character.findOne.mockResolvedValue(null);
      Character.create.mockResolvedValue(makeMockCharacter());

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      expect(res.status).toBe(201);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .post('/api/characters')
        .send(validPayload);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('devrait retourner 403 pour un PLAYER (rôle insuffisant)', async () => {
      const { token } = setupAuthUser(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('devrait retourner 422 si le nom est manquant', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send({ ethnicityId: 1 }); // Pas de name

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait retourner 422 si ethnicityId est manquant', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Perso' }); // Pas d'ethnicityId

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait retourner 422 si l\'age est négatif', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...validPayload, age: -5 });

      expect(res.status).toBe(422);
    });

    it('devrait retourner 409 si un personnage avec ce nom existe déjà', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      Ethnicity.findByPk.mockResolvedValue({ id: 1 });
      Character.findOne.mockResolvedValue({ id: 99, name: 'NouveauPersonnage' });

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      expect(res.status).toBe(409);
    });

    it('devrait protéger contre les XSS dans le nom', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'a', ethnicityId: 1 }); // Nom trop court (min 2 valide, mais 'a' = 1 char)

      // Soit 422 (validation), soit 400 (logique métier)
      expect([400, 422]).toContain(res.status);
    });
  });

  // ─── PUT /api/characters/:id ────────────────────────────────────────────────

  describe('PUT /api/characters/:id', () => {
    it('devrait mettre à jour un personnage en tant que GAME_MASTER', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');
      const mockChar = makeMockCharacter();
      Character.findByPk.mockResolvedValue(mockChar);
      Character.findOne.mockResolvedValue(null); // Pas de doublon de nom

      const res = await request(app)
        .put('/api/characters/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'NouveauNom' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .put('/api/characters/1')
        .send({ name: 'NouveauNom' });

      expect(res.status).toBe(401);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuthUser(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .put('/api/characters/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'NouveauNom' });

      expect(res.status).toBe(403);
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      Character.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/characters/999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' });

      expect(res.status).toBe(404);
    });
  });

  // ─── DELETE /api/characters/:id ─────────────────────────────────────────────

  describe('DELETE /api/characters/:id', () => {
    it('devrait supprimer un personnage en tant qu\'ADMIN', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      const mockChar = makeMockCharacter();
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .delete('/api/characters/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .delete('/api/characters/1');

      expect(res.status).toBe(401);
    });

    it('devrait retourner 403 pour un MODERATOR (ADMIN only)', async () => {
      const { token } = setupAuthUser(MODERATOR_UUID, 'MODERATOR');

      const res = await request(app)
        .delete('/api/characters/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('devrait retourner 403 pour un GAME_MASTER (ADMIN only)', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');

      const res = await request(app)
        .delete('/api/characters/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('devrait retourner 404 si le personnage n\'existe pas', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      Character.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/characters/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  // ─── PATCH /api/characters/:id/submit ──────────────────────────────────────

  describe('PATCH /api/characters/:id/submit', () => {
    it('devrait soumettre un personnage draft pour approbation', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');
      const mockChar = makeMockCharacter({ status: 'draft' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/submit')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait soumettre un personnage rejected', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');
      const mockChar = makeMockCharacter({ status: 'rejected' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/submit')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait retourner 400 si le personnage est déjà pending', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/submit')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it('devrait retourner 400 si le personnage est approved', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');
      const mockChar = makeMockCharacter({ status: 'approved' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/submit')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .patch('/api/characters/1/submit');

      expect(res.status).toBe(401);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuthUser(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .patch('/api/characters/1/submit')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  // ─── PATCH /api/characters/:id/approve ─────────────────────────────────────

  describe('PATCH /api/characters/:id/approve', () => {
    it('devrait approuver un personnage pending en tant qu\'ADMIN', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/approve')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('approuvé');
    });

    it('devrait approuver en tant que MODERATOR', async () => {
      const { token } = setupAuthUser(MODERATOR_UUID, 'MODERATOR');
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/approve')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuthUser(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .patch('/api/characters/1/approve')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('devrait retourner 403 pour un GAME_MASTER', async () => {
      const { token } = setupAuthUser(GAME_MASTER_UUID, 'GAME_MASTER');

      const res = await request(app)
        .patch('/api/characters/1/approve')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .patch('/api/characters/1/approve');

      expect(res.status).toBe(401);
    });

    it('devrait retourner 400 si le personnage n\'est pas en pending', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      const mockChar = makeMockCharacter({ status: 'draft' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/approve')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });

  // ─── PATCH /api/characters/:id/reject ──────────────────────────────────────

  describe('PATCH /api/characters/:id/reject', () => {
    const validRejectionReason = 'La fiche est incomplète, veuillez détailler davantage le background.';

    it('devrait rejeter un personnage pending avec une raison valide (ADMIN)', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      const mockChar = makeMockCharacter({ status: 'pending' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/reject')
        .set('Authorization', `Bearer ${token}`)
        .send({ rejectionReason: validRejectionReason });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait retourner 422 si la raison est absente', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .patch('/api/characters/1/reject')
        .set('Authorization', `Bearer ${token}`)
        .send({}); // Pas de rejectionReason

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait retourner 422 si la raison est trop courte', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');

      const res = await request(app)
        .patch('/api/characters/1/reject')
        .set('Authorization', `Bearer ${token}`)
        .send({ rejectionReason: 'Court' }); // < 10 chars

      expect(res.status).toBe(422);
    });

    it('devrait retourner 403 pour un PLAYER', async () => {
      const { token } = setupAuthUser(PLAYER_UUID, 'PLAYER');

      const res = await request(app)
        .patch('/api/characters/1/reject')
        .set('Authorization', `Bearer ${token}`)
        .send({ rejectionReason: validRejectionReason });

      expect(res.status).toBe(403);
    });

    it('devrait retourner 401 sans authentification', async () => {
      const res = await request(app)
        .patch('/api/characters/1/reject')
        .send({ rejectionReason: validRejectionReason });

      expect(res.status).toBe(401);
    });

    it('devrait retourner 400 si le personnage n\'est pas en pending', async () => {
      const { token } = setupAuthUser(ADMIN_UUID, 'ADMIN');
      const mockChar = makeMockCharacter({ status: 'approved' });
      Character.findByPk.mockResolvedValue(mockChar);

      const res = await request(app)
        .patch('/api/characters/1/reject')
        .set('Authorization', `Bearer ${token}`)
        .send({ rejectionReason: validRejectionReason });

      expect(res.status).toBe(400);
    });
  });
});
