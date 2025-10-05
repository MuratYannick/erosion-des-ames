import { User } from "../models/index.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { Op } from "sequelize";

// Inscription d'un nouvel utilisateur
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation des champs
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires",
      });
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: "Ce nom d'utilisateur est déjà pris",
        });
      }
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(password);

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
    });

    // Générer le token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe sont obligatoires",
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Votre compte a été désactivé",
      });
    }

    // Mettre à jour la dernière connexion
    await user.update({ last_login: new Date() });

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};

// Récupérer les informations de l'utilisateur connecté
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erreur getMe:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
};
