import {
  Permission,
  RolePermission,
  SectionPermission,
  TopicPermission,
  Section,
  Category,
  Topic,
} from "../models/index.js";
import {
  getUserCharacterStatus,
  getStatusBasedPermissions,
  canAccessSection,
  isSectionOwnedByClan,
} from "./characterStatusHelper.js";

/**
 * Vérifie si un utilisateur a une permission spécifique
 * Ordre de priorité :
 * 0. Vérification de l'acceptation des CGU (non-ADMIN uniquement)
 * 1. Vérification d'accès à la section (restrictions faction/clan)
 * 2. Vérifications spéciales pour le rôle PLAYER basées sur le statut du personnage
 * 3. Permissions spécifiques par ressource (topic/section) pour l'utilisateur
 * 4. Permissions spécifiques par ressource (topic/section) pour le rôle
 * 5. Permissions globales par rôle
 * 6. L'utilisateur est-il l'auteur de la ressource ?
 *
 * @param {Object} user - L'objet utilisateur (avec id, role, terms_accepted)
 * @param {string} permissionName - Le nom de la permission (ex: "section.create")
 * @param {Object} options - Options supplémentaires
 * @param {number} options.sectionId - ID de la section (pour permissions spécifiques)
 * @param {number} options.topicId - ID du topic (pour permissions spécifiques)
 * @param {number} options.authorUserId - ID de l'auteur de la ressource
 * @returns {Promise<boolean>}
 */
