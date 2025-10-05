import User from "./User.js";
import Faction from "./Faction.js";
import Character from "./Character.js";
import Clan from "./Clan.js";

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

// ═══════════════════════════════════════════════════════════
// EXPORT DES MODÈLES
// ═══════════════════════════════════════════════════════════

export { User, Faction, Character, Clan };

export default {
  User,
  Faction,
  Character,
  Clan,
};
