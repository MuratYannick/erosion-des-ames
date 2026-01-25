/**
 * Données mockées pour les actualités
 * À remplacer par des appels API réels en production
 */

export const mockNews = [
  {
    id: '1',
    type: 'event',
    title: 'Le Rituel des Cendres Éternelles',
    excerpt: 'Un événement unique où les joueurs pourront participer à un rituel ancestral pour raviver les flammes sacrées. Récompenses exclusives pour les participants.',
    date: '2026-01-22',
    isNew: true,
    link: '/news/rituel-cendres-eternelles'
  },
  {
    id: '2',
    type: 'update',
    title: 'Mise à jour Alpha v0.1.2',
    excerpt: 'Corrections de bugs, amélioration des performances et ajout de nouvelles gravures tribales découvrables dans les ruines.',
    date: '2026-01-20',
    isNew: true,
    link: '/news/update-v0-1-2'
  },
  {
    id: '3',
    type: 'announcement',
    title: 'Nouvelle région explorable',
    excerpt: 'Les Marais Oubliés sont désormais accessibles. Attention aux esprits égarés qui hantent ces terres désolées.',
    date: '2026-01-18',
    isNew: false,
    link: '/news/marais-oublies'
  },
  {
    id: '4',
    type: 'update',
    title: 'Système de Clans disponible',
    excerpt: 'Formez votre tribu, construisez votre campement et affrontez les autres clans pour la suprématie des ruines.',
    date: '2026-01-15',
    isNew: false,
    link: '/news/systeme-clans'
  },
  {
    id: '5',
    type: 'event',
    title: 'La Nuit des Âmes Perdues',
    excerpt: 'Pendant trois nuits, les âmes errantes apparaîtront dans le monde. Capturez-les pour obtenir des récompenses mystiques.',
    date: '2026-01-10',
    isNew: false,
    link: '/news/nuit-ames-perdues'
  },
  {
    id: '6',
    type: 'announcement',
    title: 'Serveur Européen bientôt disponible',
    excerpt: 'Pour améliorer l\'expérience de jeu, un nouveau serveur dédié à l\'Europe sera lancé prochainement.',
    date: '2026-01-08',
    isNew: false,
    link: '/news/serveur-europeen'
  }
]

export default mockNews
