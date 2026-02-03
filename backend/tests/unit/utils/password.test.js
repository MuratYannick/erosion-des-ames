'use strict';

const { hashPassword, comparePassword } = require('../../../utils/password');

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('devrait retourner un hash du mot de passe', async () => {
      const password = 'MyPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
    });

    it('devrait créer des hash différents pour le même mot de passe', async () => {
      const password = 'MyPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('devrait créer un hash de longueur fixe (bcrypt)', async () => {
      const password = 'MyPassword123!';
      const hash = await hashPassword(password);

      // Les hash bcrypt font 60 caractères
      expect(hash.length).toBe(60);
      expect(hash).toMatch(/^\$2[ayb]\$.{56}$/);
    });

    it('devrait gérer les mots de passe courts', async () => {
      const shortPassword = 'A1!a';
      const hash = await hashPassword(shortPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(shortPassword);
    });

    it('devrait gérer les mots de passe longs', async () => {
      const longPassword = 'A'.repeat(100) + '1!a';
      const hash = await hashPassword(longPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(longPassword);
    });

    it('devrait gérer les caractères spéciaux', async () => {
      const specialPassword = 'Test@#$%^&*()_+{}[]|:;"<>,.?/~`123Aa';
      const hash = await hashPassword(specialPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(specialPassword);
    });

    it('devrait gérer les emojis et caractères unicode', async () => {
      const unicodePassword = 'Test123!😀👍🏻';
      const hash = await hashPassword(unicodePassword);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(unicodePassword);
    });
  });

  describe('comparePassword', () => {
    it('devrait retourner true pour un mot de passe correct', async () => {
      const password = 'MyPassword123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('devrait retourner false pour un mot de passe incorrect', async () => {
      const password = 'MyPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });

    it('devrait être sensible à la casse', async () => {
      const password = 'MyPassword123!';
      const wrongCasePassword = 'mypassword123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(wrongCasePassword, hash);
      expect(isMatch).toBe(false);
    });

    it('devrait retourner false pour un mot de passe vide', async () => {
      const password = 'MyPassword123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword('', hash);
      expect(isMatch).toBe(false);
    });

    it('devrait retourner false pour un hash invalide', async () => {
      const password = 'MyPassword123!';
      const invalidHash = 'not-a-valid-hash';

      // bcrypt.compare retourne false pour un hash invalide au lieu de throw
      const result = await comparePassword(password, invalidHash);
      expect(result).toBe(false);
    });

    it('devrait gérer les caractères spéciaux correctement', async () => {
      const specialPassword = 'Test@#$%^&*()123Aa';
      const hash = await hashPassword(specialPassword);

      const isMatch = await comparePassword(specialPassword, hash);
      expect(isMatch).toBe(true);
    });

    it('devrait détecter une différence d\'un seul caractère', async () => {
      const password = 'MyPassword123!';
      const similarPassword = 'MyPassword123?'; // ! remplacé par ?
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(similarPassword, hash);
      expect(isMatch).toBe(false);
    });

    it('devrait gérer les espaces dans le mot de passe', async () => {
      const password = 'My Password 123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);

      const isMatchWithoutSpace = await comparePassword('MyPassword123!', hash);
      expect(isMatchWithoutSpace).toBe(false);
    });
  });

  describe('Hash Security', () => {
    it('devrait utiliser bcrypt avec un salt suffisant', async () => {
      const password = 'MyPassword123!';
      const hash = await hashPassword(password);

      // Vérifier que c'est bien un hash bcrypt avec rounds >= 10
      const rounds = parseInt(hash.split('$')[2]);
      expect(rounds).toBeGreaterThanOrEqual(10);
    });

    it('devrait résister aux attaques par timing', async () => {
      const password = 'MyPassword123!';
      const hash = await hashPassword(password);

      // Comparer avec des mots de passe de longueurs différentes
      const start1 = Date.now();
      await comparePassword('A', hash);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await comparePassword('A'.repeat(100), hash);
      const time2 = Date.now() - start2;

      // Les temps doivent être similaires (bcrypt est constant time)
      // On accepte une différence de maximum 50% du temps le plus court
      const timeDiff = Math.abs(time1 - time2);
      const minTime = Math.min(time1, time2);
      expect(timeDiff).toBeLessThanOrEqual(minTime * 0.5);
    });
  });
});
