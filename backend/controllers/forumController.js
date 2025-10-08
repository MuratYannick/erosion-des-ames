import { Category, Section, Topic, Post, User, Character } from "../models/index.js";

// Récupérer toutes les catégories avec leurs sections
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      include: [
        {
          model: Section,
          as: "sections",
          where: { is_active: true },
          required: false,
          include: [
            {
              model: Section,
              as: "subsections",
              where: { is_active: true },
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

    const category = await Category.findOne({
      where: { slug, is_active: true },
      include: [
        {
          model: Section,
          as: "sections",
          where: { is_active: true },
          required: false,
          include: [
            {
              model: Section,
              as: "subsections",
              where: { is_active: true },
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

    const section = await Section.findOne({
      where: { slug, is_active: true },
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
