'use strict';

const { User } = require('../models');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/email');
const { Op } = require('sequelize');

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, acceptedCgu, acceptedRules } = req.body;

    // Vérifier l'unicité de l'email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Cette adresse email est déjà utilisée',
          code: 'EMAIL_ALREADY_EXISTS',
        },
      });
    }

    // Vérifier l'unicité du username
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Ce nom d\'utilisateur est déjà pris',
          code: 'USERNAME_ALREADY_EXISTS',
        },
      });
    }

    // Créer l'utilisateur (le hook beforeCreate hashera le password)
    const user = await User.create({
      username,
      email,
      password,
      acceptedCgu: acceptedCgu === 'true' || acceptedCgu === true,
      acceptedRules: acceptedRules === 'true' || acceptedRules === true,
      acceptedCguAt: new Date(),
      acceptedRulesAt: new Date(),
    });

    // Générer le token de vérification d'email
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Envoyer l'email de vérification (async, ne pas bloquer la réponse)
    sendVerificationEmail(user, verificationToken).catch((error) => {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    });

    // Retourner l'utilisateur créé (sans password grâce au defaultScope)
    const userResponse = await User.findByPk(user.id);

    return res.status(201).json({
      success: true,
      data: { user: userResponse },
      message: 'Inscription réussie. Un email de vérification vous a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);

    // Gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de l\'inscription',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Connexion d'un utilisateur
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Chercher l'utilisateur par email OU username avec le scope withPassword
    const user = await User.scope('withPassword').findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Identifiant ou mot de passe incorrect',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Vérifier que l'utilisateur est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Votre compte a été désactivé. Veuillez contacter l\'administration.',
          code: 'ACCOUNT_DISABLED',
        },
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Identifiant ou mot de passe incorrect',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Vérifier que l'email est vérifié
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Veuillez vérifier votre adresse email avant de vous connecter',
          code: 'EMAIL_NOT_VERIFIED',
        },
      });
    }

    // Générer le JWT
    const token = user.generateAuthToken();

    // Mettre à jour la date de dernière connexion
    user.lastLoginAt = new Date();
    await user.save();

    // Récupérer l'utilisateur sans le password
    const userResponse = await User.findByPk(user.id);

    return res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: 'Connexion réussie',
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la connexion',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Déconnexion d'un utilisateur
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  // Pour v1, pas de blacklist côté serveur
  // Le token sera invalidé côté client
  return res.status(200).json({
    success: true,
    message: 'Déconnexion réussie',
  });
};

/**
 * Récupérer les informations de l'utilisateur connecté
 * GET /api/auth/me
 */
const me = async (req, res) => {
  try {
    // req.user est déjà attaché par le middleware authenticate
    // et n'a pas le password grâce au defaultScope
    return res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la récupération du profil',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Vérifier l'email d'un utilisateur
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // Chercher l'utilisateur par token de vérification
    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Le token de vérification est invalide ou a expiré',
          code: 'INVALID_VERIFICATION_TOKEN',
        },
      });
    }

    // Marquer l'email comme vérifié
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Envoyer l'email de bienvenue (async, ne pas bloquer)
    sendWelcomeEmail(user).catch((error) => {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    });

    return res.status(200).json({
      success: true,
      message: 'Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.',
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la vérification de l\'email',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Renvoyer l'email de vérification
 * POST /api/auth/resend-verification
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Chercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    // Si l'utilisateur existe et n'est pas vérifié, renvoyer l'email
    if (user && !user.isEmailVerified) {
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      sendVerificationEmail(user, verificationToken).catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
      });
    }

    // Toujours retourner le même message pour éviter l'énumération d'emails
    return res.status(200).json({
      success: true,
      message: 'Si cette adresse email est enregistrée et non vérifiée, un nouvel email de vérification a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur lors du renvoi de l\'email de vérification:', error);

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors du renvoi de l\'email de vérification',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Demande de réinitialisation de mot de passe
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Chercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    // Si l'utilisateur existe, générer et envoyer le token
    if (user) {
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      sendPasswordResetEmail(user, resetToken).catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      });
    }

    // Toujours retourner le même message pour éviter l'énumération d'emails
    return res.status(200).json({
      success: true,
      message: 'Si cette adresse email est enregistrée, un email de réinitialisation de mot de passe a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la demande de réinitialisation de mot de passe',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Réinitialisation de mot de passe
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Chercher l'utilisateur par token de réinitialisation
    const user = await User.scope('withPassword').findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Le token de réinitialisation est invalide ou a expiré',
          code: 'INVALID_RESET_TOKEN',
        },
      });
    }

    // Mettre à jour le mot de passe (le hook beforeUpdate hashera automatiquement)
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);

    // Gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Changement de mot de passe
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Chercher l'utilisateur avec le password (req.user n'a pas le password)
    const user = await User.scope('withPassword').findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Utilisateur non trouvé',
          code: 'USER_NOT_FOUND',
        },
      });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Le mot de passe actuel est incorrect',
          code: 'INVALID_CURRENT_PASSWORD',
        },
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    // Générer un nouveau token JWT
    const token = user.generateAuthToken();

    return res.status(200).json({
      success: true,
      data: { token },
      message: 'Votre mot de passe a été modifié avec succès. Utilisez votre nouveau token pour les prochaines requêtes.',
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);

    // Gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors du changement de mot de passe',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

/**
 * Mise à jour du profil utilisateur
 * PUT /api/auth/update-profile
 */
const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updateData = {};

    // Préparer les champs à mettre à jour
    if (username !== undefined) {
      // Vérifier l'unicité du username (exclure l'utilisateur courant)
      const existingUsername = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: req.user.id },
        },
      });

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Ce nom d\'utilisateur est déjà pris',
            code: 'USERNAME_ALREADY_EXISTS',
          },
        });
      }

      updateData.username = username;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Si aucun champ à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Aucun champ à mettre à jour',
          code: 'NO_FIELDS_TO_UPDATE',
        },
      });
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByPk(req.user.id);
    await user.update(updateData);

    // Recharger l'utilisateur pour obtenir la version mise à jour
    await user.reload();

    return res.status(200).json({
      success: true,
      data: { user },
      message: 'Profil mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);

    // Gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        error: {
          message: 'Erreur de validation',
          code: 'VALIDATION_ERROR',
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Une erreur est survenue lors de la mise à jour du profil',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
