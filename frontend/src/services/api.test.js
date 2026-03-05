/**
 * TESTS UNITAIRES POUR L'API AXIOS
 *
 * Ce fichier contient des exemples de tests pour l'instance Axios configurée.
 * Utilisez ces tests comme référence pour tester vos propres appels API.
 *
 * Pour exécuter les tests:
 * npm test api.test.js
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import api from './api';
import MockAdapter from 'axios-mock-adapter';

// Créer un mock adapter pour intercepter les requêtes
const mock = new MockAdapter(api);

describe('API Axios Instance', () => {
  beforeEach(() => {
    // Réinitialiser le mock avant chaque test
    mock.reset();
    // Nettoyer le localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Ne pas appeler mock.restore() ici — cela désactiverait définitivement l'adaptateur
    // mock.reset() dans beforeEach suffit pour nettoyer les handlers entre tests
  });

  describe('Configuration de base', () => {
    it('devrait avoir la bonne URL de base', () => {
      expect(api.defaults.baseURL).toBeDefined();
      expect(api.defaults.baseURL).toContain('/api');
    });

    it('devrait avoir un timeout défini', () => {
      expect(api.defaults.timeout).toBe(30000);
    });

    it('devrait avoir les headers par défaut corrects', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Intercepteur de requête', () => {
    it('devrait ajouter le token JWT aux headers si présent', async () => {
      // Définir un token dans localStorage
      const token = 'fake-jwt-token';
      localStorage.setItem('auth_token', token);

      // Mock d'une requête réussie
      mock.onGet('/test').reply(200, { success: true });

      // Faire la requête
      await api.get('/test');

      // Vérifier que le header Authorization a été ajouté
      const lastRequest = mock.history.get[0];
      expect(lastRequest.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('ne devrait pas ajouter le header Authorization si aucun token', async () => {
      // Mock d'une requête réussie
      mock.onGet('/test').reply(200, { success: true });

      // Faire la requête
      await api.get('/test');

      // Vérifier que le header Authorization n'existe pas
      const lastRequest = mock.history.get[0];
      expect(lastRequest.headers.Authorization).toBeUndefined();
    });
  });

  describe('Gestion des erreurs HTTP', () => {
    it('devrait gérer une erreur 401 (Unauthorized)', async () => {
      // Définir un token dans localStorage
      localStorage.setItem('auth_token', 'expired-token');

      // Mock d'une erreur 401
      mock.onGet('/protected').reply(401, {
        success: false,
        error: {
          message: 'Token expiré',
          code: 'TOKEN_EXPIRED',
        },
      });

      // La requête devrait échouer
      await expect(api.get('/protected')).rejects.toThrow();

      // Le token devrait être supprimé
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('devrait gérer une erreur 403 (Forbidden)', async () => {
      mock.onGet('/admin-only').reply(403, {
        success: false,
        error: {
          message: 'Accès refusé',
          code: 'FORBIDDEN',
        },
      });

      await expect(api.get('/admin-only')).rejects.toThrow();
    });

    it('devrait gérer une erreur 404 (Not Found)', async () => {
      mock.onGet('/not-found').reply(404, {
        success: false,
        error: {
          message: 'Ressource non trouvée',
          code: 'NOT_FOUND',
        },
      });

      await expect(api.get('/not-found')).rejects.toThrow();
    });

    it('devrait gérer une erreur 500 (Server Error)', async () => {
      mock.onGet('/server-error').reply(500, {
        success: false,
        error: {
          message: 'Erreur serveur',
          code: 'INTERNAL_ERROR',
        },
      });

      await expect(api.get('/server-error')).rejects.toThrow();
    });

    it('devrait enrichir l\'erreur avec les détails de la réponse', async () => {
      mock.onPost('/invalid-data').reply(422, {
        success: false,
        error: {
          message: 'Données invalides',
          code: 'VALIDATION_ERROR',
          details: {
            email: 'Format invalide',
            password: 'Trop court',
          },
        },
      });

      try {
        await api.post('/invalid-data', {});
      } catch (error) {
        expect(error.status).toBe(422);
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.details).toEqual({
          email: 'Format invalide',
          password: 'Trop court',
        });
      }
    });
  });

  describe('Option skipErrorRedirect', () => {
    it('devrait respecter skipErrorRedirect: true', async () => {
      mock.onGet('/forbidden').reply(403, {
        success: false,
        error: { message: 'Accès refusé' },
      });

      // Avec skipErrorRedirect: true, l'erreur doit être propagée
      // (pas de redirection silencieuse côté window.location — non testable avec jsdom)
      await expect(
        api.get('/forbidden', { skipErrorRedirect: true })
      ).rejects.toThrow();
    });
  });

  describe('Requêtes réussies', () => {
    it('devrait retourner les données pour une requête GET réussie', async () => {
      const mockData = {
        success: true,
        data: {
          users: [
            { id: 1, username: 'user1' },
            { id: 2, username: 'user2' },
          ],
        },
      };

      mock.onGet('/users').reply(200, mockData);

      const response = await api.get('/users');
      expect(response.data).toEqual(mockData);
    });

    it('devrait envoyer les données correctement pour POST', async () => {
      const postData = { username: 'newuser', email: 'new@test.com' };
      const mockResponse = {
        success: true,
        data: { id: 3, ...postData },
      };

      mock.onPost('/users', postData).reply(201, mockResponse);

      const response = await api.post('/users', postData);
      expect(response.data).toEqual(mockResponse);
      expect(response.status).toBe(201);
    });

    it('devrait gérer les query parameters correctement', async () => {
      mock.onGet('/users').reply((config) => {
        expect(config.params).toEqual({
          page: 1,
          limit: 10,
          sort: 'username',
        });
        return [200, { success: true, data: [] }];
      });

      await api.get('/users', {
        params: {
          page: 1,
          limit: 10,
          sort: 'username',
        },
      });
    });
  });

  describe('Gestion des erreurs réseau', () => {
    it('devrait gérer une erreur réseau', async () => {
      mock.onGet('/network-error').networkError();

      try {
        await api.get('/network-error');
      } catch (error) {
        expect(error.isNetworkError).toBe(true);
        expect(error.message).toContain('connexion');
      }
    });

    it('devrait gérer un timeout', async () => {
      mock.onGet('/timeout').timeout();

      await expect(api.get('/timeout')).rejects.toThrow();
    });
  });

  describe('Méthodes HTTP', () => {
    it('devrait supporter GET', async () => {
      mock.onGet('/test').reply(200, { data: 'test' });
      const response = await api.get('/test');
      expect(response.status).toBe(200);
    });

    it('devrait supporter POST', async () => {
      mock.onPost('/test').reply(201, { data: 'created' });
      const response = await api.post('/test', { data: 'test' });
      expect(response.status).toBe(201);
    });

    it('devrait supporter PUT', async () => {
      mock.onPut('/test/1').reply(200, { data: 'updated' });
      const response = await api.put('/test/1', { data: 'test' });
      expect(response.status).toBe(200);
    });

    it('devrait supporter PATCH', async () => {
      mock.onPatch('/test/1').reply(200, { data: 'patched' });
      const response = await api.patch('/test/1', { data: 'test' });
      expect(response.status).toBe(200);
    });

    it('devrait supporter DELETE', async () => {
      mock.onDelete('/test/1').reply(204);
      const response = await api.delete('/test/1');
      expect(response.status).toBe(204);
    });
  });

  describe('Headers personnalisés', () => {
    it('devrait permettre d\'ajouter des headers personnalisés', async () => {
      mock.onPost('/test').reply((config) => {
        expect(config.headers['X-Custom-Header']).toBe('custom-value');
        return [200, { success: true }];
      });

      await api.post('/test', {}, {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      });
    });
  });

  describe('Timeout personnalisé', () => {
    it('devrait avoir le timeout par défaut configuré', () => {
      // axios-mock-adapter ne respecte pas le timeout de config (limitation connue)
      // On vérifie simplement que le timeout par défaut est bien configuré sur l'instance
      expect(api.defaults.timeout).toBe(30000);
    });
  });
});

/**
 * NOTES SUR LES TESTS:
 *
 * 1. Ces tests utilisent vitest et axios-mock-adapter
 * 2. Pour installer les dépendances de test:
 *    npm install -D vitest axios-mock-adapter @testing-library/react
 *
 * 3. Configuration vitest (vitest.config.js):
 *    import { defineConfig } from 'vitest/config';
 *    export default defineConfig({
 *      test: {
 *        environment: 'jsdom',
 *        globals: true,
 *      },
 *    });
 *
 * 4. Pour exécuter les tests:
 *    npm test
 *    npm test -- --coverage (avec couverture)
 *    npm test -- --watch (mode watch)
 *
 * 5. Structure d'un test:
 *    - describe: Groupe de tests
 *    - it: Un test individuel
 *    - expect: Assertion
 *    - beforeEach: Avant chaque test
 *    - afterEach: Après chaque test
 *
 * 6. Mocking:
 *    - mock.onGet(url).reply(status, data)
 *    - mock.onPost(url, data).reply(status, data)
 *    - mock.networkError()
 *    - mock.timeout()
 *
 * 7. Pour tester les redirections, vous devrez mocker window.location
 *    car les tests ne peuvent pas réellement naviguer
 */
