import { useState, useCallback, useRef } from 'react'
import { validateSchema } from '@/utils/validation'
import './Form.css'
import { FormContext } from './formContext'

/**
 * Form component with validation and state management
 * Tribal-themed form container with schema-based validation
 *
 * @component
 * @example
 * <Form
 *   initialValues={{ email: '', password: '' }}
 *   validationSchema={schema}
 *   onSubmit={handleSubmit}
 *   tribalMessages
 * >
 *   {({ isSubmitting }) => (
 *     <FormField name="email" label="Email">
 *       <Input type="email" />
 *     </FormField>
 *   )}
 * </Form>
 */
const Form = ({
  initialValues = {},
  validationSchema = {},
  validate: customValidate = null,
  onSubmit,
  validateOnBlur = true,
  validateOnChange = false,
  tribalMessages = false,
  className = '',
  children,
  ...props
}) => {
  // Form state
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)

  // Refs for error handling
  const formRef = useRef(null)

  /**
   * Validate a single field
   */
  const validateField = useCallback((fieldName) => {
    // Schema validation
    if (validationSchema[fieldName]) {
      const error = validationSchema[fieldName](values[fieldName], values)
      if (error) {
        setErrors(prev => ({ ...prev, [fieldName]: error }))
        return false
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
        return true
      }
    }
    return true
  }, [validationSchema, values])

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    let formErrors = {}

    // Schema validation
    if (validationSchema && Object.keys(validationSchema).length > 0) {
      formErrors = validateSchema(validationSchema, values)
    }

    // Custom validation function
    if (customValidate) {
      const customErrors = customValidate(values)
      formErrors = { ...formErrors, ...customErrors }
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }, [validationSchema, customValidate, values])

  /**
   * Set field value and optionally validate
   */
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))

    if (validateOnChange && touched[fieldName]) {
      // Validate after state update
      setTimeout(() => validateField(fieldName), 0)
    }
  }, [validateOnChange, touched, validateField])

  /**
   * Set field touched state and optionally validate
   */
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }))

    if (validateOnBlur && isTouched) {
      // Validate after state update
      setTimeout(() => validateField(fieldName), 0)
    }
  }, [validateOnBlur, validateField])

  /**
   * Set field error manually
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => {
      if (error === null || error === undefined || error === '') {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      }
      return { ...prev, [fieldName]: error }
    })
  }, [])

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback((nextInitialValues = initialValues) => {
    setValues(nextInitialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    setSubmitCount(0)
  }, [initialValues])

  /**
   * Scroll to first error field
   */
  const scrollToFirstError = useCallback(() => {
    if (!formRef.current) return

    const firstErrorField = formRef.current.querySelector('[aria-invalid="true"]')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      firstErrorField.focus()
    }
  }, [])

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Increment submit count
    setSubmitCount(prev => prev + 1)

    // Mark all fields as touched
    const allFieldsTouched = Object.keys(validationSchema).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allFieldsTouched)

    // Validate form
    const isValid = validateForm()

    if (!isValid) {
      // Scroll to first error after state update
      setTimeout(scrollToFirstError, 50)
      return
    }

    // Submit
    setIsSubmitting(true)

    try {
      await onSubmit(values, {
        resetForm,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        setErrors,
        setSubmitting: setIsSubmitting
      })
    } catch (error) {
      console.error('Form submission error:', error)

      // Handle server validation errors
      if (error.validationErrors) {
        setErrors(error.validationErrors)
        setTimeout(scrollToFirstError, 50)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [
    values,
    validationSchema,
    validateForm,
    scrollToFirstError,
    onSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched
  ])

  // Context value
  const contextValue = {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    resetForm,
    tribalMessages
  }

  // Form helpers for render function
  const formHelpers = {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid: Object.keys(errors).length === 0,
    dirty: Object.keys(touched).length > 0,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched
  }

  const formClasses = [
    'form-tribal',
    isSubmitting && 'form-tribal--submitting',
    className
  ].filter(Boolean).join(' ')

  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={formClasses}
        noValidate
        {...props}
      >
        {typeof children === 'function' ? children(formHelpers) : children}
      </form>
    </FormContext.Provider>
  )
}

Form.displayName = 'Form'

export default Form
export { Form }
