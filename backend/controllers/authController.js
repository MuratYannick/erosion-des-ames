import { User } from "../models/index.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { checkAndUpdateAcceptances } from "../utils/acceptanceChecker.js";
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

    // Validation du pseudo (username)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Le pseudo n'est pas valide. Seuls les lettres (minuscules et majuscules), chiffres, tirets (-) et underscores (_) sont autorisés",
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
        terms_accepted: user.terms_accepted,
        terms_accepted_at: user.terms_accepted_at,
        forum_rules_accepted: user.forum_rules_accepted,
        forum_rules_accepted_at: user.forum_rules_accepted_at,
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
    const { identifier, password } = req.body;

    // Validation des champs
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Pseudo/Email et mot de passe sont obligatoires",
      });
    }

    // Trouver l'utilisateur par pseudo ou email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Pseudo/Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Pseudo/Email ou mot de passe incorrect",
      });
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Votre compte a été désactivé",
      });
    }

    // Vérifier et mettre à jour les acceptations CGU et règlement du forum
    await checkAndUpdateAcceptances(user);

    // Recharger l'utilisateur pour obtenir les données mises à jour
    await user.reload();

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
        terms_accepted: user.terms_accepted,
        terms_accepted_at: user.terms_accepted_at,
        forum_rules_accepted: user.forum_rules_accepted,
        forum_rules_accepted_at: user.forum_rules_accepted_at,
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

// Accepter les conditions d'utilisation
export const acceptTerms = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Permettre la ré-acceptation si les CGU ont été mises à jour
    // (la vérification est faite à la connexion et peut remettre terms_accepted à false)

    await user.update({
      terms_accepted: true,
      terms_accepted_at: new Date(),
    });

    res.json({
      success: true,
      message: "Conditions d'utilisation acceptées",
      data: {
        terms_accepted: true,
        terms_accepted_at: user.terms_accepted_at,
      },
    });
  } catch (error) {
    console.error("Erreur acceptTerms:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'acceptation des conditions",
      error: error.message,
    });
  }
};

// Accepter le règlement du forum
export const acceptForumRules = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Permettre la ré-acceptation si le règlement a été mis à jour
    // (la vérification est faite à la connexion et peut remettre forum_rules_accepted à false)

    await user.update({
      forum_rules_accepted: true,
      forum_rules_accepted_at: new Date(),
    });

    res.json({
      success: true,
      message: "Règlement du forum accepté",
      data: {
        forum_rules_accepted: true,
        forum_rules_accepted_at: user.forum_rules_accepted_at,
      },
    });
  } catch (error) {
    console.error("Erreur acceptForumRules:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'acceptation du règlement du forum",
      error: error.message,
    });
  }
};
