import sequelize from "../config/database.js";
import { Faction, Clan, Category, Section, Topic, Post } from "../models/index.js";

// Données initiales pour les factions
const factionsData = [
  {
    name: "Les Éclaireurs de l'Aube Nouvelle",
    ethnic_group: "Les Eveillés",
    description:
      "La faction des Eveillés ne jure que par l'ordre de la nature : ils n'ont pas muté, ils ont évolué. Le grand cataclysme a été lancée par leur dieu pour purifier la terre de l'homme et de sa technologie, responsable de la destruction de la nature. Pour eux, ils sont les élus et tous les non-mutants doivent périr. Mais le plus urgent dans leur quête de purification reste l'éradication de l'autre faction, les clans neutres restants peuvent attendre.",
    base_name: "L'Oasis des Transformés",
    is_playable: true,
  },
  {
    name: "Les Veilleurs de l'Ancien Monde",
    ethnic_group: "Les Inaltérés",
    description:
      "La faction des non-mutants ne jure que par les anciens savoirs oubliés : la technologie. C'est le seul moyen de reprendre le dessus sur cette nature dégénérée devenu hostile. Pour eux, les mutants font partie de cette dégénérescence et doivent tous être exterminés avant qu'ils contaminent les rares humains encore pure qu'ils sont. Le plus urgent dans leur quête de purification restant l'éradication de l'autre faction, les clans neutres restants peuvent attendre.",
    base_name: "La Citadelle du Renouveau",
    is_playable: true,
  },
];

// Données initiales pour les clans mutants
const mutantClansData = [
  {
    name: "Les Prophètes de l'Harmonie",
    ethnic_group: "Les Eveillés",
    description:
      "Composé d'un chef religieux (souvent un mutant herboriste/guérisseur se prétendant des capacités spirituelles chamanique) et de ses principaux disciples, des mutants fanatiques qui le suivent dans une foi aveugle.\n• Mission Principale : Guider la faction dans sa compréhension et son acceptation de la mutation comme une voie d'évolution. Ils interprètent les signes du monde nouveau, maintiennent la cohésion spirituelle de l'avant-poste, et définissent la \"volonté des mutations\". Ils sont les intercesseurs entre le monde muté et les vivants, souvent considérés comme les plus proches de l'essence du \"Chaos\" dont ils sont nés.",
    is_playable: false,
  },
  {
    name: "La Caste des Symbiotes",
    ethnic_group: "Les Eveillés",
    description:
      "Ce clan regroupe des mutants ayant développé une connexion presque intuitive avec la nature environnante, leur permettant de comprendre et de manipuler les écosystèmes mutés pour le bien de leur communauté. Leur expertise réside dans la symbiose, l'exploitation des ressources de la nature et l'adaptation de leur avant-poste à leur environnement.\n◦ Mission :\n  ▪ Assurer la survivance matérielle de l'avant-poste en exploitant les ressources du monde muté.\n  ▪ Développer des techniques uniques de culture, de purification de l'eau, ou de recyclage basées sur la nature.\n  ▪ Construire et adapter les structures de l'avant-poste en utilisant des matériaux et des méthodes non conventionnels.\n  ▪ Rechercher de nouvelles formes de vie ou de substances utiles issues des mutations de l'environnement.",
    is_playable: true,
  },
];

// Données initiales pour les clans non-mutants
const nonMutantClansData = [
  {
    name: "Les Élus d'Avant",
    ethnic_group: "Les Inaltérés",
    description:
      "Composé du commandant de l'avant-poste (souvant une personne aux capacités strategiques et guerrières indéniables) et de ses conseillers les plus proches.\n• Mission Principale : La gouvernance globale de l'avant-poste. Ils sont les dépositaires ultimes de l'héritage de l'Ancien Monde. Ils prennent les décisions stratégiques, définissent les lois, arbitrent les conflits majeurs entre clans, et maintiennent la \"pureté\" idéologique et génétique de la faction. Ils incarnent l'autorité et la sagesse ancestrale.",
    is_playable: false,
  },
  {
    name: "Le Clan des Sentinelles",
    ethnic_group: "Les Inaltérés",
    description:
      "C'est le bras armé de la faction. Ce clan regroupe les guerriers les plus aguerris, chargés de la défense de l'avant-poste et du maintien de l'ordre interne. Ils patrouillent les alentours, sécurisent les voies d'accès et mènent les expéditions de reconnaissance et de combat pour garantir la sécurité et la pureté de la communauté.\n◦ Mission :\n  ▪ Assurer la défense de l'avant-poste contre toute menace extérieure (mutants, créatures, autres factions).\n  ▪ Patrouiller les alentours et sécuriser les voies d'accès.\n  ▪ Maintenir l'ordre interne et faire respecter les lois établies par les Élus d'Avant.\n  ▪ Organiser les expéditions de reconnaissance et de combat.",
    is_playable: true,
  },
];

