'use strict';

const { CategoryPermission, ForumCategory } = require('../models');

// Simple in-memory cache with TTL
const permissionCache = new Map();
const CACHE_TTL_MS = 60000; // 60 seconds
const MAX_DEPTH = 20; // Safety limit to prevent infinite loops

/**
 * Recursively fetches a category and its parent chain
 * @param {number} categoryId - Category ID to start from
 * @param {Set} visited - Set of visited category IDs (circular reference protection)
 * @param {number} depth - Current recursion depth
 * @returns {Promise<Array>} Array of category IDs from current to root
 */
async function getCategoryChain(categoryId, visited = new Set(), depth = 0) {
  // Safety checks
  if (depth >= MAX_DEPTH) {
    console.warn(`Category chain exceeded maximum depth of ${MAX_DEPTH} for categoryId ${categoryId}`);
    return [];
  }

  if (visited.has(categoryId)) {
    console.warn(`Circular reference detected in category chain for categoryId ${categoryId}`);
    return [];
  }

  visited.add(categoryId);

  const category = await ForumCategory.findByPk(categoryId, {
    attributes: ['id', 'parentId'],
  });

  if (!category) {
    return [];
  }

  const chain = [category.id];

  // Recursively add parent chain
  if (category.parentId) {
    const parentChain = await getCategoryChain(category.parentId, visited, depth + 1);
    chain.push(...parentChain);
  }

  return chain;
}

/**
 * Resolves permissions for a category including inherited permissions from parents
 * Uses a simple in-memory cache with TTL
 * @param {number} categoryId - The category ID
 * @returns {Promise<Array>} Array of permission objects { permission, granteeType, granteeId }
 */
