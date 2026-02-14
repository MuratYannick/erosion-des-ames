# Category Permissions - Developer Usage Guide

## Overview

The category permission system is now integrated into the forum controllers. This guide explains how permissions are checked and how to work with them.

## How It Works

### Backward Compatibility

**CRITICAL**: If a category has NO permissions defined (empty `category_permissions` table for that category AND all its parents), then ALL actions are allowed by default. This ensures existing categories work as before.

### Permission Checking Flow

1. User performs an action (view category, create topic, move topic, etc.)
2. Controller calls `categoryPermissionService.hasPermissionOrNoRestrictions(user, categoryId, permission, options)`
3. The service:
   - Returns `true` immediately if user is ADMIN
   - Resolves permissions (direct + inherited from parent categories)
   - If no permissions found at all: returns `true` (backward compatibility)
   - If permissions exist: checks if user matches any grantee for that permission
4. If permission check fails, controller returns 403 Forbidden

## Integrated Permissions by Endpoint

### 1. GET /api/forum/categories (Public Category Listing)

**Permission checked**: `access_category`

**Behavior**:
- Filters out categories the user cannot access
- Recursively filters child categories
- Staff (ADMIN, MODERATOR, GAME_MASTER) also see inactive categories but still respect permissions

**Usage**: No code changes needed - filtering is automatic

### 2. GET /api/forum/topics/category/:categoryId (Topic Listing)

**Permission checked**: `access_category`

**Behavior**:
- Returns 403 if user doesn't have access to the category
- Still checks `isActive` for non-staff users

**Error response**:
```json
{
  "success": false,
  "error": {
    "message": "Vous n'avez pas accès à cette catégorie",
    "code": "FORBIDDEN"
  }
}
```

### 3. POST /api/forum/topics (Create Topic)

**Permission checked**: `create_topic`

**Behavior**:
- Checks permission BEFORE validating topic data
- Passes user's `selectedCharacterId` as context for character-based permissions
- Returns 403 if user cannot create topics in this category

**Context passed**:
```javascript
{
  characterId: req.user.selectedCharacterId,
  // factionId and clanId are loaded automatically from the character
}
```

**Error response**:
```json
{
  "success": false,
  "error": {
    "message": "Vous n'avez pas la permission de créer un sujet dans cette catégorie",
    "code": "FORBIDDEN"
  }
}
```

### 4. PATCH /api/admin/forum/topics/:id/move (Move Topic)

**Permission checked**: `move_topic` on BOTH source and target categories

**Behavior**:
- First loads the topic to get source categoryId
- Checks `move_topic` on source category
- Checks `move_topic` on target category
- Returns 403 with specific error for source or target

**Error responses**:
```json
// Source denial
{
  "success": false,
  "error": {
    "message": "Vous n'avez pas la permission de déplacer un sujet depuis cette catégorie",
    "code": "FORBIDDEN"
  }
}

// Target denial
{
  "success": false,
  "error": {
    "message": "Vous n'avez pas la permission de déplacer un sujet vers cette catégorie",
    "code": "FORBIDDEN"
  }
}
```

### 5. POST /api/admin/forum/topics/merge (Merge Topics)

**Permission checked**: `merge_topic` on BOTH source and target topic categories

**Behavior**:
- Loads both topics to get their categoryIds
- Checks `merge_topic` on source topic's category
- Checks `merge_topic` on target topic's category
- Returns 403 with specific error for source or target

**Error responses**:
```json
// Source denial
{
  "success": false,
  "error": {
    "message": "Vous n'avez pas la permission de fusionner un sujet depuis cette catégorie",
    "code": "FORBIDDEN"
  }
}

// Target denial
{
  "success": false,
  "error": {
    "message": "Vous n'avez pas la permission de fusionner un sujet vers cette catégorie",
    "code": "FORBIDDEN"
  }
}
```

## Permission Types Available

| Permission | Code | Description |
|------------|------|-------------|
| Access category | `access_category` | Can view/access the category |
| Create topic | `create_topic` | Can create topics in the category |
| Edit topic | `edit_topic` | Can edit/delete topics (NOT YET INTEGRATED) |
| Move topic | `move_topic` | Can move topics from/to the category |
| Merge topic | `merge_topic` | Can merge topics from/to the category |
| Edit category | `edit_category` | Can edit/delete the category (NOT YET INTEGRATED) |
| Create subcategory | `create_subcategory` | Can create subcategories (NOT YET INTEGRATED) |
| Move category | `move_category` | Can move subcategories (NOT YET INTEGRATED) |