export async function hasPermission(user, permissionName, options = {}) {
  try {
    // Si pas d'utilisateur, refuser
    if (!user || !user.id || !user.role) {
      return false;
    }

    // Les ADMIN ont toutes les permissions
    if (user.role === "ADMIN") {
      return true;
    }

    // 0. VÉRIFICATION CGU : Bloquer toutes les actions de création/modification pour les non-ADMIN
    // qui n'ont pas accepté les CGU
    if (!user.terms_accepted) {
      // Liste des actions bloquées sans acceptation des CGU
      const blockedActions = [
        ".create",
        ".edit",
        ".delete",
        ".move",
        ".lock",
        ".unlock",
        ".pin",
      ];

      // Vérifier si la permission demandée est dans la liste des actions bloquées
      if (blockedActions.some(action => permissionName.includes(action))) {
        return false;
      }
    }

    // Récupérer la permission
    const permission = await Permission.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      console.warn(`Permission "${permissionName}" n'existe pas dans la base`);
      return false;
    }

    const { sectionId, topicId, authorUserId } = options;

    // 0. Pour les PLAYER, vérifier les restrictions liées au statut du personnage
    if (user.role === "PLAYER") {
      const characterStatus = await getUserCharacterStatus(user.id);
      const statusPermissions = getStatusBasedPermissions(characterStatus.status);

      // 0a. Bloquer l'accès à la catégorie RP si pas de personnage vivant
      if (!statusPermissions.canAccessRPCategory) {
        // Récupérer la catégorie de la section/topic pour vérifier si c'est RP
        let categorySlug = null;

        if (sectionId) {
          const section = await Section.findByPk(sectionId, {
            include: [{ model: Category, as: "category" }],
          });
          categorySlug = section?.category?.slug;
        } else if (topicId) {
          const topic = await Topic.findByPk(topicId, {
            include: [{ model: Section, as: "section", include: [{ model: Category, as: "category" }] }],
          });
          categorySlug = topic?.section?.category?.slug;
        }

        if (categorySlug === "rp") {
          return false; // Bloquer tout accès à la catégorie RP
        }
      }

      // 0b. Vérifier l'accès à la section si une section est spécifiée (restrictions faction/clan)
      if (sectionId) {
        const section = await Section.findByPk(sectionId);
        if (section) {
          const accessCheck = await canAccessSection(user, section);
          if (!accessCheck.hasAccess) {
            // Accès refusé à la section = refus de toutes les opérations
            return false;
          }

          // 0c. Permissions spéciales pour les chefs de clan dans leur propre clan
          if (characterStatus.isClanLeader && isSectionOwnedByClan(section, characterStatus.character)) {
            // Chef de clan peut créer/éditer/supprimer des sous-sections
            if (permissionName === "section.create" ||
                permissionName === "section.edit" ||
                permissionName === "section.delete") {
              if (statusPermissions.canCreateSubsectionsInClan ||
                  statusPermissions.canEditSubsectionsInClan ||
                  statusPermissions.canDeleteSubsectionsInClan) {
                return true;
              }
            }

            // Chef de clan peut verrouiller/déverrouiller dans son clan
            if (permissionName === "section.lock" ||
                permissionName === "section.unlock" ||
                permissionName === "topic.lock" ||
                permissionName === "topic.unlock") {
              if (statusPermissions.canLockContentInClan) {
                return true;
              }
            }

            // Chef de clan peut épingler dans son clan
            if (permissionName === "section.pin" ||
                permissionName === "topic.pin") {
              if (statusPermissions.canPinContentInClan) {
                return true;
              }
            }
          }
        }
      }

      // 0d. Si pas de personnage vivant, refuser toute création/modification
      if (!characterStatus.hasAliveCharacter) {
        if (
          permissionName.includes(".create") ||
          permissionName.includes(".edit") ||
          permissionName.includes(".delete") ||
          permissionName.includes(".move") ||
          permissionName.includes(".lock") ||
          permissionName.includes(".unlock") ||
          permissionName.includes(".pin")
        ) {
          // Sauf si c'est son propre contenu (édition/suppression)
          if (authorUserId && authorUserId === user.id) {
            return (
              permissionName.includes(".edit") ||
              permissionName.includes(".delete")
            );
          }
          return false;
        }
      }

      // Vérifier les limites spécifiques au statut (pourra être implémenté plus tard)
      // Par exemple: vérifier le nombre de topics créés aujourd'hui vs maxTopicsPerDay
    }

    // 1. Vérifier les permissions spécifiques par topic
    if (topicId) {
      const topicPermission = await checkTopicPermission(
        user,
        permission.id,
        topicId
      );
      if (topicPermission !== null) {
        return topicPermission;
      }
    }

    // 2. Vérifier les permissions spécifiques par section
    if (sectionId) {
      const sectionPermission = await checkSectionPermission(
        user,
        permission.id,
        sectionId
      );
      if (sectionPermission !== null) {
        return sectionPermission;
      }
    }

    // 3. Vérifier les permissions globales du rôle
    const rolePermission = await RolePermission.findOne({
      where: {
        role: user.role,
        permission_id: permission.id,
      },
    });

    if (rolePermission) {
      // Si permission refusée explicitement, vérifier si l'utilisateur est l'auteur
      if (!rolePermission.granted && authorUserId && authorUserId === user.id) {
        // L'auteur peut toujours éditer/supprimer son contenu
        if (
          permissionName.includes(".edit") ||
          permissionName.includes(".delete")
        ) {
          return true;
        }
      }
      return rolePermission.granted;
    }

    // 4. Si l'utilisateur est l'auteur, donner les permissions d'édition/suppression
    if (authorUserId && authorUserId === user.id) {
      if (
        permissionName.includes(".edit") ||
        permissionName.includes(".delete")
      ) {
        return true;
      }
    }

    // Par défaut, refuser
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions:", error);
    return false;
  }
}

/**
 * Vérifie les permissions spécifiques pour un topic
 * @private
 */
async function checkTopicPermission(user, permissionId, topicId) {
  // Vérifier permission spécifique user
  const userTopicPerm = await TopicPermission.findOne({
    where: {
      topic_id: topicId,
      user_id: user.id,
      permission_id: permissionId,
    },
  });

  if (userTopicPerm) {
    return userTopicPerm.granted;
  }

  // Vérifier permission spécifique rôle
  const roleTopicPerm = await TopicPermission.findOne({
    where: {
      topic_id: topicId,
      role: user.role,
      permission_id: permissionId,
    },
  });

  if (roleTopicPerm) {
    return roleTopicPerm.granted;
  }

  return null; // Pas de permission spécifique trouvée
}

