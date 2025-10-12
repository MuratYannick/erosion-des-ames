import { Category, Section, Topic, Post, User, Character, Faction, Clan } from "../models/index.js";
import sequelize from "../config/database.js";
import { filterSectionsByAccess, canAccessSection, getCategoryFromSection } from "../utils/forumPermissions.js";

// Récupérer toutes les catégories avec leurs sections
export const getCategories = async (req, res) => {
  try {
    const user = req.user || null; // req.user existe si l'utilisateur est connecté

    const categories = await Category.findAll({
      where: { is_active: true },
      include: [
        {
          model: Section,
          as: "sections",
          where: {
            is_active: true,
            parent_section_id: null // Ne récupérer que les sections de niveau 1
          },
          required: false,
          include: [
            {
              model: Section,
              as: "subsections",
              where: { is_active: true },
              required: false,
            },
            {
              model: Faction,
              as: "visibleByFaction",
              required: false,
            },
            {
              model: Clan,
              as: "visibleByClan",
              required: false,
            },
          ],
        },
      ],
      order: [
        ["order", "ASC"],
        [{ model: Section, as: "sections" }, "order", "ASC"],
      ],
    });

    // Filtrer les sections selon les permissions de l'utilisateur
    for (const category of categories) {
      if (category.sections && category.sections.length > 0) {
        category.sections = await filterSectionsByAccess(
          category.sections,
          user,
          category
        );
      }
    }

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Erreur getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories",
      error: error.message,
    });
  }
};

// Récupérer une catégorie avec ses sections
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = req.user || null;

    const category = await Category.findOne({
      where: { slug, is_active: true },
      include: [
        {
          model: Section,
          as: "sections",
          where: {
            is_active: true,
            parent_section_id: null // Ne récupérer que les sections de niveau 1
          },
          required: false,
          include: [
            {
              model: Section,
              as: "subsections",
              where: { is_active: true },
              required: false,
            },
            {
              model: Faction,
              as: "visibleByFaction",
              required: false,
            },
            {
              model: Clan,
              as: "visibleByClan",
              required: false,
            },
          ],
        },
      ],
      order: [[{ model: Section, as: "sections" }, "order", "ASC"]],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    // Filtrer les sections selon les permissions de l'utilisateur
    if (category.sections && category.sections.length > 0) {
      category.sections = await filterSectionsByAccess(
        category.sections,
        user,
        category
      );
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Erreur getCategoryBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la catégorie",
      error: error.message,
    });
  }
};

// Récupérer toutes les sections (avec filtre optionnel par catégorie)
export const getSections = async (req, res) => {
  try {
    const { category_id } = req.query;
    const where = { is_active: true };

    if (category_id) {
      where.category_id = category_id;
    }

    const sections = await Section.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: Section,
          as: "subsections",
          where: { is_active: true },
          required: false,
        },
        {
          model: Faction,
          as: "visibleByFaction",
          required: false,
        },
        {
          model: Clan,
          as: "visibleByClan",
          required: false,
        },
      ],
      order: [["order", "ASC"]],
    });

    res.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("Erreur getSections:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des sections",
      error: error.message,
    });
  }
};

// Récupérer une section avec ses topics
export const getSectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = req.user || null;

    const section = await Section.findOne({
      where: { slug, is_active: true },
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: Section,
          as: "parentSection",
          include: [
            {
              model: Section,
              as: "parentSection",
              include: [
                {
                  model: Category,
                  as: "category",
                },
              ],
            },
            {
              model: Category,
              as: "category",
            },
          ],
        },
        {
          model: Section,
          as: "subsections",
          where: { is_active: true },
          required: false,
        },
        {
          model: Faction,
          as: "visibleByFaction",
          required: false,
        },
        {
          model: Clan,
          as: "visibleByClan",
          required: false,
        },
        {
          model: Topic,
          as: "topics",
          where: { is_active: true },
          required: false,
          limit: 20,
          order: [["is_pinned", "DESC"], ["updated_at", "DESC"]],
          include: [
            {
              model: User,
              as: "authorUser",
              attributes: ["id", "username"],
            },
            {
              model: Character,
              as: "authorCharacter",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Vérifier si l'utilisateur peut accéder à cette section
    const category = await getCategoryFromSection(section);
    if (category) {
      const hasAccess = await canAccessSection(user, section, category);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à cette section",
        });
      }
    }

    // Filtrer les sous-sections selon les permissions
    if (category && section.subsections && section.subsections.length > 0) {
      section.subsections = await filterSectionsByAccess(
        section.subsections,
        user,
        category
      );
    }

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Erreur getSectionBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la section",
      error: error.message,
    });
  }
};