## Grantee Types (Who Can Have Permissions)

| Grantee Type | Code | Description |
|--------------|------|-------------|
| Public | `public` | Everyone (including visitors) |
| Player | `player` | Any PLAYER, GAME_MASTER, or MODERATOR |
| Player (rules accepted) | `player_accepted_rules` | Players who accepted rules |
| Player with character | `player_with_character` | Players with an active character |
| Player (faction) | `player_character_faction` | Players with character in specific faction |
| Player (clan) | `player_character_clan` | Players with character in specific clan |
| Specific user | `specific_user` | One specific user by UUID |
| Specific character | `specific_character` | User with specific character active |
| Game Master | `game_master` | Users with GAME_MASTER role |
| Moderator | `moderator` | Users with MODERATOR role |

## Adding Permission Checks to New Controllers

If you need to add permission checks to other controllers (e.g., for `edit_topic`, `edit_category`), follow this pattern:

```javascript
const categoryPermissionService = require('../services/categoryPermissionService');

const yourControllerFunction = asyncHandler(async (req, res) => {
  // ... load necessary data (topic, category, etc.)

  // Check permission with backward compatibility
  const hasPermission = await categoryPermissionService.hasPermissionOrNoRestrictions(
    req.user,                    // User object (or null for visitors)
    categoryId,                  // Category ID to check
    'permission_name',           // e.g., 'edit_topic'
    {
      characterId: req.user.selectedCharacterId,  // Optional context
      // factionId and clanId will be loaded automatically
    }
  );

  if (!hasPermission) {
    throw ApiError.forbidden('Vous n\'avez pas la permission d\'effectuer cette action');
  }

  // ... continue with the action
});
```

## Admin Override

**IMPORTANT**: Users with role `ADMIN` ALWAYS have all permissions, regardless of what's defined in `category_permissions`. This is hardcoded in the service and cannot be overridden.

## Testing Permissions

### Manual Testing Scenarios

1. **No permissions defined (backward compatibility)**
   - Create a fresh category
   - Don't add any permissions
   - Verify anyone can access it and create topics

2. **Access restriction**
   - Add `access_category` permission for `player` only
   - Verify visitors cannot see the category in listings
   - Verify authenticated players can see it

3. **Create topic restriction**
   - Add `create_topic` permission for `player_with_character` only
   - Verify players without character get 403 when trying to create topics
   - Verify players with character can create topics

4. **Move/Merge restrictions**
   - Create two categories: A (unrestricted) and B (restricted)
   - Add `move_topic` permission to B for moderators only
   - As a regular player, try to move a topic from A to B (should fail)
   - As a moderator, try to move a topic from A to B (should succeed)

5. **Permission inheritance**
   - Create parent category with `access_category` = public
   - Create child category with no permissions
   - Verify child inherits parent's permissions

## Database Queries for Testing

### View all permissions for a category (including inherited)
```sql
SELECT cp.*
FROM category_permissions cp
WHERE cp.category_id IN (
  -- Get category chain (recursive)
  -- You'll need to adapt this based on your category structure
);
```

### Add a test permission
```sql
INSERT INTO category_permissions (category_id, permission, grantee_type, grantee_id, created_at, updated_at)
VALUES (1, 'access_category', 'player', NULL, NOW(), NOW());
```

### Remove all permissions for a category
```sql
DELETE FROM category_permissions WHERE category_id = 1;
```

## Cache Management

The permission service uses an in-memory cache with 60-second TTL. To invalidate:

```javascript
const categoryPermissionService = require('../services/categoryPermissionService');

// Invalidate a specific category and its descendants
await categoryPermissionService.invalidateCache(categoryId);

// Invalidate entire cache
await categoryPermissionService.invalidateCache(null);
```

**Note**: Cache is automatically invalidated when permissions are added/removed via the admin API (when that's implemented in Step 7).

## Common Pitfalls

1. **Forgetting backward compatibility**: Always use `hasPermissionOrNoRestrictions()`, not `userHasPermission()` directly
2. **Not passing character context**: For character-based permissions, always pass `characterId` in options
3. **Wrong category ID**: For topic operations, make sure you're checking the topic's category, not the topic ID itself
4. **Dual checks**: For move/merge operations, remember to check permissions on BOTH categories involved

## Future Enhancements (Not Yet Implemented)

- `edit_topic` permission check in topic update/delete controllers
- `edit_category` permission check in category update/delete controllers
- `create_subcategory` permission check in category create controller
- `move_category` permission check in category reorder controller
- Frontend permission editor (Step 7)
- Frontend UI permission enforcement (Step 8)
