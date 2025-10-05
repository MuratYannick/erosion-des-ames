import express from "express";
import introContent from "../models/IntroModel.js";

const router = express.Router();

// Route pour la page d'Accueil
router.get("/home", (req, res) => {
  res.json({
    title: "Survivre est une victoire...",
    slogan: "et revivre est un mythe.",
    content: "",
  });
});

// Route pour la présentation
router.get("/intro", (req, res) => {
  res.json(introContent);
});

// Route pour la description du lore
router.get("/lore", (req, res) => {
  res.json({
    title: "L'Univers de l'Érosion des Âmes",
    content: "Le monde post-apocalyptique...",
    // TODO: Créer LoreModel.js
  });
});

// Route pour le règlement et les CGU
router.get("/rules", (req, res) => {
  res.json({
    title: "Règlement du jeu et CGU",
    content:
      "Toute participation au forum implique l'acceptation des règles suivantes...",
    // TODO: Créer RulesModel.js
  });
});

// Route pour le wiki (en lecture seule)
router.get("/wiki", (req, res) => {
  res.json({
    title: "Wiki des objets et lieux",
    articles: [
      {
        id: 1,
        name: "Le Colisée de la Cité Haute",
        summary: "Un lieu de combat légendaire...",
      },
      {
        id: 2,
        name: "L'épée des Âmes Perdues",
        summary: "Une arme maudite...",
      },
    ],
    // TODO: Créer WikiModel.js
  });
});

export default router;
