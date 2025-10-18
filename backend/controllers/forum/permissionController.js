import {
  ForumPermission,
  Category,
  Section,
  Topic,
  Faction,
  Clan,
} from "../../models/index.js";

// Valeurs par défaut pour les permissions
const DEFAULT_PERMISSIONS = {
  view: {
    role_level: "everyone",
    allow_author: false,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: false,
  },
  create: {
    role_level: "admin_moderator_gm_player",
    allow_author: false,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,
  },
  update: {
    role_level: "admin_moderator_gm_player",
    allow_author: true,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,
  },
  delete: {
    role_level: "admin_moderator_gm_player",
    allow_author: true,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,
  },
};

// ═══════════════════════════════════════════════════════════
// RÉCUPÉRER LES PERMISSIONS D'UNE ENTITÉ
// ═══════════════════════════════════════════════════════════

/**
 * Récupérer les permissions d'une entité (category, section ou topic)
 * GET /api/forum/permissions/:entityType/:entityId
 */
export const getPermissions = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;

    // Valider le type d'entité
    const validTypes = ["category", "section", "topic"];
    if (!validTypes.includes(entityType)) {
      return res.status(400).json({
        success: false,
        message: "Type d'entité invalide. Doit être 'category', 'section' ou 'topic'",
      });
    }

    // Vérifier que l'entité existe
    let entity;
    switch (entityType) {
      case "category":
        entity = await Category.findByPk(entityId);
        break;
      case "section":
        entity = await Section.findByPk(entityId);
        break;
      case "topic":
        entity = await Topic.findByPk(entityId);
        break;
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: `${entityType} non trouvée`,
      });
    }

    // Récupérer les permissions pour les 4 opérations
    const permissions = await ForumPermission.findAll({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: [
        {
          model: Faction,
          as: "requiredFaction",
          attributes: ["id", "name"],
        },
        {
          model: Clan,
          as: "requiredClan",
          attributes: ["id", "name"],
        },
      ],
    });

    // Organiser les permissions par operation_type
    const result = {
      view: null,
      create: null,
      update: null,
      delete: null,
    };

    permissions.forEach((perm) => {
      result[perm.operation_type] = perm;
    });

    // Ajouter les valeurs par défaut pour les opérations manquantes
    ["view", "create", "update", "delete"].forEach((op) => {
      if (!result[op]) {
        result[op] = {
          operation_type: op,
          ...DEFAULT_PERMISSIONS[op],
        };
      }
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// METTRE À JOUR LES PERMISSIONS D'UNE ENTITÉ
// ═══════════════════════════════════════════════════════════

/**
 * Créer ou mettre à jour les permissions d'une entité
 * PUT /api/forum/permissions/:entityType/:entityId
 * Body: { view: {...}, create: {...}, update: {...}, delete: {...} }
 */
export const updatePermissions = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const permissionsData = req.body; // { view, create, update, delete }

    // Valider le type d'entité
    const validTypes = ["category", "section", "topic"];
    if (!validTypes.includes(entityType)) {
      return res.status(400).json({
        success: false,
        message: "Type d'entité invalide. Doit être 'category', 'section' ou 'topic'",
      });
    }

    // Vérifier que l'entité existe
    let entity;
    switch (entityType) {
      case "category":
        entity = await Category.findByPk(entityId);
        break;
      case "section":
        entity = await Section.findByPk(entityId);
        break;
      case "topic":
        entity = await Topic.findByPk(entityId);
        break;
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: `${entityType} non trouvée`,
      });
    }

    // Mettre à jour les permissions pour chaque opération
    const updatedPermissions = {};

    for (const operationType of ["view", "create", "update", "delete"]) {
      if (!permissionsData[operationType]) continue;

      const data = permissionsData[operationType];

      // Chercher si une permission existe déjà
      let permission = await ForumPermission.findOne({
        where: {
          entity_type: entityType,
          entity_id: entityId,
          operation_type: operationType,
        },
      });

      // Créer ou mettre à jour
      if (permission) {
        await permission.update(data);
      } else {
        permission = await ForumPermission.create({
          entity_type: entityType,
          entity_id: entityId,
          operation_type: operationType,
          ...data,
        });
      }

      // Recharger avec les associations
      await permission.reload({
        include: [
          {
            model: Faction,
            as: "requiredFaction",
            attributes: ["id", "name"],
          },
          {
            model: Clan,
            as: "requiredClan",
            attributes: ["id", "name"],
          },
        ],
      });

      updatedPermissions[operationType] = permission;
    }

    res.json({
      success: true,
      message: "Permissions mises à jour avec succès",
      data: updatedPermissions,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════
// COPIER LES PERMISSIONS DU PARENT
// ═══════════════════════════════════════════════════════════

/**
 * Copier les permissions du parent vers une entité
 * POST /api/forum/permissions/:entityType/:entityId/inherit
 */
export const inheritPermissionsFromParent = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;

    // Valider le type d'entité (pas de parent pour les catégories)
    const validTypes = ["section", "topic"];
    if (!validTypes.includes(entityType)) {
      return res.status(400).json({
        success: false,
        message: "Type d'entité invalide. Seules 'section' et 'topic' peuvent hériter de permissions",
      });
    }

    // Récupérer l'entité
    let entity, parentPermissions;

    if (entityType === "section") {
      entity = await Section.findByPk(entityId, {
        include: [
          { model: Category, as: "category" },
          { model: Section, as: "parentSection" },
        ],
      });

      if (!entity) {
        return res.status(404).json({
          success: false,
          message: "Section non trouvée",
        });
      }

      // Chercher les permissions du parent (section ou catégorie)
      if (entity.parent_section_id) {
        parentPermissions = await ForumPermission.findAll({
          where: {
            entity_type: "section",
            entity_id: entity.parent_section_id,
          },
        });
      } else if (entity.category_id) {
        parentPermissions = await ForumPermission.findAll({
          where: {
            entity_type: "category",
            entity_id: entity.category_id,
          },
        });
      }
    } else if (entityType === "topic") {
      entity = await Topic.findByPk(entityId, {
        include: [{ model: Section, as: "section" }],
      });

      if (!entity) {
        return res.status(404).json({
          success: false,
          message: "Topic non trouvé",
        });
      }

      // Chercher les permissions de la section parente
      if (entity.section_id) {
        parentPermissions = await ForumPermission.findAll({
          where: {
            entity_type: "section",
            entity_id: entity.section_id,
          },
        });
      }
    }

    if (!parentPermissions || parentPermissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucune permission parent trouvée",
      });
    }

    // Copier les permissions pour chaque opération
    const copiedPermissions = {};

    for (const parentPerm of parentPermissions) {
      // Copier les permissions (exclure id, entity_type, entity_id, timestamps)
      const permissionsToCopy = {
        role_level: parentPerm.role_level,
        allow_author: parentPerm.allow_author,
        character_requirement: parentPerm.character_requirement,
        required_faction_id: parentPerm.required_faction_id,
        required_clan_id: parentPerm.required_clan_id,
        enable_author_character_rule: parentPerm.enable_author_character_rule,
        author_character_mode: parentPerm.author_character_mode,
        require_terms_accepted: parentPerm.require_terms_accepted,
      };

      // Chercher si des permissions existent déjà pour cette opération
      let permission = await ForumPermission.findOne({
        where: {
          entity_type: entityType,
          entity_id: entityId,
          operation_type: parentPerm.operation_type,
        },
      });

      // Créer ou mettre à jour
      if (permission) {
        await permission.update(permissionsToCopy);
      } else {
        permission = await ForumPermission.create({
          entity_type: entityType,
          entity_id: entityId,
          operation_type: parentPerm.operation_type,
          ...permissionsToCopy,
        });
      }

      copiedPermissions[parentPerm.operation_type] = permission;
    }

    res.json({
      success: true,
      message: "Permissions héritées du parent avec succès",
      data: copiedPermissions,
    });
  } catch (error) {
    next(error);
  }
};