async function resolvePermissions(categoryId) {
  // Check cache first
  const cached = permissionCache.get(categoryId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.permissions;
  }

  // Get the full category chain (current category + all parents)
  const categoryChain = await getCategoryChain(categoryId);

  if (categoryChain.length === 0) {
    return [];
  }

  // Fetch all permissions for all categories in the chain
  const permissions = await CategoryPermission.findAll({
    where: {
      categoryId: categoryChain,
    },
    attributes: ['permission', 'granteeType', 'granteeId'],
    raw: true,
  });

  // Deduplicate permissions (merge/union)
  // Create a unique key for each permission to avoid duplicates
  const permissionMap = new Map();

  permissions.forEach(perm => {
    const key = `${perm.permission}|${perm.granteeType}|${perm.granteeId || 'null'}`;
    if (!permissionMap.has(key)) {
      permissionMap.set(key, {
        permission: perm.permission,
        granteeType: perm.granteeType,
        granteeId: perm.granteeId,
      });
    }
  });

  const resolvedPermissions = Array.from(permissionMap.values());

  // Cache the result
  permissionCache.set(categoryId, {
    permissions: resolvedPermissions,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return resolvedPermissions;
}

/**
 * Checks if a user has a specific permission on a category
 * @param {Object|null} user - The user object (can be null for visitors)
 * @param {number} categoryId - The category ID
 * @param {string} permission - The permission to check (e.g., 'access_category')
 * @param {Object} options - Additional context: { characterId, factionId, clanId }
 * @returns {Promise<boolean>} True if user has the permission
 */
async function userHasPermission(user, categoryId, permission, options = {}) {
  // Admins always have all permissions
  if (user && user.role === 'ADMIN') {
    return true;
  }

  // Get resolved permissions (direct + inherited)
  const permissions = await resolvePermissions(categoryId);

  // Filter permissions matching the requested permission type
  const matchingPermissions = permissions.filter(p => p.permission === permission);

  // Check if any of the matching permissions grant access to this user
  for (const perm of matchingPermissions) {
    if (checkGranteeMatch(user, perm.granteeType, perm.granteeId, options)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a user matches a specific grantee
 * @param {Object|null} user - The user object
 * @param {string} granteeType - The grantee type
 * @param {string|null} granteeId - The grantee ID (for specific targets)
 * @param {Object} options - Context: { characterId, factionId, clanId }
 * @returns {boolean} True if the user matches the grantee
 */
function checkGranteeMatch(user, granteeType, granteeId, options = {}) {
  const { characterId, factionId, clanId } = options;

  switch (granteeType) {
    case 'public':
      // Always true for everyone (including visitors)
      return true;

    case 'moderator':
      return user && user.role === 'MODERATOR';

    case 'game_master':
      return user && user.role === 'GAME_MASTER';

    case 'player':
      // PLAYER, GAME_MASTER, or MODERATOR (they're all "players")
      return user && ['PLAYER', 'GAME_MASTER', 'MODERATOR'].includes(user.role);

    case 'player_accepted_rules':
      return user && ['PLAYER', 'GAME_MASTER', 'MODERATOR'].includes(user.role) && user.hasAcceptedRules === true;

    case 'player_with_character':
      // User must have a character selected
      return user && ['PLAYER', 'GAME_MASTER', 'MODERATOR'].includes(user.role) && !!characterId;

    case 'player_character_faction':
      // User must have a character selected that belongs to the specified faction
      return user &&
             ['PLAYER', 'GAME_MASTER', 'MODERATOR'].includes(user.role) &&
             !!characterId &&
             factionId !== undefined &&
             factionId !== null &&
             String(factionId) === String(granteeId);

    case 'player_character_clan':
      // User must have a character selected that belongs to the specified clan
      return user &&
             ['PLAYER', 'GAME_MASTER', 'MODERATOR'].includes(user.role) &&
             !!characterId &&
             clanId !== undefined &&
             clanId !== null &&
             String(clanId) === String(granteeId);

    case 'specific_user':
      // User's UUID must match the granteeId
      return user && user.id === granteeId;

    case 'specific_character':
      // User must have the specific character selected
      return user &&
             characterId !== undefined &&
             characterId !== null &&
             String(characterId) === String(granteeId);

    default:
      return false;
  }
}

/**
 * Gets all effective permissions for a user on a category
 * @param {Object|null} user - The user object
 * @param {number} categoryId - The category ID
 * @param {Object} options - Context: { characterId, factionId, clanId }
 * @returns {Promise<Array<string>>} Array of permission strings (e.g., ['access_category', 'create_topic'])
 */
async function getCategoryPermissionsForUser(user, categoryId, options = {}) {
  // Admins have all permissions
  if (user && user.role === 'ADMIN') {
    return [...CategoryPermission.PERMISSIONS];
  }

  const userPermissions = [];

  // Check each possible permission
  for (const permission of CategoryPermission.PERMISSIONS) {
    const hasPermission = await userHasPermission(user, categoryId, permission, options);
    if (hasPermission) {
      userPermissions.push(permission);
    }
  }

  return userPermissions;
}

/**
 * Checks if a user has a permission on a category, OR if no permissions are defined
 * This implements backward compatibility: if no permissions are defined for a category,
 * all actions are allowed (as they were before the permission system)
 * @param {Object|null} user - The user object (can be null for visitors)
 * @param {number} categoryId - The category ID
 * @param {string} permission - The permission to check
 * @param {Object} options - Additional context: { characterId, factionId, clanId }
 * @returns {Promise<boolean>} True if user has permission OR no restrictions are defined
 */
async function hasPermissionOrNoRestrictions(user, categoryId, permission, options = {}) {
  // Admins always have all permissions
  if (user && user.role === 'ADMIN') {
    return true;
  }

  // Get resolved permissions (direct + inherited)
  const resolvedPermissions = await resolvePermissions(categoryId);

  // If no permissions are defined at all, allow access (backward compatibility)
  if (resolvedPermissions.length === 0) {
    return true;
  }

  // If permissions ARE defined, check if user has the specific permission
  return userHasPermission(user, categoryId, permission, options);
}

/**
 * Invalidates the permission cache for a category and all its descendants
 * @param {number|null} categoryId - The category ID to invalidate (null to clear entire cache)
 */
async function invalidateCache(categoryId = null) {
  if (categoryId === null) {
    // Clear entire cache
    permissionCache.clear();
    return;
  }

  // Remove the specified category from cache
  permissionCache.delete(categoryId);

  // Find and invalidate all descendant categories
  // We need to find all categories that have this category as an ancestor
  const allCategories = await ForumCategory.findAll({
    attributes: ['id', 'parentId'],
    raw: true,
  });

  // Build a map of children for efficient lookup
  const childrenMap = new Map();
  allCategories.forEach(cat => {
    if (cat.parentId) {
      if (!childrenMap.has(cat.parentId)) {
        childrenMap.set(cat.parentId, []);
      }
      childrenMap.get(cat.parentId).push(cat.id);
    }
  });

  // Recursively find all descendants
  const findDescendants = (id) => {
    const descendants = [];
    const children = childrenMap.get(id) || [];

    children.forEach(childId => {
      descendants.push(childId);
      descendants.push(...findDescendants(childId));
    });

    return descendants;
  };

  const descendants = findDescendants(categoryId);

  // Remove all descendants from cache
  descendants.forEach(id => {
    permissionCache.delete(id);
  });
}

module.exports = {
  resolvePermissions,
  userHasPermission,
  getCategoryPermissionsForUser,
  hasPermissionOrNoRestrictions,
  invalidateCache,
};