// Récupérer un topic avec ses posts
export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user || null;

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
            {
              model: Section,
              as: "parentSection",
              include: [
                {
                  model: Section,
                  as: "parentSection",
                  include: [
                    {
                      model: Category,
                      as: "category",
                    },
                  ],
                },
                {
                  model: Category,
                  as: "category",
                },
              ],
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

    // Vérifier si l'utilisateur peut accéder à la section du topic
    if (topic.section) {
      const category = await getCategoryFromSection(topic.section);
      if (category) {
        const hasAccess = await canAccessSection(user, topic.section, category);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: "Vous n'avez pas accès à ce topic",
          });
        }
      }
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

// Déplacer un topic vers une nouvelle section
export const moveTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_section_id } = req.body;
    const userId = req.user.id;

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

    // Vérifier que l'utilisateur est l'auteur du topic
    if (topic.author_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à déplacer ce topic",
      });
    }

    // Vérifier que la nouvelle section existe
    const newSection = await Section.findByPk(new_section_id);
    if (!newSection) {
      return res.status(404).json({
        success: false,
        message: "Section de destination non trouvée",
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

// Mettre à jour un topic
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_locked } = req.body;
    const userId = req.user.id;

    // Récupérer le topic
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Vérifier que l'utilisateur est l'auteur du topic
    if (topic.author_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce topic",
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
    const userId = req.user.id;

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

    // Vérifier que l'utilisateur est l'auteur du topic
    if (topic.author_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce topic",
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
    const topic = await Topic.findByPk(topic_id, {
      include: [
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Category,
              as: "category",
            },
            {
              model: Section,
              as: "parentSection",
              include: [
                {
                  model: Section,
                  as: "parentSection",
                  include: [
                    {
                      model: Category,
                      as: "category",
                    },
                  ],
                },
                {
                  model: Category,
                  as: "category",
                },
              ],
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

    if (topic.is_locked) {
      return res.status(403).json({
        success: false,
        message: "Ce topic est verrouillé, vous ne pouvez pas y répondre",
      });
    }

    // Vérifier si l'utilisateur peut accéder à la section du topic
    if (topic.section) {
      const category = await getCategoryFromSection(topic.section);
      if (category) {
        const user = req.user;
        const hasAccess = await canAccessSection(user, topic.section, category);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: "Vous n'avez pas accès à ce topic",
          });
        }
      }
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

// Créer un nouveau topic
export const createTopic = async (req, res) => {
  try {
    const { title, content, section_id, author_character_id } = req.body;
    const userId = req.user.id; // Fourni par le middleware d'authentification
    const user = req.user;

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

    // Vérifier que la section existe
    const section = await Section.findByPk(section_id, {
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: Section,
          as: "parentSection",
          include: [
            {
              model: Section,
              as: "parentSection",
              include: [
                {
                  model: Category,
                  as: "category",
                },
              ],
            },
            {
              model: Category,
              as: "category",
            },
          ],
        },
      ],
    });
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Vérifier si l'utilisateur peut accéder à cette section
    const category = await getCategoryFromSection(section);
    if (category) {
      const hasAccess = await canAccessSection(user, section, category);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à cette section",
        });
      }
    }

    // Récupérer les détails complets de l'utilisateur
    const fullUser = await User.findByPk(userId);
    if (!fullUser) {
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
    const authorName = character ? character.name : fullUser.username;

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

// Déplacer une section vers une nouvelle catégorie ou section parente
export const moveSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_category_id, new_parent_section_id } = req.body;

    // Récupérer la section
    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Vérifier qu'au moins une destination est fournie
    if (!new_category_id && !new_parent_section_id) {
      return res.status(400).json({
        success: false,
        message: "Vous devez spécifier une catégorie ou une section parente",
      });
    }

    // Si nouvelle catégorie, vérifier qu'elle existe
    if (new_category_id) {
      const category = await Category.findByPk(new_category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }
    }

    // Si nouvelle section parente, vérifier qu'elle existe et éviter les boucles
    if (new_parent_section_id) {
      const parentSection = await Section.findByPk(new_parent_section_id);
      if (!parentSection) {
        return res.status(404).json({
          success: false,
          message: "Section parente non trouvée",
        });
      }

      // Empêcher de déplacer une section vers elle-même ou ses propres sous-sections
      if (new_parent_section_id === id) {
        return res.status(400).json({
          success: false,
          message: "Une section ne peut pas être sa propre parente",
        });
      }

      // Vérifier que la section parente n'est pas une sous-section de la section à déplacer
      let checkParent = parentSection;
      while (checkParent.parent_section_id) {
        if (checkParent.parent_section_id === id) {
          return res.status(400).json({
            success: false,
            message: "Vous ne pouvez pas déplacer une section vers l'une de ses sous-sections",
          });
        }
        checkParent = await Section.findByPk(checkParent.parent_section_id);
        if (!checkParent) break;
      }
    }

    // Déplacer la section
    await section.update({
      category_id: new_category_id || null,
      parent_section_id: new_parent_section_id || null,
    });

    res.json({
      success: true,
      message: "Section déplacée avec succès",
      data: section,
    });
  } catch (error) {
    console.error("Erreur moveSection:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du déplacement de la section",
      error: error.message,
    });
  }
};

