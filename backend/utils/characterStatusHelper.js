import { Character, Clan, Faction } from "../models/index.js";

/**
 * Types de statut de personnage possibles
 */
export const CHARACTER_STATUS = {
  FACTION_CLAN_LEADER: "faction_clan_leader", // Chef de clan d'une faction
  NEUTRAL_CLAN_LEADER: "neutral_clan_leader", // Chef de clan neutre
  FACTION_CLAN_MEMBER: "faction_clan_member", // Membre d'un clan de faction
  NEUTRAL_CLAN_MEMBER: "neutral_clan_member", // Membre d'un clan neutre
  FACTION_NO_CLAN: "faction_no_clan", // Dans une faction sans clan
  NO_FACTION_NO_CLAN: "no_faction_no_clan", // Sans faction ni clan
  NO_ALIVE_CHARACTER: "no_alive_character", // Pas de personnage vivant
};

/**
 * Récupère le personnage actif (vivant) d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Object|null>} Le personnage avec ses relations ou null
 */
export async function getActiveCharacter(userId) {
  try {
    const character = await Character.findOne({
      where: {
        user_id: userId,
        is_alive: true,
      },
      include: [
        {
          model: Clan,
          as: "clan",
          include: [
            {
              model: Faction,
              as: "faction",
            },
          ],
        },
        {
          model: Faction,
          as: "faction",
        },
      ],
      order: [["created_at", "DESC"]], // Le plus récent si plusieurs personnages vivants
    });

    return character;
  } catch (error) {
    console.error("Erreur getActiveCharacter:", error);
    return null;
  }
}

/**
 * Détermine le statut d'un personnage
 * @param {Object} character - Le personnage avec ses relations (clan, faction)
 * @returns {string} Le statut du personnage
 */
export function determineCharacterStatus(character) {
  // Pas de personnage ou personnage mort
  if (!character || !character.is_alive) {
    return CHARACTER_STATUS.NO_ALIVE_CHARACTER;
  }

  // A un clan
  if (character.clan_id && character.clan) {
    const clanFactionId = character.clan.faction_id;
    const isLeader = character.clan.leader_id === character.id;

    // Chef de clan
    if (isLeader) {
      // Clan d'une faction
      if (clanFactionId) {
        return CHARACTER_STATUS.FACTION_CLAN_LEADER;
      }
      // Clan neutre
      return CHARACTER_STATUS.NEUTRAL_CLAN_LEADER;
    }

    // Membre de clan (non chef)
    if (clanFactionId) {
      return CHARACTER_STATUS.FACTION_CLAN_MEMBER;
    }
    return CHARACTER_STATUS.NEUTRAL_CLAN_MEMBER;
  }

  // Pas de clan, mais a une faction
  if (character.faction_id && character.faction) {
    return CHARACTER_STATUS.FACTION_NO_CLAN;
  }

  // Ni clan ni faction
  return CHARACTER_STATUS.NO_FACTION_NO_CLAN;
}

/**
 * Récupère le statut du personnage d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { status: string, character: Object|null }
 */
export async function getUserCharacterStatus(userId) {
  const character = await getActiveCharacter(userId);
  const status = determineCharacterStatus(character);

  return {
    status,
    character,
    hasAliveCharacter: status !== CHARACTER_STATUS.NO_ALIVE_CHARACTER,
    isClanLeader:
      status === CHARACTER_STATUS.FACTION_CLAN_LEADER ||
      status === CHARACTER_STATUS.NEUTRAL_CLAN_LEADER,
    isInClan:
      status === CHARACTER_STATUS.FACTION_CLAN_LEADER ||
      status === CHARACTER_STATUS.NEUTRAL_CLAN_LEADER ||
      status === CHARACTER_STATUS.FACTION_CLAN_MEMBER ||
      status === CHARACTER_STATUS.NEUTRAL_CLAN_MEMBER,
    isInFaction:
      status === CHARACTER_STATUS.FACTION_CLAN_LEADER ||
      status === CHARACTER_STATUS.FACTION_CLAN_MEMBER ||
      status === CHARACTER_STATUS.FACTION_NO_CLAN,
    isNeutral:
      status === CHARACTER_STATUS.NEUTRAL_CLAN_LEADER ||
      status === CHARACTER_STATUS.NEUTRAL_CLAN_MEMBER,
  };
}

/**
 * Vérifie si un utilisateur a accès à une section restreinte
 * @param {Object} user - L'utilisateur
 * @param {Object} section - La section avec clan_id, faction_id, is_public
 * @returns {Promise<Object>} { hasAccess: boolean, reason: string }
 */
