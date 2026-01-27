/**
 * Données des personnages prédéfinis
 * "Les Âmes Marquées" - Personnages-exemples adoptables par les joueurs
 */

export const races = [
  { id: 'human', label: 'Humain', rune: '◇' },
  { id: 'marked', label: 'Marqué', rune: '◆' },
  { id: 'shade', label: 'Ombre', rune: '◈' },
  { id: 'ember', label: 'Braise', rune: '◊' }
]

export const classes = [
  { id: 'warrior', label: 'Guerrier', icon: '⚔' },
  { id: 'shaman', label: 'Chamane', icon: '☽' },
  { id: 'scout', label: 'Éclaireur', icon: '◎' },
  { id: 'healer', label: 'Guérisseur', icon: '✦' },
  { id: 'mystic', label: 'Mystique', icon: '∆' },
  { id: 'artisan', label: 'Artisan', icon: '⬡' }
]

export const factions = [
  {
    id: 'ash-guardians',
    label: 'Gardiens des Cendres',
    color: '#e67315',
    glowColor: 'rgba(230, 115, 21, 0.4)'
  },
  {
    id: 'forgotten-seekers',
    label: 'Chercheurs de l\'Oubli',
    color: '#6b8cce',
    glowColor: 'rgba(107, 140, 206, 0.4)'
  },
  {
    id: 'flame-keepers',
    label: 'Gardiens de la Flamme',
    color: '#c9a227',
    glowColor: 'rgba(201, 162, 39, 0.4)'
  },
  {
    id: 'shadow-walkers',
    label: 'Marcheurs d\'Ombre',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)'
  },
  {
    id: 'wanderers',
    label: 'Errants',
    color: '#7a6454',
    glowColor: 'rgba(122, 100, 84, 0.4)'
  }
]

export const difficultyLevels = [
  { id: 1, label: 'Novice', description: 'Idéal pour débuter le RP' },
  { id: 2, label: 'Accessible', description: 'Quelques nuances à maîtriser' },
  { id: 3, label: 'Intermédiaire', description: 'Personnalité complexe' },
  { id: 4, label: 'Avancé', description: 'Background riche et nuancé' },
  { id: 5, label: 'Expert', description: 'Roleplay exigeant et profond' }
]

