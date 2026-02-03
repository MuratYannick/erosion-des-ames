'use strict';

const jwt = require('jsonwebtoken');
const { signToken, verifyToken } = require('../../../utils/jwt');

describe('JWT Utils', () => {
  describe('signToken', () => {
    it('devrait retourner un token JWT valide', () => {
      const userId = '12345';
      const token = signToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // Format JWT: header.payload.signature
    });

    it('devrait encoder le userId dans le token', () => {
      const userId = '12345';
      const token = signToken(userId);

      const decoded = jwt.decode(token);
      expect(decoded.userId).toBe(userId);
    });

    it('devrait créer des tokens différents pour des userId différents', () => {
      const token1 = signToken('user1');
      const token2 = signToken('user2');

      expect(token1).not.toBe(token2);
    });

    it('devrait inclure une date d\'expiration', () => {
      const userId = '12345';
      const token = signToken(userId);

      const decoded = jwt.decode(token);
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });

    it('devrait lancer une erreur si JWT_SECRET est manquant', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      // Recharger le module pour prendre en compte la nouvelle valeur
      jest.resetModules();
      const { signToken: signTokenNoSecret } = require('../../../utils/jwt');

      expect(() => signTokenNoSecret('12345')).toThrow('JWT_SECRET n\'est pas défini');

      // Restaurer
      process.env.JWT_SECRET = originalSecret;
      jest.resetModules();
    });
  });

  describe('verifyToken', () => {
    it('devrait décoder un token valide', () => {
      const userId = '12345';
      const token = signToken(userId);

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(userId);
    });

    it('devrait retourner un objet avec userId, iat et exp', () => {
      const userId = '12345';
      const token = signToken(userId);

      const decoded = verifyToken(token);
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('devrait lancer une erreur pour un token invalide', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow('Le token est invalide');
    });

    it('devrait lancer une erreur pour un token malformé', () => {
      const malformedToken = 'not-a-jwt-token';

      expect(() => verifyToken(malformedToken)).toThrow('Le token est invalide');
    });

    it('devrait lancer une erreur pour un token expiré', () => {
      const userId = '12345';
      // Créer un token qui expire immédiatement
      const expiredToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Attendre un peu pour s'assurer que le token expire
      return new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
        expect(() => verifyToken(expiredToken)).toThrow('Le token a expiré');
      });
    });

    it('devrait lancer une erreur pour un token signé avec un secret différent', () => {
      const userId = '12345';
      const wrongToken = jwt.sign({ userId }, 'wrong-secret', { expiresIn: '7d' });

      expect(() => verifyToken(wrongToken)).toThrow('Le token est invalide');
    });

    it('devrait lancer une erreur si JWT_SECRET est manquant', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      jest.resetModules();
      const { verifyToken: verifyTokenNoSecret } = require('../../../utils/jwt');

      expect(() => verifyTokenNoSecret('any-token')).toThrow('JWT_SECRET n\'est pas défini');

      process.env.JWT_SECRET = originalSecret;
      jest.resetModules();
    });

    it('devrait rejeter un token vide', () => {
      expect(() => verifyToken('')).toThrow();
    });

    it('devrait rejeter un token null', () => {
      expect(() => verifyToken(null)).toThrow();
    });
  });
});
