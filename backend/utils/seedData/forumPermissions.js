/**
 * Données de seed pour les permissions du forum
 */

// ═════════════════════════════════════════════════════════════════════════════
// PERMISSIONS POUR LA CATÉGORIE "FORUM GÉNÉRAL"
// ═════════════════════════════════════════════════════════════════════════════
/**
 * - voir : tout le monde, pas de CGU et règlement requis
 * - créer une section enfant : admin uniquement, pas de CGU et règlement requis, pas d'autorisation supplémentaire pour l'auteur
 * - déplacer un enfant depuis/vers l'élément : admin uniquement, pas de CGU et règlement requis, pas d'autorisation supplémentaire pour l'auteur
 */
export const forumGeneralPermissions = [
  {
    entity_type: "category",
    operation_type: "view",
    role_level: "everyone",
    allow_author: false,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: false,
  },
  {
    entity_type: "category",
    operation_type: "create_section",
    role_level: "admin",
    allow_author: false,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: false,
  },
  {
    entity_type: "category",
    operation_type: "move_children",
    role_level: "admin",
    allow_author: false,
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: false,
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// PERMISSIONS POUR LA CATÉGORIE "FORUM HRP"
// ═════════════════════════════════════════════════════════════════════════════
/**
 * - voir : admin, moderator, game-master et player, pas de particularité pour le personnage de player, pas de CGU et règlement requis
 * - créer une section enfant : admin uniquement, CGU et règlement requis, pas d'autorisation supplémentaire pour l'auteur
 * - déplacer un enfant depuis/vers l'élément : admin uniquement, CGU et règlement requis, pas d'autorisation supplémentaire pour l'auteur
 */
export const forumHRPPermissions = [
  {
    entity_type: "category",
    operation_type: "view",
    role_level: "admin_moderator_gm_player",   // Admin, Moderator, Game Master et Player
    allow_author: false,
    character_requirement: "none",             // PAS de particularité pour le personnage
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: false,             // PAS de CGU/règlement requis
  },
  {
    entity_type: "category",
    operation_type: "create_section",
    role_level: "admin",                       // Admin uniquement
    allow_author: false,                       // PAS d'autorisation supplémentaire pour l'auteur
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,              // CGU et règlement requis
  },
  {
    entity_type: "category",
    operation_type: "move_children",
    role_level: "admin",                       // Admin uniquement
    allow_author: false,                       // PAS d'autorisation supplémentaire pour l'auteur
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,              // CGU et règlement requis
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// PERMISSIONS POUR LA CATÉGORIE "FORUM RP"
// ═════════════════════════════════════════════════════════════════════════════
/**
 * - voir : admin, moderator, game-master et player, le personnage de player doit être vivant, pas de CGU et règlement requis
 * - créer une section enfant : admin uniquement, CGU et règlement requis, pas d'autorisation supplémentaire pour l'auteur
 * - déplacer un enfant depuis/vers l'élément : admin uniquement, CGU et règlement requis, pas d'autorisation supplémentaire pour l'auteur
 */
export const forumRPPermissions = [
  {
    entity_type: "category",
    operation_type: "view",
    role_level: "admin_moderator_gm_player",   // Admin, Moderator, Game Master et Player
    allow_author: false,
    character_requirement: "alive",            // Le personnage de player doit être vivant
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: false,             // PAS de CGU/règlement requis
  },
  {
    entity_type: "category",
    operation_type: "create_section",
    role_level: "admin",                       // Admin uniquement
    allow_author: false,                       // PAS d'autorisation supplémentaire pour l'auteur
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,              // CGU et règlement requis
  },
  {
    entity_type: "category",
    operation_type: "move_children",
    role_level: "admin",                       // Admin uniquement
    allow_author: false,                       // PAS d'autorisation supplémentaire pour l'auteur
    character_requirement: "none",
    required_faction_id: null,
    required_clan_id: null,
    enable_author_character_rule: false,
    author_character_mode: "inclusive",
    require_terms_accepted: true,              // CGU et règlement requis
  },
];