/**
 * Vérifie les permissions spécifiques pour une section (avec héritage)
 * @private
 */
async function checkSectionPermission(user, permissionId, sectionId) {
  // Récupérer la section et sa hiérarchie
  const section = await Section.findByPk(sectionId);
  if (!section) return null;

  const sectionIds = await getSectionHierarchy(sectionId);

  // Parcourir la hiérarchie de la section la plus spécifique à la plus générale
  for (const currentSectionId of sectionIds) {
    // Vérifier permission spécifique user
    const userSectionPerm = await SectionPermission.findOne({
      where: {
        section_id: currentSectionId,
        user_id: user.id,
        permission_id: permissionId,
      },
    });

    if (userSectionPerm) {
      return userSectionPerm.granted;
    }

    // Vérifier permission spécifique rôle
    const roleSectionPerm = await SectionPermission.findOne({
      where: {
        section_id: currentSectionId,
        role: user.role,
        permission_id: permissionId,
      },
    });

    if (roleSectionPerm) {
      // Si la permission est pour une section parente et n'hérite pas, ignorer
      if (
        currentSectionId !== sectionId &&
        !roleSectionPerm.inherit_to_subsections
      ) {
        continue;
      }
      return roleSectionPerm.granted;
    }
  }

  return null; // Pas de permission spécifique trouvée
}

/**
 * Récupère la hiérarchie complète d'une section (de la plus spécifique à la plus générale)
 * @private
 */
async function getSectionHierarchy(sectionId) {
  const hierarchy = [sectionId];
  let currentSection = await Section.findByPk(sectionId);

  while (currentSection && currentSection.parent_section_id) {
    hierarchy.push(currentSection.parent_section_id);
    currentSection = await Section.findByPk(currentSection.parent_section_id);
  }

  return hierarchy;
}

/**
 * Vérifie si l'utilisateur peut voir une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} sectionId - ID de la section
 * @returns {Promise<boolean>}
 */
export async function canViewSection(user, sectionId) {
  return hasPermission(user, "section.view", { sectionId });
}

/**
 * Vérifie si l'utilisateur peut créer une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} parentSectionId - ID de la section parente (optionnel)
 * @returns {Promise<boolean>}
 */
export async function canCreateSection(user, parentSectionId = null) {
  if (parentSectionId) {
    return hasPermission(user, "section.create", {
      sectionId: parentSectionId,
    });
  }
  return hasPermission(user, "section.create");
}

/**
 * Vérifie si l'utilisateur peut éditer une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} sectionId - ID de la section
 * @returns {Promise<boolean>}
 */
export async function canEditSection(user, sectionId) {
  return hasPermission(user, "section.edit", { sectionId });
}

/**
 * Vérifie si l'utilisateur peut supprimer une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} sectionId - ID de la section
 * @returns {Promise<boolean>}
 */
export async function canDeleteSection(user, sectionId) {
  return hasPermission(user, "section.delete", { sectionId });
}

/**
 * Vérifie si l'utilisateur peut verrouiller/déverrouiller une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} sectionId - ID de la section
 * @returns {Promise<boolean>}
 */
export async function canLockSection(user, sectionId) {
  const canLock = await hasPermission(user, "section.lock", { sectionId });
  const canUnlock = await hasPermission(user, "section.unlock", { sectionId });
  return canLock || canUnlock;
}

/**
 * Vérifie si l'utilisateur peut déplacer une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} sectionId - ID de la section à déplacer
 * @param {number} targetSectionId - ID de la section de destination
 * @returns {Promise<boolean>}
 */
export async function canMoveSection(user, sectionId, targetSectionId = null) {
  const canMove = await hasPermission(user, "section.move", { sectionId });
  if (!canMove) return false;

  // Vérifier que l'utilisateur peut créer dans la destination
  if (targetSectionId) {
    return canCreateSection(user, targetSectionId);
  }

  return true;
}

