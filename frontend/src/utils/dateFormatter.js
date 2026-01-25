/**
 * Utilitaires de formatage de dates
 * Style immersif pour l'univers Erosion des Ames
 */

/**
 * Formate une date de manière relative et immersive
 * @param {string|Date} dateString - Date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} Date formatée
 */
export const formatRelativeDate = (dateString, options = {}) => {
  const {
    locale = 'fr-FR',
    useRelative = true,
    maxRelativeDays = 30
  } = options

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Si on veut du relatif et que c'est dans la plage
  if (useRelative && diffDays <= maxRelativeDays) {
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays === 2) return "Avant-hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`

    const weeks = Math.floor(diffDays / 7)
    if (diffDays < 30) {
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`
    }
  }

  // Sinon format complet
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

/**
 * Formate une date avec style tribal immersif
 * Exemple: "22ème jour du cycle des Cendres"
 * @param {string|Date} dateString - Date à formater
 * @returns {string} Date formatée style tribal
 */
export const formatTribalDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth()

  const tribalMonths = [
    'cycle des Brumes',      // Janvier
    'cycle des Cendres',     // Février
    'cycle du Réveil',       // Mars
    'cycle des Pierres',     // Avril
    'cycle des Flammes',     // Mai
    'cycle des Murmures',    // Juin
    'cycle des Ruines',      // Juillet
    'cycle des Ombres',      // Août
    'cycle des Échos',       // Septembre
    'cycle du Crépuscule',   // Octobre
    'cycle des Âmes',        // Novembre
    'cycle de l\'Oubli'      // Décembre
  ]

  const ordinal = (n) => {
    if (n === 1) return '1er'
    return `${n}ème`
  }

  return `${ordinal(day)} jour du ${tribalMonths[month]}`
}

/**
 * Formate une date pour affichage compact
 * @param {string|Date} dateString - Date à formater
 * @returns {string} Date formatée (ex: "22 Jan 2026")
 */
export const formatCompactDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

/**
 * Vérifie si une date est récente (moins de X jours)
 * @param {string|Date} dateString - Date à vérifier
 * @param {number} days - Nombre de jours considérés comme "récent"
 * @returns {boolean}
 */
export const isRecent = (dateString, days = 7) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days
}

/**
 * Formate une durée en texte lisible
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} heure${hours > 1 ? 's' : ''}`
  }

  return `${hours}h${remainingMinutes}`
}

export default {
  formatRelativeDate,
  formatTribalDate,
  formatCompactDate,
  isRecent,
  formatDuration
}