export async function canAccessSection(user, section) {
  // Section publique = accès pour tous
  if (section.is_public === 1) {
    return { hasAccess: true, reason: "public_section" };
  }

  // Section privée, récupérer le statut du personnage
  const characterStatus = await getUserCharacterStatus(user.id);
  const { character } = characterStatus;

  // Pas de personnage vivant = pas d'accès aux sections privées
  if (!characterStatus.hasAliveCharacter) {
    return { hasAccess: false, reason: "no_alive_character" };
  }

  // Section restreinte à un clan spécifique
  if (section.clan_id) {
    if (!character.clan_id) {
      return { hasAccess: false, reason: "not_in_clan" };
    }
    if (character.clan_id !== section.clan_id) {
      return { hasAccess: false, reason: "wrong_clan" };
    }
    return { hasAccess: true, reason: "clan_member" };
  }

  // Section restreinte à une faction (sans clan spécifique)
  if (section.faction_id) {
    // Vérifier la faction du personnage
    let characterFactionId = character.faction_id;

    // Si le personnage est dans un clan, vérifier la faction du clan
    if (character.clan_id && character.clan && character.clan.faction_id) {
      characterFactionId = character.clan.faction_id;
    }

    if (!characterFactionId) {
      return { hasAccess: false, reason: "not_in_faction" };
    }
    if (characterFactionId !== section.faction_id) {
      return { hasAccess: false, reason: "wrong_faction" };
    }
    return { hasAccess: true, reason: "faction_member" };
  }

  // Section privée sans restriction spécifique = accès refusé
  return { hasAccess: false, reason: "private_section" };
}

/**
 * Vérifie si une section/sous-section appartient au clan du personnage
 * @param {Object} section - La section avec clan_id
 * @param {Object} character - Le personnage avec clan_id
 * @returns {boolean}
 */
export function isSectionOwnedByClan(section, character) {
  if (!section || !character) return false;
  if (!section.clan_id || !character.clan_id) return false;
  return section.clan_id === character.clan_id;
}

/**
 * Obtient les permissions spéciales selon le statut du personnage
 * @param {string} characterStatus - Le statut du personnage
 * @returns {Object} Configuration des permissions spéciales
 */
export function getStatusBasedPermissions(characterStatus) {
  const permissions = {
    // Permissions de base
    canCreatePrivateSections: false,
    canManageClanSections: false,
    canPostInFactionSections: false,
    canPostInNeutralSections: false,
    canAccessPublicSections: true,

    // Permissions étendues pour chefs de clan
    canCreateSubsectionsInClan: false,
    canEditSubsectionsInClan: false,
    canDeleteSubsectionsInClan: false,
    canLockContentInClan: false,
    canPinContentInClan: false,

    // Accès aux catégories
    canAccessRPCategory: true,

    // Limites
    maxTopicsPerDay: 5,
    maxPostsPerDay: 50,
  };

  switch (characterStatus) {
    case CHARACTER_STATUS.FACTION_CLAN_LEADER:
      permissions.canCreatePrivateSections = true;
      permissions.canManageClanSections = true;
      permissions.canPostInFactionSections = true;
      permissions.canCreateSubsectionsInClan = true;
      permissions.canEditSubsectionsInClan = true;
      permissions.canDeleteSubsectionsInClan = true;
      permissions.canLockContentInClan = true;
      permissions.canPinContentInClan = true;
      permissions.maxTopicsPerDay = 20;
      permissions.maxPostsPerDay = 100;
      break;

    case CHARACTER_STATUS.NEUTRAL_CLAN_LEADER:
      permissions.canCreatePrivateSections = true;
      permissions.canManageClanSections = true;
      permissions.canPostInNeutralSections = true;
      permissions.canCreateSubsectionsInClan = true;
      permissions.canEditSubsectionsInClan = true;
      permissions.canDeleteSubsectionsInClan = true;
      permissions.canLockContentInClan = true;
      permissions.canPinContentInClan = true;
      permissions.maxTopicsPerDay = 20;
      permissions.maxPostsPerDay = 100;
      break;

    case CHARACTER_STATUS.FACTION_CLAN_MEMBER:
      permissions.canPostInFactionSections = true;
      permissions.maxTopicsPerDay = 10;
      permissions.maxPostsPerDay = 75;
      break;

    case CHARACTER_STATUS.NEUTRAL_CLAN_MEMBER:
      permissions.canPostInNeutralSections = true;
      permissions.maxTopicsPerDay = 10;
      permissions.maxPostsPerDay = 75;
      break;

    case CHARACTER_STATUS.FACTION_NO_CLAN:
      permissions.canPostInFactionSections = true;
      permissions.maxTopicsPerDay = 7;
      permissions.maxPostsPerDay = 50;
      break;

    case CHARACTER_STATUS.NO_FACTION_NO_CLAN:
      permissions.maxTopicsPerDay = 3;
      permissions.maxPostsPerDay = 20;
      break;

    case CHARACTER_STATUS.NO_ALIVE_CHARACTER:
      permissions.canAccessPublicSections = true;
      permissions.canAccessRPCategory = false; // Pas d'accès à la catégorie RP
      permissions.maxTopicsPerDay = 0;
      permissions.maxPostsPerDay = 0;
      break;
  }

  return permissions;
}

export default {
  CHARACTER_STATUS,
  getActiveCharacter,
  determineCharacterStatus,
  getUserCharacterStatus,
  canAccessSection,
  isSectionOwnedByClan,
  getStatusBasedPermissions,
};
