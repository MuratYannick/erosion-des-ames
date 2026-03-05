'use strict';

const { ApiError, errorHandler, asyncHandler } = require('../../../middlewares/errorHandler');

describe('ApiError', () => {
  describe('constructeur', () => {
    it('devrait créer une erreur avec les propriétés correctes', () => {
      const error = new ApiError(400, 'Bad Request');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
      expect(error.isOperational).toBe(true);
      expect(error.details).toBeNull();
    });

    it('devrait stocker les détails supplémentaires', () => {
      const details = [{ field: 'email', message: 'Invalid email' }];
      const error = new ApiError(422, 'Validation failed', details);

      expect(error.details).toEqual(details);
    });

    it('devrait avoir une stack trace', () => {
      const error = new ApiError(500, 'Server error');

      expect(error.stack).toBeDefined();
    });
  });

  describe('méthodes statiques', () => {
    it('badRequest() devrait créer une erreur 400', () => {
      const error = ApiError.badRequest('Invalid data');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid data');
      expect(error.isOperational).toBe(true);
    });

    it('badRequest() devrait utiliser "Bad Request" comme message par défaut', () => {
      const error = ApiError.badRequest();

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
    });

    it('unauthorized() devrait créer une erreur 401', () => {
      const error = ApiError.unauthorized('Not authenticated');

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Not authenticated');
    });

    it('forbidden() devrait créer une erreur 403', () => {
      const error = ApiError.forbidden('Access denied');

      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    it('notFound() devrait créer une erreur 404', () => {
      const error = ApiError.notFound('Resource not found');

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('conflict() devrait créer une erreur 409', () => {
      const error = ApiError.conflict('Already exists');

      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Already exists');
    });

    it('unprocessableEntity() devrait créer une erreur 422', () => {
      const error = ApiError.unprocessableEntity('Validation error');

      expect(error.statusCode).toBe(422);
      expect(error.message).toBe('Validation error');
    });

    it('tooManyRequests() devrait créer une erreur 429', () => {
      const error = ApiError.tooManyRequests('Rate limit exceeded');

      expect(error.statusCode).toBe(429);
      expect(error.message).toBe('Rate limit exceeded');
    });

    it('internal() devrait créer une erreur 500', () => {
      const error = ApiError.internal('Server crash');

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Server crash');
    });

    it('toutes les méthodes devraient marquer isOperational à true', () => {
      const methods = ['badRequest', 'unauthorized', 'forbidden', 'notFound', 'conflict', 'unprocessableEntity', 'tooManyRequests', 'internal'];

      methods.forEach((method) => {
        const error = ApiError[method]('message');
        expect(error.isOperational).toBe(true);
      });
    });
  });
});

describe('errorHandler middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      path: '/api/test',
      method: 'GET',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe('erreurs opérationnelles ApiError', () => {
    it('devrait formater une erreur 400 correctement', () => {
      const error = ApiError.badRequest('Requête invalide');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: 'Requête invalide',
          code: 400,
        }),
      }));
    });

    it('devrait formater une erreur 401 correctement', () => {
      const error = ApiError.unauthorized('Non authentifié');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ message: 'Non authentifié' }),
      }));
    });

    it('devrait formater une erreur 403 correctement', () => {
      const error = ApiError.forbidden('Accès refusé');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('devrait formater une erreur 404 correctement', () => {
      const error = ApiError.notFound('Ressource non trouvée');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
      }));
    });

    it('devrait inclure les détails si présents', () => {
      const details = [{ field: 'email', message: 'Email invalide' }];
      const error = new ApiError(422, 'Erreur de validation', details);

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          details,
        }),
      }));
    });

    it('ne devrait pas inclure les détails si null', () => {
      const error = ApiError.notFound('Non trouvé');

      errorHandler(error, req, res, next);

      const call = res.json.mock.calls[0][0];
      expect(call.error.details).toBeUndefined();
    });
  });

  describe('erreurs non-opérationnelles', () => {
    it('devrait renvoyer un statut 500 pour une erreur générique', () => {
      const error = new Error('Erreur interne inattendue');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('devrait renvoyer success: false pour toute erreur', () => {
      const error = new Error('Erreur quelconque');

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
      }));
    });
  });

  describe('erreurs Sequelize', () => {
    it('devrait traiter une SequelizeValidationError avec un statut 400', () => {
      const error = new Error('Validation error');
      error.name = 'SequelizeValidationError';
      error.errors = [
        { path: 'email', message: 'L\'email n\'est pas valide' },
        { path: 'username', message: 'Le nom est trop court' },
      ];

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: 'Validation Error',
          details: expect.arrayContaining([
            expect.objectContaining({ field: 'email' }),
            expect.objectContaining({ field: 'username' }),
          ]),
        }),
      }));
    });

    it('devrait traiter une SequelizeUniqueConstraintError avec un statut 409', () => {
      const error = new Error('Unique constraint error');
      error.name = 'SequelizeUniqueConstraintError';
      error.errors = [
        { path: 'email', message: 'Email must be unique' },
      ];

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Resource already exists',
        }),
      }));
    });

    it('devrait traiter une SequelizeForeignKeyConstraintError avec un statut 400', () => {
      const error = new Error('Foreign key constraint error');
      error.name = 'SequelizeForeignKeyConstraintError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Invalid reference',
        }),
      }));
    });
  });

  describe('erreurs JWT', () => {
    it('devrait traiter une JsonWebTokenError avec un statut 401', () => {
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Invalid token',
        }),
      }));
    });

    it('devrait traiter une TokenExpiredError avec un statut 401', () => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Token expired',
        }),
      }));
    });
  });

  describe('format de réponse standardisé', () => {
    it('devrait toujours renvoyer success: false', () => {
      const error = ApiError.badRequest('Test');

      errorHandler(error, req, res, next);

      const call = res.json.mock.calls[0][0];
      expect(call.success).toBe(false);
    });

    it('devrait toujours renvoyer un objet error avec code et message', () => {
      const error = ApiError.notFound('Test');

      errorHandler(error, req, res, next);

      const call = res.json.mock.calls[0][0];
      expect(call.error).toHaveProperty('code');
      expect(call.error).toHaveProperty('message');
    });
  });
});

describe('asyncHandler', () => {
  it('devrait appeler la fonction et passer à next en cas de succès', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const handler = asyncHandler(async (req, res) => {
      res.status(200).json({ success: true });
    });

    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait capturer les rejets de promesse et les passer à next', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const error = new Error('Async error');

    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('devrait capturer les ApiError lancées depuis les controllers', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const apiError = ApiError.notFound('Non trouvé');

    const handler = asyncHandler(async () => {
      throw apiError;
    });

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(apiError);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });
});
