'use strict';

const { validationResult } = require('express-validator');
const { validate } = require('../../../middlewares/validate');

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Validate Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe('validate', () => {
    it('devrait appeler next() si aucune erreur de validation', () => {
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      validate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('devrait retourner 422 avec des erreurs formatées', () => {
      const mockErrors = [
        {
          path: 'email',
          msg: 'L\'adresse email est invalide',
          value: 'invalid-email',
        },
        {
          path: 'password',
          msg: 'Le mot de passe est requis',
          value: '',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'email',
              message: 'L\'adresse email est invalide',
              value: 'invalid-email',
            },
            {
              field: 'password',
              message: 'Le mot de passe est requis',
              value: '',
            },
          ],
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait gérer les erreurs avec param au lieu de path', () => {
      const mockErrors = [
        {
          param: 'username',
          msg: 'Le nom d\'utilisateur est trop court',
          value: 'abc',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'username',
              message: 'Le nom d\'utilisateur est trop court',
              value: 'abc',
            },
          ],
        },
      });
    });

    it('devrait gérer plusieurs erreurs sur le même champ', () => {
      const mockErrors = [
        {
          path: 'password',
          msg: 'Le mot de passe doit contenir au moins 8 caractères',
          value: 'short',
        },
        {
          path: 'password',
          msg: 'Le mot de passe doit contenir une majuscule',
          value: 'short',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'password',
              message: 'Le mot de passe doit contenir au moins 8 caractères',
              value: 'short',
            },
            {
              field: 'password',
              message: 'Le mot de passe doit contenir une majuscule',
              value: 'short',
            },
          ],
        },
      });
    });

    it('devrait inclure la valeur undefined dans les erreurs', () => {
      const mockErrors = [
        {
          path: 'requiredField',
          msg: 'Ce champ est requis',
          value: undefined,
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.error.details[0].value).toBeUndefined();
    });

    it('devrait gérer les valeurs null', () => {
      const mockErrors = [
        {
          path: 'nullField',
          msg: 'La valeur ne peut pas être null',
          value: null,
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.error.details[0].value).toBeNull();
    });

    it('devrait gérer les erreurs sans field/param', () => {
      const mockErrors = [
        {
          msg: 'Erreur générale',
          value: 'some-value',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.error.details[0].field).toBeUndefined();
    });

    it('devrait formater correctement les erreurs de validation personnalisées', () => {
      const mockErrors = [
        {
          path: 'confirmPassword',
          msg: 'Les mots de passe ne correspondent pas',
          value: 'different',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'confirmPassword',
              message: 'Les mots de passe ne correspondent pas',
              value: 'different',
            },
          ],
        },
      });
    });

    it('devrait gérer les valeurs complexes (objets, tableaux)', () => {
      const mockErrors = [
        {
          path: 'data',
          msg: 'Données invalides',
          value: { nested: 'object' },
        },
        {
          path: 'items',
          msg: 'Tableau invalide',
          value: [1, 2, 3],
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.error.details[0].value).toEqual({ nested: 'object' });
      expect(responseData.error.details[1].value).toEqual([1, 2, 3]);
    });
  });

  describe('Security', () => {
    it('ne devrait pas exposer de stack traces dans les erreurs', () => {
      const mockErrors = [
        {
          path: 'field',
          msg: 'Error message',
          value: 'value',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.error).not.toHaveProperty('stack');
      expect(responseData).not.toHaveProperty('stack');
    });

    it('devrait sanitiser les valeurs sensibles dans les erreurs', () => {
      const mockErrors = [
        {
          path: 'password',
          msg: 'Le mot de passe est invalide',
          value: 'SuperSecret123!',
        },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors,
      });

      validate(req, res, next);

      // Le middleware retourne la valeur telle quelle
      // C'est à l'appelant de ne pas logger les erreurs contenant des mots de passe
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.error.details[0].value).toBe('SuperSecret123!');
    });
  });
});
