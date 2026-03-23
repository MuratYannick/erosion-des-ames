'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Récupérer les ethnies
    const [ethnicities] = await queryInterface.sequelize.query(
      'SELECT id, name FROM ethnicities WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    const inalteres = ethnicities.find(e => e.name === 'Les Inaltérés');
    const eveilles = ethnicities.find(e => e.name === 'Les Éveillés');

    // Récupérer les factions
    const [factions] = await queryInterface.sequelize.query(
      'SELECT id, name FROM factions WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    const veilleurs = factions.find(f => f.name === 'Les Veilleurs de l\'Ancien Monde');
    const eclaireurs = factions.find(f => f.name === 'Les Éclaireurs de l\'Aube Nouvelle');

    // Récupérer l'admin pour approved_by
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'ADMIN' AND deleted_at IS NULL LIMIT 1"
    );

    const adminId = users.length > 0 ? users[0].id : null;

    await queryInterface.bulkInsert("clans", [
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: "Les Élus de l'Avant",
        emblem: null,
        is_playable: false,
        background:
          "Clan supérieur de la faction des Veilleurs, Les Élus de l'Avant regroupent le chef de l'avant-poste et ses conseillers les plus proches. Dépositaires ultimes de l'héritage de l'Ancien Monde, ils incarnent l'autorité absolue et la sagesse ancestrale au sein de la faction.",
        goals:
          "Assurer la gouvernance globale de la faction : prendre les décisions stratégiques, définir les lois, arbitrer les conflits majeurs entre clans, et maintenir la pureté idéologique et génétique des Veilleurs de l'Ancien Monde.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: "Le Clan des Sentinelles",
        emblem: null,
        is_playable: true,
        background:
          "Bras armé de la faction des Veilleurs, le Clan des Sentinelles regroupe les guerriers les plus aguerris. Chargés de la défense de l'avant-poste et du maintien de l'ordre interne, ils patrouillent les alentours, sécurisent les voies d'accès et mènent les expéditions de reconnaissance et de combat pour garantir la sécurité et la pureté de la communauté.",
        goals:
          "Assurer la défense de l'avant-poste contre toute menace extérieure (mutants, créatures et faction ennemie). Patrouiller les alentours et sécuriser les voies d'accès. Maintenir l'ordre interne et faire respecter les lois établies par les Élus de l'Avant. Organiser les expéditions de reconnaissance et de combat.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: "Le Clan des Pourvoyeurs",
        emblem: null,
        is_playable: true,
        background:
          "Les membres de ce clan sont les garants de la survie matérielle de la communauté des Veilleurs. Responsables de la collecte des ressources essentielles et de leur gestion, ils supervisent les infrastructures vitales de l'avant-poste et s'assurent que chaque clan est approvisionné selon ses besoins.",
        goals:
          "Gérer la collecte de ressources essentielles (eau, nourriture, armement et matériaux de construction). Entretenir les infrastructures vitales de l'avant-poste. Approvisionner les autres clans en fonction de leurs besoins.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: "Le Clan des Archivistes",
        emblem: null,
        is_playable: true,
        background:
          "Gardiens de l'héritage de l'Ancien Monde, les Archivistes sont composés d'érudits et d'anciens à la mémoire vive. Ils préservent et étudient les reliques, les écrits et les récits du passé, transmettant les connaissances et les valeurs aux jeunes générations pour garantir que l'humanité ne perde pas ses racines.",
        goals:
          "Préserver et étudier les reliques, les écrits et les récits de l'Ancien Monde. Transmettre la connaissance, l'histoire et les valeurs aux jeunes générations. Documenter les événements actuels et les découvertes importantes. Servir de conseillers culturels et historiques aux Élus de l'Avant.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: "Le Clan des Purificateurs",
        emblem: null,
        is_playable: true,
        background:
          "Spécialistes de la santé et de l'hygiène, les Purificateurs veillent à la pureté biologique de la faction. Ils fournissent les soins médicaux, traitent les blessures et les maladies, et surveillent la population pour détecter tout signe de mutation ou de contamination. Ils recherchent activement des remèdes pour contrer les effets du monde muté.",
        goals:
          "Fournir les soins médicaux et traiter les blessures et maladies. Veiller à l'hygiène de l'avant-poste ainsi qu'à la qualité de l'eau et de la nourriture. Surveiller les signes de mutation ou de contamination au sein de la population non-mutante et prendre des mesures préventives ou d'isolement si nécessaire. Rechercher des remèdes et des moyens de contrer les effets du monde muté.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: "Le Clan des Explorateurs",
        emblem: null,
        is_playable: true,
        background:
          "Ceux qui ont le courage de s'aventurer au-delà des murs de l'avant-poste, les Explorateurs sont les cartographes et les éclaireurs de la faction. Ils partent à la recherche de nouvelles ressources et d'anciens artefacts utiles. En cartographiant les terres inconnues et en rapportant des informations vitales, ils aident à identifier les zones sûres ou dangereuses. Ils sont également chargés d'établir, ou d'éviter, le contact avec les autres clans neutres.",
        goals:
          "Cartographier les terres inconnues et identifier les zones sûres ou dangereuses. Rechercher de nouvelles ressources ou d'anciens artefacts utiles. Établir le contact (ou éviter) avec d'autres clans et servir d'émissaire au besoin. Rapporter des informations vitales sur l'environnement extérieur et les menaces potentielles.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: "Les Prophètes de l'Harmonie",
        emblem: null,
        is_playable: false,
        background:
          "Clan supérieur de la faction des Éclaireurs, Les Prophètes de l'Harmonie sont menés par un chef religieux — souvent un mutant herboriste ou guérisseur se prévalant de capacités spirituelles chamaniques — entouré de ses principaux disciples, des éveillés fanatiques qui le suivent dans une foi aveugle. Considérés comme les plus proches de l'essence de l'Éveil, ils sont les intercesseurs entre le monde muté et les vivants.",
        goals:
          "Guider la faction dans sa compréhension et son acceptation de la mutation comme voie d'évolution. Interpréter les signes du monde nouveau, maintenir la cohésion spirituelle de l'avant-poste et définir la volonté des mutations.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: "La Caste des Symbiotes",
        emblem: null,
        is_playable: true,
        background:
          "Ce clan regroupe des Éveillés ayant développé une connexion presque intuitive avec la nature environnante. Pensant mieux comprendre les écosystèmes mutés pour le bien de leur communauté, leur expertise réside dans la symbiose, l'exploitation des ressources de la nature et l'adaptation de l'avant-poste à leur environnement.",
        goals:
          "Assurer la survivance matérielle de l'avant-poste en exploitant les ressources du monde muté. Gérer la collecte de ressources essentielles (eau, nourriture, armement et matériaux de construction). Entretenir les infrastructures vitales de l'avant-poste. Approvisionner les autres clans en fonction de leurs besoins. Rechercher de nouvelles substances utiles issues des mutations de l'environnement.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: "La Caste des Sensitifs",
        emblem: null,
        is_playable: true,
        background:
          "Les Sensitifs sont des éveillés dont les sens sont particulièrement aiguisés, leur permettant de percevoir leur environnement de manière unique et d'anticiper les dangers ou de déceler des opportunités là où d'autres ne verraient rien. Ils servent de sentinelles naturelles et de guides infaillibles, capables de naviguer dans le monde transformé avec une grande intuition.",
        goals:
          "Explorer les territoires inconnus et lire le monde extérieur grâce à la connaissance de leur environnement. Détecter la moindre ressource cachée et traquer tout genre de proies ou de menaces. Servir d'éclaireurs et de guides pour les expéditions.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: "La Caste des Forgerons de Chair",
        emblem: null,
        is_playable: true,
        background:
          "Ce sont les médecins et biologistes de la faction. Possédant une connaissance approfondie de la nature sous toutes ses formes, ils sont capables d'utiliser les propriétés des espèces vivantes — flore ou faune mutées — pour soigner, empoisonner ou nourrir leur communauté. Leur pratique, bien que considérée comme barbare par les Inaltérés, est d'une efficacité redoutable et repose sur une compréhension intime des mutations et des nouvelles formes de vie.",
        goals:
          "Soigner les blessures et les maladies en utilisant des méthodes qui peuvent sembler barbares aux non-mutants mais qui sont efficaces. Étudier et connaître l'ensemble des espèces vivantes afin d'en tirer le meilleur profit. Développer des antidotes comme des poisons redoutables.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: "La Caste des Déchainés",
        emblem: null,
        is_playable: true,
        background:
          "Regroupant les Éveillés dotés de prédispositions physiques naturelles et entraînés au combat depuis leur plus jeune âge, ce clan forme l'avant-garde martiale de la faction. Gardiens de l'avant-poste, ils sont spécialisés dans le combat contre les menaces extérieures, qu'il s'agisse des Inaltérés ou des créatures hostiles du monde sauvage. Leur force est mise au service de la survie de la faction et de l'avancement de sa cause.",
        goals:
          "Assurer la défense active de l'avant-poste. Mener les affrontements contre les Inaltérés et les créatures hostiles. Développer des tactiques de combat lors des expéditions extérieures.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: "La Caste des Scrutateurs",
        emblem: null,
        is_playable: true,
        background:
          "Des Éveillés dont les capacités et les obsessions les poussent à fouiller les ruines de l'Ancien Monde — non pas pour les préserver, mais pour comprendre la chute de l'humanité non-altérée et en extraire des éléments utiles ou des avertissements. Ils servent de rappel constant des erreurs commises par ceux qui ont refusé l'évolution.",
        goals:
          "Récupérer des artefacts et des informations des ruines de l'Ancien Monde. Analyser les causes de la folie et de la destruction passée. Empêcher que des technologies ou des connaissances oubliées susceptibles de servir la faction ennemie ne tombent entre leurs mains.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: null,
        faction_id: null,
        name: "Les Fouilleurs de Ruines",
        emblem: null,
        is_playable: true,
        background:
          "Majoritairement composés d'Inaltérés, avec parfois quelques éveillés érudits, les Fouilleurs de Ruines sont des explorateurs calmes et méthodiques, vêtus de tenues pratiques, souvent équipés de torches et d'outils de déblaiement. Vus comme des pilleurs d'histoire par les Veilleurs de l'Ancien Monde et des fossoyeurs du passé par les Éclaireurs de l'Aube nouvelle, ils sont pourtant parfois recherchés comme guides ou informateurs par les deux factions.",
        goals:
          "Cartographier, explorer et sauvegarder les connaissances et artefacts des ruines de l'Ancien Monde — non pour les glorifier, mais pour apprendre des erreurs passées et comprendre la catastrophe. Ils croient que la vérité est la seule voie vers un avenir meilleur, refusent de prendre parti et partagent leurs découvertes avec quiconque est prêt à les écouter sans les détruire.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: null,
        faction_id: null,
        name: "Les Vagabonds du Vent",
        emblem: null,
        is_playable: true,
        background:
          "Clan mixte composé d'individus de toutes origines, souvent nomades, les Vagabonds du Vent sont des voyageurs infatigables reconnaissables à leurs vêtements composites et leurs visages burinés par les éléments. Souvent équipés de caravanes bricolées ou de montures mutées, ils sillonnent les routes entre les avant-postes et les zones isolées. Considérés comme des traîtres par les factions en raison de leurs interactions sans distinction avec les deux camps, leur utilité les rend néanmoins indispensables pour certains échanges.",
        goals:
          "Servir de marchands ambulants, de transporteurs ou de messagers entre les avant-postes ou les zones isolées. Vivre du commerce et de leur connaissance des routes et des dangers. Ils valorisent avant tout la liberté de mouvement et l'opportunité.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: null,
        name: "Les Frères de la Terre Brûlée",
        emblem: null,
        is_playable: true,
        background:
          "Exclusivement composés d'Inaltérés — souvent d'anciens soldats, des marginaux ou des exilés des Sentinelles — les Frères de la Terre Brûlée affichent une apparence austère et disciplinée, marquée par une touche de désespoir. Stoïques et efficaces, ils ont vu trop de destructions pour croire encore aux grandes idéologies des factions. Leur cynisme et leur désillusion les ont conduits à se battre uniquement pour leur propre survie et celle de leur petit groupe, ce qui leur vaut le mépris des \"Purs\".",
        goals:
          "Survivre par tous les moyens dans les zones les plus dangereuses, en tant que mercenaires d'élite ou gardes du corps. Mettre à profit leur connaissance des terrains hostiles et leurs tactiques de survie en conditions extrêmes. Vendre leurs services aux plus offrants, quel que soit leur camp.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: null,
        name: "Le Peuple des Ombres",
        emblem: null,
        is_playable: true,
        background:
          "Exclusivement composé d'Éveillés dont les capacités de furtivité et de dissimulation sont un atout, les membres du Peuple des Ombres sont vêtus de peaux et de matériaux naturels sombres leur permettant de se fondre dans l'environnement. Réputés pour leur discrétion, leur agilité et leur capacité à se cacher dans n'importe quel décor, ils se déplacent silencieusement et évitent le conflit direct. Tolérés pour leurs compétences, ils ne sont jamais pleinement acceptés par les deux factions.",
        goals:
          "Survivre en évitant le conflit direct. Chasser et pister avec excellence. Proposer leurs services comme éclaireurs ou espions discrets à ceux qui les paient bien et respectent leur mode de vie. Ils considèrent que le conflit direct est une perte d'énergie et n'ont que faire des querelles de factions, voyant les deux camps comme des obstacles à leur liberté.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: null,
        faction_id: null,
        name: "Les Collecteurs de Chuchotis",
        emblem: null,
        is_playable: false,
        background:
          "Clan mixte composé de mutants et de non-mutants qui excellent dans l'observation et la communication, les Collecteurs de Chuchotis sont discrets et passent inaperçus. Ils collectent des informations plutôt que des objets. Perçus comme des opportunistes et des fouineurs par tous, leur valeur en tant que source d'information les rend précieux et, jusqu'à un certain point, protégés.",
        goals:
          "Accumuler des rumeurs, des faits, des secrets et des informations sur tout ce qui se passe dans les Terres Désolées. Vendre des informations vérifiées à prix d'or à ceux qui peuvent les utiliser — factions, clans ou individus. Leur survie dépend de leur impartialité absolue : ils ne prennent jamais parti.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: null,
        faction_id: null,
        name: "Les Loups Solitaires",
        emblem: null,
        is_playable: false,
        background:
          "Clan mixte composé d'individus opportunistes et sans foi ni loi, rejetés par les factions et les autres clans. D'apparence négligée et intimidante, vêtus de bric et de broc avec des pièces d'armure et des armes de fortune, ils voyagent en petits groupes armés reconnaissables par leur attitude agressive et leur manque de respect pour autrui. La loi du plus fort est leur seule règle.",
        goals:
          "Survivre par le vol, l'intimidation et la force. Attaquer les convois de marchandises, les voyageurs isolés et les avant-postes les plus faibles pour piller leurs ressources. Ils ne servent qu'eux-mêmes, mais peuvent être engagés comme mercenaires pour des actions violentes.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        faction_id: null,
        name: "Les Dévoreurs d'Âmes",
        emblem: null,
        is_playable: false,
        background:
          "Clan exclusivement éveillés formé de fanatiques et d'exilés issus des Prophètes de l'Harmonie, bannis pour avoir poussé l'idéologie des mutants à des extrêmes terrifiants. Leur apparence est souvent dérangée, ornée de parures faites d'ossements et de peaux de leurs victimes, couverts de signes rituels et de peinture corporelle. Leur regard est empreint d'une folie glaçante. Craints et chassés par toutes les factions — y compris les mutants qui les ont bannis — ils errent en prédateurs dans les Terres Désolées.",
        goals:
          "Se considérant comme les véritables élus de la mutation, ils cherchent à \"purifier\" les âmes en consommant la chair des autres — mutants et non-mutants — pour absorber leur essence vitale. Ils chassent et capturent sans pitié pour leurs rituels cannibales, convaincus que s'abandonner totalement au chaos du cataclysme est la seule voie pour s'élever.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: inalteres.id,
        faction_id: null,
        name: "Le Sanctuaire du Silence",
        emblem: null,
        is_playable: false,
        background:
          "Exclusivement composé d'Inaltérés ayant rejeté la violence et les dogmes des factions, le Sanctuaire du Silence vit dans des retraites isolées, souvent des lieux oubliés ou naturellement protégés. Leur apparence simple et humble reflète leur mode de vie contemplatif. Perçus comme faibles ou naïfs par les factions, ils sont pourtant respectés par la plupart des clans neutres pour leur capacité à vivre en harmonie avec le monde.",
        goals:
          "Préserver la paix intérieure et la vie simple. Cultiver et vivre en autosuffisance. Offrir un refuge temporaire à ceux qui cherchent la quiétude, sans jamais prendre part aux conflits. Ils pensent que la division et le conflit sont les véritables maux de l'humanité.",
        status: "approved",
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clans', null, {});
  },
};
