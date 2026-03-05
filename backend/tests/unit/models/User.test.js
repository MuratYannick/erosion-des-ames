'use strict';

/**
 * Tests unitaires pour le modèle User
 * On instancie le modèle avec un Sequelize minimal (mock) pour tester
 * les hooks, scopes et méthodes d'instance sans accès DB réel.
 */
const bcrypt = require('bcrypt');

// Mock de bcrypt pour contrôler le comportement dans les tests
jest.mock('bcrypt');

// Mock de jwt pour generateAuthToken
jest.mock('../../../utils/jwt', () => ({
  signToken: jest.fn().mockReturnValue('mocked-token'),
}));

describe('User Model', () => {
  let userFactory;
  let mockSequelize;
  let DataTypes;
  let UserModel;
  let hooks;

  beforeEach(() => {
    jest.clearAllMocks();

    hooks = {};

    // DataTypes minimal
    DataTypes = {
      UUID: 'UUID',
      UUIDV4: 'UUIDV4',
      STRING: jest.fn((len) => `STRING(${len})`),
      TEXT: 'TEXT',
      BOOLEAN: 'BOOLEAN',
      DATE: 'DATE',
      INTEGER: 'INTEGER',
      ENUM: jest.fn((...args) => `ENUM(${args.join(',')})`),
    };

    // Sequelize minimal
    mockSequelize = {
      define: jest.fn((name, attrs, options) => {
        // Simuler le modèle retourné
        const Model = {
          _name: name,
          _attrs: attrs,
          _options: options,
          beforeCreate: jest.fn((fn) => { hooks.beforeCreate = fn; }),
          beforeUpdate: jest.fn((fn) => { hooks.beforeUpdate = fn; }),
          afterUpdate: jest.fn((fn) => { hooks.afterUpdate = fn; }),
          associate: null,
          prototype: {},
          // scope() retourne le modèle lui-même pour simplifier
          scope: jest.fn().mockReturnThis(),
        };
        return Model;
      }),
    };

    // Charger la factory et initialiser le modèle
    userFactory = require('../../../models/User');
    UserModel = userFactory(mockSequelize, DataTypes);
  });

  // ─── Hook beforeCreate ─────────────────────────────────────────────────────

  describe('hook beforeCreate', () => {
    it('devrait hasher le mot de passe avant la création', async () => {
      bcrypt.hash.mockResolvedValue('$2b$12$hashed_password');

      const userInstance = { password: 'PlainPassword123!' };

      await hooks.beforeCreate(userInstance);

      expect(bcrypt.hash).toHaveBeenCalledWith('PlainPassword123!', 12);
      expect(userInstance.password).toBe('$2b$12$hashed_password');
    });

    it('ne devrait pas appeler hash si le mot de passe est absent', async () => {
      const userInstance = {}; // Pas de champ password

      await hooks.beforeCreate(userInstance);

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('ne devrait pas appeler hash si le mot de passe est null', async () => {
      const userInstance = { password: null };

      await hooks.beforeCreate(userInstance);

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('ne devrait pas appeler hash si le mot de passe est une chaîne vide', async () => {
      const userInstance = { password: '' };

      await hooks.beforeCreate(userInstance);

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('devrait utiliser SALT_ROUNDS = 12', async () => {
      bcrypt.hash.mockResolvedValue('$2b$12$somehashedvalue');
      const userInstance = { password: 'TestPassword123!' };

      await hooks.beforeCreate(userInstance);

      expect(bcrypt.hash).toHaveBeenCalledWith(expect.any(String), 12);
    });
  });

  // ─── Hook beforeUpdate ─────────────────────────────────────────────────────

  describe('hook beforeUpdate', () => {
    it('devrait hasher le mot de passe si le champ password a changé', async () => {
      bcrypt.hash.mockResolvedValue('$2b$12$new_hashed_password');

      const userInstance = {
        password: 'NewPassword123!',
        changed: jest.fn((field) => field === 'password'),
      };

      await hooks.beforeUpdate(userInstance);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 12);
      expect(userInstance.password).toBe('$2b$12$new_hashed_password');
    });

    it('ne devrait pas hasher si le champ password n\'a pas changé', async () => {
      const userInstance = {
        password: '$2b$12$already_hashed',
        changed: jest.fn().mockReturnValue(false),
      };

      await hooks.beforeUpdate(userInstance);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      // Le mot de passe ne doit pas changer
      expect(userInstance.password).toBe('$2b$12$already_hashed');
    });

    it('ne devrait pas hasher lors d\'une mise à jour de lastLoginAt', async () => {
      const userInstance = {
        lastLoginAt: new Date(),
        // changed('password') retourne false
        changed: jest.fn((field) => field !== 'password'),
      };

      await hooks.beforeUpdate(userInstance);

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  // ─── Scopes ────────────────────────────────────────────────────────────────

  describe('scopes', () => {
    it('le scope "active" devrait filtrer par isActive: true', () => {
      const activeScope = UserModel._options.scopes.active;

      expect(activeScope).toEqual({ where: { isActive: true } });
    });

    it('le scope "withPassword" devrait inclure le champ password', () => {
      const withPasswordScope = UserModel._options.scopes.withPassword;

      // withPassword doit ne pas exclure le password (attributes: {})
      expect(withPasswordScope).toEqual({ attributes: {} });
    });

    it('le defaultScope devrait exclure le mot de passe', () => {
      const defaultScope = UserModel._options.defaultScope;

      expect(defaultScope).toEqual({
        attributes: { exclude: ['password'] },
      });
    });

    it('le scope "verified" devrait filtrer par isEmailVerified: true', () => {
      const verifiedScope = UserModel._options.scopes.verified;

      expect(verifiedScope).toEqual({ where: { isEmailVerified: true } });
    });
  });

  // ─── Méthode validatePassword ──────────────────────────────────────────────

  describe('méthode d\'instance validatePassword', () => {
    it('devrait retourner true pour un mot de passe correct', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const userInstance = {
        password: '$2b$12$hashed_password',
      };

      // Attacher la méthode depuis le prototype
      const validatePassword = UserModel.prototype.validatePassword;
      const result = await validatePassword.call(userInstance, 'CorrectPassword123!');

      expect(bcrypt.compare).toHaveBeenCalledWith('CorrectPassword123!', '$2b$12$hashed_password');
      expect(result).toBe(true);
    });

    it('devrait retourner false pour un mot de passe incorrect', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const userInstance = {
        password: '$2b$12$hashed_password',
      };

      const validatePassword = UserModel.prototype.validatePassword;
      const result = await validatePassword.call(userInstance, 'WrongPassword!');

      expect(result).toBe(false);
    });
  });

  // ─── Méthode generateEmailVerificationToken ────────────────────────────────

  describe('méthode generateEmailVerificationToken', () => {
    it('devrait générer un token hexadécimal de 64 caractères', () => {
      const userInstance = {};
      const generateToken = UserModel.prototype.generateEmailVerificationToken;

      const token = generateToken.call(userInstance);

      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('devrait stocker le token et la date d\'expiration sur l\'instance', () => {
      const userInstance = {};
      const generateToken = UserModel.prototype.generateEmailVerificationToken;

      const token = generateToken.call(userInstance);

      expect(userInstance.emailVerificationToken).toBe(token);
      expect(userInstance.emailVerificationExpires).toBeInstanceOf(Date);
      // Doit expirer dans ~24h (avec tolérance de 1min)
      const now = Date.now();
      const exp = userInstance.emailVerificationExpires.getTime();
      expect(exp).toBeGreaterThan(now + 23 * 60 * 60 * 1000);
      expect(exp).toBeLessThan(now + 25 * 60 * 60 * 1000);
    });
  });

  // ─── Méthode generatePasswordResetToken ───────────────────────────────────

  describe('méthode generatePasswordResetToken', () => {
    it('devrait générer un token hexadécimal de 64 caractères', () => {
      const userInstance = {};
      const generateToken = UserModel.prototype.generatePasswordResetToken;

      const token = generateToken.call(userInstance);

      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('devrait stocker le token et l\'expiration dans 1 heure', () => {
      const userInstance = {};
      const generateToken = UserModel.prototype.generatePasswordResetToken;

      generateToken.call(userInstance);

      expect(userInstance.passwordResetToken).toBeDefined();
      const now = Date.now();
      const exp = userInstance.passwordResetExpires.getTime();
      // Expire dans ~1h
      expect(exp).toBeGreaterThan(now + 55 * 60 * 1000);
      expect(exp).toBeLessThan(now + 65 * 60 * 1000);
    });
  });

  // ─── Méthode generateAuthToken ─────────────────────────────────────────────

  describe('méthode generateAuthToken', () => {
    it('devrait appeler signToken avec l\'id de l\'utilisateur', () => {
      const { signToken } = require('../../../utils/jwt');
      const userInstance = { id: 'user-uuid-test' };
      const generateAuthToken = UserModel.prototype.generateAuthToken;

      const token = generateAuthToken.call(userInstance);

      expect(signToken).toHaveBeenCalledWith('user-uuid-test');
      expect(token).toBe('mocked-token');
    });
  });

  // ─── Options du modèle ─────────────────────────────────────────────────────

  describe('options du modèle', () => {
    it('devrait avoir paranoid: true pour le soft delete', () => {
      expect(UserModel._options.paranoid).toBe(true);
    });

    it('devrait avoir timestamps: true', () => {
      expect(UserModel._options.timestamps).toBe(true);
    });

    it('devrait avoir underscored: true', () => {
      expect(UserModel._options.underscored).toBe(true);
    });

    it('devrait avoir tableName: "users"', () => {
      expect(UserModel._options.tableName).toBe('users');
    });
  });
});