// Mettre à jour une section
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, order, visible_by_faction_id, visible_by_clan_id } = req.body;

    // Récupérer la section
    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Si le nom change, générer un nouveau slug
    let slug = section.slug;
    if (name && name.trim() !== section.name) {
      slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Vérifier que le nouveau slug est unique
      const existingSection = await Section.findOne({
        where: { slug, id: { [sequelize.Sequelize.Op.ne]: id } }
      });
      if (existingSection) {
        return res.status(400).json({
          success: false,
          message: "Une section avec ce nom existe déjà",
        });
      }
    }

    // Mettre à jour la section
    await section.update({
      name: name ? name.trim() : section.name,
      slug,
      description: description !== undefined ? description?.trim() || null : section.description,
      order: order !== undefined ? order : section.order,
      visible_by_faction_id: visible_by_faction_id !== undefined ? visible_by_faction_id : section.visible_by_faction_id,
      visible_by_clan_id: visible_by_clan_id !== undefined ? visible_by_clan_id : section.visible_by_clan_id,
    });

    res.json({
      success: true,
      message: "Section mise à jour avec succès",
      data: section,
    });
  } catch (error) {
    console.error("Erreur updateSection:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la section",
      error: error.message,
    });
  }
};

// Supprimer une section
export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la section
    const section = await Section.findByPk(id, {
      include: [
        {
          model: Section,
          as: "subsections",
          where: { is_active: true },
          required: false,
        },
        {
          model: Topic,
          as: "topics",
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Vérifier qu'il n'y a pas de sous-sections ou de topics actifs
    if (section.subsections && section.subsections.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer cette section : elle contient des sous-sections",
        hasSubsections: true,
        subsectionsCount: section.subsections.length,
      });
    }

    if (section.topics && section.topics.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer cette section : elle contient des topics",
        hasTopics: true,
        topicsCount: section.topics.length,
      });
    }

    // Supprimer la section (soft delete via is_active)
    await section.update({ is_active: false });

    res.json({
      success: true,
      message: "Section supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteSection:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la section",
      error: error.message,
    });
  }
};

// Créer une nouvelle section
export const createSection = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      parent_section_id,
      order,
      visible_by_faction_id,
      visible_by_clan_id,
    } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le nom de la section est requis",
      });
    }

    // Vérifier qu'au moins category_id ou parent_section_id est fourni
    if (!category_id && !parent_section_id) {
      return res.status(400).json({
        success: false,
        message: "La section doit appartenir à une catégorie ou à une section parente",
      });
    }

    // Générer le slug à partir du nom
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Vérifier que le slug est unique
    const existingSection = await Section.findOne({ where: { slug } });
    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: "Une section avec ce nom existe déjà",
      });
    }

    // Si category_id est fourni, vérifier qu'elle existe
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }
    }

    // Variables pour la visibilité héritée
    let inheritedFactionId = null;
    let inheritedClanId = null;

    // Si parent_section_id est fourni, vérifier qu'elle existe et hériter de la visibilité
    if (parent_section_id) {
      const parentSection = await Section.findByPk(parent_section_id);
      if (!parentSection) {
        return res.status(404).json({
          success: false,
          message: "Section parente non trouvée",
        });
      }

      // Hériter de la visibilité de la section parente si non explicitement définie
      inheritedFactionId = parentSection.visible_by_faction_id;
      inheritedClanId = parentSection.visible_by_clan_id;
    }

    // Utiliser la visibilité explicite du body, sinon celle héritée, sinon null
    const finalFactionId =
      visible_by_faction_id !== undefined
        ? visible_by_faction_id
        : inheritedFactionId;
    const finalClanId =
      visible_by_clan_id !== undefined ? visible_by_clan_id : inheritedClanId;

    // Créer la section
    const section = await Section.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : null,
      category_id: category_id || null,
      parent_section_id: parent_section_id || null,
      order: order || 0,
      is_active: true,
      visible_by_faction_id: finalFactionId,
      visible_by_clan_id: finalClanId,
    });

    res.status(201).json({
      success: true,
      message: "Section créée avec succès",
      data: section,
    });
  } catch (error) {
    console.error("Erreur createSection:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la section",
      error: error.message,
    });
  }
};
