import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const ForumPermission = sequelize.define(
  "ForumPermission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Type d'entité concernée
    entity_type: {
      type: DataTypes.ENUM("category", "section", "topic"),
      allowNull: false,
      comment: "Type d'entité (category, section, ou topic)",
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'entité concernée",
    },

    // ═══════════════════════════════════════════════════════════
    // TYPE D'OPÉRATION
    // ═══════════════════════════════════════════════════════════
    operation_type: {
      type: DataTypes.ENUM(
        "view",                    // Voir l'élément
        "create_section",          // Créer une section enfant (category, section)
        "create_topic",            // Créer un topic enfant (section uniquement)
        "pin_lock",                // Verrouiller ou épingler (section, topic)
        "edit_delete",             // Modifier ou supprimer (section, topic)
        "move_children"            // Déplacer un enfant depuis/vers l'élément (category, section, topic)
      ),
      allowNull: false,
      comment: "Type d'opération (view / create_section / create_topic / pin_lock / edit_delete / move_children)",
    },

    // ═══════════════════════════════════════════════════════════
    // 1. PERMISSIONS DE RÔLE (Switch - un seul choix)
    // ═══════════════════════════════════════════════════════════
    role_level: {
      type: DataTypes.ENUM(
        "admin",
        "admin_moderator",
        "admin_moderator_gm",
        "admin_moderator_player",
        "admin_moderator_gm_player",
        "everyone"
      ),
      allowNull: false,
      defaultValue: "everyone",
      comment: "Niveau de rôle requis (admin / admin+mod / admin+mod+gm / admin+mod+player / admin+mod+gm+player / everyone)",
    },

    // ═══════════════════════════════════════════════════════════
    // 2. PERMISSION AUTEUR (Toggle - ajout à la permission rôle)
    // ═══════════════════════════════════════════════════════════
    allow_author: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "OU permet à l'auteur même si rôle insuffisant",
    },

    // ═══════════════════════════════════════════════════════════
    // 3. PERSONNAGE (Switch - pour Players uniquement)
    // ═══════════════════════════════════════════════════════════
    character_requirement: {
      type: DataTypes.ENUM(
        "none",
        "alive",
        "clan_member",
        "faction_member",
        "clan_leader"
      ),
      allowNull: false,
      defaultValue: "none",
      comment: "Exigence de personnage (none / alive / clan_member / faction_member / clan_leader)",
    },

    // Faction/Clan spécifique pour character_requirement
    required_faction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "factions",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "ID de la faction requise (si character_requirement = faction_member)",
    },
    required_clan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clans",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "ID du clan requis (si character_requirement = clan_member ou clan_leader)",
    },

    // ═══════════════════════════════════════════════════════════
    // 4. AUTEUR PERSONNAGE (Toggle + Radio - pour Players)
    // ═══════════════════════════════════════════════════════════
    enable_author_character_rule: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Activer la règle auteur personnage",
    },
    author_character_mode: {
      type: DataTypes.ENUM("exclusive", "inclusive"),
      allowNull: false,
      defaultValue: "inclusive",
      comment: "Mode auteur: exclusive (QUI est l'auteur uniquement) / inclusive (OU est l'auteur aussi)",
    },

    // ═══════════════════════════════════════════════════════════
    // 5. CONDITIONS OBLIGATOIRES (Toggle unique)
    // ═══════════════════════════════════════════════════════════
    require_terms_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "CGU ET Règlement du forum acceptés requis",
    },
  },
  {
    tableName: "forum_permissions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["entity_type", "entity_id", "operation_type"],
        name: "unique_entity_operation_permission",
      },
    ],
  }
);

// Méthode pour définir les associations (appelée dans models/index.js)
ForumPermission.associate = (models) => {
  // Relation avec la faction requise
  ForumPermission.belongsTo(models.Faction, {
    foreignKey: "required_faction_id",
    as: "requiredFaction",
  });

  // Relation avec le clan requis
  ForumPermission.belongsTo(models.Clan, {
    foreignKey: "required_clan_id",
    as: "requiredClan",
  });
};

export default ForumPermission;
