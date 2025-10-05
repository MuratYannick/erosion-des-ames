import { verifyToken } from "../utils/auth.js";
import { User } from "../models/index.js";

// Middleware pour protéger les routes
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

    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
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
