'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // =========================================================================
    // Fetch users
    // =========================================================================
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE deleted_at IS NULL'
    );
    const admin = users.find(u => u.username === 'admin');
    const moderator = users.find(u => u.username === 'moderator');
    const gamemaster = users.find(u => u.username === 'gamemaster');
    const player1 = users.find(u => u.username === 'player1');
    const player2 = users.find(u => u.username === 'player2');

    // =========================================================================
    // Fetch topics
    // =========================================================================
    const [topics] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM forum_topics WHERE deleted_at IS NULL'
    );
    const topic = (slug) => topics.find(t => t.slug === slug);

    const ouverture = topic('ouverture-prochaine-du-site');
    const reglement = topic('reglement-du-forum');
    const cgu = topic('conditions-generales-dutilisation');
    const reglesRP = topic('regles-du-jeu-role-play');
    const astuces = topic('astuces-pour-bien-debuter');
    const evenement = topic('evenement-communautaire-du-mois');
    const presentations = topic('presentez-vous');
    const veillee = topic('veillee-autour-du-feu-sacre');
    const chroniques = topic('les-chroniques-de-lavant-monde');
    const temple = topic('les-murmures-de-lancien-temple');
    const meditation = topic('meditation-sous-la-lune-brisee');
    const croisee = topic('a-la-croisee-des-chemins');

    // =========================================================================
    // Fetch approved characters
    // =========================================================================
    const [characters] = await queryInterface.sequelize.query(
      'SELECT id, name, user_id FROM characters WHERE deleted_at IS NULL AND status = \'approved\''
    );
    const kael = characters.find(c => c.name === 'Kael l\'Inaltéré' && c.user_id === admin.id);
    const draven = characters.find(c => c.name === 'Draven le Chroniqueur' && c.user_id === gamemaster.id);
    const lyra = characters.find(c => c.name === 'Lyra des Brumes' && c.user_id === player1.id);
    const thalia = characters.find(c => c.name === 'Thalia la Clairvoyante' && c.user_id === moderator.id);
    const fenris = characters.find(c => c.name === 'Fenris l\'Errant' && c.user_id === player1.id);

    await queryInterface.bulkInsert('forum_posts', [
      // =====================================================================
      // Général > Annonces > "Ouverture prochaine du site"
      // =====================================================================
      {
        topic_id: ouverture.id,
        user_id: admin.id,
        character_id: null,
        content: '<p>Chers futurs aventuriers,</p><p>Nous avons le plaisir de vous annoncer que le site <strong>Érosion des Âmes</strong> ouvrira ses portes très prochainement. Préparez-vous à découvrir un univers post-apocalyptique riche et immersif, où chaque choix compte.</p><p>Restez connectés pour plus d\'informations. L\'aventure ne fait que commencer !</p><p><em>— L\'équipe d\'Érosion des Âmes</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Général > Règlement et CGU > "Règlement du forum"
      // =====================================================================
      {
        topic_id: reglement.id,
        user_id: admin.id,
        character_id: null,
        content: '<h2>Règlement du forum</h2><p><strong>1. Respect mutuel</strong> — Toute forme d\'insulte, harcèlement ou discrimination est strictement interdite.</p><p><strong>2. Contenu approprié</strong> — Les contenus à caractère violent, sexuel ou illégal sont proscrits.</p><p><strong>3. Pas de spam</strong> — Les messages publicitaires, le flood et les messages hors-sujet répétés entraîneront des sanctions.</p><p><strong>4. Vie privée</strong> — Ne partagez jamais les données personnelles d\'autres membres.</p><p><strong>5. Rôle-play</strong> — Dans les sections RP, restez en personnage et respectez la cohérence de l\'univers.</p><p><em>Le non-respect de ces règles entraînera des sanctions pouvant aller de l\'avertissement au bannissement définitif.</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Général > Règlement et CGU > "CGU"
      // =====================================================================
      {
        topic_id: cgu.id,
        user_id: admin.id,
        character_id: null,
        content: '<h2>Conditions Générales d\'Utilisation</h2><p><strong>Article 1 — Objet</strong><br/>Les présentes CGU régissent l\'utilisation du site Érosion des Âmes et de son forum communautaire.</p><p><strong>Article 2 — Inscription</strong><br/>L\'inscription est gratuite et ouverte à toute personne âgée d\'au moins 16 ans. Chaque utilisateur ne peut posséder qu\'un seul compte.</p><p><strong>Article 3 — Propriété intellectuelle</strong><br/>L\'univers, les textes et les visuels du site sont la propriété de l\'équipe d\'Érosion des Âmes. Le contenu créé par les joueurs (fiches de personnage, textes RP) reste leur propriété.</p><p><strong>Article 4 — Responsabilité</strong><br/>L\'équipe se réserve le droit de modérer tout contenu ne respectant pas le règlement ou les présentes CGU.</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Général > Informations officielles > "Règles du jeu role-play"
      // =====================================================================
      {
        topic_id: reglesRP.id,
        user_id: admin.id,
        character_id: null,
        content: '<h2>Règles du jeu role-play</h2><p><strong>1. Création de personnage</strong> — Chaque joueur peut créer jusqu\'à 3 personnages. La fiche doit être validée par un membre du staff avant de pouvoir jouer.</p><p><strong>2. Écriture RP</strong> — Rédigez à la troisième personne, au passé simple ou au présent de narration. Un minimum de 200 caractères par post RP est demandé.</p><p><strong>3. Cohérence</strong> — Respectez le lore établi : les factions, les clans et l\'histoire de l\'univers. Pas de god-modding ni de meta-gaming.</p><p><strong>4. Factions et clans</strong> — Votre personnage peut appartenir à une faction et/ou un clan. Certains clans ont des prérequis spécifiques détaillés dans leurs fiches respectives.</p><p><strong>5. Mort de personnage</strong> — La mort d\'un personnage est définitive et ne peut survenir qu\'avec l\'accord du joueur ou par décision narrative du staff.</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Hors RP > Discussions autour du jeu > "Astuces pour bien débuter"
      // =====================================================================
      {
        topic_id: astuces.id,
        user_id: player2.id,
        character_id: null,
        content: '<p>Voici quelques conseils pour les nouveaux arrivants sur Érosion des Âmes :</p><ul><li><strong>Lisez le lore</strong> — Prenez le temps de découvrir l\'univers avant de créer votre personnage.</li><li><strong>Commencez simple</strong> — Pas besoin d\'un background de 3 pages. Un personnage avec des motivations claires suffira.</li><li><strong>N\'hésitez pas à demander</strong> — Le staff et les joueurs expérimentés sont là pour vous aider !</li><li><strong>Respectez le rythme</strong> — Chacun joue à son rythme, ne mettez pas la pression à vos partenaires RP.</li></ul>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: astuces.id,
        user_id: player1.id,
        character_id: null,
        content: '<p>Merci pour ces conseils, c\'est très utile ! J\'ajouterais aussi : <strong>rejoignez un clan</strong> dès que possible, ça vous donnera un point d\'ancrage narratif et des partenaires de jeu.</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Hors RP > Discussions autour du jeu > "Événement communautaire du mois"
      // =====================================================================
      {
        topic_id: evenement.id,
        user_id: moderator.id,
        character_id: null,
        content: '<p>Nous organisons un événement spécial ce mois-ci ! Un mystérieux artefact a été découvert dans les Terres Abandonnées et toutes les factions convergent vers la zone.</p><p><strong>Dates :</strong> Du 15 au 28 du mois<br/><strong>Participants :</strong> Tous les personnages validés<br/><strong>Récompense :</strong> Un objet narratif unique pour les participants</p><p>Restez connectés pour plus de détails !</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Hors RP > Discussions libres > "Présentez-vous !"
      // =====================================================================
      {
        topic_id: presentations.id,
        user_id: player1.id,
        character_id: null,
        content: '<p>Salut tout le monde ! Ce topic est dédié aux présentations. Dites-nous qui vous êtes, comment vous avez découvert Érosion des Âmes, et ce qui vous attire dans le jeu de rôle !</p><p>Je commence : je suis un joueur RP depuis 5 ans, fan d\'univers post-apocalyptiques. Hâte de partager des aventures avec vous !</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: presentations.id,
        user_id: player2.id,
        character_id: null,
        content: '<p>Hello ! Je suis nouveau dans le RP écrit mais l\'univers m\'a tout de suite attiré. Content de rejoindre la communauté !</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: presentations.id,
        user_id: moderator.id,
        character_id: null,
        content: '<p>Bienvenue à tous les nouveaux membres ! N\'hésitez pas à poser vos questions, l\'équipe est là pour vous accompagner dans vos premiers pas.</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // RP > Les Veilleurs > Sentinelles > "Veillée autour du feu sacré"
      // =====================================================================
      {
        topic_id: veillee.id,
        user_id: admin.id,
        character_id: kael ? kael.id : null,
        content: '<p><em>La nuit tombait sur le campement des Sentinelles. Kael s\'assit près du feu sacré, dont les flammes semblaient danser au rythme d\'une mélodie oubliée. Ses yeux, marqués par les années de veille, scrutaient les ombres au-delà du cercle de lumière.</em></p><p><em>« Une autre nuit commence, murmura-t-il en posant sa lame sur ses genoux. Que ceux qui veillent s\'avancent. Le feu attend vos récits. »</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: veillee.id,
        user_id: gamemaster.id,
        character_id: draven ? draven.id : null,
        content: '<p><em>Draven émergea de l\'obscurité, son long manteau bruissant contre les herbes sèches. Le Chroniqueur prit place de l\'autre côté du feu, son carnet de cuir posé sur un genou, une plume dans la main.</em></p><p><em>« Je consigne ce que le feu me montre, dit-il simplement. Cette nuit, les flammes parlent d\'un temps révolu. Écoute, Kael. Elles murmurent le nom des anciens. »</em></p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // RP > Les Veilleurs > Élus de l'Avant > "Les chroniques de l'Avant-Monde"
      // =====================================================================
      {
        topic_id: chroniques.id,
        user_id: gamemaster.id,
        character_id: draven ? draven.id : null,
        content: '<p><em>Draven déroula le parchemin jauni sur la table de pierre. Les glyphes anciens brillaient faiblement sous la lumière vacillante des torches.</em></p><p><em>« L\'Avant-Monde n\'était pas ce que nous croyons, commença-t-il d\'une voix grave. Les archives que j\'ai retrouvées dans les ruines du sud parlent d\'une civilisation qui avait dompté l\'érosion elle-même. Ils appelaient cela le Grand Lien. »</em></p><p><em>Il traça du doigt les symboles, comme s\'il cherchait à réveiller leur signification enfouie.</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: chroniques.id,
        user_id: admin.id,
        character_id: kael ? kael.id : null,
        content: '<p><em>Kael s\'approcha de la table, les bras croisés. Son regard parcourut les glyphes avec une méfiance instinctive.</em></p><p><em>« Le Grand Lien, répéta-t-il. J\'ai entendu les anciens en parler quand j\'étais enfant. Ils disaient que c\'était un pouvoir interdit — quelque chose qui liait les âmes entre elles. Si ces archives disent vrai... »</em></p><p><em>Il laissa la phrase en suspens, le crépitement des torches comblant le silence.</em></p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // RP > Les Éclaireurs > Sensitifs > "Les murmures de l'ancien temple"
      // =====================================================================
      {
        topic_id: temple.id,
        user_id: player1.id,
        character_id: lyra ? lyra.id : null,
        content: '<p><em>Le temple semblait vivant. Ses murs de pierre grise résonnaient de murmures que Lyra seule pouvait percevoir. Elle avança prudemment dans la nef effondrée, ses doigts effleurant les inscriptions gravées dans la roche.</em></p><p><em>« Quelque chose dort ici, souffla-t-elle. Quelque chose qui nous attend depuis très longtemps. »</em></p><p><em>Les murmures s\'intensifièrent, comme si le temple répondait à sa présence.</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: temple.id,
        user_id: moderator.id,
        character_id: thalia ? thalia.id : null,
        content: '<p><em>Thalia posa sa main sur l\'épaule de Lyra, les yeux mi-clos. Sa perception de Sensitive était en alerte maximale.</em></p><p><em>« Ce ne sont pas des murmures ordinaires, dit-elle. Ce sont des échos d\'âmes. Des centaines d\'entre elles, piégées dans la pierre depuis l\'Érosion. Ne touche rien — pas encore. Laisse-moi d\'abord comprendre ce qu\'elles essaient de nous dire. »</em></p><p><em>Elle s\'agenouilla au centre du temple, paumes contre le sol, et ferma les yeux.</em></p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // RP > Les Éclaireurs > Prophètes > "Méditation sous la lune brisée"
      // =====================================================================
      {
        topic_id: meditation.id,
        user_id: moderator.id,
        character_id: thalia ? thalia.id : null,
        content: '<p><em>La lune, fracturée en trois segments depuis la Grande Érosion, projetait une lumière argentée et irrégulière sur la clairière sacrée des Prophètes. Thalia s\'assit en position de méditation, les mains ouvertes sur ses genoux.</em></p><p><em>« Les fragments lunaires chantent ce soir, murmura-t-elle. Chaque éclat porte un fragment de vérité. Qui rejoint la méditation ce soir ? »</em></p><p><em>L\'air vibrait d\'une énergie subtile, perceptible uniquement par les Éveillés.</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // RP > Les Terres Abandonnées > Vagabonds > "À la croisée des chemins"
      // =====================================================================
      {
        topic_id: croisee.id,
        user_id: player1.id,
        character_id: fenris ? fenris.id : null,
        content: '<p><em>Fenris s\'arrêta au carrefour, là où les quatre routes se rencontraient en un point que les Vagabonds appelaient le Souffle du Vent. Son sac pesait lourd sur ses épaules, mais c\'était le poids de ses souvenirs qui l\'immobilisait.</em></p><p><em>« Nord, sud, est, ouest, marmonna-t-il en scrutant chaque direction. Chaque chemin mène quelque part. Mais lequel mène là où je dois aller ? »</em></p><p><em>Le vent souffla, comme une réponse silencieuse, soulevant la poussière du chemin de l\'est.</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // =========================================================================
    // Update topic counters
    // =========================================================================
    const [topicPosts] = await queryInterface.sequelize.query(
      'SELECT topic_id, COUNT(*) as cnt, MAX(id) as last_id, MAX(created_at) as last_at FROM forum_posts WHERE deleted_at IS NULL GROUP BY topic_id'
    );
    for (const tp of topicPosts) {
      await queryInterface.sequelize.query(
        'UPDATE forum_topics SET post_count = ?, last_post_id = ?, last_post_at = ?, updated_at = ? WHERE id = ?',
        { replacements: [tp.cnt, tp.last_id, tp.last_at, now, tp.topic_id] }
      );
    }

    // =========================================================================
    // Update category counters
    // =========================================================================
    const [catStats] = await queryInterface.sequelize.query(`
      SELECT c.id,
        COUNT(DISTINCT t.id) as topic_cnt,
        COUNT(DISTINCT p.id) as post_cnt,
        MAX(p.id) as last_post_id
      FROM forum_categories c
      LEFT JOIN forum_topics t ON t.category_id = c.id AND t.deleted_at IS NULL
      LEFT JOIN forum_posts p ON p.topic_id = t.id AND p.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      GROUP BY c.id
    `);
    for (const cs of catStats) {
      await queryInterface.sequelize.query(
        'UPDATE forum_categories SET topic_count = ?, post_count = ?, last_post_id = ?, updated_at = ? WHERE id = ?',
        { replacements: [cs.topic_cnt, cs.post_cnt, cs.last_post_id, now, cs.id] }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('forum_posts', null, {});
  },
};
