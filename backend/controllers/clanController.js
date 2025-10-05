import { Clan, Faction, Character } from "../models/index.js";

// Récupérer tous les clans
export const getAllClans = async (req, res) => {
  try {
    const clans = await Clan.findAll({
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type"],
        },
      ],
      order: [
        ["type", "ASC"],
        ["name", "ASC"],
      ],
    });

    res.json({
      success: true,
      count: clans.length,
      data: clans,
    });
  } catch (error) {
    console.error("Erreur getAllClans:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des clans",
      error: error.message,
    });
  }
};

// Récupérer un clan par ID
export const getClanById = async (req, res) => {
  try {
    const { id } = req.params;

    const clan = await Clan.findByPk(id, {
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type", "description"],
        },
        {
          model: Character,
          as: "members",
          attributes: ["id", "name", "level"],
          limit: 10, // Limiter à 10 membres pour la preview
        },
      ],
    });

    if (!clan) {
      return res.status(404).json({
        success: false,
        message: "Clan non trouvé",
      });
    }

    res.json({
      success: true,
      data: clan,
    });
  } catch (error) {
    console.error("Erreur getClanById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du clan",
      error: error.message,
    });
  }
};

// Récupérer les clans par type
export const getClansByType = async (req, res) => {
  try {
    const { type } = req.params;

    const validTypes = ["caste_mutant", "caste_non_mutant", "clan_neutre"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type de clan invalide",
        validTypes,
      });
    }

    const clans = await Clan.findAll({
      where: { type },
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      count: clans.length,
      data: clans,
    });
  } catch (error) {
    console.error("Erreur getClansByType:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des clans par type",
      error: error.message,
    });
  }
};

// Récupérer les clans d'une faction
export const getClansByFaction = async (req, res) => {
  try {
    const { factionId } = req.params;

    const clans = await Clan.findAll({
      where: { faction_id: factionId },
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      count: clans.length,
      data: clans,
    });
  } catch (error) {
    console.error("Erreur getClansByFaction:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des clans de la faction",
      error: error.message,
    });
  }
};
