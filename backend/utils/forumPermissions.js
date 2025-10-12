import { Character, Faction, Clan, Category, Section } from "../models/index.js";

/**
 * Vérifie si l'utilisateur peut accéder à une section selon les règles de visibilité
 * @param {Object} user - Utilisateur avec son rôle
 * @param {Object} section - Section avec visible_by_faction_id et visible_by_clan_id
 * @param {Object} category - Catégorie parente
 * @returns {Promise<boolean>}
 */
export async function canAccessSection(user, section, category) {
  // Règle 1: Forum Général - accessible à tous
  if (category.slug === "general") {
    return true;
  }

  // Règle 2: Forum HRP - accessible à tous les utilisateurs connectés
  if (category.slug === "hrp") {
    return user !== null;
  }

  // Pour le Forum RP, l'utilisateur doit être connecté
  if (!user) {
    return false;
  }

  // Règle pour les staffs (admin, moderator, game_master) - accès à tout dans le forum RP
  const staffRoles = ["admin", "moderator", "game_master"];
  if (user.role && staffRoles.includes(user.role.name)) {
    return true;
  }

  // Règle 3: Forum RP sans restriction - accessible aux utilisateurs avec personnage vivant
  if (!section.visible_by_faction_id && !section.visible_by_clan_id) {
    return await hasAliveCharacter(user.id);
  }

  // Règle 4: Forum RP avec restriction de faction
  if (section.visible_by_faction_id) {
    return await hasCharacterInFaction(user.id, section.visible_by_faction_id);
  }

  // Règle 5: Forum RP avec restriction de clan
  if (section.visible_by_clan_id) {
    return await hasCharacterInClan(user.id, section.visible_by_clan_id);
  }

  return false;
}

/**
 * Vérifie si l'utilisateur a au moins un personnage vivant
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
export async function hasAliveCharacter(userId) {
  const character = await Character.findOne({
    where: {
      user_id: userId,
      is_alive: true,
    },
  });
  return character !== null;
}

/**
 * Vérifie si l'utilisateur a un personnage vivant dans une faction spécifique
 * @param {number} userId
 * @param {number} factionId
 * @returns {Promise<boolean>}
 */
export async function hasCharacterInFaction(userId, factionId) {
  const character = await Character.findOne({
    where: {
      user_id: userId,
      faction_id: factionId,
      is_alive: true,
    },
  });
  return character !== null;
}

/**
 * Vérifie si l'utilisateur a un personnage vivant dans un clan spécifique
 * @param {number} userId
 * @param {number} clanId
 * @returns {Promise<boolean>}
 */
export async function hasCharacterInClan(userId, clanId) {
  const character = await Character.findOne({
    where: {
      user_id: userId,
      clan_id: clanId,
      is_alive: true,
    },
  });
  return character !== null;
}

/**
 * Filtre un tableau de sections selon les permissions de l'utilisateur
 * @param {Array} sections - Tableau de sections
 * @param {Object} user - Utilisateur connecté (ou null)
 * @param {Object} category - Catégorie parente
 * @returns {Promise<Array>}
 */
export async function filterSectionsByAccess(sections, user, category) {
  const filteredSections = [];

  for (const section of sections) {
    const hasAccess = await canAccessSection(user, section, category);
    if (hasAccess) {
      // Si la section a des sous-sections, les filtrer aussi
      if (section.subsections && section.subsections.length > 0) {
        section.subsections = await filterSectionsByAccess(
          section.subsections,
          user,
          category
        );
      }
      filteredSections.push(section);
    }
  }

  return filteredSections;
}

/**
 * Récupère les IDs de factions accessibles par l'utilisateur
 * @param {number} userId
 * @returns {Promise<Array<number>>}
 */
export async function getAccessibleFactionIds(userId) {
  const characters = await Character.findAll({
    where: {
      user_id: userId,
      is_alive: true,
    },
    attributes: ["faction_id"],
    group: ["faction_id"],
  });

  return characters
    .map((char) => char.faction_id)
    .filter((id) => id !== null);
}

/**
 * Récupère les IDs de clans accessibles par l'utilisateur
 * @param {number} userId
 * @returns {Promise<Array<number>>}
 */
export async function getAccessibleClanIds(userId) {
  const characters = await Character.findAll({
    where: {
      user_id: userId,
      is_alive: true,
    },
    attributes: ["clan_id"],
    group: ["clan_id"],
  });

  return characters.map((char) => char.clan_id).filter((id) => id !== null);
}

/**
 * Récupère la catégorie d'une section (en remontant la hiérarchie si nécessaire)
 * @param {Object} section - Section avec category ou parentSection
 * @returns {Promise<Object|null>} - Catégorie ou null
 */
export async function getCategoryFromSection(section) {
  // Si la section a directement une catégorie
  if (section.category) {
    return section.category;
  }

  // Si la section a une category_id
  if (section.category_id) {
    return await Category.findByPk(section.category_id);
  }

  // Si la section a une section parente, remonter la hiérarchie
  if (section.parentSection) {
    return await getCategoryFromSection(section.parentSection);
  }

  // Si la section a un parent_section_id mais pas l'objet chargé
  if (section.parent_section_id) {
    const parentSection = await Section.findByPk(section.parent_section_id, {
      include: [
        { model: Category, as: "category" },
        { model: Section, as: "parentSection" },
      ],
    });
    if (parentSection) {
      return await getCategoryFromSection(parentSection);
    }
  }

  return null;
}