// Données pour les clans neutres
const neutralClansData = [
  {
    name: "Le Peuple des Ombres",
    faction_id: null,
    ethnic_group: "Les Eveillés",
    description:
      "Composé exclusivement des mutants, souvent ceux qui ont de grandes prédispositions en furtivité et dissimulation.\n◦ Caractéristiques : Les membres du Peuple des Ombres sont souvent vêtus de peaux et de matériaux naturels sombres, leur permettant de se fondre dans l'environnement. Ils se déplacent silencieusement et sont réputés pour leur discrétion, leur agilité et leur capacité à se cacher dans n'importe quel décor.\n◦ Mission : Survivre en évitant le conflit direct. Ils sont d'excellents chasseurs et pisteurs, et proposent leurs services comme éclaireurs ou espions discrets à ceux qui les paient bien et respectent leur mode de vie.\n◦ Mœurs/Idéologie : Pragmatiques et méfiants. Ils croient en l'adaptation ultime et considèrent que le conflit direct est une perte d'énergie. Ils n'ont que faire des querelles de factions, voyant les deux camps comme des obstacles à leur liberté.\nIls sont tolérés par Les Éclaireurs de l'Aube Nouvelle pour leurs compétences mais jamais pleinement acceptés.",
    is_playable: true,
  },
  {
    name: "Les Frères de la Terre Brûlée",
    faction_id: null,
    ethnic_group: "Les Inaltérés",
    description:
      "Composé exclusivement de non-mutants, souvent des anciens soldats, des marginaux ou des exilés des Sentinelles.\n◦ Caractéristiques : Apparence austère, disciplinée, mais avec une touche de désespoir. Ils sont stoïques et efficaces.\n◦ Mission : Survivre par tous les moyens dans les zones les plus dangereuses, souvent en tant que mercenaires d'élite ou gardes du corps. Ils connaissent les terrains hostiles et les tactiques de survie dans des conditions extrêmes.\n◦ Mœurs/Idéologie : Cyniques et désabusés. Ils ne croient plus aux grandes idéologies des factions, ayant vu trop de destructions. Ils se battent pour leur propre survie et celle de leur petit groupe, tout en vendant leurs services aux plus offrants.\nles Veilleurs de l'Ancien Monde les tolèrent, même si ces derniers restent très méfiants envers eux.",
    is_playable: true,
  },
  {
    name: "Les Vagabonds du Vent",
    faction_id: null,
    ethnic_group: null,
    description:
      "Clan mixte, composé d'individus de toutes origines, souvent nomades.\n◦ Caractéristiques : Voyageurs infatigables, souvent équipés de caravanes bricolées ou de montures mutées. Ils sont reconnaissables à leurs vêtements composites et leurs visages burinés par les éléments.\n◦ Mission : Servir de marchands ambulants, de transporteurs ou de messagers entre les avant-postes ou les zones isolées. Ils vivent du commerce et de leur connaissance des routes et des dangers.\n◦ Mœurs/Idéologie : Indépendants et opportunistes. Ils valorisent la liberté de mouvement et le commerce. Ils sont les \"traitres\" par excellence car ils interagissent avec les deux factions sans distinction, mais leur utilité les rend indispensables pour certains échanges.",
    is_playable: true,
  },
  {
    name: "Les Dévoreurs d'Âmes",
    faction_id: null,
    ethnic_group: "Les Eveillés",
    description:
      "Clan exclusivement mutant, formé de fanatiques et d'exilés issus des Prophètes de l'Harmonie, bannis pour avoir poussé l'idéologie des mutants à des extrêmes terrifiants.\n◦ Caractéristiques : Leur apparence est souvent dérangée, avec des parures faites d'ossements et de peaux de leurs victimes. Ils se couvrent de signes rituels et de peinture corporelle, et leur regard est empreint d'une folie glaçante.\n◦ Mission : Ils se considèrent comme les véritables élus de la mutation, cherchant à \"purifier\" les âmes en consommant la chair des autres, mutants et non-mutants, pour absorber leur \"essence vitale\". Ils chassent et capturent sans pitié pour leurs rituels cannibales.\n◦ Mœurs/Idéologie : Leur idéologie est une perversion de la croyance des mutants. Ils pensent que le cataclysme a créé un monde de chaos et que la seule façon de s'élever est de s'abandonner totalement à ce chaos, à travers le cannibalisme et les sacrifices. Ils sont craints et chassés par toutes les factions, y compris les mutants qui les ont bannis.",
    is_playable: false,
  },
];

