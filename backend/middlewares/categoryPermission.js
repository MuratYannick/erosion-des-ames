'use strict';

const categoryPermissionService = require('../services/categoryPermissionService');
const { ApiError } = require('./errorHandler');
const { Character } = require('../models');

/**
 * Helper function to extract a value from a nested object using dot notation
 * @param {object} obj - The object to extract from
 * @param {string} path - Dot-notation path (e.g., 'body.categoryId')
 * @returns {any} The extracted value or undefined
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Helper function to extract categoryId from the request
 * @param {object} req - Express request object
 * @param {string|null} sourceField - Optional explicit field path to use
 * @returns {number|null} The extracted categoryId
 */
function extractCategoryId(req, sourceField = null) {
  if (sourceField) {
    // Use explicit source field if provided
    return getNestedValue(req, sourceField);
  }

  // Auto-detection order
  if (req.params.categoryId) {
    return req.params.categoryId;
  }

  if (req.params.id) {
    return req.params.id;
  }

  if (req.body.categoryId) {
    return req.body.categoryId;
  }

  return null;
}

/**
 * Helper function to build the options object for permission checking
 * Extracts characterId, factionId, clanId from request
 * @param {object} req - Express request object
 * @param {object} overrideOptions - Options passed to the middleware
 * @returns {Promise<object>} Options object with characterId, factionId, clanId
 */
async function buildPermissionOptions(req, overrideOptions = {}) {
  const options = {};

  // Determine characterId source
  let characterId = null;

  if (overrideOptions.characterFromBody && req.body.characterId) {
    // Use characterId from body if specified
    characterId = req.body.characterId;
  } else if (req.user && req.user.selectedCharacterId) {
    // Use selectedCharacterId from authenticated user
    characterId = req.user.selectedCharacterId;
  }

  options.characterId = characterId;

  // Determine factionId and clanId
  if (characterId) {
    // Try to get from body first (if characterFromBody is true)
    if (overrideOptions.characterFromBody) {
      options.factionId = req.body.factionId;
      options.clanId = req.body.clanId;
    }

    // If not in body, load from the character
    if (options.factionId === undefined || options.clanId === undefined) {
      try {
        const character = await Character.findByPk(characterId, {
          attributes: ['id', 'factionId', 'clanId'],
        });

        if (character) {
          if (options.factionId === undefined) {
            options.factionId = character.factionId;
          }
          if (options.clanId === undefined) {
            options.clanId = character.clanId;
          }
        }
      } catch (error) {
        console.error('Error loading character for permission check:', error);
        // Continue with undefined values if loading fails
      }
    }
  }

  return options;
}

/**
 * Middleware factory that checks if the user has a specific permission on a category
 * @param {string} permission - The permission to check (e.g., 'access_category')
 * @param {object} options - Configuration options
 * @param {string} options.sourceField - Explicit field path for categoryId (e.g., 'body.categoryId')
 * @param {boolean} options.characterFromBody - If true, read characterId/factionId/clanId from req.body
 * @returns {function} Express middleware function
 */
const requireCategoryPermission = (permission, options = {}) => {
  return async (req, res, next) => {
    try {
      // Extract categoryId from request
      const categoryId = extractCategoryId(req, options.sourceField);

      if (!categoryId) {
        throw ApiError.badRequest('Identifiant de catégorie manquant');
      }

      // Get user (can be null for public access checks)
      const user = req.user || null;

      // Build options for permission check
      const permissionOptions = await buildPermissionOptions(req, options);

      // Check permission
      const hasPermission = await categoryPermissionService.userHasPermission(
        user,
        categoryId,
        permission,
        permissionOptions
      );

      if (!hasPermission) {
        throw ApiError.forbidden("Vous n'avez pas la permission d'effectuer cette action");
      }

      // Permission granted, continue
      next();
    } catch (error) {
      // Pass error to error handler middleware
      next(error);
    }
  };
};

/**
 * Middleware factory that checks permission on a specific field in the request
 * @param {string} field - Dot-notation path to the categoryId (e.g., 'body.categoryId', 'params.id')
 * @param {string} permission - The permission to check
 * @returns {function} Express middleware function
 */
const requireCategoryPermissionOn = (field, permission) => {
  return requireCategoryPermission(permission, { sourceField: field });
};

/**
 * Helper middleware for routes that involve TWO categories (move topic, merge topics, etc.)
 * Checks permission on both source and target categories
 * @param {string} permission - The permission to check on both categories
 * @param {object} extractors - Functions to extract source and target category IDs
 * @param {function} extractors.getSourceCategoryId - Async function that returns source categoryId
 * @param {function} extractors.getTargetCategoryId - Async function that returns target categoryId
 * @returns {function} Express middleware function
 */
const requireDualCategoryPermission = (permission, extractors) => {
  return async (req, res, next) => {
    try {
      const { getSourceCategoryId, getTargetCategoryId } = extractors;

      // Extract both category IDs
      const sourceCategoryId = await getSourceCategoryId(req);
      const targetCategoryId = await getTargetCategoryId(req);

      if (!sourceCategoryId || !targetCategoryId) {
        throw ApiError.badRequest('Identifiants de catégories manquants');
      }

      // Get user and build options
      const user = req.user || null;
      const permissionOptions = await buildPermissionOptions(req);

      // Check permission on source category
      const hasSourcePermission = await categoryPermissionService.userHasPermission(
        user,
        sourceCategoryId,
        permission,
        permissionOptions
      );

      if (!hasSourcePermission) {
        throw ApiError.forbidden(
          "Vous n'avez pas la permission d'effectuer cette action sur la catégorie source"
        );
      }

      // Check permission on target category
      const hasTargetPermission = await categoryPermissionService.userHasPermission(
        user,
        targetCategoryId,
        permission,
        permissionOptions
      );

      if (!hasTargetPermission) {
        throw ApiError.forbidden(
          "Vous n'avez pas la permission d'effectuer cette action sur la catégorie cible"
        );
      }

      // Both permissions granted, continue
      next();
    } catch (error) {
      // Pass error to error handler middleware
      next(error);
    }
  };
};

module.exports = {
  requireCategoryPermission,
  requireCategoryPermissionOn,
  requireDualCategoryPermission,
};
