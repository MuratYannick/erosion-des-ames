import { createContext, useContext } from 'react'
import { getMessage } from '@/utils/validationMessages'

/**
 * Form Context for field registration and state management
 */
export const FormContext = createContext(null)

/**
 * Hook to access form context
 * @throws {Error} If used outside of Form component
 */
export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context
}

/**
 * Hook to register and manage a field
 * @param {string} name Field name
 * @returns {object} Field props and helpers
 */
export const useField = (name) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    tribalMessages
  } = useFormContext()

  const value = values[name] || ''
  const error = touched[name] && errors[name]
  const errorMessage = error ? getMessage(error, { tribal: tribalMessages }) : null

  return {
    name,
    value,
    error: errorMessage,
    touched: touched[name],
    onChange: (e) => {
      const newValue = e.target?.value ?? e
      setFieldValue(name, newValue)
    },
    onBlur: () => {
      setFieldTouched(name, true)
      validateField(name)
    },
    setFieldValue: (val) => setFieldValue(name, val),
    setFieldTouched: (val) => setFieldTouched(name, val),
    setFieldError: (err) => setFieldError(name, err),
    validate: () => validateField(name)
  }
}
