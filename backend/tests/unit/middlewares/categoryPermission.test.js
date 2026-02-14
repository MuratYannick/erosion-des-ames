'use strict';

const categoryPermissionService = require('../../../services/categoryPermissionService');
const { Character } = require('../../../models');

jest.mock('../../../services/categoryPermissionService', () => ({
  userHasPermission: jest.fn(),
}));

jest.mock('../../../models', () => ({
  Character: {
    findByPk: jest.fn(),
  },
}));

const {
  requireCategoryPermission,
  requireCategoryPermissionOn,
  requireDualCategoryPermission,
} = require('../../../middlewares/categoryPermission');

describe('categoryPermission middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
      headers: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('requireCategoryPermission', () => {
    describe('Extraction du categoryId', () => {
      it('devrait extraire categoryId de req.params.categoryId', async () => {
        req.params.categoryId = 1;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 1, 'access_category', expect.any(Object)
        );
        expect(next).toHaveBeenCalledWith();
      });

      it('devrait extraire categoryId de req.params.id', async () => {
        req.params.id = 2;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 2, 'access_category', expect.any(Object)
        );
      });

      it('devrait extraire categoryId de req.body.categoryId', async () => {
        req.body.categoryId = 3;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 3, 'access_category', expect.any(Object)
        );
      });

      it('devrait prioriser req.params.categoryId sur req.params.id', async () => {
        req.params.categoryId = 1;
        req.params.id = 2;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 1, 'access_category', expect.any(Object)
        );
      });

      it('devrait appeler next avec une erreur 400 si aucun categoryId trouvé', async () => {
        req.user = { id: 'user-1', role: 'PLAYER' };

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({ statusCode: 400 })
        );
        expect(categoryPermissionService.userHasPermission).not.toHaveBeenCalled();
      });

      it('devrait utiliser options.sourceField si fourni', async () => {
        req.body.targetCategoryId = 5;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category', {
          sourceField: 'body.targetCategoryId',
        });
        await middleware(req, res, next);

        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 5, 'access_category', expect.any(Object)
        );
      });
    });

    describe('Verification de permission', () => {
      it('devrait appeler next() si la permission est accordee', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
      });

      it('devrait appeler next(error) avec 403 si la permission est refusee', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(false);

        const middleware = requireCategoryPermission('edit_category');
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({ statusCode: 403 })
        );
      });

      it('devrait passer null comme user si req.user est undefined', async () => {
        delete req.user;
        req.params.id = 1;
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          null, 1, 'access_category', expect.any(Object)
        );
      });
    });

    describe('Options de permission', () => {
      it('devrait utiliser req.user.selectedCharacterId pour construire les options', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER', selectedCharacterId: 'char-1' };
        Character.findByPk.mockResolvedValue({ id: 'char-1', factionId: 2, clanId: 3 });
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(Character.findByPk).toHaveBeenCalledWith('char-1', {
          attributes: ['id', 'factionId', 'clanId'],
        });
        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 1, 'access_category',
          expect.objectContaining({ characterId: 'char-1', factionId: 2, clanId: 3 })
        );
      });

      it('devrait utiliser req.body.characterId si characterFromBody est true', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER', selectedCharacterId: 'char-old' };
        req.body.characterId = 'char-2';
        Character.findByPk.mockResolvedValue({ id: 'char-2', factionId: 4, clanId: 5 });
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category', { characterFromBody: true });
        await middleware(req, res, next);

        expect(Character.findByPk).toHaveBeenCalledWith('char-2', {
          attributes: ['id', 'factionId', 'clanId'],
        });
      });

      it('devrait utiliser factionId et clanId du body si characterFromBody est true', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER' };
        req.body.characterId = 'char-2';
        req.body.factionId = 10;
        req.body.clanId = 20;
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category', { characterFromBody: true });
        await middleware(req, res, next);

        expect(Character.findByPk).not.toHaveBeenCalled();
        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 1, 'access_category',
          expect.objectContaining({ characterId: 'char-2', factionId: 10, clanId: 20 })
        );
      });

      it('devrait continuer si le chargement du personnage echoue', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER', selectedCharacterId: 'char-1' };
        Character.findByPk.mockRejectedValue(new Error('Database error'));
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        consoleSpy.mockRestore();
      });

      it('devrait passer des options vides si aucun characterId disponible', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER' };
        categoryPermissionService.userHasPermission.mockResolvedValue(true);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(Character.findByPk).not.toHaveBeenCalled();
        expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
          req.user, 1, 'access_category',
          expect.objectContaining({ characterId: null })
        );
      });
    });

    describe('Gestion des erreurs', () => {
      it('devrait propager les erreurs du service de permission', async () => {
        req.params.id = 1;
        req.user = { id: 'user-1', role: 'PLAYER' };
        const serviceError = new Error('Service error');
        categoryPermissionService.userHasPermission.mockRejectedValue(serviceError);

        const middleware = requireCategoryPermission('access_category');
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(serviceError);
      });
    });
  });

  describe('requireCategoryPermissionOn', () => {
    it('devrait deleguer avec le bon sourceField', async () => {
      req.body.targetCategoryId = 5;
      req.user = { id: 'user-1', role: 'PLAYER' };
      categoryPermissionService.userHasPermission.mockResolvedValue(true);

      const middleware = requireCategoryPermissionOn('body.targetCategoryId', 'access_category');
      await middleware(req, res, next);

      expect(categoryPermissionService.userHasPermission).toHaveBeenCalledWith(
        req.user, 5, 'access_category', expect.any(Object)
      );
      expect(next).toHaveBeenCalledWith();
    });

    it('devrait appeler next(error) si la permission est refusee', async () => {
      req.params.sourceCategoryId = 10;
      req.user = { id: 'user-1', role: 'PLAYER' };
      categoryPermissionService.userHasPermission.mockResolvedValue(false);

      const middleware = requireCategoryPermissionOn('params.sourceCategoryId', 'edit_category');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });
  });

  describe('requireDualCategoryPermission', () => {
    it('devrait appeler next() si permission accordee sur les deux categories', async () => {
      req.user = { id: 'user-1', role: 'PLAYER' };
      categoryPermissionService.userHasPermission.mockResolvedValue(true);

      const extractors = {
        getSourceCategoryId: jest.fn().mockResolvedValue(1),
        getTargetCategoryId: jest.fn().mockResolvedValue(2),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(categoryPermissionService.userHasPermission).toHaveBeenCalledTimes(2);
      expect(next).toHaveBeenCalledWith();
    });

    it('devrait appeler next(error) 403 si la permission source est refusee', async () => {
      req.user = { id: 'user-1', role: 'PLAYER' };
      categoryPermissionService.userHasPermission
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const extractors = {
        getSourceCategoryId: jest.fn().mockResolvedValue(1),
        getTargetCategoryId: jest.fn().mockResolvedValue(2),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(categoryPermissionService.userHasPermission).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });

    it('devrait appeler next(error) 403 si la permission cible est refusee', async () => {
      req.user = { id: 'user-1', role: 'PLAYER' };
      categoryPermissionService.userHasPermission
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const extractors = {
        getSourceCategoryId: jest.fn().mockResolvedValue(1),
        getTargetCategoryId: jest.fn().mockResolvedValue(2),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(categoryPermissionService.userHasPermission).toHaveBeenCalledTimes(2);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403 })
      );
    });

    it('devrait appeler next(error) 400 si sourceCategoryId est manquant', async () => {
      req.user = { id: 'user-1', role: 'PLAYER' };

      const extractors = {
        getSourceCategoryId: jest.fn().mockResolvedValue(null),
        getTargetCategoryId: jest.fn().mockResolvedValue(2),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400 })
      );
      expect(categoryPermissionService.userHasPermission).not.toHaveBeenCalled();
    });

    it('devrait appeler next(error) 400 si targetCategoryId est manquant', async () => {
      req.user = { id: 'user-1', role: 'PLAYER' };

      const extractors = {
        getSourceCategoryId: jest.fn().mockResolvedValue(1),
        getTargetCategoryId: jest.fn().mockResolvedValue(null),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400 })
      );
    });

    it('devrait propager les erreurs des extractors', async () => {
      req.user = { id: 'user-1', role: 'PLAYER' };
      const extractorError = new Error('Extractor failed');

      const extractors = {
        getSourceCategoryId: jest.fn().mockRejectedValue(extractorError),
        getTargetCategoryId: jest.fn().mockResolvedValue(2),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(extractorError);
    });

    it('devrait fonctionner avec user null', async () => {
      req.user = null;
      categoryPermissionService.userHasPermission.mockResolvedValue(true);

      const extractors = {
        getSourceCategoryId: jest.fn().mockResolvedValue(1),
        getTargetCategoryId: jest.fn().mockResolvedValue(2),
      };

      const middleware = requireDualCategoryPermission('move_topic', extractors);
      await middleware(req, res, next);

      expect(categoryPermissionService.userHasPermission).toHaveBeenNthCalledWith(
        1, null, 1, 'move_topic', expect.any(Object)
      );
      expect(categoryPermissionService.userHasPermission).toHaveBeenNthCalledWith(
        2, null, 2, 'move_topic', expect.any(Object)
      );
    });
  });
});
