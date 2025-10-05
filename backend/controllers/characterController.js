import { Character, Faction, Clan, User } from "../models/index.js";

// Créer un nouveau personnage
export const createCharacter = async (req, res) => {
  try {
    const { name, faction_id, clan_id } = req.body;
    const user_id = req.user.id;

    // Validation des champs
    if (!name || !faction_id) {
      return res.status(400).json({
        success: false,
        message: "Le nom et la faction sont obligatoires",
      });
    }

    // Vérifier que la faction existe
    const faction = await Faction.findByPk(faction_id);
    if (!faction) {
      return res.status(404).json({
        success: false,
        message: "Faction non trouvée",
      });
    }

    // Vérifier que le clan existe et appartient à la faction (si fourni)
    if (clan_id) {
      const clan = await Clan.findByPk(clan_id);
      if (!clan) {
        return res.status(404).json({
          success: false,
          message: "Clan non trouvé",
        });
      }
      if (clan.faction_id !== faction_id && clan.faction_id !== null) {
        return res.status(400).json({
          success: false,
          message: "Ce clan n'appartient pas à cette faction",
        });
      }
    }

    // Vérifier le nombre de personnages de l'utilisateur
    const characterCount = await Character.count({ where: { user_id } });
    if (characterCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "Vous avez atteint le nombre maximum de personnages (5)",
      });
    }

    // Créer le personnage
    const character = await Character.create({
      user_id,
      faction_id,
      clan_id: clan_id || null,
      name,
    });

    // Récupérer le personnage avec ses relations
    const characterWithRelations = await Character.findByPk(character.id, {
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type"],
        },
        {
          model: Clan,
          as: "clan",
          attributes: ["id", "name", "type", "specialization"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Personnage créé avec succès",
      data: characterWithRelations,
    });
  } catch (error) {
    console.error("Erreur createCharacter:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du personnage",
      error: error.message,
    });
  }
};

// Récupérer tous les personnages de l'utilisateur connecté
export const getMyCharacters = async (req, res) => {
  try {
    const characters = await Character.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type"],
        },
        {
          model: Clan,
          as: "clan",
          attributes: ["id", "name", "type", "specialization"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      count: characters.length,
      data: characters,
    });
  } catch (error) {
    console.error("Erreur getMyCharacters:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des personnages",
      error: error.message,
    });
  }
};

// Récupérer un personnage spécifique
export const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await Character.findOne({
      where: {
        id,
        user_id: req.user.id, // Vérifier que le personnage appartient à l'utilisateur
      },
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type", "description"],
        },
        {
          model: Clan,
          as: "clan",
          attributes: ["id", "name", "type", "description", "specialization"],
        },
      ],
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: "Personnage non trouvé",
      });
    }

    res.json({
      success: true,
      data: character,
    });
  } catch (error) {
    console.error("Erreur getCharacterById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du personnage",
      error: error.message,
    });
  }
};

// Mettre à jour un personnage
export const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, clan_id } = req.body;

    const character = await Character.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: "Personnage non trouvé",
      });
    }

    // Vérifier le clan si fourni
    if (clan_id) {
      const clan = await Clan.findByPk(clan_id);
      if (!clan) {
        return res.status(404).json({
          success: false,
          message: "Clan non trouvé",
        });
      }
      if (
        clan.faction_id !== character.faction_id &&
        clan.faction_id !== null
      ) {
        return res.status(400).json({
          success: false,
          message: "Ce clan n'appartient pas à votre faction",
        });
      }
    }

    // Mettre à jour
    await character.update({
      name: name || character.name,
      clan_id: clan_id !== undefined ? clan_id : character.clan_id,
    });

    // Récupérer avec relations
    const updatedCharacter = await Character.findByPk(character.id, {
      include: [
        {
          model: Faction,
          as: "faction",
          attributes: ["id", "name", "type"],
        },
        {
          model: Clan,
          as: "clan",
          attributes: ["id", "name", "type", "specialization"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Personnage mis à jour",
      data: updatedCharacter,
    });
  } catch (error) {
    console.error("Erreur updateCharacter:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du personnage",
      error: error.message,
    });
  }
};

// Supprimer un personnage
export const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await Character.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: "Personnage non trouvé",
      });
    }

    await character.destroy();

    res.json({
      success: true,
      message: "Personnage supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteCharacter:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du personnage",
      error: error.message,
    });
  }
};
