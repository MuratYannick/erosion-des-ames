// ═══════════════════════════════════════════════════════════
// IMPORTS DES MODÈLES
// ═══════════════════════════════════════════════════════════

// Game models
import User from "./game/User.js";
import Faction from "./game/Faction.js";
import Character from "./game/Character.js";
import Clan from "./game/Clan.js";

// Forum models
import Category from "./forum/Category.js";
import Section from "./forum/Section.js";
import Topic from "./forum/Topic.js";
import Post from "./forum/Post.js";
import Permission from "./forum/Permission.js";
import RolePermission from "./forum/RolePermission.js";
import SectionPermission from "./forum/SectionPermission.js";
import TopicPermission from "./forum/TopicPermission.js";

// ═══════════════════════════════════════════════════════════
// RELATIONS ENTRE LES MODÈLES
// ═══════════════════════════════════════════════════════════

// User ↔ Character (1:N)
User.hasMany(Character, {
  foreignKey: "user_id",
  as: "characters",
  onDelete: "CASCADE",
});
Character.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Faction ↔ Character (1:N)
Faction.hasMany(Character, {
  foreignKey: "faction_id",
  as: "characters",
  onDelete: "RESTRICT",
});
Character.belongsTo(Faction, {
  foreignKey: "faction_id",
  as: "faction",
});

// Faction ↔ Clan (1:N)
Faction.hasMany(Clan, {
  foreignKey: "faction_id",
  as: "clans",
  onDelete: "SET NULL",
});
Clan.belongsTo(Faction, {
  foreignKey: "faction_id",
  as: "faction",
});

// Character ↔ Clan (N:1) - Un personnage peut appartenir à un clan
Character.belongsTo(Clan, {
  foreignKey: "clan_id",
  as: "clan",
  onDelete: "SET NULL",
});
Clan.hasMany(Character, {
  foreignKey: "clan_id",
  as: "members",
});

// ──────────────────────────────────────────────────────────
// RELATIONS FORUM
// ──────────────────────────────────────────────────────────

// Category ↔ Section (1:N)
Category.hasMany(Section, {
  foreignKey: "category_id",
  as: "sections",
  onDelete: "CASCADE",
});
Section.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

// Section ↔ Section (auto-référence 1:N pour sous-sections)
Section.hasMany(Section, {
  foreignKey: "parent_section_id",
  as: "subsections",
  onDelete: "CASCADE",
});
Section.belongsTo(Section, {
  foreignKey: "parent_section_id",
  as: "parentSection",
});

// Section ↔ Topic (1:N)
Section.hasMany(Topic, {
  foreignKey: "section_id",
  as: "topics",
  onDelete: "CASCADE",
});
Topic.belongsTo(Section, {
  foreignKey: "section_id",
  as: "section",
});

// Topic ↔ Post (1:N)
Topic.hasMany(Post, {
  foreignKey: "topic_id",
  as: "posts",
  onDelete: "CASCADE",
});
Post.belongsTo(Topic, {
  foreignKey: "topic_id",
  as: "topic",
});

// User ↔ Topic (1:N) - Auteur du topic
User.hasMany(Topic, {
  foreignKey: "author_user_id",
  as: "topics",
  onDelete: "SET NULL",
});
Topic.belongsTo(User, {
  foreignKey: "author_user_id",
  as: "authorUser",
});

// Character ↔ Topic (1:N) - Auteur du topic (pour RP)
Character.hasMany(Topic, {
  foreignKey: "author_character_id",
  as: "topics",
  onDelete: "SET NULL",
});
Topic.belongsTo(Character, {
  foreignKey: "author_character_id",
  as: "authorCharacter",
});

// User ↔ Post (1:N) - Auteur du post
User.hasMany(Post, {
  foreignKey: "author_user_id",
  as: "posts",
  onDelete: "SET NULL",
});
Post.belongsTo(User, {
  foreignKey: "author_user_id",
  as: "authorUser",
});

// Character ↔ Post (1:N) - Auteur du post (pour RP)
Character.hasMany(Post, {
  foreignKey: "author_character_id",
  as: "posts",
  onDelete: "SET NULL",
});
Post.belongsTo(Character, {
  foreignKey: "author_character_id",
  as: "authorCharacter",
});

// ──────────────────────────────────────────────────────────
// RELATIONS PERMISSIONS
// ──────────────────────────────────────────────────────────

// Permission ↔ RolePermission (1:N)
Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "rolePermissions",
  onDelete: "CASCADE",
});
RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

// Section ↔ SectionPermission (1:N)
Section.hasMany(SectionPermission, {
  foreignKey: "section_id",
  as: "sectionPermissions",
  onDelete: "CASCADE",
});
SectionPermission.belongsTo(Section, {
  foreignKey: "section_id",
  as: "section",
});

// Permission ↔ SectionPermission (1:N)
Permission.hasMany(SectionPermission, {
  foreignKey: "permission_id",
  as: "sectionPermissions",
  onDelete: "CASCADE",
});
SectionPermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

// User ↔ SectionPermission (1:N)
User.hasMany(SectionPermission, {
  foreignKey: "user_id",
  as: "sectionPermissions",
  onDelete: "CASCADE",
});
SectionPermission.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Topic ↔ TopicPermission (1:N)
Topic.hasMany(TopicPermission, {
  foreignKey: "topic_id",
  as: "topicPermissions",
  onDelete: "CASCADE",
});
TopicPermission.belongsTo(Topic, {
  foreignKey: "topic_id",
  as: "topic",
});

// Permission ↔ TopicPermission (1:N)
Permission.hasMany(TopicPermission, {
  foreignKey: "permission_id",
  as: "topicPermissions",
  onDelete: "CASCADE",
});
TopicPermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

// User ↔ TopicPermission (1:N)
User.hasMany(TopicPermission, {
  foreignKey: "user_id",
  as: "topicPermissions",
  onDelete: "CASCADE",
});
TopicPermission.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// ═══════════════════════════════════════════════════════════
// EXPORT DES MODÈLES
// ═══════════════════════════════════════════════════════════

export {
  User,
  Faction,
  Character,
  Clan,
  Category,
  Section,
  Topic,
  Post,
  Permission,
  RolePermission,
  SectionPermission,
  TopicPermission,
};

export default {
  User,
  Faction,
  Character,
  Clan,
  Category,
  Section,
  Topic,
  Post,
  Permission,
  RolePermission,
  SectionPermission,
  TopicPermission,
};
