import { Topic, Post } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Vérifie et met à jour les acceptations CGU et règlement du forum d'un utilisateur
 * en comparant les dates d'acceptation avec les dernières mises à jour des posts correspondants
 *
 * @param {Object} user - Instance Sequelize de l'utilisateur
 * @returns {Promise<Object>} - { termsUpdated: boolean, forumRulesUpdated: boolean }
 */
export const checkAndUpdateAcceptances = async (user) => {
  try {
    let termsUpdated = false;
    let forumRulesUpdated = false;

    // Vérifier les CGU (topic avec slug 'cgu')
    if (user.terms_accepted && user.terms_accepted_at) {
      const cguTopic = await Topic.findOne({
        where: {
          slug: "cgu",
          is_active: true
        },
        include: [
          {
            model: Post,
            as: "posts",
            where: { is_active: true },
            attributes: ["id", "content", "updated_at"],
            required: false,
          },
        ],
        order: [[{ model: Post, as: "posts" }, "updated_at", "DESC"]],
      });

      if (cguTopic && cguTopic.posts && cguTopic.posts.length > 0) {
        // Sequelize retourne les champs dans le dataValues avec leurs noms de colonnes SQL
        const post = cguTopic.posts[0];
        const postUpdateDate = post.dataValues?.updated_at || post.updated_at || post.updatedAt;

        if (!postUpdateDate) {
          console.warn("Impossible de récupérer la date de mise à jour du post CGU");
          return { termsUpdated, forumRulesUpdated };
        }

        const lastCguUpdate = new Date(postUpdateDate);
        const userTermsAcceptedDate = new Date(user.terms_accepted_at);

        // Si le post des CGU a été mis à jour après l'acceptation de l'utilisateur
        if (lastCguUpdate > userTermsAcceptedDate) {
          await user.update({
            terms_accepted: false,
            terms_accepted_at: null,
          });
          termsUpdated = true;
        }
      }
    }

    // Vérifier le règlement du forum (topic avec slug 'reglement')
    if (user.forum_rules_accepted && user.forum_rules_accepted_at) {
      const reglementTopic = await Topic.findOne({
        where: {
          slug: "reglement",
          is_active: true
        },
        include: [
          {
            model: Post,
            as: "posts",
            where: { is_active: true },
            attributes: ["id", "content", "updated_at"],
            required: false,
          },
        ],
        order: [[{ model: Post, as: "posts" }, "updated_at", "DESC"]],
      });

      if (reglementTopic && reglementTopic.posts && reglementTopic.posts.length > 0) {
        // Sequelize retourne les champs dans le dataValues avec leurs noms de colonnes SQL
        const post = reglementTopic.posts[0];
        const postUpdateDate = post.dataValues?.updated_at || post.updated_at || post.updatedAt;

        if (!postUpdateDate) {
          console.warn("Impossible de récupérer la date de mise à jour du post Règlement");
          return { termsUpdated, forumRulesUpdated };
        }

        const lastReglementUpdate = new Date(postUpdateDate);
        const userForumRulesAcceptedDate = new Date(user.forum_rules_accepted_at);

        // Si le post du règlement a été mis à jour après l'acceptation de l'utilisateur
        if (lastReglementUpdate > userForumRulesAcceptedDate) {
          await user.update({
            forum_rules_accepted: false,
            forum_rules_accepted_at: null,
          });
          forumRulesUpdated = true;
        }
      }
    }

    return {
      termsUpdated,
      forumRulesUpdated,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification des acceptations:", error);
    throw error;
  }
};

/**
 * Récupère la date de dernière mise à jour du post le plus récent pour un topic donné
 *
 * @param {string} slug - Slug du topic (ex: 'cgu', 'reglement')
 * @returns {Promise<Date|null>} - Date de dernière mise à jour ou null si non trouvé
 */
export const getLastUpdateDateForTopic = async (slug) => {
  try {
    const topic = await Topic.findOne({
      where: {
        slug,
        is_active: true
      },
      include: [
        {
          model: Post,
          as: "posts",
          where: { is_active: true },
          attributes: ["id", "updated_at"],
          required: false,
        },
      ],
      order: [[{ model: Post, as: "posts" }, "updated_at", "DESC"]],
    });

    if (topic && topic.posts && topic.posts.length > 0) {
      const post = topic.posts[0];
      const postUpdateDate = post.dataValues?.updated_at || post.updated_at || post.updatedAt;
      return postUpdateDate ? new Date(postUpdateDate) : null;
    }

    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la date pour le topic ${slug}:`, error);
    return null;
  }
};