export const presetCharacters = [
  {
    id: 'kael-ashborn',
    name: 'Kael Cendrenuit',
    race: 'marked',
    class: 'warrior',
    faction: 'ash-guardians',
    age: 34,
    difficulty: 2,
    shortDescription: 'Vétéran des guerres tribales, il porte les cicatrices de batailles oubliées et un honneur qui refuse de s\'éteindre.',
    quote: '"Les cendres se souviennent de ce que les vivants oublient."',
    avatar: '/images/characters/kael.jpg',
    background: `Né dans les ruines de l'Ancien Temple, Kael a grandi dans l'ombre des géants de pierre tombés. Orphelin dès son plus jeune âge, il fut recueilli par les Gardiens des Cendres qui virent en lui une flamme particulière.

Les marques tribales sur son visage racontent l'histoire de ses épreuves : chaque ligne est un combat, chaque rune un serment. Il a traversé les Terres Brûlées, combattu les Ombres Errantes, et protégé les caravanes de réfugiés pendant la Grande Migration.

Aujourd'hui, il erre entre les tribus, offrant sa lame à ceux qui honorent les anciennes traditions. Mais une quête personnelle le consume : retrouver l'artefact qui causa la chute de son temple natal.`,
    traits: [
      { type: 'strength', label: 'Loyauté indéfectible' },
      { type: 'weakness', label: 'Incapable de pardonner' },
      { type: 'quirk', label: 'Parle aux cendres des morts' }
    ],
    abilities: [
      'Maîtrise des armes tribales',
      'Résistance à la douleur',
      'Lecture des traces de cendres',
      'Rituel de protection du feu'
    ],
    equipment: [
      'Lame d\'obsidienne ancestrale',
      'Armure de cuir gravé',
      'Amulette des premiers feux',
      'Cendres sacrées en fiole'
    ],
    rpNotes: 'Kael est un personnage honorable mais hanté. Il s\'exprime avec parcimonie et préfère les actes aux paroles. Idéal pour les joueurs aimant les archétypes de guerrier noble.'
  },
  {
    id: 'lyria-mistwalker',
    name: 'Lyria Brumemonde',
    race: 'shade',
    class: 'mystic',
    faction: 'forgotten-seekers',
    age: 127,
    difficulty: 4,
    shortDescription: 'Mi-ombre mi-lumière, elle navigue entre les mondes à la recherche de vérités que nul ne devrait connaître.',
    quote: '"L\'oubli n\'est pas une perte, c\'est une porte."',
    avatar: '/images/characters/lyria.jpg',
    background: `Lyria n'est pas née, elle s'est éveillée. Un jour, dans les brumes du Lac des Songes Perdus, une conscience émergea des vapeurs – ni humaine, ni esprit, mais quelque chose entre les deux.

Les Chercheurs de l'Oubli la trouvèrent errant sur la rive, sans souvenirs mais emplie d'un savoir ancien. Ils reconnurent en elle une Marchombre, une créature rare née de la fusion entre une âme errante et les brumes mystiques.

Depuis, Lyria parcourt le monde en quête de fragments de mémoire – la sienne et celle du monde. Elle peut voir les échos du passé, entendre les murmures des disparus, mais chaque vision l'éloigne un peu plus de sa propre humanité.`,
    traits: [
      { type: 'strength', label: 'Vision des échos temporels' },
      { type: 'weakness', label: 'Connexion fragile à la réalité' },
      { type: 'quirk', label: 'Ne projette pas toujours d\'ombre' }
    ],
    abilities: [
      'Marche dans les brumes',
      'Lecture des âmes',
      'Communion avec les ancêtres',
      'Dissipation dans l\'ombre'
    ],
    equipment: [
      'Voile tissé de brume',
      'Orbe de mémoires fragmentées',
      'Carillon des esprits',
      'Grimoire des oubliés'
    ],
    rpNotes: 'Lyria offre un RP riche mais exigeant. Sa nature ambiguë permet des interactions uniques mais demande une compréhension fine des mystères du monde.'
  },
  {
    id: 'theron-ironhand',
    name: 'Theron Maindefer',
    race: 'human',
    class: 'artisan',
    faction: 'flame-keepers',
    age: 52,
    difficulty: 1,
    shortDescription: 'Forgeron légendaire dont les créations portent l\'essence même du feu sacré des anciens.',
    quote: '"Une lame bien forgée est une prière solidifiée."',
    avatar: '/images/characters/theron.jpg',
    background: `Theron est né dans une lignée de forgerons remontant à l'époque avant l'Érosion. Son père, et le père de son père, ont tous œuvré à préserver les techniques anciennes de la forge sacrée.

Dans son atelier au cœur du Sanctuaire de la Flamme Éternelle, Theron maintient le dernier feu qui brûle depuis le Temps d'Avant. Chaque arme qu'il crée porte une parcelle de cette flamme primordiale.

Bien que vieillissant, Theron reste actif. Il voyage parfois pour collecter des métaux rares ou pour réparer des artefacts brisés. Il cherche un apprenti digne de recevoir ses secrets, mais peu possèdent la patience et la dévotion nécessaires.`,
    traits: [
      { type: 'strength', label: 'Patience infinie' },
      { type: 'weakness', label: 'Perfectionniste obsessionnel' },
      { type: 'quirk', label: 'Juge les gens par leurs outils' }
    ],
    abilities: [
      'Maître forgeron',
      'Enchantement du feu',
      'Lecture des métaux',
      'Réparation d\'artefacts'
    ],
    equipment: [
      'Marteau des Premiers Forgerons',
      'Tablier ignifugé sacré',
      'Lunettes de vision thermique',
      'Coffret de métaux rares'
    ],
    rpNotes: 'Theron est idéal pour les débutants. Son personnage est ancré, stable et offre des opportunités de RP variées : création d\'objets, mentorat, quêtes de ressources.'
  },
  {
    id: 'vera-nightbloom',
    name: 'Vera Florenuit',
    race: 'ember',
    class: 'healer',
    faction: 'shadow-walkers',
    age: 29,
    difficulty: 3,
    shortDescription: 'Guérisseuse aux méthodes controversées, elle soigne les corps en conversant avec la mort elle-même.',
    quote: '"La mort n\'est pas mon ennemie, c\'est ma plus vieille alliée."',
    avatar: '/images/characters/vera.jpg',
    background: `Vera aurait dû mourir à sa naissance – les sages-femmes la déclarèrent morte-née. Mais quelque chose la ramena, et avec elle, un don terrifiant : la capacité de voir la mort dans les yeux des vivants.

Bannie de sa tribu natale qui la considérait comme une abomination, elle trouva refuge chez les Marcheurs d'Ombre. Là, elle apprit à transformer sa malédiction en bénédiction, utilisant sa connexion avec l'au-delà pour arracher les âmes au seuil de la mort.

Ses méthodes de guérison sont peu orthodoxes : elle ne soigne pas seulement le corps, elle négocie avec les esprits de maladie, marchande avec la faucheuse, et parfois accepte des prix que nul autre ne paierait.`,
    traits: [
      { type: 'strength', label: 'Guérison miraculeuse' },
      { type: 'weakness', label: 'Chaque soin a un prix' },
      { type: 'quirk', label: 'Murmure aux mourants' }
    ],
    abilities: [
      'Nécromancie curative',
      'Vision de la mort',
      'Pacte avec les esprits',
      'Transfert de douleur'
    ],
    equipment: [
      'Sacoche d\'herbes interdites',
      'Crâne de son jumeau mort-né',
      'Aiguilles d\'os gravées',
      'Fioles de larmes de spectre'
    ],
    rpNotes: 'Vera offre un RP moralement ambigu. Elle fait le bien par des moyens sombres. Idéale pour les joueurs aimant explorer les zones grises.'
  },
  {
    id: 'renn-swiftfoot',
    name: 'Renn Piedléger',
    race: 'human',
    class: 'scout',
    faction: 'wanderers',
    age: 23,
    difficulty: 2,
    shortDescription: 'Jeune messager des tribus, il court plus vite que le vent et porte les nouvelles à travers les terres désolées.',
    quote: '"Une nouvelle qui n\'arrive pas à temps n\'est plus qu\'une rumeur."',
    avatar: '/images/characters/renn.jpg',
    background: `Renn n'a jamais connu ses parents – abandonné au carrefour des Quatre Vents, il fut élevé par une succession de voyageurs qui se le passaient comme un colis vivant. Cette enfance nomade lui donna des jambes infatigables et une soif de mouvement.

À quinze ans, il intégra le réseau des Coureurs de Brume, messagers qui relient les tribus dispersées. Aujourd'hui, il est l'un des plus rapides et des plus fiables. Il connaît chaque sentier, chaque raccourci, chaque cachette des Terres Érodées.

Mais Renn porte un secret : lors d'une livraison, il a lu un message qu'il n'aurait pas dû voir. Depuis, quelqu'un le traque – et il ne peut pas s'arrêter de courir.`,
    traits: [
      { type: 'strength', label: 'Vitesse et endurance' },
      { type: 'weakness', label: 'Incapable de rester en place' },
      { type: 'quirk', label: 'Parle très vite' }
    ],
    abilities: [
      'Course extraordinaire',
      'Orientation parfaite',
      'Furtivité naturelle',
      'Mémoire eidétique'
    ],
    equipment: [
      'Bottes de coureur enchanté',
      'Sacoche de messages scellés',
      'Sifflet de signal tribal',
      'Carte mentale des territoires'
    ],
    rpNotes: 'Renn est dynamique et accessible. Son rôle de messager permet de s\'intégrer facilement dans différentes intrigues et de rencontrer de nombreux PNJ.'
  },
  {
    id: 'morgana-stormcaller',
    name: 'Morgana Appelle-Tempête',
    race: 'marked',
    class: 'shaman',
    faction: 'ash-guardians',
    age: 45,
    difficulty: 5,
    shortDescription: 'Haute Chamane marquée par la foudre, elle porte le fardeau de parler pour les esprits et de juger les vivants.',
    quote: '"Les esprits ne mentent jamais. Ce sont les vivants qui refusent d\'entendre."',
    avatar: '/images/characters/morgana.jpg',
    background: `Morgana fut frappée par la foudre à l'âge de douze ans, lors du plus violent orage que les Terres Érodées aient connu depuis l'Érosion. Elle aurait dû mourir, mais l'éclair lui insuffla autre chose : la voix des tempêtes.

Depuis, les marques de Lichtenberg parcourent son corps comme des rivières de lumière. Elle entend les esprits du ciel, de la terre et du feu. Elle peut invoquer le tonnerre, apaiser les tempêtes, et lire l'avenir dans les éclairs.

Devenue Haute Chamane des Gardiens des Cendres, elle porte un fardeau immense : chaque décision tribale importante passe par elle, chaque conflit requiert son jugement. Elle est respectée, crainte, et terriblement seule.`,
    traits: [
      { type: 'strength', label: 'Pouvoir chamanique immense' },
      { type: 'weakness', label: 'Isolée par son statut' },
      { type: 'quirk', label: 'Les tempêtes la suivent' }
    ],
    abilities: [
      'Invocation des tempêtes',
      'Communion spirituelle',
      'Jugement des esprits',
      'Marche dans les éclairs'
    ],
    equipment: [
      'Bâton de foudre pétrifiée',
      'Manteau de plumes d\'orage',
      'Collier de crocs de tonnerre',
      'Calice des libations sacrées'
    ],
    rpNotes: 'Morgana est un personnage de pouvoir et de responsabilité. Elle demande un joueur capable de gérer l\'autorité morale et les dilemmes éthiques complexes.'
  },
  {
    id: 'dex-shadowmend',
    name: 'Dex Ravaudombre',
    race: 'shade',
    class: 'scout',
    faction: 'shadow-walkers',
    age: 'Inconnu',
    difficulty: 4,
    shortDescription: 'Espion légendaire dont même l\'existence est sujet à débat. Certains disent qu\'il n\'est qu\'une rumeur.',
    quote: '"..."',
    avatar: '/images/characters/dex.jpg',
    background: `Personne ne sait vraiment qui est Dex, ni même s'il existe réellement. Les rapports le décrivent comme une ombre parmi les ombres, un fantôme capable de s'infiltrer n'importe où et de disparaître sans laisser de traces.

Ce que l'on sait : il travaille pour les Marcheurs d'Ombre. Il collecte des informations impossibles à obtenir. Il n'a jamais été capturé, et ceux qui prétendent l'avoir rencontré donnent des descriptions contradictoires.

Peut-être est-il plusieurs personnes utilisant le même nom. Peut-être est-il un esprit. Ou peut-être est-il simplement très, très doué pour ne pas être trouvé.`,
    traits: [
      { type: 'strength', label: 'Invisibilité parfaite' },
      { type: 'weakness', label: 'Identité fragmentée' },
      { type: 'quirk', label: 'Ne parle que par notes' }
    ],
    abilities: [
      'Fusion avec les ombres',
      'Déplacement silencieux',
      'Déguisement parfait',
      'Effacement de traces'
    ],
    equipment: [
      'Équipement... inconnu',
      'Notes en encre invisible',
      'Multiples identités',
      'Réseau de contacts'
    ],
    rpNotes: 'Dex est un défi. Il permet un RP mystérieux et minimaliste. Recommandé pour les joueurs expérimentés aimant les personnages énigmatiques.'
  },
  {
    id: 'alba-dawnbringer',
    name: 'Alba Porteaurore',
    race: 'ember',
    class: 'healer',
    faction: 'flame-keepers',
    age: 31,
    difficulty: 2,
    shortDescription: 'Prêtresse de la lumière résiduelle, elle incarne l\'espoir dans un monde de cendres.',
    quote: '"Même la plus petite flamme peut réchauffer un cœur gelé."',
    avatar: '/images/characters/alba.jpg',
    background: `Alba est née lors de la seule éclipse solaire depuis l'Érosion – un moment considéré comme un présage. Les Gardiens de la Flamme l'ont immédiatement prise sous leur aile, voyant en elle un signe des anciens dieux.

Élevée dans le temple, elle a appris les arts de la lumière curative et de la flamme purificatrice. Contrairement à Vera, ses méthodes sont pures et traditionnelles : elle canalise la chaleur du Premier Feu pour soigner les corps et apaiser les esprits.

Alba croit fermement qu'un nouveau jour viendra, que l'Érosion n'est qu'une nuit longue avant l'aube. Cette foi inébranlable en fait un phare pour les désespérés – et une cible pour ceux qui profitent des ténèbres.`,
    traits: [
      { type: 'strength', label: 'Foi inébranlable' },
      { type: 'weakness', label: 'Naïveté occasionnelle' },
      { type: 'quirk', label: 'Chante des hymnes anciens' }
    ],
    abilities: [
      'Guérison par la lumière',
      'Purification du feu',
      'Bénédiction protectrice',
      'Aura apaisante'
    ],
    equipment: [
      'Robe cérémonielle brodée d\'or',
      'Flamme éternelle en lanterne',
      'Huiles sacrées de guérison',
      'Livre des Hymnes Premiers'
    ],
    rpNotes: 'Alba est un pilier de lumière dans un monde sombre. Idéale pour les joueurs voulant incarner l\'espoir et la compassion sans complexité morale.'
  }
]

// Helpers
export const getRaceById = (id) => races.find(r => r.id === id)
export const getClassById = (id) => classes.find(c => c.id === id)
export const getFactionById = (id) => factions.find(f => f.id === id)
export const getDifficultyById = (level) => difficultyLevels.find(d => d.id === level)
