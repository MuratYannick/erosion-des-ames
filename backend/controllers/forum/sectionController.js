import { Category, Section, Topic, User, Character, Faction, Clan } from "../../models/index.js";
import sequelize from "../../config/database.js";

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

// Créer une nouvelle section
export const createSection = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      parent_section_id,
      order,
      faction_id,
      clan_id,
      is_public
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

    // Vérifier qu'aucune section active avec le même nom n'existe déjà pour le même parent
    const whereCondition = {
      name: name.trim(),
      is_active: true,
    };

    // Si la section a un parent direct (section)
    if (parent_section_id) {
      whereCondition.parent_section_id = parent_section_id;
    }
    // Si la section est directement sous une catégorie (pas de parent section)
    else if (category_id) {
      whereCondition.category_id = category_id;
      whereCondition.parent_section_id = null;
    }

    const existingSectionWithSameName = await Section.findOne({ where: whereCondition });
    if (existingSectionWithSameName) {
      return res.status(400).json({
        success: false,
        message: "Une section avec ce nom existe déjà au même niveau",
      });
    }

    // Générer le slug à partir du nom
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Vérifier que le slug est unique (ajouter un suffixe si nécessaire)
    let uniqueSlug = slug;
    let counter = 1;
    while (await Section.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
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

    // Récupérer les valeurs de la section parente pour l'héritage
    let inheritedFactionId = faction_id !== undefined ? faction_id : null;
    let inheritedClanId = clan_id !== undefined ? clan_id : null;
    let inheritedIsPublic = is_public !== undefined ? is_public : true;

    if (parent_section_id) {
      const parentSection = await Section.findByPk(parent_section_id);
      if (!parentSection) {
        return res.status(404).json({
          success: false,
          message: "Section parente non trouvée",
        });
      }

      // Vérifier que la section parente n'est pas verrouillée
      if (parentSection.is_locked) {
        return res.status(403).json({
          success: false,
          message: "La section parente est verrouillée, vous ne pouvez pas y créer de sous-section",
        });
      }

      // Hériter des valeurs de la section parent si non spécifiées
      if (faction_id === undefined) {
        inheritedFactionId = parentSection.faction_id;
      }
      if (clan_id === undefined) {
        inheritedClanId = parentSection.clan_id;
      }
      if (is_public === undefined) {
        inheritedIsPublic = parentSection.is_public;
      }
    }

    // Vérifier que la faction existe si spécifiée
    if (inheritedFactionId) {
      const faction = await Faction.findByPk(inheritedFactionId);
      if (!faction) {
        return res.status(404).json({
          success: false,
          message: "Faction non trouvée",
        });
      }
    }

    // Vérifier que le clan existe si spécifié
    if (inheritedClanId) {
      const clan = await Clan.findByPk(inheritedClanId);
      if (!clan) {
        return res.status(404).json({
          success: false,
          message: "Clan non trouvé",
        });
      }
    }

    // Créer la section
    const section = await Section.create({
      name: name.trim(),
      slug: uniqueSlug,
      description: description ? description.trim() : null,
      category_id: category_id || null,
      parent_section_id: parent_section_id || null,
      faction_id: inheritedFactionId,
      clan_id: inheritedClanId,
      is_public: inheritedIsPublic,
      order: order || 0,
      is_active: true,
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

// Mettre à jour une section
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, order, faction_id, clan_id, is_public } = req.body;

    // Récupérer la section
    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Si le nom change, vérifier qu'aucune section active avec ce nom n'existe au même niveau
    if (name && name.trim() !== section.name) {
      const whereCondition = {
        name: name.trim(),
        is_active: true,
        id: { [sequelize.Sequelize.Op.ne]: id }
      };

      // Si la section a un parent direct (section)
      if (section.parent_section_id) {
        whereCondition.parent_section_id = section.parent_section_id;
      }
      // Si la section est directement sous une catégorie (pas de parent section)
      else if (section.category_id) {
        whereCondition.category_id = section.category_id;
        whereCondition.parent_section_id = null;
      }

      const existingSectionWithSameName = await Section.findOne({ where: whereCondition });
      if (existingSectionWithSameName) {
        return res.status(400).json({
          success: false,
          message: "Une section avec ce nom existe déjà au même niveau",
        });
      }
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

      // Vérifier que le nouveau slug est unique (ajouter un suffixe si nécessaire)
      let uniqueSlug = slug;
      let counter = 1;
      while (await Section.findOne({
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

    // Vérifier que la faction existe si spécifiée
    if (faction_id !== undefined && faction_id !== null) {
      const faction = await Faction.findByPk(faction_id);
      if (!faction) {
        return res.status(404).json({
          success: false,
          message: "Faction non trouvée",
        });
      }
    }

    // Vérifier que le clan existe si spécifié
    if (clan_id !== undefined && clan_id !== null) {
      const clan = await Clan.findByPk(clan_id);
      if (!clan) {
        return res.status(404).json({
          success: false,
          message: "Clan non trouvé",
        });
      }
    }

    // Mettre à jour la section
    await section.update({
      name: name ? name.trim() : section.name,
      slug,
      description: description !== undefined ? description?.trim() || null : section.description,
      order: order !== undefined ? order : section.order,
      faction_id: faction_id !== undefined ? faction_id : section.faction_id,
      clan_id: clan_id !== undefined ? clan_id : section.clan_id,
      is_public: is_public !== undefined ? is_public : section.is_public,
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

    // Supprimer la section (soft delete via is_active et vider le slug)
    await section.update({ is_active: false, slug: "" });

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

    // Vérifier qu'aucune section active avec le même nom n'existe déjà dans la destination
    const whereCondition = {
      name: section.name,
      is_active: true,
      id: { [sequelize.Sequelize.Op.ne]: id }
    };

    // Si on déplace vers une section parente
    if (new_parent_section_id) {
      whereCondition.parent_section_id = new_parent_section_id;
    }
    // Si on déplace directement sous une catégorie
    else if (new_category_id) {
      whereCondition.category_id = new_category_id;
      whereCondition.parent_section_id = null;
    }

    const existingSectionWithSameName = await Section.findOne({ where: whereCondition });
    if (existingSectionWithSameName) {
      return res.status(400).json({
        success: false,
        message: "Une section avec ce nom existe déjà dans la destination",
      });
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
