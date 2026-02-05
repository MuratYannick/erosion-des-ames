import { forwardRef } from 'react'
import './Form.css'

/**
 * Variant styles for FormGroup
 */
const groupVariants = {
  default: '',
  bordered: 'form-group--bordered',
  tribal: 'form-group--tribal'
}

/**
 * Tribal corner decorations for tribal variant
 */
const TribalCorners = () => (
  <>
    <svg
      className="form-group-corner form-group-corner--tl"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-left corner */}
      <path
        d="M0 8 L0 0 L8 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.5" />
      <path d="M2 10 L4 8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M10 2 L8 4" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>

    <svg
      className="form-group-corner form-group-corner--tr"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-right corner */}
      <path
        d="M24 8 L24 0 L16 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="4" r="1" fill="currentColor" opacity="0.5" />
      <path d="M22 10 L20 8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M14 2 L16 4" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>

    <svg
      className="form-group-corner form-group-corner--bl"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bottom-left corner */}
      <path
        d="M0 16 L0 24 L8 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="20" r="1" fill="currentColor" opacity="0.5" />
      <path d="M2 14 L4 16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M10 22 L8 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>

    <svg
      className="form-group-corner form-group-corner--br"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bottom-right corner */}
      <path
        d="M24 16 L24 24 L16 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.5" />
      <path d="M22 14 L20 16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M14 22 L16 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  </>
)

/**
 * FormGroup component
 * Groups related form fields with optional title and description
 * Supports variants: default (transparent), bordered, tribal (decorated)
 *
 * @component
 * @example
 * <FormGroup title="Identité" description="Informations de base" variant="tribal">
 *   <FormField name="username" label="Nom d'utilisateur">
 *     <Input />
 *   </FormField>
 *   <FormField name="email" label="Email">
 *     <Input type="email" />
 *   </FormField>
 * </FormGroup>
 */
const FormGroup = forwardRef(({
  title,
  description,
  variant = 'default',
  children,
  className = '',
  ...props
}, ref) => {
  const variantClass = groupVariants[variant] || groupVariants.default

  const groupClasses = [
    'form-group',
    variantClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <fieldset
      ref={ref}
      className={groupClasses}
      {...props}
    >
      {/* Tribal corner decorations */}
      {variant === 'tribal' && <TribalCorners />}

      {/* Title and description */}
      {(title || description) && (
        <div className="form-group-header">
          {title && (
            <legend className="form-group-title">
              {title}
            </legend>
          )}
          {description && (
            <p className="form-group-description">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="form-group-content">
        {children}
      </div>
    </fieldset>
  )
})

FormGroup.displayName = 'FormGroup'

export default FormGroup
export { FormGroup }
