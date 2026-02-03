'use strict';

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
process.env.JWT_EXPIRES_IN = '7d';
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '465';
process.env.SMTP_SECURE = 'true';
process.env.SMTP_USER = 'test@example.com';
process.env.SMTP_PASS = 'test-password';
process.env.EMAIL_FROM = '"Test App" <noreply@test.com>';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Augmenter le timeout global pour les tests
jest.setTimeout(10000);

// Mock console pour réduire le bruit pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
