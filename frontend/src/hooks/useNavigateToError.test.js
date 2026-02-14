/**
 * Tests pour le hook useNavigateToError
 */

import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useNavigateToError } from './useNavigateToError';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useNavigateToError', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  describe('navigateTo404', () => {
    it('doit naviguer vers la page 404', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateTo404();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer avec replace: true', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateTo404({ replace: true });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: true,
        state: {},
      });
    });

    it('doit naviguer avec un state personnalisé', () => {
      const { result } = renderHook(() => useNavigateToError());
      const customState = { message: 'Page non trouvée personnalisée' };

      act(() => {
        result.current.navigateTo404({ state: customState });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: false,
        state: customState,
      });
    });

    it('doit naviguer avec replace et state', () => {
      const { result } = renderHook(() => useNavigateToError());
      const customState = { message: 'Test', from: '/test' };

      act(() => {
        result.current.navigateTo404({
          replace: true,
          state: customState,
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: true,
        state: customState,
      });
    });
  });

  describe('navigateTo403', () => {
    it('doit naviguer vers la page 403', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateTo403();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/interdit', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer avec options', () => {
      const { result } = renderHook(() => useNavigateToError());
      const options = {
        replace: true,
        state: { message: 'Accès refusé' },
      };

      act(() => {
        result.current.navigateTo403(options);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/interdit', {
        replace: true,
        state: { message: 'Accès refusé' },
      });
    });
  });

  describe('navigateTo500', () => {
    it('doit naviguer vers la page 500', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateTo500();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/erreur', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer avec state contenant les détails de l\'erreur', () => {
      const { result } = renderHook(() => useNavigateToError());
      const errorState = {
        message: 'Erreur serveur',
        statusCode: 500,
        timestamp: '2024-01-01T00:00:00Z',
      };

      act(() => {
        result.current.navigateTo500({ state: errorState });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/erreur', {
        replace: false,
        state: errorState,
      });
    });
  });

  describe('navigateToMaintenance', () => {
    it('doit naviguer vers la page de maintenance', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateToMaintenance();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/maintenance', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer avec options', () => {
      const { result } = renderHook(() => useNavigateToError());
      const options = {
        replace: true,
        state: { reason: 'Mise à jour système' },
      };

      act(() => {
        result.current.navigateToMaintenance(options);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/maintenance', {
        replace: true,
        state: { reason: 'Mise à jour système' },
      });
    });
  });

  describe('navigateToError (fonction générique)', () => {
    it('doit naviguer vers 404 avec un code 404', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateToError(404);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer vers 403 avec un code 403', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateToError(403);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/interdit', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer vers 500 avec un code 500', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateToError(500);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/erreur', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer vers maintenance avec le code "maintenance"', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateToError('maintenance');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/maintenance', {
        replace: false,
        state: {},
      });
    });

    it('doit naviguer avec options', () => {
      const { result } = renderHook(() => useNavigateToError());
      const options = {
        replace: true,
        state: { message: 'Erreur personnalisée' },
      };

      act(() => {
        result.current.navigateToError(500, options);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/erreur', {
        replace: true,
        state: { message: 'Erreur personnalisée' },
      });
    });

    it('doit afficher une erreur console et rediriger vers 404 pour un code invalide', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateToError(999);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Code d'erreur invalide: 999. Codes valides: 404, 403, 500, 'maintenance'"
      );
      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: false,
        state: {},
      });

      consoleErrorSpy.mockRestore();
    });

    it('doit fallback vers 404 pour un code invalide avec options', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => useNavigateToError());
      const options = { replace: true, state: { test: true } };

      act(() => {
        result.current.navigateToError('invalid', options);
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: true,
        state: { test: true },
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('ERROR_ROUTES', () => {
    it('doit exposer toutes les routes d\'erreur', () => {
      const { result } = renderHook(() => useNavigateToError());

      expect(result.current.ERROR_ROUTES).toEqual({
        404: '/page-non-trouvee',
        403: '/interdit',
        500: '/erreur',
        maintenance: '/maintenance',
      });
    });
  });

  describe('Stabilité des références', () => {
    it('doit maintenir les mêmes références de fonction entre les rendus', () => {
      const { result, rerender } = renderHook(() => useNavigateToError());

      const firstRenderFunctions = {
        navigateTo404: result.current.navigateTo404,
        navigateTo403: result.current.navigateTo403,
        navigateTo500: result.current.navigateTo500,
        navigateToMaintenance: result.current.navigateToMaintenance,
        navigateToError: result.current.navigateToError,
      };

      rerender();

      expect(result.current.navigateTo404).toBe(firstRenderFunctions.navigateTo404);
      expect(result.current.navigateTo403).toBe(firstRenderFunctions.navigateTo403);
      expect(result.current.navigateTo500).toBe(firstRenderFunctions.navigateTo500);
      expect(result.current.navigateToMaintenance).toBe(firstRenderFunctions.navigateToMaintenance);
      expect(result.current.navigateToError).toBe(firstRenderFunctions.navigateToError);
    });
  });

  describe('Cas d\'usage réels', () => {
    it('doit gérer une erreur API 403', () => {
      const { result } = renderHook(() => useNavigateToError());

      // Simulation d'une réponse API 403
      const apiResponse = {
        status: 403,
        message: 'Accès refusé',
      };

      act(() => {
        result.current.navigateTo403({
          state: {
            message: apiResponse.message,
            from: '/admin/dashboard',
          },
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/interdit', {
        replace: false,
        state: {
          message: 'Accès refusé',
          from: '/admin/dashboard',
        },
      });
    });

    it('doit gérer une erreur réseau avec replace', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateTo500({
          replace: true,
          state: {
            message: 'Erreur réseau',
            error: 'Network timeout',
            timestamp: new Date().toISOString(),
          },
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/erreur', {
        replace: true,
        state: expect.objectContaining({
          message: 'Erreur réseau',
          error: 'Network timeout',
        }),
      });
    });

    it('doit gérer une ressource non trouvée avec contexte', () => {
      const { result } = renderHook(() => useNavigateToError());

      act(() => {
        result.current.navigateTo404({
          state: {
            resourceType: 'character',
            resourceId: '123',
            message: 'Le personnage demandé n\'existe pas',
          },
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/page-non-trouvee', {
        replace: false,
        state: {
          resourceType: 'character',
          resourceId: '123',
          message: 'Le personnage demandé n\'existe pas',
        },
      });
    });
  });
});
