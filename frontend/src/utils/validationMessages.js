/**
 * Validation messages for form handling
 * Supports French standard messages and tribal-themed messages
 */

/**
 * Standard French messages
 */
const standardMessages = {
  required: 'Ce champ est requis',
  email: 'Adresse email invalide',
  url: 'URL invalide',
  minLength: 'Minimum {min} caractères requis',
  maxLength: 'Maximum {max} caractères autorisés',
  min: 'La valeur minimum est {min}',
  max: 'La valeur maximum est {max}',
  pattern: 'Format invalide',
  matchField: 'Les champs ne correspondent pas',
  confirmPassword: 'Les mots de passe ne correspondent pas',
  fileSize: 'Le fichier est trop volumineux (max {max} Mo)',
  fileType: 'Type de fichier non supporté. Types acceptés : {types}',
}

/**
 * Tribal-themed French messages
 * Used when tribalMessages option is enabled
 */
const tribalMessages = {
  required: 'Ce sceau doit être gravé',
  email: 'Cette adresse spirituelle est invalide',
  url: 'Ce chemin vers les ruines est invalide',
  minLength: 'Ce sceau est trop court (minimum {min} runes)',
  maxLength: 'Ce sceau dépasse la limite ({max} runes max)',
  min: 'Cette valeur est trop faible (minimum {min})',
  max: 'Cette valeur est trop élevée (maximum {max})',
  pattern: 'Ce symbole ne respecte pas les anciens rites',
  matchField: 'Les sceaux ne correspondent pas',
  confirmPassword: 'Les sceaux secrets ne correspondent pas',
  fileSize: 'Cette relique est trop lourde (max {max} Mo)',
  fileType: 'Cette relique n\'est pas reconnue par les anciens',
}

/**
 * Interpolate parameters into message template
 * @param {string} message Message template with {param} placeholders
 * @param {object} params Object with parameter values
 * @returns {string} Interpolated message
 */
const interpolate = (message, params = {}) => {
  return message.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? params[key] : `{${key}}`
  })
}

/**
 * Get formatted error message
 * @param {string|object|null} error Error key or { key, params } object
 * @param {object} options Options object
 * @param {boolean} options.tribal Use tribal-themed messages
 * @returns {string|null} Formatted error message or null
 */
export const getMessage = (error, options = {}) => {
  const { tribal = false } = options

  if (!error) return null

  // Select message set
  const messages = tribal
    ? { ...standardMessages, ...tribalMessages }
    : standardMessages

  // Simple string error (key only)
  if (typeof error === 'string') {
    return messages[error] || error
  }

  // Object error with key and params
  if (typeof error === 'object' && error.key) {
    const template = messages[error.key] || error.key
    return interpolate(template, error.params)
  }

  // Fallback
  return String(error)
}

/**
 * Create a custom getMessage function with preset options
 * @param {object} defaultOptions Default options for getMessage
 * @returns {function} getMessage function with preset options
 */
export const createGetMessage = (defaultOptions = {}) => {
  return (error, options = {}) => getMessage(error, { ...defaultOptions, ...options })
}

// Export message sets for customization
export { standardMessages, tribalMessages }
export default getMessage
