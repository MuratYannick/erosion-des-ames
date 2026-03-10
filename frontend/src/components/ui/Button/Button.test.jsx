/**
 * Unit tests for the Button component
 *
 * Coverage:
 * - Rendering with children
 * - All variants (primary, secondary, outline, danger, ghost)
 * - All sizes (sm, md, lg)
 * - disabled state: button not clickable, correct HTML attribute
 * - loading state: spinner visible, button not clickable, children hidden
 * - onClick: called on click, not called when disabled or loading
 * - type prop: button, submit, reset
 * - Icon rendering (left and right positions)
 * - showCorners behavior (lg + primary auto-activates it)
 * - forwardRef support
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button/Button'

// Button.css is a side-effect import — vitest with css:false ignores it,
// but we mock it explicitly to prevent any import errors in case the
// test runner encounters the file.
vi.mock('@/components/ui/Button/Button.css', () => ({}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderButton = (props = {}) =>
  render(<Button {...props}>{props.children ?? 'Cliquer'}</Button>)

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Button — rendu de base', () => {
  it('affiche le texte enfant', () => {
    renderButton({ children: 'Envoyer' })
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument()
  })

  it('a le type "button" par défaut', () => {
    renderButton()
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('accepte le type "submit"', () => {
    renderButton({ type: 'submit' })
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('accepte le type "reset"', () => {
    renderButton({ type: 'reset' })
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
  })

  it('transmet les props HTML supplémentaires (aria-label)', () => {
    renderButton({ 'aria-label': 'Confirmer' })
    expect(screen.getByRole('button', { name: 'Confirmer' })).toBeInTheDocument()
  })

  it('applique une className personnalisée', () => {
    renderButton({ className: 'ma-classe-custom' })
    expect(screen.getByRole('button')).toHaveClass('ma-classe-custom')
  })
})

// ---------------------------------------------------------------------------

describe('Button — variantes', () => {
  const variants = ['primary', 'secondary', 'outline', 'danger', 'ghost']

  variants.forEach((variant) => {
    it(`rend sans erreur avec la variante "${variant}"`, () => {
      renderButton({ variant })
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  it('utilise la variante "primary" par défaut', () => {
    renderButton()
    // The primary variant includes the shadow-glow class
    expect(screen.getByRole('button')).toHaveClass('shadow-glow')
  })

  it('applique les classes de la variante "danger"', () => {
    renderButton({ variant: 'danger' })
    expect(screen.getByRole('button')).toHaveClass('bg-error')
  })

  it('applique les classes de la variante "ghost"', () => {
    renderButton({ variant: 'ghost' })
    // Ghost variant has bg-transparent
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applique les classes de la variante "outline"', () => {
    renderButton({ variant: 'outline' })
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('retombe sur primary si la variante est inconnue', () => {
    renderButton({ variant: 'inexistante' })
    expect(screen.getByRole('button')).toHaveClass('shadow-glow')
  })
})

// ---------------------------------------------------------------------------

describe('Button — tailles', () => {
  it('applique les classes de taille "sm"', () => {
    renderButton({ size: 'sm' })
    expect(screen.getByRole('button')).toHaveClass('text-sm')
  })

  it('applique les classes de taille "md" par défaut', () => {
    renderButton()
    expect(screen.getByRole('button')).toHaveClass('text-base')
  })

  it('applique les classes de taille "lg"', () => {
    renderButton({ size: 'lg' })
    expect(screen.getByRole('button')).toHaveClass('text-lg')
  })
})

// ---------------------------------------------------------------------------

describe('Button — état disabled', () => {
  it('rend l\'attribut HTML disabled quand disabled=true', () => {
    renderButton({ disabled: true })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('ne déclenche pas onClick quand disabled=true', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderButton({ disabled: true, onClick })
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applique la classe disabled:cursor-not-allowed', () => {
    renderButton({ disabled: true })
    // The base class includes disabled:cursor-not-allowed
    expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed')
  })
})

// ---------------------------------------------------------------------------

describe('Button — état loading', () => {
  it('désactive le bouton quand loading=true', () => {
    renderButton({ loading: true })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('affiche le spinner SVG (aria-hidden) quand loading=true', () => {
    const { container } = renderButton({ loading: true })
    // The TribalSpinner renders an SVG with aria-hidden="true"
    const spinner = container.querySelector('svg[aria-hidden="true"]')
    expect(spinner).toBeInTheDocument()
  })

  it('masque visuellement le contenu texte quand loading=true (opacity-0)', () => {
    const { container } = renderButton({ loading: true, children: 'Envoyer' })
    // The text is wrapped in a span with opacity-0
    const hiddenSpan = container.querySelector('span.opacity-0')
    expect(hiddenSpan).toBeInTheDocument()
    expect(hiddenSpan).toHaveTextContent('Envoyer')
  })

  it('ne déclenche pas onClick quand loading=true', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderButton({ loading: true, onClick })
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('affiche le texte enfant normalement quand loading=false', () => {
    renderButton({ loading: false, children: 'Envoyer' })
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    // No opacity-0 wrapper in normal state
    const hiddenSpan = button.querySelector('span.opacity-0')
    expect(hiddenSpan).toBeNull()
  })
})

// ---------------------------------------------------------------------------

describe('Button — gestionnaire onClick', () => {
  it('appelle onClick au clic', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderButton({ onClick })
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('appelle onClick plusieurs fois si cliqué plusieurs fois', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderButton({ onClick })
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('ne plante pas si onClick n\'est pas fourni', async () => {
    const user = userEvent.setup()
    renderButton()
    // Should not throw
    await user.click(screen.getByRole('button'))
  })
})

// ---------------------------------------------------------------------------

describe('Button — icône', () => {
  const icon = <span data-testid="icon-test">*</span>

  it('affiche l\'icône à gauche par défaut (iconPosition="left")', () => {
    renderButton({ icon, iconPosition: 'left', children: 'Texte' })
    // Both icon and text should be present
    expect(screen.getByTestId('icon-test')).toBeInTheDocument()
    expect(screen.getByText('Texte')).toBeInTheDocument()
  })

  it('affiche l\'icône à droite quand iconPosition="right"', () => {
    renderButton({ icon, iconPosition: 'right', children: 'Texte' })
    expect(screen.getByTestId('icon-test')).toBeInTheDocument()
  })

  it('n\'affiche pas de span icône si icon est null', () => {
    renderButton({ icon: null })
    // There should be no icon wrapper span — only the text node
    expect(screen.queryByTestId('icon-test')).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------

describe('Button — CornerMark (showCorners)', () => {
  it('affiche les coins décoratifs quand showCorners=true', () => {
    const { container } = renderButton({ showCorners: true })
    // CornerMark renders SVGs with class btn-corner-mark
    const corners = container.querySelectorAll('.btn-corner-mark')
    expect(corners).toHaveLength(4)
  })

  it('affiche automatiquement les coins pour size="lg" et variant="primary"', () => {
    const { container } = renderButton({ size: 'lg', variant: 'primary' })
    const corners = container.querySelectorAll('.btn-corner-mark')
    expect(corners).toHaveLength(4)
  })

  it('n\'affiche pas les coins pour size="md" et variant="primary" sans showCorners', () => {
    const { container } = renderButton({ size: 'md', variant: 'primary' })
    const corners = container.querySelectorAll('.btn-corner-mark')
    expect(corners).toHaveLength(0)
  })

  it('ajoute la classe "btn-with-corners" quand les coins sont affichés', () => {
    renderButton({ showCorners: true })
    expect(screen.getByRole('button')).toHaveClass('btn-with-corners')
  })
})

// ---------------------------------------------------------------------------

describe('Button — forwardRef', () => {
  it('transmet la ref au noeud DOM du bouton', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).not.toBeNull()
    expect(ref.current.tagName).toBe('BUTTON')
  })
})
