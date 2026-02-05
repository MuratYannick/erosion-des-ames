/**
 * Form Components - Tribal Theme
 * Erosion des Ames
 *
 * Exports:
 * - Form (default): Main form component with validation
 * - FormContext: Context for form state
 * - useFormContext: Hook to access form context
 * - useField: Hook to register and manage a field
 * - FormField: Field wrapper with label, error, hint
 * - FormGroup: Group related fields with title/description
 *
 * @example
 * import Form, { FormField, FormGroup } from '@/components/ui/Form'
 *
 * <Form
 *   initialValues={{ email: '', password: '' }}
 *   validationSchema={schema}
 *   onSubmit={handleSubmit}
 *   tribalMessages
 * >
 *   <FormGroup title="Connexion" variant="tribal">
 *     <FormField name="email" label="Email" required>
 *       <Input type="email" />
 *     </FormField>
 *   </FormGroup>
 * </Form>
 */

export { default, Form, FormContext, useFormContext, useField } from './Form'
export { FormField } from './FormField'
export { FormGroup } from './FormGroup'
