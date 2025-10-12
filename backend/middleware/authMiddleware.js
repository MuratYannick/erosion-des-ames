import { verifyToken } from "../utils/auth.js";
import { User, Role } from "../models/index.js";

// Middleware pour protéger les routes (authentification obligatoire)
export const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans les headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé - Aucun token fourni",
      });
    }

    // Vérifier le token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé - Token invalide",
      });
    }

    // Récupérer l'utilisateur avec son rôle
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "label", "level"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Compte désactivé",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur middleware auth:", error);
    res.status(401).json({
      success: false,
      message: "Non autorisé",
      error: error.message,
    });
  }
};

// Middleware optionnel qui charge l'utilisateur s'il est authentifié, sinon continue sans erreur
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis l'en-tête Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si pas de token, continuer sans utilisateur
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Vérifier et décoder le token
      const decoded = verifyToken(token);

      if (decoded) {
        // Récupérer l'utilisateur depuis la base de données
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ["password_hash"] },
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["id", "name", "label", "level"],
            },
          ],
        });

        // Si l'utilisateur existe et est actif, l'attacher à la requête
        if (user && user.is_active) {
          req.user = user;
        } else {
          req.user = null;
        }
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // Si le token est invalide, continuer sans utilisateur
      req.user = null;
    }

    next();
  } catch (error) {
    console.error("Erreur dans optionalAuth:", error);
    req.user = null;
    next();
  }
};
