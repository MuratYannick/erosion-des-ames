/**
 * locationData.js
 * Données des lieux importants de l'univers Erosion des Ames
 */

export const locationsData = [
  {
    id: 'ancient-empire-ruins',
    name: 'Les Ruines de l\'Ancien Empire',
    slug: 'ruines-ancien-empire',
    type: 'ruins',
    dangerLevel: 4,
    description: 'Vestiges titanesques de la capitale déchue, où les échos du passé murmurent encore parmi les colonnes brisées. Les artefacts anciens y dorment sous la surveillance d\'ombres millénaires.',
    shortDescription: 'Vestiges de la capitale déchue',
    coordinates: '47°N, 12°E',
    image: '/images/locations/ruins-empire.jpg',
    imageAlt: 'Colonnes brisées et architecture ancienne dans la brume',
    discovered: true,
    landmarks: ['Le Palais Effondré', 'La Place des Rois Oubliés', 'Les Archives Muettes'],
    tribes: ['Gardiens de la Flamme'],
    resources: ['Artefacts anciens', 'Grimoires perdus', 'Métaux rares'],
    threats: ['Ombres gardiennes', 'Ruines instables', 'Malédictions ancestrales']
  },
  {
    id: 'ember-sanctuary',
    name: 'Le Sanctuaire des Braises',
    slug: 'sanctuaire-braises',
    type: 'sanctuary',
    dangerLevel: 2,
    description: 'Temple sacré où brûle la Flamme Éternelle, cœur spirituel des tribus survivantes. Un havre de lumière et de chaleur dans l\'obscurité du monde brisé.',
    shortDescription: 'Temple du feu sacré',
    coordinates: '43°N, 8°E',
    image: '/images/locations/sanctuary-ember.jpg',
    imageAlt: 'Temple illuminé par des flammes éternelles',
    discovered: true,
    landmarks: ['L\'Autel de Feu', 'Les Brasiers Rituels', 'La Salle des Oracles'],
    tribes: ['Gardiens de la Flamme', 'Forgerons du Crépuscule'],
    resources: ['Feu sacré', 'Bénédictions', 'Formations rituelles'],
    threats: ['Faible - Protégé par les Gardiens']
  },
  {
    id: 'desolate-plains',
    name: 'Les Plaines Désolées',
    slug: 'plaines-desolees',
    type: 'desert',
    dangerLevel: 3,
    description: 'Étendues infinies de cendres grises où le vent hurle comme une bête mourante. Seuls les plus robustes osent traverser ces terres sans vie sous le ciel de plomb.',
    shortDescription: 'Étendues de cendres infinies',
    coordinates: '38°N, 18°E',
    image: '/images/locations/plains-desolate.jpg',
    imageAlt: 'Paysage désolé de cendres et de poussière',
    discovered: true,
    landmarks: ['Le Désert de Cendre', 'Les Colonnes de Sel', 'L\'Oasis Fantôme'],
    tribes: ['Nomades de Cendre'],
    resources: ['Minéraux rares', 'Fossiles anciens'],
    threats: ['Tempêtes de cendre', 'Déshydratation', 'Créatures des sables']
  },
  {
    id: 'whispering-forest',
    name: 'La Forêt des Murmures',
    slug: 'foret-murmures',
    type: 'forest',
    dangerLevel: 5,
    description: 'Arbres pétrifiés qui chuchotent les secrets des morts. Ceux qui s\'y aventurent trop profondément n\'en reviennent jamais... ou reviennent changés, hantés par des voix qu\'eux seuls entendent.',
    shortDescription: 'Arbres pétrifiés qui chuchotent',
    coordinates: '51°N, 6°W',
    image: '/images/locations/forest-whisper.jpg',
    imageAlt: 'Forêt sombre d\'arbres pétrifiés dans la brume',
    discovered: true,
    landmarks: ['Le Cœur Pétrifié', 'Le Cercle des Anciens', 'La Source Silencieuse'],
    tribes: ['Aucune - Zone maudite'],
    resources: ['Bois pétrifié', 'Herbes maudites', 'Échos du passé'],
    threats: ['Esprits tourmentés', 'Folie progressive', 'Créatures distordues']
  },
  {
    id: 'cataclysm-chasm',
    name: 'Le Gouffre de la Faille',
    slug: 'gouffre-faille',
    type: 'chasm',
    dangerLevel: 5,
    description: 'Cicatrice béante du Cataclysme, un abîme sans fond d\'où s\'échappent des lueurs étranges et des gémissements inhumains. La source même de l\'Érosion qui ronge les âmes.',
    shortDescription: 'Cicatrice béante du Cataclysme',
    coordinates: '45°N, 15°E',
    image: '/images/locations/chasm-cataclysm.jpg',
    imageAlt: 'Gouffre immense avec des lueurs mystérieuses',
    discovered: true,
    landmarks: ['Le Bord du Monde', 'Les Ponts Brisés', 'Les Profondeurs Hurlantes'],
    tribes: ['Aucune - Interdit'],
    resources: ['Fragments d\'érosion', 'Énergie corrompue'],
    threats: ['Corruption totale', 'Chute mortelle', 'Abominations des profondeurs']
  },
  {
    id: 'eroded-refuge',
    name: 'Le Refuge des Érodés',
    slug: 'refuge-erodes',
    type: 'settlement',
    dangerLevel: 1,
    description: 'Dernier bastion de l\'humanité, construit dans les ruines fortifiées d\'un ancien fort. Un refuge précaire où les survivants tentent de préserver ce qui reste de civilisation.',
    shortDescription: 'Dernier bastion de l\'humanité',
    coordinates: '44°N, 10°E',
    image: '/images/locations/refuge-eroded.jpg',
    imageAlt: 'Fortification improvisée dans des ruines anciennes',
    discovered: true,
    landmarks: ['Les Murs Renforcés', 'La Place du Marché', 'La Tour de Guet'],
    tribes: ['Toutes les tribus coexistent ici'],
    resources: ['Nourriture', 'Eau potable', 'Commerce', 'Sécurité relative'],
    threats: ['Rares - Bien protégé']
  }
]