// Données initiales pour les catégories du forum
const categoriesData = [
  {
    name: "Forum Général",
    slug: "general",
    description:
      "Discussions générales sur le jeu, l'univers et la communauté.",
    order: 1,
    is_active: true,
  },
  {
    name: "Forum RP (Rôle-Play)",
    slug: "rp",
    description:
      "Espace dédié au jeu de rôle. Incarnez votre personnage et vivez des aventures dans l'univers de L'Érosion des Âmes.",
    order: 2,
    is_active: true,
  },
  {
    name: "Forum HRP (Hors Rôle-Play)",
    slug: "hrp",
    description:
      "Discussions hors-jeu : organisation, événements, questions techniques et discussions entre joueurs.",
    order: 3,
    is_active: true,
  },
];

// Données initiales pour les sections du forum
const sectionsData = [
  {
    name: "Annonces",
    slug: "annonces",
    description: "Annonces officielles de l'équipe de développement et de modération.",
    order: 1,
    is_active: true,
  },
  {
    name: "Règlement et CGU",
    slug: "reglement-cgu",
    description: "Règlement du forum et Conditions Générales d'Utilisation.",
    order: 2,
    is_active: true,
  },
  {
    name: "Règles du Jeu",
    slug: "regles-jeu",
    description: "Règles et mécaniques de jeu de L'Érosion des Âmes.",
    order: 3,
    is_active: true,
  },
];

