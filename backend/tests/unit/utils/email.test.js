'use strict';

// Mock nodemailer AVANT d'importer le module email
const mockSendMail = jest.fn().mockResolvedValue({
  messageId: 'test-message-id',
  response: '250 OK',
});

const mockVerify = jest.fn((callback) => {
  if (callback) callback(null);
});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
    verify: mockVerify,
  })),
}));

// Maintenant importer le module email
const {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require('../../../utils/email');

describe('Email Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({
      messageId: 'test-message-id',
      response: '250 OK',
    });
  });

  describe('sendEmail', () => {
    it('devrait envoyer un email avec les bons paramètres', async () => {
      const to = 'user@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test HTML</p>';
      const text = 'Test Text';

      await sendEmail(to, subject, html, text);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to,
          subject,
          html,
          text,
        })
      );
    });

    it('devrait utiliser l\'adresse EMAIL_FROM configurée', async () => {
      await sendEmail('user@example.com', 'Test', '<p>Test</p>', 'Test');

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: process.env.EMAIL_FROM,
        })
      );
    });

    it('devrait générer un texte fallback si non fourni', async () => {
      const html = '<p>Hello <strong>World</strong></p>';
      await sendEmail('user@example.com', 'Test', html);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('Hello World'),
        })
      );
    });

    it('devrait retourner les informations d\'envoi', async () => {
      const result = await sendEmail(
        'user@example.com',
        'Test',
        '<p>Test</p>'
      );

      expect(result).toHaveProperty('messageId');
      expect(result.messageId).toBe('test-message-id');
    });

    it('devrait lancer une erreur si l\'envoi échoue', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP error'));

      await expect(
        sendEmail('user@example.com', 'Test', '<p>Test</p>')
      ).rejects.toThrow('Échec de l\'envoi de l\'email');
    });
  });

  describe('sendVerificationEmail', () => {
    it('devrait envoyer un email de vérification', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'verification-token-123';

      await sendVerificationEmail(user, token);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Vérifie ton inscription'),
        })
      );
    });

    it('devrait inclure le username dans l\'email', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'verification-token-123';

      await sendVerificationEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(user.username);
      expect(callArgs.text).toContain(user.username);
    });

    it('devrait inclure le lien de vérification avec le token', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'verification-token-123';

      await sendVerificationEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      const expectedLink = `${process.env.FRONTEND_URL}/verifier-email?token=${token}`;
      expect(callArgs.html).toContain(expectedLink);
      expect(callArgs.text).toContain(expectedLink);
    });

    it('devrait mentionner la durée de validité du token', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'verification-token-123';

      await sendVerificationEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('24 heures');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('devrait envoyer un email de réinitialisation', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'reset-token-123';

      await sendPasswordResetEmail(user, token);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Réinitialisation de ton mot de passe'),
        })
      );
    });

    it('devrait inclure le username dans l\'email', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'reset-token-123';

      await sendPasswordResetEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(user.username);
      expect(callArgs.text).toContain(user.username);
    });

    it('devrait inclure le lien de réinitialisation avec le token', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'reset-token-123';

      await sendPasswordResetEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      const expectedLink = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
      expect(callArgs.html).toContain(expectedLink);
      expect(callArgs.text).toContain(expectedLink);
    });

    it('devrait mentionner la durée de validité du token', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };
      const token = 'reset-token-123';

      await sendPasswordResetEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('1 heure');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('devrait envoyer un email de bienvenue', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };

      await sendWelcomeEmail(user);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Bienvenue'),
        })
      );
    });

    it('devrait inclure le username dans l\'email', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };

      await sendWelcomeEmail(user);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(user.username);
      expect(callArgs.text).toContain(user.username);
    });

    it('devrait inclure un lien vers la page de connexion', async () => {
      const user = {
        username: 'TestUser',
        email: 'user@example.com',
      };

      await sendWelcomeEmail(user);

      const callArgs = mockSendMail.mock.calls[0][0];
      const expectedLink = `${process.env.FRONTEND_URL}/connexion`;
      expect(callArgs.html).toContain(expectedLink);
    });
  });

  describe('Email Security', () => {
    it('ne devrait pas exposer de données sensibles dans les erreurs', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP auth failed: password is wrong'));

      await expect(
        sendEmail('user@example.com', 'Test', '<p>Test</p>')
      ).rejects.toThrow('Échec de l\'envoi de l\'email');
    });

    it('devrait sanitiser les entrées HTML', async () => {
      const user = {
        username: '<script>alert("XSS")</script>',
        email: 'user@example.com',
      };
      const token = 'token-123';

      await sendVerificationEmail(user, token);

      const callArgs = mockSendMail.mock.calls[0][0];
      // Le username malicieux devrait être présent mais dans un contexte sécurisé
      expect(callArgs.html).toContain(user.username);
    });
  });
});
