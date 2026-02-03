'use strict';

const nodemailer = require('nodemailer');

// Configuration du transporteur SMTP (compatible O2Switch)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true', // true pour le port 465, false pour le port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Vérifier la configuration SMTP au démarrage (seulement en développement)
if (process.env.NODE_ENV === 'development' && process.env.SMTP_HOST) {
  transporter.verify((error) => {
    if (error) {
      console.error('Erreur de configuration SMTP:', error.message);
    } else {
      console.log('Configuration SMTP prête pour l\'envoi d\'emails');
    }
  });
}

/**
 * Envoie un email générique
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} html - Contenu HTML de l'email
 * @param {string} text - Contenu texte de l'email (fallback)
 * @returns {Promise<object>} Informations sur l'envoi
 */
const sendEmail = async (to, subject, html, text) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Érosion des Âmes" <noreply@example.com>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Fallback: retire les balises HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV === 'development') {
      console.log('Email envoyé:', info.messageId);
    }
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error.message);
    throw new Error('Échec de l\'envoi de l\'email');
  }
};

/**
 * Envoie l'email de vérification d'adresse email
 * @param {object} user - L'utilisateur
 * @param {string} token - Le token de vérification
 * @returns {Promise<object>}
 */
const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verifier-email?token=${token}`;

  const subject = 'Vérifie ton inscription - Érosion des Âmes';

  const html = `
    <div style="font-family: 'Georgia', serif; color: #2c1810; max-width: 600px; margin: 0 auto; background: #f4ede4; padding: 20px; border: 2px solid #8b4513;">
      <h1 style="color: #8b4513; text-align: center; font-size: 24px; margin-bottom: 20px;">
        Érosion des Âmes
      </h1>

      <p style="font-size: 16px; line-height: 1.6;">
        Bienvenue dans les ruines, <strong>${user.username}</strong> !
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        Clique sur le lien ci-dessous pour vérifier ton adresse email :
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}"
           style="background-color: #8b4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Vérifier mon email
        </a>
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Ce lien expire dans 24 heures.
      </p>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Si tu n'as pas créé de compte, ignore cet email.
      </p>

      <hr style="border: none; border-top: 1px solid #8b4513; margin: 30px 0;">

      <p style="text-align: center; font-style: italic; color: #8b4513;">
        — Les Gardiens des Cendres
      </p>
    </div>
  `;

  const text = `
Bienvenue dans les ruines, ${user.username} !

Clique sur le lien ci-dessous pour vérifier ton adresse email :
${verificationLink}

Ce lien expire dans 24 heures.

Si tu n'as pas créé de compte, ignore cet email.

— Les Gardiens des Cendres
  `.trim();

  return sendEmail(user.email, subject, html, text);
};

/**
 * Envoie l'email de réinitialisation de mot de passe
 * @param {object} user - L'utilisateur
 * @param {string} token - Le token de réinitialisation
 * @returns {Promise<object>}
 */
const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;

  const subject = 'Réinitialisation de ton mot de passe - Érosion des Âmes';

  const html = `
    <div style="font-family: 'Georgia', serif; color: #2c1810; max-width: 600px; margin: 0 auto; background: #f4ede4; padding: 20px; border: 2px solid #8b4513;">
      <h1 style="color: #8b4513; text-align: center; font-size: 24px; margin-bottom: 20px;">
        Érosion des Âmes
      </h1>

      <p style="font-size: 16px; line-height: 1.6;">
        Salutations, <strong>${user.username}</strong>.
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        Une demande de réinitialisation de mot de passe a été effectuée.
        Clique sur le lien ci-dessous pour choisir un nouveau mot de passe :
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}"
           style="background-color: #8b4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Réinitialiser mon mot de passe
        </a>
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Ce lien expire dans 1 heure.
      </p>

      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Si tu n'as pas fait cette demande, ignore cet email.
      </p>

      <hr style="border: none; border-top: 1px solid #8b4513; margin: 30px 0;">

      <p style="text-align: center; font-style: italic; color: #8b4513;">
        — Les Gardiens des Cendres
      </p>
    </div>
  `;

  const text = `
Salutations, ${user.username}.

Une demande de réinitialisation de mot de passe a été effectuée.
Clique sur le lien ci-dessous pour choisir un nouveau mot de passe :
${resetLink}

Ce lien expire dans 1 heure.

Si tu n'as pas fait cette demande, ignore cet email.

— Les Gardiens des Cendres
  `.trim();

  return sendEmail(user.email, subject, html, text);
};

/**
 * Envoie l'email de bienvenue après vérification
 * @param {object} user - L'utilisateur
 * @returns {Promise<object>}
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Bienvenue parmi les Âmes Érodées !';

  const html = `
    <div style="font-family: 'Georgia', serif; color: #2c1810; max-width: 600px; margin: 0 auto; background: #f4ede4; padding: 20px; border: 2px solid #8b4513;">
      <h1 style="color: #8b4513; text-align: center; font-size: 24px; margin-bottom: 20px;">
        Érosion des Âmes
      </h1>

      <p style="font-size: 16px; line-height: 1.6;">
        <strong>${user.username}</strong>,
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        Ton âme a été acceptée dans les ruines.<br>
        Tu peux maintenant te connecter et commencer ton voyage.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/connexion"
           style="background-color: #8b4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Se connecter
        </a>
      </div>

      <p style="font-size: 16px; line-height: 1.6; text-align: center; font-style: italic; color: #8b4513;">
        Que les braises guident tes pas.
      </p>

      <hr style="border: none; border-top: 1px solid #8b4513; margin: 30px 0;">

      <p style="text-align: center; font-style: italic; color: #8b4513;">
        — Les Gardiens des Cendres
      </p>
    </div>
  `;

  const text = `
${user.username},

Ton âme a été acceptée dans les ruines.
Tu peux maintenant te connecter et commencer ton voyage.

Que les braises guident tes pas.

— Les Gardiens des Cendres
  `.trim();

  return sendEmail(user.email, subject, html, text);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
