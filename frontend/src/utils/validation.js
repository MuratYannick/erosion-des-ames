/**
 * Validation utilities for form handling
 * Returns null if valid, or { key, params } / string for error
 */

/**
 * Required field validator
 */
export const required = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return 'required'
  }
  return null
}

/**
 * Minimum length validator (curried)
 */
export const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return { key: 'minLength', params: { min } }
  }
  return null
}

/**
 * Maximum length validator (curried)
 */
export const maxLength = (max) => (value) => {
  if (value && value.length > max) {
    return { key: 'maxLength', params: { max } }
  }
  return null
}

/**
 * Regex pattern validator (curried)
 */
export const pattern = (regex, messageKey = 'pattern') => (value) => {
  if (value && !regex.test(value)) {
    return messageKey
  }
  return null
}

/**
 * Email format validator
 */
export const email = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value && !emailRegex.test(value)) {
    return 'email'
  }
  return null
}

/**
 * URL format validator
 */
export const url = (value) => {
  if (!value) return null
  try {
    new URL(value)
    return null
  } catch {
    return 'url'
  }
}

/**
 * Minimum numeric value validator (curried)
 */
export const min = (n) => (value) => {
  if (value !== '' && value !== null && value !== undefined && Number(value) < n) {
    return { key: 'min', params: { min: n } }
  }
  return null
}

/**
 * Maximum numeric value validator (curried)
 */
export const max = (n) => (value) => {
  if (value !== '' && value !== null && value !== undefined && Number(value) > n) {
    return { key: 'max', params: { max: n } }
  }
  return null
}

/**
 * Match another field validator (curried)
 * Useful for password confirmation
 */
export const matchField = (fieldName, messageKey = 'matchField') => (value, allValues) => {
  if (allValues && value !== allValues[fieldName]) {
    return { key: messageKey, params: { field: fieldName } }
  }
  return null
}

/**
 * File size validator (curried)
 * @param maxBytes Maximum file size in bytes
 */
export const fileSize = (maxBytes) => (value) => {
  if (value && value.size && value.size > maxBytes) {
    const maxMB = (maxBytes / (1024 * 1024)).toFixed(1)
    return { key: 'fileSize', params: { max: maxMB } }
  }
  return null
}

/**
 * File type validator (curried)
 * @param types Array of accepted MIME types or extensions
 */
export const fileType = (types) => (value) => {
  if (!value || !value.type) return null

  const isValid = types.some(type => {
    if (type.startsWith('.')) {
      return value.name?.toLowerCase().endsWith(type.toLowerCase())
    }
    if (type.endsWith('/*')) {
      return value.type.startsWith(type.replace('/*', '/'))
    }
    return value.type === type
  })

  if (!isValid) {
    return { key: 'fileType', params: { types: types.join(', ') } }
  }
  return null
}

/**
 * Compose multiple validators into one
 * Stops at first error
 */
export const compose = (...validators) => (value, allValues) => {
  for (const validator of validators) {
    const result = validator(value, allValues)
    if (result) return result
  }
  return null
}

/**
 * Validate an entire form schema
 * @param schema Object with field names as keys and validators as values
 * @param values Form values object
 * @returns Object with field names as keys and errors as values
 */
export const validateSchema = (schema, values) => {
  const errors = {}
  for (const [field, validator] of Object.entries(schema)) {
    const error = validator(values[field], values)
    if (error) {
      errors[field] = error
    }
  }
  return errors
}

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0
}