// Fonction principale de seed
export const seedDatabase = async () => {
  try {
    console.log("🌱 Début du seeding de la base de données...\n");

    // 1. Créer les factions
    console.log("📊 Création des factions...");
    const factions = await Faction.bulkCreate(factionsData, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${factions.length} factions créées\n`);

    // 2. Récupérer les IDs des factions
    const mutantFaction = await Faction.findOne({
      where: { ethnic_group: "Les Eveillés" },
    });
    const nonMutantFaction = await Faction.findOne({
      where: { ethnic_group: "Les Inaltérés" },
    });

    // 3. Créer les clans mutants
    console.log("📊 Création des clans mutants...");
    const mutantClans = await Clan.bulkCreate(
      mutantClansData.map((clan) => ({
        ...clan,
        faction_id: mutantFaction.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${mutantClans.length} clans mutants créés\n`);

    // 4. Créer les clans non-mutants
    console.log("📊 Création des clans non-mutants...");
    const nonMutantClans = await Clan.bulkCreate(
      nonMutantClansData.map((clan) => ({
        ...clan,
        faction_id: nonMutantFaction.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${nonMutantClans.length} clans non-mutants créés\n`);

    // 5. Créer les clans neutres
    console.log("📊 Création des clans neutres...");
    const neutralClans = await Clan.bulkCreate(neutralClansData, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${neutralClans.length} clans neutres créés\n`);

    // 6. Créer les catégories du forum
    console.log("📊 Création des catégories du forum...");
    const categories = await Category.bulkCreate(categoriesData, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${categories.length} catégories du forum créées\n`);

    // 7. Récupérer la catégorie "Forum Général"
    const forumGeneral = await Category.findOne({
      where: { slug: "general" },
    });

    // 8. Créer les sections dans "Forum Général"
    console.log("📊 Création des sections du forum...");
    const sections = await Section.bulkCreate(
      sectionsData.map((section) => ({
        ...section,
        category_id: forumGeneral.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${sections.length} sections créées\n`);

    // 9. Récupérer la section "Annonces"
    const sectionAnnonces = await Section.findOne({
      where: { slug: "annonces" },
    });

    // 10. Créer le topic "Bienvenue" dans la section Annonces
    console.log("📊 Création du topic de bienvenue...");
    const topicBienvenue = await Topic.create({
      title: "Bienvenue sur L'Érosion des Âmes !",
      slug: "bienvenue",
      is_pinned: true,
      is_locked: true,
      section_id: sectionAnnonces.id,
      author_name: "L'équipe de développement",
      author_user_id: null,
      author_character_id: null,
    });
    console.log(`✅ Topic de bienvenue créé\n`);

    // 11. Créer le post de bienvenue
    console.log("📊 Création du post de bienvenue...");
    await Post.create({
      content: `# Bienvenue sur L'Érosion des Âmes ! 🌍

Chers survivants,

Bienvenue dans l'univers post-apocalyptique de **L'Érosion des Âmes**, où mutants et non-mutants se livrent une guerre sans merci pour la survie de l'humanité.

## 🚧 Site en développement

Ce site est actuellement **en cours de développement actif**. De nouvelles fonctionnalités sont ajoutées régulièrement, et certaines parties du jeu peuvent encore être instables ou incomplètes.

### Ce qui est déjà disponible :
- ✅ Système d'inscription et de connexion
- ✅ Création de personnages (mutants et non-mutants)
- ✅ Système de factions et de clans
- ✅ Forum de discussion (HRP et RP)

### À venir prochainement :
- 🔜 Système de combat et d'exploration
- 🔜 Système d'inventaire et d'objets
- 🔜 Quêtes et missions
- 🔜 Événements communautaires

## 📋 Comment débuter ?

1. **Lisez le règlement** dans la section dédiée
2. **Consultez les règles du jeu** pour comprendre les mécaniques
3. **Créez votre personnage** et choisissez votre camp
4. **Rejoignez la communauté** sur le forum !

## 🐛 Bugs et suggestions

Si vous rencontrez un bug ou avez une suggestion, n'hésitez pas à nous en faire part dans la section appropriée du forum.

Bon jeu et bonne survie dans les Terres Désolées !

*— L'équipe de développement*`,
      author_name: "L'équipe de développement",
      topic_id: topicBienvenue.id,
      author_user_id: null,
      author_character_id: null,
    });
    console.log(`✅ Post de bienvenue créé\n`);

    // 12. Récupérer la section "Règlement et CGU"
    const sectionReglementCGU = await Section.findOne({
      where: { slug: "reglement-cgu" },
    });

    // 13. Créer le topic "Conditions Générales d'Utilisation"
    console.log("📊 Création du topic CGU...");
    const topicCGU = await Topic.create({
      title: "Conditions Générales d'Utilisation",
      slug: "cgu",
      is_pinned: true,
      is_locked: true,
      section_id: sectionReglementCGU.id,
      author_name: "L'équipe de développement",
      author_user_id: null,
      author_character_id: null,
    });
    console.log(`✅ Topic CGU créé\n`);

    // 14. Créer le post CGU
    console.log("📊 Création du post CGU...");
    await Post.create({
      content: `# Conditions Générales d'Utilisation

**Date de dernière mise à jour :** ${new Date().toLocaleDateString("fr-FR")}

En accédant et en utilisant le site **L'Érosion des Âmes**, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.

## 1. Objet du site

L'Érosion des Âmes est un jeu de rôle textuel en ligne (JDR) situé dans un univers post-apocalyptique. Le site offre :
- Un espace de jeu de rôle immersif
- Des forums de discussion (RP et HRP)
- Un système de gestion de personnages
- Des interactions entre joueurs dans un univers partagé

## 2. Inscription et compte utilisateur

### 2.1 Conditions d'inscription
- Vous devez avoir au moins 16 ans pour vous inscrire
- Vous devez fournir des informations exactes et à jour
- Vous êtes responsable de la confidentialité de votre mot de passe
- Vous êtes responsable de toutes les activités effectuées depuis votre compte

### 2.2 Compte unique
Chaque utilisateur ne peut posséder qu'un seul compte. La création de comptes multiples est interdite et peut entraîner la suspension de tous vos comptes.

## 3. Utilisation du service

### 3.1 Contenu généré par les utilisateurs
Vous conservez la propriété intellectuelle du contenu que vous créez (personnages, histoires, posts). Toutefois, en publiant du contenu sur le site, vous accordez à L'Érosion des Âmes une licence non-exclusive pour afficher et distribuer ce contenu dans le cadre du service.

### 3.2 Comportement interdit
Il est strictement interdit de :
- Harceler, menacer ou intimider d'autres utilisateurs
- Publier du contenu illégal, offensant, pornographique ou discriminatoire
- Utiliser des scripts, bots ou outils automatisés pour exploiter le jeu
- Usurper l'identité d'autres utilisateurs ou membres de l'équipe
- Divulguer des informations personnelles d'autres utilisateurs
- Tenter de contourner les mesures de sécurité du site

## 4. Modération et sanctions

L'équipe de modération se réserve le droit de :
- Modifier ou supprimer tout contenu inapproprié
- Suspendre ou bannir définitivement les comptes en violation des CGU
- Prendre toute mesure jugée nécessaire pour maintenir un environnement sain

Les sanctions peuvent inclure :
- Avertissement
- Restriction temporaire d'accès
- Suspension temporaire du compte
- Bannissement définitif

## 5. Propriété intellectuelle

### 5.1 Contenu du site
L'univers, le lore, les mécaniques de jeu et l'ensemble des éléments constitutifs de L'Érosion des Âmes sont protégés par le droit d'auteur. Toute reproduction ou utilisation commerciale sans autorisation est interdite.

### 5.2 Respect des droits
Vous vous engagez à ne pas publier de contenu portant atteinte aux droits d'auteur, marques déposées ou autres droits de propriété intellectuelle de tiers.

## 6. Protection des données personnelles

Vos données personnelles sont collectées et traitées conformément à notre Politique de Confidentialité. Nous nous engageons à protéger votre vie privée et à ne pas vendre vos données à des tiers.

### Données collectées :
- Email (obligatoire)
- Nom d'utilisateur (obligatoire)
- Informations de jeu (personnages, statistiques)
- Logs de connexion (pour la sécurité)

## 7. Disponibilité du service

Le site est fourni "tel quel" sans garantie de disponibilité continue. Nous nous réservons le droit de :
- Effectuer des maintenances programmées ou d'urgence
- Modifier ou interrompre tout ou partie du service
- Modifier ces CGU à tout moment (les utilisateurs seront notifiés)

## 8. Limitation de responsabilité

L'Érosion des Âmes ne peut être tenu responsable de :
- Pertes de données dues à des problèmes techniques
- Préjudices résultant d'interactions entre utilisateurs
- Contenus publiés par les utilisateurs
- Interruptions de service

## 9. Résiliation

### 9.1 Résiliation par l'utilisateur
Vous pouvez fermer votre compte à tout moment en contactant l'équipe de modération.

### 9.2 Résiliation par l'administration
Nous nous réservons le droit de suspendre ou fermer tout compte en violation des CGU, sans préavis et sans remboursement (le cas échéant).

## 10. Modifications des CGU

Ces CGU peuvent être modifiées à tout moment. Les modifications prendront effet dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.

## 11. Droit applicable

Les présentes CGU sont régies par le droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux français.

## 12. Contact

Pour toute question concernant ces CGU, veuillez contacter l'équipe de modération via le forum ou par email.

---

**En utilisant L'Érosion des Âmes, vous reconnaissez avoir lu, compris et accepté ces Conditions Générales d'Utilisation.**`,
      author_name: "L'équipe de développement",
      topic_id: topicCGU.id,
      author_user_id: null,
      author_character_id: null,
    });
    console.log(`✅ Post CGU créé\n`);

    // 15. Créer le topic "Règlement"
    console.log("📊 Création du topic Règlement...");
    const topicReglement = await Topic.create({
      title: "Règlement du Forum et du Jeu",
      slug: "reglement",
      is_pinned: true,
      is_locked: true,
      section_id: sectionReglementCGU.id,
      author_name: "L'équipe de développement",
      author_user_id: null,
      author_character_id: null,
    });
    console.log(`✅ Topic Règlement créé\n`);

    // 16. Créer le post Règlement
    console.log("📊 Création du post Règlement...");
    await Post.create({
      content: `# Règlement du Forum et du Jeu

**Bienvenue dans L'Érosion des Âmes !**

Ce règlement a pour but d'assurer une expérience agréable et respectueuse pour tous les joueurs. Le non-respect de ces règles pourra entraîner des sanctions pouvant aller de l'avertissement au bannissement définitif.

---

## 📌 I. Règles Générales

### 1.1 Respect et courtoisie
- **Soyez respectueux** envers tous les membres de la communauté (joueurs, modérateurs, administrateurs)
- **Aucune forme de harcèlement** n'est tolérée (insultes, menaces, discrimination)
- **Les désaccords doivent être réglés calmement** et de manière constructive
- **Respectez les opinions des autres**, même si vous n'êtes pas d'accord

### 1.2 Contenu interdit
Les contenus suivants sont strictement interdits :
- **Contenu pornographique ou sexuellement explicite**
- **Incitation à la haine**, racisme, sexisme, homophobie, transphobie
- **Apologie de la violence** réelle (hors contexte RP approprié)
- **Contenu illégal** (piratage, drogue, etc.)
- **Spam et publicité** non autorisée
- **Divulgation d'informations personnelles** (doxxing)

### 1.3 Multi-comptes
- **Un seul compte par personne** est autorisé
- Le contournement d'un bannissement via un nouveau compte entraînera un bannissement définitif
- En cas de problème technique, contactez l'équipe avant de créer un nouveau compte

---

## 🎭 II. Règles du Jeu de Rôle (RP)

### 2.1 Cohérence et réalisme
- **Respectez l'univers** de L'Érosion des Âmes (lore, chronologie, contexte)
- **Jouez un personnage cohérent** avec ses capacités, son histoire et sa faction
- **Pas de God-Modding** : Votre personnage n'est pas tout-puissant et peut échouer
- **Pas de Meta-Gaming** : Ne mélangez pas les connaissances HRP et RP

### 2.2 Interactions entre personnages
- **Respectez le consentement** : Les interactions doivent être acceptées par les deux parties
- **Pas de Power-Playing** : Ne contrôlez pas le personnage d'un autre joueur sans permission
- **Les combats RP** doivent être équilibrés et accepter la possibilité de perdre
- **Respectez les conséquences** : Les actions de votre personnage ont des répercussions

### 2.3 Mort et violence RP
- **La mort d'un personnage** doit être consensuelle (sauf dans les zones PvP désignées)
- **Les scènes de violence graphique** doivent être accompagnées d'un avertissement
- **Les thèmes sensibles** (torture, traumatisme) nécessitent l'accord des participants
- **Distinguez RP et réalité** : Un conflit entre personnages n'est pas un conflit entre joueurs

### 2.4 Rythme et activité
- **Prévenez en cas d'absence** prolongée (plus de 7 jours)
- **Respectez le rythme** des autres participants dans les RPs collaboratifs
- **Évitez le RP solo excessif** : L'Érosion des Âmes est un jeu communautaire
- **Les comptes inactifs** plus de 90 jours sans justification pourront être archivés

---

## 💬 III. Règles du Forum

### 3.1 Organisation des sections
- **Postez dans la section appropriée** (Général, RP, HRP)
- **Un sujet = un topic** : Ne créez pas plusieurs topics sur le même sujet
- **Utilisez la fonction recherche** avant de créer un nouveau topic
- **Respectez les topics épinglés** et les annonces officielles

### 3.2 Messages et posts
- **Soignez votre orthographe** : Les messages doivent être compréhensibles
- **Pas de flood** : Évitez les messages inutiles ou répétitifs
- **Pas de double-post** : Utilisez la fonction d'édition pour compléter un message
- **Citez correctement** : N'abusez pas des citations longues, soyez pertinent

### 3.3 Signatures et avatars
- **Taille maximale des signatures** : 500x200 pixels
- **Contenu approprié** : Pas d'images choquantes ou NSFW
- **Pas de gif animés excessifs** : Limitez-vous à 1 gif par signature

---

## ⚔️ IV. Règles de Gameplay

### 4.1 Création de personnage
- **Respectez les limites de la faction** choisie
- **Pas de personnage OP** dès la création (progression graduelle)
- **Historique cohérent** avec l'univers et votre faction
- **Un personnage par compte** initialement (possibilité de créer des PNJ selon votre expérience)

### 4.2 Progression et statistiques
- **Pas de triche** : N'exploitez pas les bugs à votre avantage
- **Progression naturelle** : Gagnez de l'expérience via le RP et les quêtes
- **Respectez les cooldowns** et limites de ressources
- **Signalez les bugs** à l'équipe au lieu de les exploiter

### 4.3 Économie et échanges
- **Pas de vente réelle** : Aucun échange d'argent réel contre des ressources du jeu
- **Pas de farming abusif** : Jouez de manière équitable
- **Respectez les règles du commerce RP** entre personnages

---

## 🛡️ V. Modération et Sanctions

### 5.1 Échelle des sanctions
1. **Avertissement** : Rappel à l'ordre privé
2. **Avertissement public** : Visible sur le forum
3. **Restriction temporaire** : Interdiction de poster (1-7 jours)
4. **Suspension temporaire** : Compte désactivé (7-30 jours)
5. **Bannissement définitif** : Compte supprimé définitivement

### 5.2 Contestations
- **Vous pouvez contester** une sanction en contactant un modérateur par MP
- **Restez courtois** lors de votre contestation
- **La décision finale** appartient à l'équipe d'administration
- **Ne contestez pas publiquement** : Cela pourrait aggraver votre sanction

### 5.3 Signalements
- **Utilisez le bouton de signalement** pour rapporter un contenu problématique
- **Expliquez clairement** la raison du signalement
- **Ne faites pas de faux signalements** : C'est sanctionnable
- **L'équipe examine** tous les signalements dans les 48h

---

## 📢 VI. Communication avec l'équipe

### 6.1 Canaux de communication
- **Questions générales** : Section "HRP" du forum
- **Problèmes techniques** : Topic dédié aux bugs
- **Signalement** : Bouton de report ou MP à un modérateur
- **Suggestions** : Topic dédié aux idées d'amélioration

### 6.2 Respect de l'équipe
- **Les modérateurs et admins** sont bénévoles
- **Soyez patient** : Ils répondront dès que possible
- **Suivez leurs directives** : Ils sont là pour faire respecter le règlement
- **Ne sollicitez pas excessivement** : Évitez le harcèlement

---

## ✅ VII. Bonnes Pratiques

### Pour une meilleure expérience :
- ✅ **Lisez le lore** avant de créer votre personnage
- ✅ **Participez aux événements** communautaires
- ✅ **Aidez les nouveaux joueurs** à s'intégrer
- ✅ **Communiquez HRP** si un RP vous met mal à l'aise
- ✅ **Soyez créatif** et contribuez à l'univers partagé
- ✅ **Amusez-vous !** C'est l'objectif principal

---

## 📜 VIII. Dispositions finales

### 8.1 Évolution du règlement
Ce règlement peut être modifié à tout moment. Les changements majeurs seront annoncés via un topic épinglé. Il est de votre responsabilité de rester informé.

### 8.2 Interprétation
En cas de doute sur l'interprétation d'une règle, l'équipe de modération aura le dernier mot. L'esprit du règlement prime toujours sur la lettre.

### 8.3 Cas particuliers
Les situations non couvertes par ce règlement seront évaluées au cas par cas par l'équipe d'administration, toujours dans un souci d'équité.

---

**⚠️ IMPORTANT :** L'ignorance du règlement ne constitue pas une excuse en cas de manquement. En jouant sur L'Érosion des Âmes, vous acceptez de respecter l'ensemble de ces règles.

**Bonne survie dans les Terres Désolées !**

*— L'équipe de modération*`,
      author_name: "L'équipe de développement",
      topic_id: topicReglement.id,
      author_user_id: null,
      author_character_id: null,
    });
    console.log(`✅ Post Règlement créé\n`);

    console.log("🎉 Seeding terminé avec succès !\n");

    return true;
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    return false;
  }
};

// Exécuter le seed automatiquement
(async () => {
  try {
    console.log("🚀 Script de seed lancé...\n");

    // Synchroniser les tables (force: true = recréer les tables)
    console.log("🔄 Synchronisation de la base de données...");
    await sequelize.sync({ force: true });
    console.log("✅ Tables créées/recréées\n");

    // Lancer le seeding
    const success = await seedDatabase();

    if (success) {
      console.log("🏁 Script terminé avec succès");
      process.exit(0);
    } else {
      console.log("❌ Échec du seeding");
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 ERREUR FATALE:", error);
    process.exit(1);
  }
})();
