import { Section, Topic, Post, User, Character, Category } from "../../models/index.js";
import sequelize from "../../config/database.js";

// Récupérer un topic avec ses posts
export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    // Déterminer si c'est un ID numérique ou un slug
    const isNumeric = /^\d+$/.test(id);
    const whereClause = isNumeric
      ? { id, is_active: true }
      : { slug: id, is_active: true };

    const topic = await Topic.findOne({
      where: whereClause,
      include: [
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Category,
              as: "category",
            },
          ],
        },
        {
          model: User,
          as: "authorUser",
          attributes: ["id", "username", "created_at"],
        },
        {
          model: Character,
          as: "authorCharacter",
          attributes: ["id", "name", "level"],
        },
        {
          model: Post,
          as: "posts",
          where: { is_active: true },
          required: false,
          order: [["created_at", "ASC"]],
          include: [
            {
              model: User,
              as: "authorUser",
              attributes: ["id", "username", "created_at"],
            },
            {
              model: Character,
              as: "authorCharacter",
              attributes: ["id", "name", "level"],
            },
          ],
        },
      ],
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Incrémenter le nombre de vues
    await topic.increment("views_count");

    res.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    console.error("Erreur getTopicById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du topic",
      error: error.message,
    });
  }
};

// Créer un nouveau topic
export const createTopic = async (req, res) => {
  try {
    const { title, content, section_id, author_character_id } = req.body;
    const userId = req.user.id; // Fourni par le middleware d'authentification

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le titre du topic est requis",
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le contenu du premier message est requis",
      });
    }

    if (!section_id) {
      return res.status(400).json({
        success: false,
        message: "La section est requise",
      });
    }

    // Vérifier que la section existe et n'est pas verrouillée
    const section = await Section.findByPk(section_id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    if (section.is_locked) {
      return res.status(403).json({
        success: false,
        message: "Cette section est verrouillée, vous ne pouvez pas y créer de topic",
      });
    }

    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Si un personnage est spécifié, vérifier qu'il appartient à l'utilisateur
    let character = null;
    if (author_character_id) {
      character = await Character.findOne({
        where: { id: author_character_id, user_id: userId },
      });
      if (!character) {
        return res.status(403).json({
          success: false,
          message: "Ce personnage ne vous appartient pas",
        });
      }
    }

    // Déterminer le nom de l'auteur
    const authorName = character ? character.name : user.username;

    // Générer le slug à partir du titre
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Vérifier que le slug est unique (ajouter un suffixe si nécessaire)
    let uniqueSlug = slug;
    let counter = 1;
    while (await Topic.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Créer le topic et le premier post dans une transaction
    const result = await sequelize.transaction(async (t) => {
      // Créer le topic
      const topic = await Topic.create(
        {
          title: title.trim(),
          slug: uniqueSlug,
          section_id,
          author_user_id: userId,
          author_character_id: author_character_id || null,
          author_name: authorName,
          is_pinned: false,
          is_locked: false,
          is_active: true,
          views_count: 0,
        },
        { transaction: t }
      );

      // Créer le premier post
      const post = await Post.create(
        {
          content: content.trim(),
          topic_id: topic.id,
          author_user_id: userId,
          author_character_id: author_character_id || null,
          author_name: authorName,
          is_edited: false,
          is_active: true,
        },
        { transaction: t }
      );

      return { topic, post };
    });

    res.status(201).json({
      success: true,
      message: "Topic créé avec succès",
      data: result.topic,
    });
  } catch (error) {
    console.error("Erreur createTopic:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du topic",
      error: error.message,
    });
  }
};

// Mettre à jour un topic
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_locked } = req.body;

    // Récupérer le topic
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Si le titre change, générer un nouveau slug
    let slug = topic.slug;
    if (title && title.trim() !== topic.title) {
      slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Vérifier que le nouveau slug est unique (ajouter un suffixe si nécessaire)
      let uniqueSlug = slug;
      let counter = 1;
      while (await Topic.findOne({
        where: {
          slug: uniqueSlug,
          id: { [sequelize.Sequelize.Op.ne]: id }
        }
      })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    // Mettre à jour le topic
    await topic.update({
      title: title ? title.trim() : topic.title,
      slug,
      is_locked: is_locked !== undefined ? is_locked : topic.is_locked,
    });

    res.json({
      success: true,
      message: "Topic mis à jour avec succès",
      data: topic,
    });
  } catch (error) {
    console.error("Erreur updateTopic:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du topic",
      error: error.message,
    });
  }
};

// Supprimer un topic
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le topic avec ses posts
    const topic = await Topic.findByPk(id, {
      include: [
        {
          model: Post,
          as: "posts",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Supprimer le topic et tous ses posts (soft delete via is_active)
    await sequelize.transaction(async (t) => {
      // Désactiver tous les posts
      if (topic.posts && topic.posts.length > 0) {
        await Post.update(
          { is_active: false },
          {
            where: { topic_id: id, is_active: true },
            transaction: t,
          }
        );
      }

      // Désactiver le topic
      await topic.update({ is_active: false }, { transaction: t });
    });

    res.json({
      success: true,
      message: "Topic supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteTopic:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du topic",
      error: error.message,
    });
  }
};

// Déplacer un topic vers une nouvelle section
export const moveTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_section_id } = req.body;

    // Validation
    if (!new_section_id) {
      return res.status(400).json({
        success: false,
        message: "La nouvelle section est requise",
      });
    }

    // Récupérer le topic
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Vérifier que la nouvelle section existe et n'est pas verrouillée
    const newSection = await Section.findByPk(new_section_id);
    if (!newSection) {
      return res.status(404).json({
        success: false,
        message: "Section de destination non trouvée",
      });
    }

    if (newSection.is_locked) {
      return res.status(403).json({
        success: false,
        message: "La section de destination est verrouillée",
      });
    }

    // Déplacer le topic
    await topic.update({ section_id: new_section_id });

    res.json({
      success: true,
      message: "Topic déplacé avec succès",
      data: topic,
    });
  } catch (error) {
    console.error("Erreur moveTopic:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du déplacement du topic",
      error: error.message,
    });
  }
};

// Épingler/désépingler un topic
export const togglePinTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le topic
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Basculer l'état épinglé
    await topic.update({ is_pinned: !topic.is_pinned });

    res.json({
      success: true,
      message: topic.is_pinned ? "Topic épinglé avec succès" : "Topic désépinglé avec succès",
      data: topic,
    });
  } catch (error) {
    console.error("Erreur togglePinTopic:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'épinglage/désépinglage du topic",
      error: error.message,
    });
  }
};

// Verrouiller/déverrouiller un topic
export const toggleLockTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le topic
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Basculer l'état verrouillé
    await topic.update({ is_locked: !topic.is_locked });

    res.json({
      success: true,
      message: topic.is_locked ? "Topic verrouillé avec succès" : "Topic déverrouillé avec succès",
      data: topic,
    });
  } catch (error) {
    console.error("Erreur toggleLockTopic:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du verrouillage/déverrouillage du topic",
      error: error.message,
    });
  }
};