/**
 * Vérifie si l'utilisateur peut créer un topic dans une section
 * @param {Object} user - L'objet utilisateur
 * @param {number} sectionId - ID de la section
 * @returns {Promise<boolean>}
 */
export async function canCreateTopic(user, sectionId) {
  return hasPermission(user, "topic.create", { sectionId });
}

/**
 * Vérifie si l'utilisateur peut éditer un topic
 * @param {Object} user - L'objet utilisateur
 * @param {Object} topic - L'objet topic (avec author_user_id)
 * @returns {Promise<boolean>}
 */
export async function canEditTopic(user, topic) {
  return hasPermission(user, "topic.edit", {
    topicId: topic.id,
    sectionId: topic.section_id,
    authorUserId: topic.author_user_id,
  });
}

/**
 * Vérifie si l'utilisateur peut supprimer un topic
 * @param {Object} user - L'objet utilisateur
 * @param {Object} topic - L'objet topic (avec author_user_id)
 * @returns {Promise<boolean>}
 */
export async function canDeleteTopic(user, topic) {
  return hasPermission(user, "topic.delete", {
    topicId: topic.id,
    sectionId: topic.section_id,
    authorUserId: topic.author_user_id,
  });
}

/**
 * Vérifie si l'utilisateur peut verrouiller/déverrouiller un topic
 * @param {Object} user - L'objet utilisateur
 * @param {Object} topic - L'objet topic
 * @returns {Promise<boolean>}
 */
export async function canLockTopic(user, topic) {
  const canLock = await hasPermission(user, "topic.lock", {
    topicId: topic.id,
    sectionId: topic.section_id,
  });
  const canUnlock = await hasPermission(user, "topic.unlock", {
    topicId: topic.id,
    sectionId: topic.section_id,
  });
  return canLock || canUnlock;
}

/**
 * Vérifie si l'utilisateur peut déplacer un topic
 * @param {Object} user - L'objet utilisateur
 * @param {Object} topic - L'objet topic
 * @param {number} targetSectionId - ID de la section de destination
 * @returns {Promise<boolean>}
 */
export async function canMoveTopic(user, topic, targetSectionId) {
  const canMove = await hasPermission(user, "topic.move", {
    topicId: topic.id,
    sectionId: topic.section_id,
  });
  if (!canMove) return false;

  // Vérifier que l'utilisateur peut créer dans la destination
  return canCreateTopic(user, targetSectionId);
}

/**
 * Vérifie si l'utilisateur peut créer un post dans un topic
 * @param {Object} user - L'objet utilisateur
 * @param {Object} topic - L'objet topic
 * @returns {Promise<boolean>}
 */
export async function canCreatePost(user, topic) {
  return hasPermission(user, "post.create", {
    topicId: topic.id,
    sectionId: topic.section_id,
  });
}

/**
 * Vérifie si l'utilisateur peut éditer un post
 * @param {Object} user - L'objet utilisateur
 * @param {Object} post - L'objet post (avec author_user_id)
 * @param {Object} topic - L'objet topic parent
 * @returns {Promise<boolean>}
 */
export async function canEditPost(user, post, topic) {
  return hasPermission(user, "post.edit", {
    topicId: topic.id,
    sectionId: topic.section_id,
    authorUserId: post.author_user_id,
  });
}

/**
 * Vérifie si l'utilisateur peut supprimer un post
 * @param {Object} user - L'objet utilisateur
 * @param {Object} post - L'objet post (avec author_user_id)
 * @param {Object} topic - L'objet topic parent
 * @returns {Promise<boolean>}
 */
export async function canDeletePost(user, post, topic) {
  return hasPermission(user, "post.delete", {
    topicId: topic.id,
    sectionId: topic.section_id,
    authorUserId: post.author_user_id,
  });
}

export default {
  hasPermission,
  canViewSection,
  canCreateSection,
  canEditSection,
  canDeleteSection,
  canLockSection,
  canMoveSection,
  canCreateTopic,
  canEditTopic,
  canDeleteTopic,
  canLockTopic,
  canMoveTopic,
  canCreatePost,
  canEditPost,
  canDeletePost,
};
