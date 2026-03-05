'use strict';

// Mocks AVANT les imports — requis pour le hoisting Jest
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
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    scope: jest.fn(),
  },
  UserSanction: {
    scope: jest.fn(),
  },
  Character: {
    findOne: jest.fn(),
  },
  Faction: {},
}));

jest.mock('../../../utils/email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({}),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({}),
  sendWelcomeEmail: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../utils/jwt', () => ({
  signToken: jest.fn().mockReturnValue('mocked-jwt-token'),
  verifyToken: jest.fn(),
}));

const {
  register,
  login,
  updateProfile,
  selectCharacter,
} = require('../../../controllers/authController');

const { User, UserSanction, Character } = require('../../../models');
const emailUtils = require('../../../utils/email');

/**
 * Helper pour créer un faux environnement req/res/next
 */
const makeReqResNext = (body = {}, user = null) => {
  const req = { body, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup par défaut du scope mock
    User.scope.mockReturnValue({
      findOne: User.findOne,
      findByPk: User.findByPk,
    });

    UserSanction.scope.mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    });

    // resetMocks: true efface les implémentations — les re-configurer ici
    emailUtils.sendVerificationEmail.mockResolvedValue({});
    emailUtils.sendPasswordResetEmail.mockResolvedValue({});
    emailUtils.sendWelcomeEmail.mockResolvedValue({});
  });

  // ─── register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    const validBody = {
      username: 'NewUser123',
      email: 'newuser@example.com',
      password: 'ValidPass123!',
      acceptedCgu: 'true',
      acceptedRules: 'true',
    };

    it('devrait créer un utilisateur et retourner 201', async () => {
      User.findOne.mockResolvedValue(null); // email libre
      User.findOne.mockResolvedValueOnce(null) // email libre
        .mockResolvedValueOnce(null); // username libre

      const mockCreatedUser = {
        id: 'user-uuid-new',
        username: validBody.username,
        email: validBody.email,
        generateEmailVerificationToken: jest.fn().mockReturnValue('verif-token'),
        save: jest.fn().mockResolvedValue(true),
      };

      User.create.mockResolvedValue(mockCreatedUser);
      User.findByPk.mockResolvedValue({ id: 'user-uuid-new', username: validBody.username });

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: expect.stringContaining('Inscription réussie'),
      }));
    });

    it('devrait retourner 409 si l\'email est déjà utilisé', async () => {
      // La première vérification (email) retourne un user existant
      User.findOne.mockResolvedValueOnce({ email: validBody.email });

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'EMAIL_ALREADY_EXISTS' }),
      }));
      expect(User.create).not.toHaveBeenCalled();
    });

    it('devrait retourner 409 si le username est déjà pris', async () => {
      User.findOne
        .mockResolvedValueOnce(null) // email libre
        .mockResolvedValueOnce({ username: validBody.username }); // username pris

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'USERNAME_ALREADY_EXISTS' }),
      }));
      expect(User.create).not.toHaveBeenCalled();
    });

    it('devrait retourner 422 si une erreur de validation Sequelize survient', async () => {
      User.findOne.mockResolvedValue(null);

      const sequelizeValidationError = new Error('Validation error');
      sequelizeValidationError.name = 'SequelizeValidationError';
      sequelizeValidationError.errors = [
        { path: 'password', message: 'Le mot de passe est trop faible' },
      ];

      User.create.mockRejectedValue(sequelizeValidationError);

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
      }));
    });

    it('devrait retourner 500 en cas d\'erreur inattendue', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(new Error('Database connection lost'));

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR' }),
      }));
    });

    it('devrait appeler generateEmailVerificationToken et save', async () => {
      User.findOne.mockResolvedValue(null);

      const generateToken = jest.fn().mockReturnValue('verif-token');
      const save = jest.fn().mockResolvedValue(true);

      User.create.mockResolvedValue({
        id: 'user-uuid-new',
        generateEmailVerificationToken: generateToken,
        save,
      });

      User.findByPk.mockResolvedValue({ id: 'user-uuid-new' });

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      expect(generateToken).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
    });

    it('ne devrait pas exposer le mot de passe dans la réponse', async () => {
      User.findOne.mockResolvedValue(null);

      User.create.mockResolvedValue({
        id: 'user-uuid-new',
        generateEmailVerificationToken: jest.fn().mockReturnValue('verif-token'),
        save: jest.fn().mockResolvedValue(true),
      });

      User.findByPk.mockResolvedValue({ id: 'user-uuid-new', username: 'NewUser123' });

      const { req, res, next } = makeReqResNext(validBody);

      await register(req, res, next);

      const responseBody = res.json.mock.calls[0][0];
      const userInResponse = responseBody.data?.user;
      if (userInResponse) {
        expect(userInResponse).not.toHaveProperty('password');
      }
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    const validBody = {
      identifier: 'user@example.com',
      password: 'ValidPass123!',
    };

    it('devrait connecter un utilisateur valide et retourner un token', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        username: 'TestUser',
        email: validBody.identifier,
        isActive: true,
        isEmailVerified: true,
        validatePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('jwt-token'),
        save: jest.fn().mockResolvedValue(true),
      };

      // login utilise User.scope('withPassword').findOne(...)
      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });
      // Pas de ban actif
      UserSanction.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });
      // getUserWithSelectedCharacter utilise User.findByPk
      User.findByPk.mockResolvedValue({ id: 'user-uuid-1234', username: 'TestUser' });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: 'jwt-token',
        }),
        message: expect.stringContaining('Connexion réussie'),
      }));
    });

    it('devrait retourner 401 si l\'utilisateur est introuvable', async () => {
      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
      }));
    });

    it('devrait retourner 403 si le compte est désactivé', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        isActive: false,
      };

      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'ACCOUNT_DISABLED' }),
      }));
    });

    it('devrait retourner 401 si le mot de passe est incorrect', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        isActive: true,
        isEmailVerified: true,
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });
      UserSanction.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
      }));
    });

    it('devrait retourner 403 si l\'email n\'est pas vérifié', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        isActive: true,
        isEmailVerified: false,
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });
      UserSanction.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'EMAIL_NOT_VERIFIED' }),
      }));
    });

    it('devrait retourner 403 si l\'utilisateur a un ban actif', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        isActive: true,
        isEmailVerified: true,
        validatePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      const activeBan = { id: 'ban-1', type: 'ban' };

      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });
      UserSanction.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(activeBan) });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'ACCOUNT_BANNED' }),
      }));
    });

    it('ne devrait pas révéler si c\'est l\'identifiant ou le mot de passe qui est incorrect', async () => {
      User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });

      const { req, res, next } = makeReqResNext(validBody);

      await login(req, res, next);

      const responseBody = res.json.mock.calls[0][0];
      // Le message ne doit pas révéler si c'est l'email qui est incorrect
      expect(responseBody.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // ─── updateProfile ───────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    const userId = 'user-uuid-1234';

    it('devrait mettre à jour le username avec succès', async () => {
      const mockUser = {
        id: userId,
        username: 'OldUsername',
        avatar: null,
        update: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue(true),
      };

      // Pas de conflit de username
      User.findOne.mockResolvedValue(null);
      User.findByPk.mockResolvedValue(mockUser);

      const { req, res, next } = makeReqResNext(
        { username: 'NewUsername' },
        { id: userId }
      );

      await updateProfile(req, res, next);

      expect(mockUser.update).toHaveBeenCalledWith({ username: 'NewUsername' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
      }));
    });

    it('devrait mettre à jour l\'avatar avec succès', async () => {
      const mockUser = {
        id: userId,
        update: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue(true),
      };

      User.findByPk.mockResolvedValue(mockUser);

      const { req, res, next } = makeReqResNext(
        { avatar: 'https://example.com/avatar.jpg' },
        { id: userId }
      );

      await updateProfile(req, res, next);

      expect(mockUser.update).toHaveBeenCalledWith({ avatar: 'https://example.com/avatar.jpg' });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait retourner 409 si le username est déjà pris', async () => {
      // Un autre utilisateur a ce username
      User.findOne.mockResolvedValue({ id: 'other-user', username: 'TakenUsername' });

      const { req, res, next } = makeReqResNext(
        { username: 'TakenUsername' },
        { id: userId }
      );

      await updateProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'USERNAME_ALREADY_EXISTS' }),
      }));
    });

    it('devrait retourner 400 si aucun champ n\'est fourni', async () => {
      const { req, res, next } = makeReqResNext({}, { id: userId });

      await updateProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'NO_FIELDS_TO_UPDATE' }),
      }));
    });

    it('ne devrait pas bloquer si le username est le sien propre', async () => {
      // findOne retourne null = username disponible (query exclut l'user courant via Op.ne)
      User.findOne.mockResolvedValue(null);

      const mockUser = {
        id: userId,
        update: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue(true),
      };

      User.findByPk.mockResolvedValue(mockUser);

      const { req, res, next } = makeReqResNext(
        { username: 'SameUsername' },
        { id: userId }
      );

      await updateProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ─── selectCharacter ─────────────────────────────────────────────────────────

  describe('selectCharacter', () => {
    const userId = 'user-uuid-1234';

    it('devrait sélectionner un personnage appartenant à l\'utilisateur', async () => {
      const mockCharacter = {
        id: 1,
        userId,
        status: 'approved',
        isActive: true,
      };

      Character.findOne.mockResolvedValue(mockCharacter);
      User.update.mockResolvedValue([1]);
      User.findByPk.mockResolvedValue({ id: userId, selectedCharacterId: 1 });

      const { req, res, next } = makeReqResNext(
        { characterId: 1 },
        { id: userId, role: 'PLAYER' }
      );

      await selectCharacter(req, res, next);

      expect(Character.findOne).toHaveBeenCalled();
      expect(User.update).toHaveBeenCalledWith(
        { selectedCharacterId: 1 },
        { where: { id: userId } }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: expect.stringContaining('sélectionné'),
      }));
    });

    it('devrait retourner 404 si le personnage n\'est pas trouvé', async () => {
      Character.findOne.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext(
        { characterId: 999 },
        { id: userId, role: 'PLAYER' }
      );

      await selectCharacter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'CHARACTER_NOT_FOUND' }),
      }));
    });

    it('devrait retourner 404 si le personnage appartient à un autre utilisateur', async () => {
      // findOne retourne null car la condition userId est restrictive
      Character.findOne.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext(
        { characterId: 1 },
        { id: 'other-user-uuid', role: 'PLAYER' }
      );

      await selectCharacter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'CHARACTER_NOT_FOUND' }),
      }));
    });

    it('devrait retourner 404 si le personnage n\'est pas approved ou actif', async () => {
      // findOne retourne null car status/isActive ne correspond pas
      Character.findOne.mockResolvedValue(null);

      const { req, res, next } = makeReqResNext(
        { characterId: 2 },
        { id: userId, role: 'PLAYER' }
      );

      await selectCharacter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('devrait permettre au staff de sélectionner un personnage sans propriétaire', async () => {
      // Personnage staff (userId null)
      const mockStaffCharacter = {
        id: 5,
        userId: null,
        status: 'approved',
        isActive: true,
      };

      Character.findOne.mockResolvedValue(mockStaffCharacter);
      // Pas d'autre user utilisant ce personnage
      User.findOne.mockResolvedValue(null);
      User.update.mockResolvedValue([1]);
      User.findByPk.mockResolvedValue({ id: 'admin-uuid', selectedCharacterId: 5 });

      const { req, res, next } = makeReqResNext(
        { characterId: 5 },
        { id: 'admin-uuid', role: 'ADMIN' }
      );

      await selectCharacter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait retourner 409 si un personnage staff est déjà utilisé par quelqu\'un d\'autre', async () => {
      const mockStaffCharacter = {
        id: 5,
        userId: null,
        status: 'approved',
        isActive: true,
      };

      Character.findOne.mockResolvedValue(mockStaffCharacter);
      // Un autre staff utilise déjà ce personnage
      User.findOne.mockResolvedValue({ id: 'other-admin', selectedCharacterId: 5 });

      const { req, res, next } = makeReqResNext(
        { characterId: 5 },
        { id: 'admin-uuid', role: 'ADMIN' }
      );

      await selectCharacter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({ code: 'CHARACTER_ALREADY_IN_USE' }),
      }));
    });
  });
});
