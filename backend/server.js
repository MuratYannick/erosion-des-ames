import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize, { testConnection } from "./config/database.js";
import "./models/index.js"; // Importer les modèles et leurs relations

// Importer les routes
import authRoutes from "./routes/authRoutes.js";
import factionRoutes from "./routes/factionRoutes.js";
import clanRoutes from "./routes/clanRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // URL du frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes de test
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de L'Érosion des Âmes",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Le serveur fonctionne correctement",
    database: "Connected",
    timestamp: new Date().toISOString(),
  });
});

// Utiliser les routes
app.use("/api/auth", authRoutes);
app.use("/api/factions", factionRoutes);
app.use("/api/clans", clanRoutes);
app.use("/api/characters", characterRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.path,
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur:", err.stack);
  res.status(500).json({
    error: "Erreur interne du serveur",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur est survenue",
  });
});

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error("❌ Impossible de se connecter à la base de données");
      console.log("Vérifiez vos identifiants MySQL dans le fichier .env");
      process.exit(1);
    }

    // Synchroniser les modèles avec la base de données (développement uniquement)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      console.log("✅ Modèles synchronisés avec la base de données");
    }

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(
        "\n🚀 ════════════════════════════════════════════════════════"
      );
      console.log(`   Serveur démarré avec succès !`);
      console.log(`   📍 URL: http://localhost:${PORT}`);
      console.log(`   📊 Environnement: ${process.env.NODE_ENV}`);
      console.log(`   🗄️  Base de données: ${process.env.DB_NAME}`);
      console.log(
        "🚀 ════════════════════════════════════════════════════════\n"
      );
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();
