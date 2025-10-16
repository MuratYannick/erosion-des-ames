import { Category, Section } from "../../models/index.js";

// Récupérer toutes les catégories avec leurs sections
export const getCategories = async (req, res) => {
  try {
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
