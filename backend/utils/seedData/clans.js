/**
 * Données de seed pour les clans
 */

// Clans de la faction mutante (Les Éveillés)
export const mutantClansData = [
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

// Clans de la faction non-mutante (Les Inaltérés)
export const nonMutantClansData = [
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

// Clans neutres indépendants
export const neutralClansData = [
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
