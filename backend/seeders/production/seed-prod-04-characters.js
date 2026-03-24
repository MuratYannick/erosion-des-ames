'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const [ethnicities] = await queryInterface.sequelize.query(
      'SELECT id, name FROM ethnicities WHERE deleted_at IS NULL ORDER BY id ASC'
    );
    const inalteres = ethnicities.find(e => e.name === 'Les Inaltérés');
    const eveilles = ethnicities.find(e => e.name === 'Les Éveillés');

    const [factions] = await queryInterface.sequelize.query(
      'SELECT id, name FROM factions WHERE deleted_at IS NULL ORDER BY id ASC'
    );
    const veilleurs = factions.find(f => f.name === "Les Veilleurs de l'Ancien Monde");
    const eclaireurs = factions.find(f => f.name === "Les Éclaireurs de l'Aube Nouvelle");

    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'ADMIN' AND deleted_at IS NULL LIMIT 1"
    );
    const adminId = users.length > 0 ? users[0].id : null;

    const [clans] = await queryInterface.sequelize.query(
      'SELECT id, name FROM clans WHERE deleted_at IS NULL ORDER BY id ASC'
    );
    const getClan = name => clans.find(c => c.name === name);

    await queryInterface.bulkInsert('characters', [
      // ── Veilleurs de l'Ancien Monde ─────────────────────────────────────────

      // 1. Les Élus de l'Avant — chef suprême de faction, non-playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: getClan("Les Élus de l'Avant").id,
        name: 'Aldric le Gardien',
        avatar: null,
        age: 48,
        appearance:
          "Grand homme au maintien imposant, cheveux blancs coupés court, cicatrice verticale traversant son sourcil gauche. Toujours vêtu d'une longue veste sombre ornée d'insignes de l'Ancien Monde, il porte à la ceinture un couteau de cérémonie hérité de son père.",
        personality:
          "Autoritaire et implacable, Aldric est convaincu que la survie de l'humanité dépend de la préservation rigoureuse de ses gènes et de ses traditions. Il est capable d'une grande bienveillance envers ceux qu'il juge dignes, mais d'une froideur absolue envers ceux qui menacent la pureté de sa faction.",
        background:
          "Né dans les premières années suivant le cataclysme, Aldric a grandi dans les ruines d'une ville fortifiée avec son père, ancien militaire. À vingt ans, il avait déjà pris la tête d'un groupe de survivants non-mutants. En quarante ans, il a forgé les Veilleurs de l'Ancien Monde, imposant sa vision d'un ordre strict fondé sur la pureté biologique et le respect des valeurs d'avant le cataclysme.",
        goals:
          "Asseoir définitivement l'autorité des Veilleurs sur les terres environnantes. Éliminer la menace mutante des Éclaireurs. Trouver un successeur digne de perpétuer son héritage.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 2. Le Clan des Sentinelles — guerriers/défenseurs, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: getClan('Le Clan des Sentinelles').id,
        name: 'Marius Duroc',
        avatar: null,
        age: 32,
        appearance:
          "Homme trapu au corps couvert de cicatrices de combat. Cheveux noirs rasés sur les côtés, regard acier. Toujours en armure de fortune renforcée, une matraque en métal à la hanche et une longue lame récupérée dans les ruines portée dans le dos.",
        personality:
          "Direct, discipliné et exigeant, Marius parle peu mais agit avec efficacité. Loyal à Aldric jusqu'à la mort, il doute parfois en privé des décisions les plus radicales du conseil mais les exécute sans hésiter.",
        background:
          "Orphelin recueilli par les Sentinelles à l'âge de huit ans après que ses parents furent tués par des mutants errants. À trente ans, il avait mené dix expéditions décisives contre les menaces extérieures. Son ascension au rang de chef fut unanime après qu'il ait repoussé seul une incursion nocturne de la Caste des Déchainés.",
        goals:
          "Maintenir l'avant-poste inviolable. Former une nouvelle génération de combattants d'élite. Neutraliser les éclaireurs mutants avant qu'ils n'atteignent les ressources vitales.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 3. Le Clan des Pourvoyeurs — ressources/intendance, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: getClan('Le Clan des Pourvoyeurs').id,
        name: 'Élara Cresson',
        avatar: null,
        age: 34,
        appearance:
          "Femme d'apparence ordinaire mais au regard perçant. Cheveux châtains toujours en chignon serré. Vêtue de vêtements fonctionnels à nombreuses poches, elle porte invariablement un tablier de cuir et un registre sous le bras.",
        personality:
          "Pragmatique et calculatrice, Élara voit tout en termes de ressources — y compris les personnes. Elle peut paraître froide mais est respectée pour sa capacité à anticiper les pénuries et à organiser les stocks avec une précision chirurgicale.",
        background:
          "Elle affirme avoir été comptable avant le cataclysme, bien que nul ne l'ait connue avant. Elle s'est imposée dans les Pourvoyeurs en faisant durer les ressources là où d'autres gaspillaient. Elle a négocié les premières trêves commerciales avec les Vagabonds du Vent, bien qu'elle ne leur fasse aucune confiance.",
        goals:
          "Constituer des réserves suffisantes pour survivre à un siège de six mois. Réduire la dépendance aux échanges extérieurs. Identifier et éliminer tout gaspillage ou détournement de ressources au sein de l'avant-poste.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 4. Le Clan des Archivistes — mémoire/érudits, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: getClan('Le Clan des Archivistes').id,
        name: 'Théodore Halleck',
        avatar: null,
        age: 45,
        appearance:
          "Vieil homme maigre aux doigts tachés d'encre permanente. Lunettes rafistolées sur le nez, cheveux blancs en bataille. Toujours entouré de liasses de papiers et de carnets reliés de cuir.",
        personality:
          "Méthodique, passionné et légèrement obsessionnel, Théodore est capable d'oublier de manger pendant trois jours si une découverte l'absorbe. Derrière sa douceur apparente se cache une volonté de fer : il ne laissera rien ni personne menacer les archives qu'il a consacré sa vie à préserver.",
        background:
          "Fils d'un des derniers survivants du premier âge post-cataclysme, Théodore a grandi bercé par les récits déjà fragmentaires que son père et quelques anciens lui transmettaient dans son enfance. Ces témoins sont aujourd'hui tous disparus, emportant avec eux toute mémoire directe de l'Ancien Monde. Théodore est sincèrement convaincu d'en avoir préservé l'essentiel dans ses archives — mais celles-ci ne sont en réalité qu'une reconstruction orale, déformée par les filtres du temps, de la mémoire défaillante et des besoins idéologiques de ceux qui témoignaient. Il n'en a pas conscience, et n'admettrait aucune remise en question.",
        goals:
          "Achever la grande encyclopédie de l'Ancien Monde. Former au moins un successeur digne. Récupérer des archives dont on murmure l'existence dans la zone nord interdite.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 5. Le Clan des Purificateurs — médecins/santé, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: getClan('Le Clan des Purificateurs').id,
        name: 'Sorine Blanche',
        avatar: null,
        age: 36,
        appearance:
          "Femme aux traits tirés mais à la posture droite. Blouse blanche tachée de sang séché, cheveux argent coupés à la nuque. Ses mains sont toujours propres — presque avec obsession.",
        personality:
          "Rigoureuse et scientifique, Sorine traite les patients avec efficacité mais sans excès de compassion. Elle est capable de décisions terribles au nom de la santé collective — isolement forcé, amputations préventives — qu'elle justifie par la survie du groupe.",
        background:
          "Infirmière avant le cataclysme, elle s'est formée seule à la médecine de campagne sur les cadavres et les blessés des premières années. Elle a survécu à trois épidémies et développé des protocoles stricts de quarantaine qui ont sauvé l'avant-poste. Sa hantise des mutations la rend particulièrement intransigeante envers quiconque présente des signes d'Éveil.",
        goals:
          "Éradiquer toute trace de contamination de l'avant-poste. Développer un test fiable pour détecter les premiers stades de mutation. Trouver un remède ou un vaccin contre l'Éveil.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 6. Le Clan des Explorateurs — cartographes/éclaireurs, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: getClan('Le Clan des Explorateurs').id,
        name: 'Gareth Picard',
        avatar: null,
        age: 24,
        appearance:
          "Jeune homme bronzé aux allures dégingandées, toujours équipé de son sac à dos rempli de matériel de cartographie. Cicatrice en arc de cercle sur la joue droite — souvenir d'une créature mutée.",
        personality:
          "Curieux, adaptable et optimiste dans un monde qui n'y prête guère, Gareth est le seul chef de clan des Veilleurs à entretenir des relations cordiales avec des neutres. Il doute en privé de certaines rigidités de la faction, mais reste loyal à l'avant-poste.",
        background:
          "Né dans l'avant-poste, il mémorisait des cartes depuis l'enfance. À quinze ans, sa première expédition solo l'a mené à découvrir un entrepôt préservé dont les provisions ont nourri l'avant-poste pendant un an. Il est devenu chef des Explorateurs à vingt-deux ans après la disparition de son prédécesseur dans la zone contaminée est.",
        goals:
          "Cartographier l'intégralité des terres accessibles dans un rayon de cent kilomètres. Établir des routes sécurisées pour les convois. Retrouver des traces de son prédécesseur disparu.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // ── Éclaireurs de l'Aube Nouvelle ───────────────────────────────────────

      // 7. Les Prophètes de l'Harmonie — chef suprême de faction, non-playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: getClan("Les Prophètes de l'Harmonie").id,
        name: "Nyx l'Éveillée",
        avatar: null,
        age: 38,
        appearance:
          "Femme à la peau d'un gris bleuté profond qu'elle expose sans honte ni dissimulation, parée de bijoux de nature — dents d'animaux, os, pierres étranges. Son regard est d'une intensité qui déstabilise la plupart de ceux qui la croisent. Elle parle peu et lentement, choisissant chaque mot avec une précision déconcertante.",
        personality:
          "Énigmatique et charismatique, Nyx parle souvent en métaphores et en symboles. Elle inspire une dévotion quasi-religieuse à ses disciples tout en maintenant une distance mystérieuse. Elle perçoit les nuances du monde muté d'une manière incompréhensible pour les non-initiés.",
        background:
          "Elle se prétend née de la mutation elle-même — bien que les plus anciens se souviennent d'une enfant ordinaire qui s'est éveillée tardivement et avec une intensité jamais vue. Ses visions ont guidé la faction à travers des crises majeures. Elle a unifié les clans des Éclaireurs sous sa bannière après des années de fragmentation.",
        goals:
          "Conduire les Éclaireurs vers ce qu'elle appelle \"l'Harmonie Totale\" — une forme de symbiose complète avec le monde muté. Convertir ou neutraliser les Inaltérés. Préparer l'avènement d'une nouvelle humanité.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 8. La Caste des Symbiotes — ressources/nature, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: getClan('La Caste des Symbiotes').id,
        name: 'Verta Mossane',
        avatar: null,
        age: 29,
        appearance:
          "Femme robuste à la peau teintée d'un vert grisé caractéristique des Éveillés, qu'elle expose volontiers comme une marque de fierté. Cheveux nattés entremêlés de plantes et de fibres naturelles. Ses vêtements sont fabriqués à partir de matériaux organiques récupérés.",
        personality:
          "Pragmatique et nourricière, Verta voit l'avant-poste comme un écosystème à entretenir. Elle est méthodique, patiente et possède un sens pratique rare chez les Éclaireurs les plus fanatiques. Son approche de la mutation est instrumentale plutôt que religieuse.",
        background:
          "Fille d'un des premiers Symbiotes, elle a grandi avec les plantes mutées comme compagnons. À vingt ans, elle avait cartographié toutes les espèces comestibles de la zone. Elle a développé des techniques de culture en milieu hostile qui ont multiplié par trois la production alimentaire de l'avant-poste.",
        goals:
          "Atteindre l'autosuffisance alimentaire complète de l'avant-poste. Développer de nouvelles symbioses avec des espèces mutées encore inconnues. Créer une pharmacopée des plantes mutées utiles à la faction.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 9. La Caste des Sensitifs — sens/éclaireurs, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: getClan('La Caste des Sensitifs').id,
        name: "Raen l'Écouteur",
        avatar: null,
        age: 17,
        appearance:
          "Adolescent à la peau grisée des Éveillés, d'apparence ordinaire au premier regard. Rien ne trahit sa sensorialité hors du commun, si ce n'est son habitude de légèrement incliner la tête avant de répondre — comme s'il écoutait encore quelque chose que les autres n'entendent plus.",
        personality:
          "Introverti et intense, Raen perçoit le monde avec une acuité qui peut être aussi un fardeau qu'un don. Il parle peu mais observe tout. Sa sensibilité extrême le rend parfois brusque — trop de bruit, trop de lumière — mais aussi exceptionnellement perspicace.",
        background:
          "Enfant sauvage retrouvé dans les ruines à l'âge de six ans, Raen n'a aucun souvenir de ses parents. Ses sens développés ont assuré sa survie. Recueilli par les Sensitifs, il est devenu le plus doué d'entre eux. À seize ans, il a détecté une attaque nocturne des Frères de la Terre Brûlée avec quatre heures d'avance, sauvant l'avant-poste.",
        goals:
          "Étendre le réseau de surveillance sensitif aux zones nord et est encore inconnues. Former les Sensitifs les moins expérimentés à affiner leurs perceptions. Comprendre pourquoi ses capacités s'intensifient de façon anormale depuis six mois.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 10. La Caste des Forgerons de Chair — médecins/biologistes, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: getClan('La Caste des Forgerons de Chair').id,
        name: 'Orryn Tessaire',
        avatar: null,
        age: 35,
        appearance:
          "Homme grand et maigre dont les bras portent les cicatrices de nombreuses expérimentations. Sa main gauche a été remplacée par une prothèse en os et métal de sa propre fabrication. Toujours en tablier de cuir épais taché de substances variées.",
        personality:
          "Intellectuellement brillant et moralement ambigu, Orryn considère que la fin justifie les moyens. Il n'est pas sadique — il est simplement dépourvu de la répulsion face à ce que d'autres jugent inacceptable. Sa fascination pour les mutations biologiques frôle l'obsession.",
        background:
          "Ancien assistant médical des Veilleurs, il a été banni après avoir expérimenté sur des patients. Les Éclaireurs l'ont accueilli comme une ressource précieuse. Ses travaux sur les propriétés des créatures mutées ont depuis permis de développer des traitements révolutionnaires — et des poisons d'une efficacité terrifiante.",
        goals:
          "Cartographier le génome de toutes les mutations connues. Développer un traitement pour induire l'Éveil chez les Inaltérés capturés. Prouver que la biologie mutée est supérieure à toute pharmacopée pré-cataclysme.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 11. La Caste des Déchainés — guerriers mutants, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: getClan('La Caste des Déchainés').id,
        name: 'Kael le Fracasseur',
        avatar: null,
        age: 22,
        appearance:
          "Jeune homme d'une carrure imposante forgée par des années d'entraînement intensif depuis l'enfance. Peau d'un gris sombre caractéristique des Éveillés, qu'il porte à découvert comme une déclaration. Cicatrices de combat sur les bras et le torse.",
        personality:
          "Brutal dans la forme mais pas dans le fond, Kael est d'une loyauté absolue envers son clan et ses Éclaireurs. Il méprise les stratégies complexes et croit en la force directe. Derrière l'aspect intimidant se cache un sens de l'honneur rigide : il ne frappe jamais un ennemi désarmé.",
        background:
          "Né dans un groupe d'Éveillés errants, Kael s'est imposé très tôt par sa constitution physique naturelle et une agressivité canalisée dans le combat. La Caste des Déchainés l'a repéré dès son adolescence. Il est devenu chef après avoir mis à terre l'ancien chef lors d'un duel rituel.",
        goals:
          "Faire des Déchainés la force de frappe la plus redoutée des terres désolées. Provoquer et vaincre le Clan des Sentinelles en combat ouvert. Prouver que les mutants physiques ne sont pas des monstres mais des guerriers.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 12. La Caste des Scrutateurs — archéologues/ruines, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: getClan('La Caste des Scrutateurs').id,
        name: 'Syl Cairne',
        avatar: null,
        age: 30,
        appearance:
          "Femme à la peau d'un gris bleuté que les années passées dans les ruines sombres ont paradoxalement rendue plus visible au soleil. Toujours vêtue de gris et de noir, des outils de fouille à la ceinture et un carnet de croquis sous la main.",
        personality:
          "Analytique et détachée, Syl observe plus qu'elle ne ressent. Elle traite le passé comme une mine d'informations froides plutôt qu'un objet de nostalgie. Elle est l'une des rares Scrutatrices à entretenir une certaine forme de respect — pas d'admiration — pour les Archivistes des Veilleurs.",
        background:
          "Née d'un père Scrutateur et d'une mère dont la mutation a été fatale à l'accouchement, Syl a grandi dans les ruines. À dix-sept ans, elle a découvert un bunker intact contenant des archives militaires décisives pour la faction. Cela lui a valu sa réputation et sa montée au pouvoir au sein de la Caste.",
        goals:
          "Localiser et sécuriser tous les bunkers pré-cataclysme dans un rayon de cinquante kilomètres. Empêcher les Archivistes des Veilleurs d'accéder à certaines découvertes cruciales. Rassembler des preuves que le cataclysme était délibéré.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // ── Clans neutres ────────────────────────────────────────────────────────

      // 13. Les Fouilleurs de Ruines — ethnicity null, faction null, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: getClan('Les Fouilleurs de Ruines').id,
        name: 'Corvus Sablier',
        avatar: null,
        age: 34,
        appearance:
          "Homme d'âge mûr au look de cartographe usé — veste de cuir couverte de poches, loupe gravée à la ceinture, doigts caleux. Barbe de plusieurs jours, regard fatigué mais attentif.",
        personality:
          "Neutre et pragmatique jusqu'à la philosophie, Corvus croit sincèrement que la vérité sur le cataclysme est le seul salut pour l'humanité. Il refuse tout parti pris avec une constance qui irrite autant les Veilleurs que les Éclaireurs.",
        background:
          "Ancien soldat des Veilleurs reconverti après avoir découvert des archives compromettantes que ses supérieurs ont voulu censurer. Il a fondé les Fouilleurs de Ruines comme réponse à ce qu'il appelle \"la falsification organisée de l'histoire\" par les deux factions.",
        goals:
          "Compléter la cartographie exhaustive des ruines de l'Ancien Monde. Constituer une archive neutre et accessible à tous. Révéler la vérité sur les causes du cataclysme, quelles qu'en soient les conséquences.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 14. Les Vagabonds du Vent — ethnicity null, faction null, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: null,
        clan_id: getClan('Les Vagabonds du Vent').id,
        name: 'Maëlle la Marchande',
        avatar: null,
        age: 28,
        appearance:
          "Femme aux vêtements composites de toutes origines, toujours colorés et pratiques. Cheveux roux teints aux plantes mutées en tresses. Sourire commercial permanent, yeux qui calculent en permanence.",
        personality:
          "Opportuniste assumée, Maëlle ne cache pas ses motivations mercantiles. Son sens des affaires est légendaire. Elle fait confiance aux personnes en fonction de leur fiabilité commerciale, pas de leur faction.",
        background:
          "Née dans une caravane en transit entre deux avant-postes, elle n'a jamais eu de chez-soi fixe. Elle a repris la direction du clan à la mort de son père — empoisonné par des clients insatisfaits — à vingt ans. Elle a depuis triplé le réseau commercial des Vagabonds.",
        goals:
          "Établir un réseau d'échanges couvrant toutes les zones habitées connues. Négocier une trêve commerciale durable avec les deux factions principales. Accumuler assez de ressources pour s'offrir une neutralité définitive.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 15. Les Frères de la Terre Brûlée — Inaltérés, faction null, playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: getClan('Les Frères de la Terre Brûlée').id,
        name: 'Rekk le Désenchanté',
        avatar: null,
        age: 42,
        appearance:
          "Vétéran à l'allure taillée dans le roc — visage buriné, cheveux grisonnants rasés, cicatrice en travers de la gorge. Armure composite de récupération, toujours en parfait état d'entretien malgré l'usure.",
        personality:
          "Cynique et direct, Rekk n'a plus d'illusions sur quoi que ce soit. Il n'est pas cruel — il a juste appris à ne rien attendre des grandes causes. Sa loyauté est entière envers ses hommes, et nulle ailleurs.",
        background:
          "Ancien commandant des Sentinelles des Veilleurs, renvoyé après avoir refusé d'exécuter des civils suspectés d'Éveil. Il a fondé les Frères de la Terre Brûlée avec une douzaine d'hommes qui l'ont suivi dans sa chute. Il n'a jamais regretté son choix, mais il ne pardonne pas à Aldric.",
        goals:
          "Assurer la survie de son groupe par tous les moyens légitimes. Éviter de servir l'un ou l'autre camp de façon permanente. Régler ses comptes avec les Veilleurs à l'heure qu'il choisira.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 16. Le Peuple des Ombres — Éveillés, faction null, playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: null,
        clan_id: getClan('Le Peuple des Ombres').id,
        name: "Sera l'Invisible",
        avatar: null,
        age: 18,
        appearance:
          "Jeune femme à la peau teintée d'un gris légèrement orangé qu'elle dissimule méticuleusement sous des vêtements sombres et des applications de boue ou de cendre — refusant de révéler aux inconnus son appartenance aux Éveillés. Svelte et économe en gestes, elle se déplace dans un silence appris dès l'enfance.",
        personality:
          "Discrète, observatrice et économe en mots comme en mouvements. Sera juge les personnes à leurs actes, pas à leurs discours. Elle a une admiration secrète pour la science des Forgerons de Chair, bien qu'elle ne l'admette jamais.",
        background:
          "Enfant solitaire ayant survécu dans les zones dangereuses grâce à une discrétion naturelle affinée par nécessité, elle a rejoint le Peuple des Ombres à douze ans. Elle en est devenue la cheffe à seize ans après avoir traqué et neutralisé un groupe de Loups Solitaires qui menaçait son clan.",
        goals:
          "Maintenir la neutralité du Peuple des Ombres tout en augmentant leur valeur marchande comme éclaireurs. Construire un réseau de caches dans toutes les zones connues. Éviter à tout prix de se retrouver liée à l'une des deux factions.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 17. Les Collecteurs de Chuchotis — ethnicity null, faction null, non-playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: getClan('Les Collecteurs de Chuchotis').id,
        name: 'Voix-Grise',
        avatar: null,
        age: 43,
        appearance:
          "Silhouette indéterminée enveloppée de vêtements neutres, toujours une capuche baissée. Voix douce et uniforme ne trahissant jamais d'émotion. Les rares qui l'ont vu de près rapportent des yeux inexpressifs comme du verre.",
        personality:
          "Absolument neutre, Voix-Grise est l'incarnation de l'impartialité calculée. Ni amis ni ennemis — seulement des sources et des clients. Sa seule règle : ne jamais vendre la même information aux deux camps simultanément.",
        background:
          "Nul ne sait d'où vient Voix-Grise, ni si c'est un titre qui passe de main en main. Les archives des Collecteurs mentionnent ce nom depuis les toutes premières années post-cataclysme. Certains pensent que c'est une organisation déguisée en individu.",
        goals:
          "Maintenir le réseau d'information des Collecteurs dans toutes les zones habitées. Rester parfaitement neutre dans tous les conflits. Accumuler des secrets suffisamment compromettants pour garantir la sécurité du clan.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 18. Les Loups Solitaires — ethnicity null, faction null, non-playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: null,
        clan_id: getClan('Les Loups Solitaires').id,
        name: 'Brann le Fléau',
        avatar: null,
        age: 26,
        appearance:
          "Homme imposant au visage couvert de tatouages de bandes, dents en métal remplacées au combat, cheveux en locks noircis à la cendre. Armé en permanence, il dégaine au moindre regard de travers.",
        personality:
          "Violent, imprévisible et opportuniste, Brann règne par la peur et la force brute. Capable d'une brutalité sans limites envers les étrangers, il peut faire preuve d'une loyauté tribale farouche envers ses propres hommes — tant qu'ils lui sont utiles.",
        background:
          "Ancien enfant de rue qui a grandi dans les zones les plus dangereuses des terres désolées. Il a constitué sa bande à coups de combats gagnés et de rivaux éliminés. Les Loups Solitaires sous sa direction sont devenus la menace la plus directe pour les convois commerciaux.",
        goals:
          "Prendre le contrôle du carrefour commercial central des terres désolées. Écraser quiconque ose s'opposer à lui. Transformer les Loups en une force assez redoutable pour que même les factions lui paient un tribut.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 19. Les Dévoreurs d'Âmes — Éveillés, faction null, non-playable
      {
        user_id: null,
        ethnicity_id: eveilles.id,
        faction_id: null,
        clan_id: getClan("Les Dévoreurs d'Âmes").id,
        name: 'Malgrin le Dévot',
        avatar: null,
        age: 32,
        appearance:
          "Homme à la peau d'un gris cendré qu'il recouvre entièrement de peintures rituelles à base de cendres et de sang séché — camouflant délibérément sa condition d'Éveillé derrière l'apparence d'un ascète quelconque. Corps décharné mais d'une force surprenante.",
        personality:
          "Fanatique calme et persuasif — plus dangereux que s'il hurlait. Malgrin est convaincu de sa mission divine et parle avec une sérénité glaçante. Sa folie est d'autant plus terrifiante qu'elle est articulée et cohérente dans son propre système de croyances.",
        background:
          "Ancien disciple des Prophètes de l'Harmonie, banni pour ses rituels cannibales. Il a trouvé dans son bannissement la confirmation de sa \"vérité révélée\" : que les Prophètes eux-mêmes ont peur de la mutation totale. Il a rassemblé les bannis les plus extrêmes autour de lui.",
        goals:
          "\"Purifier\" assez d'âmes pour déclencher ce qu'il appelle \"l'Éveil Final\". Convaincre d'autres mutants que sa voie est la seule vraie. Éliminer Nyx qu'il considère comme une hérétique timorée.",
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },

      // 20. Le Sanctuaire du Silence — Inaltérés, faction null, non-playable
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: getClan('Le Sanctuaire du Silence').id,
        name: 'Frère Callum',
        avatar: null,
        age: 44,
        appearance:
          "Vieil homme aux mains douces et au sourire permanent. Cheveux blancs en désordre, vêtements simples et usés mais propres. Il se déplace lentement, sans jamais sembler pressé.",
        personality:
          "D'une sérénité qui confine à l'irritante pour ceux qui vivent dans la violence, Callum ne juge pas mais n'approuve pas non plus. Son calme est réel, pas feint — il a simplement arrêté d'avoir peur il y a longtemps.",
        background:
          "Ancien médecin des Veilleurs, parti après que Sorine l'a forcé à pratiquer des procédures forcées sur des suspects d'Éveil. Il a fondé le Sanctuaire du Silence sur les ruines d'un monastère, accueillant tous ceux qui refusent la guerre — mutants comme non-mutants.",
        goals:
          "Maintenir un espace de paix dans un monde qui n'en veut plus. Soigner quiconque se présente sans discrimination. Espérer qu'un jour les factions comprendront que la coexistence est la seule issue durable.",
        status: 'approved',
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
    await queryInterface.bulkDelete('characters', null, {});
  },
};