/**
 * Types de lieux avec leurs métadonnées
 */
export const locationTypes = {
  ruins: {
    label: 'Ruines',
    icon: 'ruins',
    color: '#7a6454',
    description: 'Vestiges d\'une civilisation disparue'
  },
  sanctuary: {
    label: 'Sanctuaire',
    icon: 'sanctuary',
    color: '#e67315',
    description: 'Lieu sacré et protégé'
  },
  desert: {
    label: 'Désert',
    icon: 'desert',
    color: '#bba794',
    description: 'Étendues arides et dangereuses'
  },
  forest: {
    label: 'Forêt',
    icon: 'forest',
    color: '#4a6f4d',
    description: 'Zone boisée mystérieuse'
  },
  chasm: {
    label: 'Gouffre',
    icon: 'chasm',
    color: '#7a2e28',
    description: 'Abîme profond et dangereux'
  },
  settlement: {
    label: 'Refuge',
    icon: 'settlement',
    color: '#4d6f82',
    description: 'Lieu habité et fortifié'
  }
}

/**
 * Niveaux de danger avec leurs métadonnées
 */
export const dangerLevels = {
  1: {
    label: 'Sûr',
    description: 'Peu ou pas de danger',
    color: '#6b8e6f',
    runes: 1,
    textClass: 'text-success-light'
  },
  2: {
    label: 'Faible',
    description: 'Dangers mineurs',
    color: '#d49858',
    runes: 2,
    textClass: 'text-warning-light'
  },
  3: {
    label: 'Modéré',
    description: 'Précautions nécessaires',
    color: '#ff9635',
    runes: 3,
    textClass: 'text-secondary-400'
  },
  4: {
    label: 'Élevé',
    description: 'Très dangereux',
    color: '#c2580d',
    runes: 4,
    textClass: 'text-secondary-600'
  },
  5: {
    label: 'Extrême',
    description: 'Mortel - Éviter',
    color: '#a63f38',
    runes: 5,
    textClass: 'text-error'
  }
}

/**
 * Fonction utilitaire pour obtenir les lieux par niveau de danger
 */
export const getLocationsByDanger = (level) => {
  return locationsData.filter(loc => loc.dangerLevel === level)
}

/**
 * Fonction utilitaire pour obtenir les lieux par type
 */
export const getLocationsByType = (type) => {
  return locationsData.filter(loc => loc.type === type)
}

/**
 * Fonction utilitaire pour obtenir un lieu par slug
 */
export const getLocationBySlug = (slug) => {
  return locationsData.find(loc => loc.slug === slug)
}

/**
 * Fonction utilitaire pour obtenir un lieu par id
 */
export const getLocationById = (id) => {
  return locationsData.find(loc => loc.id === id)
}
