import { Faction, Clan } from "../models/index.js";

// Récupérer toutes les factions
export const getAllFactions = async (req, res) => {
  try {
    const factions = await Faction.findAll({
      include: [
        {
          model: Clan,
          as: "clans",
          attributes: ["id", "name", "type", "specialization"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      count: factions.length,
      data: factions,
    });
  } catch (error) {
    console.error("Erreur getAllFactions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des factions",
      error: error.message,
    });
  }
};

// Récupérer une faction par ID
export const getFactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const faction = await Faction.findByPk(id, {
      include: [
        {
          model: Clan,
          as: "clans",
          attributes: ["id", "name", "type", "description", "specialization"],
        },
      ],
    });

    if (!faction) {
      return res.status(404).json({
        success: false,
        message: "Faction non trouvée",
      });
    }

    res.json({
      success: true,
      data: faction,
    });
  } catch (error) {
    console.error("Erreur getFactionById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la faction",
      error: error.message,
    });
  }
};

// Récupérer les factions jouables
export const getPlayableFactions = async (req, res) => {
  try {
    const factions = await Faction.findAll({
      where: { is_playable: true },
      include: [
        {
          model: Clan,
          as: "clans",
          attributes: ["id", "name", "type", "specialization"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      count: factions.length,
      data: factions,
    });
  } catch (error) {
    console.error("Erreur getPlayableFactions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des factions jouables",
      error: error.message,
    });
  }
};
