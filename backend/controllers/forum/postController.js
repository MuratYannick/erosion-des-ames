import { Topic, Post, User, Character } from "../../models/index.js";
import sequelize from "../../config/database.js";

// Créer un nouveau post (réponse à un topic)
export const createPost = async (req, res) => {
  try {
    const { content, topic_id, author_character_id } = req.body;
    const userId = req.user.id; // Fourni par le middleware d'authentification

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le contenu du message est requis",
      });
    }

    if (!topic_id) {
      return res.status(400).json({
        success: false,
        message: "Le topic est requis",
      });
    }

    // Vérifier que le topic existe et n'est pas verrouillé
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    if (topic.is_locked) {
      return res.status(403).json({
        success: false,
        message: "Ce topic est verrouillé, vous ne pouvez pas y répondre",
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

    // Créer le post
    const post = await Post.create({
      content: content.trim(),
      topic_id,
      author_user_id: userId,
      author_character_id: author_character_id || null,
      author_name: authorName,
      is_edited: false,
      is_active: true,
    });

    // Mettre à jour le timestamp du topic
    await topic.update({ updated_at: new Date() });

    res.status(201).json({
      success: true,
      message: "Réponse ajoutée avec succès",
      data: post,
    });
  } catch (error) {
    console.error("Erreur createPost:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la réponse",
      error: error.message,
    });
  }
};

// Mettre à jour un post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le contenu du message est requis",
      });
    }

    // Récupérer le post
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Message non trouvé",
      });
    }

    // Mettre à jour le post
    await post.update({
      content: content.trim(),
      is_edited: true,
      edited_at: new Date(),
    });

    res.json({
      success: true,
      message: "Message mis à jour avec succès",
      data: post,
    });
  } catch (error) {
    console.error("Erreur updatePost:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du message",
      error: error.message,
    });
  }
};

// Supprimer un post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le post
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Topic,
          as: "topic",
          attributes: ["id"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Message non trouvé",
      });
    }

    // Compter les posts actifs dans le topic
    const activePosts = await Post.count({
      where: { topic_id: post.topic_id, is_active: true },
    });

    // Si c'est le seul post du topic, supprimer aussi le topic
    if (activePosts === 1) {
      await sequelize.transaction(async (t) => {
        // Supprimer le post (soft delete via is_active)
        await post.update({ is_active: false }, { transaction: t });

        // Supprimer le topic (soft delete via is_active)
        const topic = await Topic.findByPk(post.topic_id);
        if (topic) {
          await topic.update({ is_active: false }, { transaction: t });
        }
      });

      return res.json({
        success: true,
        message: "Message supprimé avec succès. Le topic a également été supprimé car c'était le dernier message.",
        topicDeleted: true,
      });
    }

    // Supprimer le post (soft delete via is_active)
    await post.update({ is_active: false });

    res.json({
      success: true,
      message: "Message supprimé avec succès",
      topicDeleted: false,
    });
  } catch (error) {
    console.error("Erreur deletePost:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du message",
      error: error.message,
    });
  }
};

// Déplacer un post vers un autre topic
export const movePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_topic_id } = req.body;

    // Validation
    if (!new_topic_id) {
      return res.status(400).json({
        success: false,
        message: "Le nouveau topic est requis",
      });
    }

    // Récupérer le post
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Message non trouvé",
      });
    }

    // Vérifier qu'on ne déplace pas vers le même topic
    if (post.topic_id === new_topic_id) {
      return res.status(400).json({
        success: false,
        message: "Le message est déjà dans ce topic",
      });
    }

    // Vérifier que le nouveau topic existe et n'est pas verrouillé
    const newTopic = await Topic.findByPk(new_topic_id);
    if (!newTopic) {
      return res.status(404).json({
        success: false,
        message: "Topic de destination non trouvé",
      });
    }

    if (newTopic.is_locked) {
      return res.status(403).json({
        success: false,
        message: "Le topic de destination est verrouillé",
      });
    }

    // Compter les posts actifs dans le topic actuel
    const activePosts = await Post.count({
      where: { topic_id: post.topic_id, is_active: true },
    });

    // Si c'est le seul post du topic, déplacer et supprimer l'ancien topic
    if (activePosts === 1) {
      await sequelize.transaction(async (t) => {
        // Déplacer le post
        const oldTopicId = post.topic_id;
        await post.update({ topic_id: new_topic_id }, { transaction: t });

        // Supprimer l'ancien topic (soft delete via is_active)
        const oldTopic = await Topic.findByPk(oldTopicId);
        if (oldTopic) {
          await oldTopic.update({ is_active: false }, { transaction: t });
        }

        // Mettre à jour le timestamp du nouveau topic
        await newTopic.update({ updated_at: new Date() }, { transaction: t });
      });

      return res.json({
        success: true,
        message: "Message déplacé avec succès. Le topic d'origine a été supprimé car c'était le dernier message.",
        data: post,
        oldTopicDeleted: true,
      });
    }

    // Déplacer le post normalement
    const oldTopicId = post.topic_id;
    await post.update({ topic_id: new_topic_id });

    // Mettre à jour le timestamp des deux topics
    await Topic.update(
      { updated_at: new Date() },
      { where: { id: [oldTopicId, new_topic_id] } }
    );

    res.json({
      success: true,
      message: "Message déplacé avec succès",
      data: post,
      oldTopicDeleted: false,
    });
  } catch (error) {
    console.error("Erreur movePost:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du déplacement du message",
      error: error.message,
    });
  }
};
