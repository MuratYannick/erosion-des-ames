'use strict';

// IMPORTANT: Les mocks doivent être définis AVANT les imports
// Mock des models
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    scope: jest.fn(),
  },
}));

// Mock des fonctions email
jest.mock('../../utils/email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({}),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({}),
  sendWelcomeEmail: jest.fn().mockResolvedValue({}),
}));

// Mock des rate limiters pour les tests
jest.mock('../../middlewares/rateLimit', () => ({
  loginLimiter: (req, res, next) => next(),
  registerLimiter: (req, res, next) => next(),
  passwordResetLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
}));

// Maintenant on peut importer les modules
const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models');
const { signToken } = require('../../utils/jwt');
const { hashPassword } = require('../../utils/password');
const emailUtils = require('../../utils/email');

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup du mock User.scope
    User.scope.mockReturnValue({
      findByPk: User.findByPk,
      findOne: User.findOne,
    });
  });

  describe('POST /api/auth/register', () => {
    const validPayload = {
      username: 'NewUser123',
      email: 'newuser@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      acceptedCgu: 'true',
      acceptedRules: 'true',
    };

    it('devrait créer un nouvel utilisateur avec succès', async () => {
      // Mock: email et username n'existent pas
      User.findOne.mockResolvedValue(null);

      const mockUser = {
        id: 'user-123',
        username: validPayload.username,
        email: validPayload.email,
        isEmailVerified: false,
        generateEmailVerificationToken: jest.fn().mockReturnValue('verification-token'),
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: validPayload.username,
          email: validPayload.email,
        }),
      };

      User.create.mockResolvedValue(mockUser);
      User.findByPk.mockResolvedValue({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: validPayload.username,
          email: validPayload.email,
        }),
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('username', validPayload.username);
      expect(res.body.message).toContain('Inscription réussie');
      expect(emailUtils.sendVerificationEmail).toHaveBeenCalled();
    });

    it('devrait rejeter si l\'email existe déjà', async () => {
      User.findOne.mockResolvedValueOnce({ email: validPayload.email });

      const res = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('devrait rejeter si le username existe déjà', async () => {
      User.findOne
        .mockResolvedValueOnce(null) // email n'existe pas
        .mockResolvedValueOnce({ username: validPayload.username }); // username existe

      const res = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('USERNAME_ALREADY_EXISTS');
    });

    it('devrait rejeter avec un mot de passe faible', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          password: 'weak',
          confirmPassword: 'weak',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait rejeter si confirmPassword ne correspond pas', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          confirmPassword: 'DifferentPass123!',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait rejeter si acceptedCgu est false', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          acceptedCgu: 'false',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait rejeter si acceptedRules est false', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          acceptedRules: 'false',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait rejeter un username invalide', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          username: '_InvalidUsername',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait rejeter un email invalide', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validPayload,
          email: 'not-an-email',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginPayload = {
      email: 'user@example.com',
      password: 'ValidPass123!',
    };

    it('devrait connecter un utilisateur avec succès', async () => {
      const hashedPassword = await hashPassword(validLoginPayload.password);
      const mockUser = {
        id: 'user-123',
        username: 'TestUser',
        email: validLoginPayload.email,
        password: hashedPassword,
        isActive: true,
        isEmailVerified: true,
        validatePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('jwt-token-123'),
        save: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      User.findByPk.mockResolvedValue({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLoginPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.message).toContain('Connexion réussie');
    });

    it('devrait rejeter avec un email inexistant', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLoginPayload);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('devrait rejeter avec un mauvais mot de passe', async () => {
      const mockUser = {
        id: 'user-123',
        email: validLoginPayload.email,
        isActive: true,
        isEmailVerified: true,
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLoginPayload);

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('devrait rejeter si le compte est désactivé', async () => {
      const mockUser = {
        id: 'user-123',
        email: validLoginPayload.email,
        isActive: false,
        isEmailVerified: true,
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLoginPayload);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('ACCOUNT_DISABLED');
    });

    it('devrait rejeter si l\'email n\'est pas vérifié', async () => {
      const mockUser = {
        id: 'user-123',
        email: validLoginPayload.email,
        isActive: true,
        isEmailVerified: false,
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLoginPayload);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('EMAIL_NOT_VERIFIED');
    });

    it('devrait rejeter avec un email invalide', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'AnyPassword',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('devrait rejeter avec un password vide', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: '',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('devrait déconnecter un utilisateur authentifié', async () => {
      const userId = 'user-123';
      const token = signToken(userId);
      const mockUser = {
        id: userId,
        username: 'TestUser',
        email: 'test@example.com',
      };

      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Déconnexion réussie');
    });

    it('devrait rejeter sans token', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('devrait rejeter avec un token invalide', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('GET /api/auth/me', () => {
    it('devrait retourner les informations de l\'utilisateur authentifié', async () => {
      const userId = 'user-123';
      const token = signToken(userId);
      const mockUser = {
        id: userId,
        username: 'TestUser',
        email: 'test@example.com',
        role: 'user',
      };

      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id', userId);
      expect(res.body.data.user).toHaveProperty('username', 'TestUser');
    });

    it('devrait rejeter sans token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('devrait rejeter avec un token expiré', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer expired-token');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('devrait vérifier un email avec un token valide', async () => {
      const verificationToken = 'valid-token-123';
      const mockUser = {
        id: 'user-123',
        username: 'TestUser',
        email: 'user@example.com',
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 3600000),
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: 'TestUser',
          email: 'user@example.com',
        }),
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: verificationToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('vérifié');
      expect(emailUtils.sendWelcomeEmail).toHaveBeenCalled();
    });

    it('devrait rejeter avec un token invalide', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_VERIFICATION_TOKEN');
    });

    it('devrait rejeter avec un token expiré', async () => {
      const verificationToken = 'expired-token-123';
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() - 3600000), // Expiré
      };

      User.findOne.mockResolvedValue(null); // La requête avec Op.gt ne trouve rien

      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: verificationToken });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_VERIFICATION_TOKEN');
    });

    it('devrait rejeter sans token', async () => {
      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({});

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/resend-verification', () => {
    it('devrait renvoyer l\'email de vérification', async () => {
      const mockUser = {
        id: 'user-123',
        username: 'TestUser',
        email: 'user@example.com',
        isEmailVerified: false,
        generateEmailVerificationToken: jest.fn().mockReturnValue('new-token'),
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: 'TestUser',
          email: 'user@example.com',
        }),
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'user@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(emailUtils.sendVerificationEmail).toHaveBeenCalled();
    });

    it('devrait retourner success même si l\'email n\'existe pas (sécurité)', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'nonexistent@example.com' });

      // Ne devrait pas révéler que l'email n'existe pas
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait retourner success même si l\'email est déjà vérifié (sécurité)', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        isEmailVerified: true,
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'user@example.com' });

      // Ne devrait pas révéler que l'email est déjà vérifié
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait rejeter avec un email invalide', async () => {
      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('devrait envoyer un email de réinitialisation', async () => {
      const mockUser = {
        id: 'user-123',
        username: 'TestUser',
        email: 'user@example.com',
        generatePasswordResetToken: jest.fn().mockReturnValue('reset-token'),
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: 'TestUser',
          email: 'user@example.com',
        }),
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'user@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(emailUtils.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('devrait retourner success même si l\'email n\'existe pas (sécurité)', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      // Ne devrait pas révéler que l'email n'existe pas
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('devrait rejeter avec un email invalide', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('devrait réinitialiser le mot de passe avec un token valide', async () => {
      const resetToken = 'valid-reset-token';
      const newPassword = 'NewValidPass123!';
      const hashedPassword = await hashPassword('OldPassword123!');

      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        password: hashedPassword,
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 3600000),
        save: jest.fn().mockResolvedValue(true),
      };

      User.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: newPassword,
          confirmPassword: newPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('réinitialisé');
    });

    it('devrait rejeter avec un token invalide', async () => {
      User.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'NewValidPass123!',
          confirmPassword: 'NewValidPass123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_RESET_TOKEN');
    });

    it('devrait rejeter avec un mot de passe faible', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'valid-token',
          password: 'weak',
          confirmPassword: 'weak',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/auth/change-password', () => {
    it('devrait changer le mot de passe avec succès', async () => {
      const userId = 'user-123';
      const token = signToken(userId);
      const currentPassword = 'CurrentPass123!';
      const newPassword = 'NewValidPass123!';
      const hashedPassword = await hashPassword(currentPassword);

      const mockUser = {
        id: userId,
        username: 'TestUser',
        email: 'user@example.com',
        password: hashedPassword,
        validatePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: userId,
          username: 'TestUser',
          email: 'user@example.com',
        }),
      };

      User.findByPk.mockResolvedValue(mockUser);
      User.scope.mockReturnValue({
        findByPk: jest.fn().mockResolvedValue(mockUser),
      });

      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword,
          newPassword,
          confirmNewPassword: newPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('modifié');
    });

    it('devrait rejeter sans authentification', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .send({
          currentPassword: 'CurrentPass123!',
          newPassword: 'NewValidPass123!',
          confirmNewPassword: 'NewValidPass123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('devrait rejeter avec un mauvais mot de passe actuel', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      const mockUser = {
        id: userId,
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      User.findByPk.mockResolvedValue(mockUser);
      User.scope.mockReturnValue({
        findByPk: jest.fn().mockResolvedValue(mockUser),
      });

      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewValidPass123!',
          confirmNewPassword: 'NewValidPass123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CURRENT_PASSWORD');
    });
  });

  describe('PUT /api/auth/update-profile', () => {
    it('devrait mettre à jour le profil avec succès', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      const mockUser = {
        id: userId,
        username: 'OldUsername',
        email: 'user@example.com',
        avatar: null,
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: userId,
          username: 'NewUsername',
          email: 'user@example.com',
          avatar: 'https://example.com/avatar.jpg',
        }),
      };

      User.findByPk.mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue(null); // Username disponible

      const res = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'NewUsername',
          avatar: 'https://example.com/avatar.jpg',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('username');
    });

    it('devrait rejeter sans authentification', async () => {
      const res = await request(app)
        .put('/api/auth/update-profile')
        .send({ username: 'NewUsername' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('devrait rejeter si le username est déjà pris', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      const mockUser = {
        id: userId,
        username: 'CurrentUsername',
      };

      const mockExistingUser = {
        id: 'other-user-id',
        username: 'TakenUsername',
      };

      User.findByPk.mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue(mockExistingUser);

      const res = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'TakenUsername' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('USERNAME_ALREADY_EXISTS');
    });

    it('devrait rejeter avec une URL d\'avatar invalide', async () => {
      const userId = 'user-123';
      const token = signToken(userId);

      User.findByPk.mockResolvedValue({ id: userId });

      const res = await request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ avatar: 'not-a-url' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Security Tests', () => {
    it('devrait rejeter les tentatives d\'injection SQL dans l\'email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin@example.com' OR '1'='1",
          password: 'AnyPassword123!',
        });

      // Devrait échouer à la validation
      expect(res.status).toBe(422);
    });

    it('devrait rejeter les scripts XSS dans le username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: '<script>alert("XSS")</script>',
          email: 'test@example.com',
          password: 'ValidPass123!',
          confirmPassword: 'ValidPass123!',
          acceptedCgu: 'true',
          acceptedRules: 'true',
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('ne devrait pas exposer d\'informations sensibles dans les erreurs', async () => {
      User.findOne.mockRejectedValue(new Error('Database connection failed with password: secret123'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'ValidPass123!',
        });

      expect(res.status).toBe(500);
      expect(res.body.error.message).not.toContain('password');
      expect(res.body.error.message).not.toContain('secret');
    });
  });
});
