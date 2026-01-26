/**
 * Données des factions d'Érosion des Âmes
 * Chaque faction possède une identité visuelle unique et une philosophie distincte
 */

import {
  StoneGuardianEmblem,
  FlameBearerEmblem,
  ShadowHunterEmblem,
  AshWeaverEmblem,
  RuinExplorerEmblem
} from './FactionEmblems'

export const factionsData = [
  {
    id: 'stone-guardians',
    name: 'Gardiens de Pierre',
    tagline: 'Protecteurs des Ruines Anciennes',
    philosophy: '"La mémoire est notre armure, les ruines notre sanctuaire."',
    description:
      'Sentinelles immuables des vestiges du monde ancien, les Gardiens veillent sur les secrets ensevelis dans la pierre. Ils croient que chaque ruine recèle une vérité oubliée, et que protéger le passé est le seul moyen de forger un avenir.',
    values: ['Mémoire', 'Protection', 'Stabilité', 'Honneur'],
    colors: {
      primary: '#6B7280',
      accent: '#94A3B8',
      glow: '#CBD5E1',
    },
    Emblem: StoneGuardianEmblem,
  },
  {
    id: 'flame-bearers',
    name: 'Porteurs de Flamme',
    tagline: 'Gardiens du Feu Sacré',
    philosophy: '"Dans la flamme éternelle, nous trouvons la transformation."',
    description:
      'Descendants des premiers allumeurs de feu, ils maintiennent vivantes les braises sacrées qui repoussent l\'obscurité. Pour eux, la flamme n\'est pas seulement lumière : c\'est vie, passion et renaissance perpétuelle.',
    values: ['Passion', 'Transformation', 'Courage', 'Vitalité'],
    colors: {
      primary: '#E67315',
      accent: '#F59E0B',
      glow: '#FCD34D',
    },
    Emblem: FlameBearerEmblem,
  },
  {
    id: 'shadow-hunters',
    name: 'Chasseurs d\'Ombres',
    tagline: 'Traqueurs des Créatures de la Faille',
    philosophy: '"Nous marchons dans l\'obscurité pour que d\'autres voient la lumière."',
    description:
      'Prédateurs silencieux des terres crépusculaires, ils traquent les aberrations nées de la Faille. Leur maîtrise de la furtivité et du combat rapproché en fait les guerriers les plus redoutés des terres désolées.',
    values: ['Agilité', 'Vigilance', 'Sacrifice', 'Mystère'],
    colors: {
      primary: '#6366F1',
      accent: '#8B5CF6',
      glow: '#A78BFA',
    },
    Emblem: ShadowHunterEmblem,
  },
  {
    id: 'ash-weavers',
    name: 'Tisserands de Cendres',
    tagline: 'Chamans et Guérisseurs',
    philosophy: '"De la cendre renaît la vie, du cycle émerge la sagesse."',
    description:
      'Mystiques connectés aux esprits de la terre brûlée, ils tissent les énergies du monde pour guérir les blessures et apaiser les âmes tourmentées. Ils voient dans chaque cendre la promesse d\'une renaissance.',
    values: ['Sagesse', 'Guérison', 'Harmonie', 'Cycle'],
    colors: {
      primary: '#10B981',
      accent: '#34D399',
      glow: '#6EE7B7',
    },
    Emblem: AshWeaverEmblem,
  },
  {
    id: 'ruin-explorers',
    name: 'Éclaireurs des Ruines',
    tagline: 'Explorateurs et Archéologues',
    philosophy: '"Chaque fragment révèle une vérité, chaque carte ouvre un chemin."',
    description:
      'Aventuriers assoiffés de connaissance, ils cartographient les terres inexplorées et déchiffrent les artefacts oubliés. Leur curiosité insatiable les pousse toujours plus loin dans les profondeurs dangereuses.',
    values: ['Connaissance', 'Curiosité', 'Audace', 'Découverte'],
    colors: {
      primary: '#F59E0B',
      accent: '#D97706',
      glow: '#FBBF24',
    },
    Emblem: RuinExplorerEmblem,
  },
]
