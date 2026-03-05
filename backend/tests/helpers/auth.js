'use strict';

const { signToken } = require('../../utils/jwt');

/**
 * Génère un token JWT pour un utilisateur de test
 * @param {string} userId - L'ID de l'utilisateur
 * @param {string} role - Le rôle de l'utilisateur (non encodé dans le token mais utile pour les helpers)
 * @returns {string} Token JWT signé
 */
const createToken = (userId, role = 'PLAYER') => signToken(userId);

/**
 * Génère un header Authorization Bearer pour un utilisateur de test
 * @param {string} userId - L'ID de l'utilisateur
 * @param {string} role - Le rôle de l'utilisateur
 * @returns {object} Header Authorization
 */
const createAuthHeader = (userId, role = 'PLAYER') => ({
  Authorization: `Bearer ${createToken(userId, role)}`,
});

/**
 * Crée un objet utilisateur mock pour les tests
 * @param {object} overrides - Champs à surcharger
 * @returns {object} Utilisateur mock
 */
const mockUser = (overrides = {}) => ({
  id: 'user-uuid-1234',
  username: 'TestUser',
  email: 'test@example.com',
  role: 'PLAYER',
  isActive: true,
  isEmailVerified: true,
  selectedCharacterId: null,
  ...overrides,
});

/**
 * Crée un objet utilisateur admin mock pour les tests
 * @param {object} overrides - Champs à surcharger
 * @returns {object} Utilisateur admin mock
 */
const mockAdminUser = (overrides = {}) => mockUser({ role: 'ADMIN', id: 'admin-uuid-5678', ...overrides });

/**
 * Crée un objet utilisateur moderateur mock pour les tests
 * @param {object} overrides - Champs à surcharger
 * @returns {object} Utilisateur moderateur mock
 */
const mockModeratorUser = (overrides = {}) => mockUser({ role: 'MODERATOR', id: 'mod-uuid-9999', ...overrides });

/**
 * Crée un objet utilisateur game master mock pour les tests
 * @param {object} overrides - Champs à surcharger
 * @returns {object} Utilisateur game master mock
 */
const mockGameMasterUser = (overrides = {}) => mockUser({ role: 'GAME_MASTER', id: 'gm-uuid-7777', ...overrides });

module.exports = {
  createToken,
  createAuthHeader,
  mockUser,
  mockAdminUser,
  mockModeratorUser,
  mockGameMasterUser,
};
