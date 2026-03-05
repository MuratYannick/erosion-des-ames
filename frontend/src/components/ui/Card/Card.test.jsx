/**
 * Unit tests for the Card component family
 *
 * Coverage:
 * - Card: renders children, default variant/padding, all variants, all padding sizes
 * - Card: hover mode, effects array, animation prop, custom className
 * - Card: unknown variant/padding fallback behavior
 * - Card: forwardRef support
 * - CardHeader: renders children, applies border-b class, custom className
 * - CardBody: renders children, applies p-4 class, custom className
 * - CardFooter: renders children, applies border-t class, custom className
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card/Card'

// Silence CSS import side effects
vi.mock('@/components/ui/Card/Card.css', () => ({}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderCard = (props = {}, content = 'Contenu de la carte') =>
  render(<Card {...props}>{content}</Card>)

// ---------------------------------------------------------------------------
// Card — rendu de base
// ---------------------------------------------------------------------------

describe('Card — rendu de base', () => {
  it('affiche le contenu enfant', () => {
    renderCard({}, 'Contenu visible')
    expect(screen.getByText('Contenu visible')).toBeInTheDocument()
  })

  it('rend un élément div', () => {
    const { container } = renderCard()
    expect(container.firstChild?.tagName).toBe('DIV')
  })

  it('applique toujours les classes de base rounded-stone et overflow-hidden', () => {
    const { container } = renderCard()
    expect(container.firstChild).toHaveClass('rounded-stone', 'overflow-hidden')
  })

  it('utilise la variante "bordered" par défaut', () => {
    const { container } = renderCard()
    // bordered adds border-2 class
    expect(container.firstChild).toHaveClass('border-2')
  })

  it('utilise le padding "none" par défaut (pas de classe p-*)', () => {
    const { container } = renderCard()
    expect(container.firstChild).not.toHaveClass('p-3')
    expect(container.firstChild).not.toHaveClass('p-4')
    expect(container.firstChild).not.toHaveClass('p-6')
  })

  it('transmet les props HTML supplémentaires (data-testid)', () => {
    renderCard({ 'data-testid': 'ma-carte' })
    expect(screen.getByTestId('ma-carte')).toBeInTheDocument()
  })

  it('applique une className personnalisée', () => {
    const { container } = renderCard({ className: 'classe-custom' })
    expect(container.firstChild).toHaveClass('classe-custom')
  })
})

// ---------------------------------------------------------------------------
// Card — variantes
// ---------------------------------------------------------------------------

describe('Card — variantes', () => {
  it('applique bg-surface pour la variante "default"', () => {
    const { container } = renderCard({ variant: 'default' })
    expect(container.firstChild).toHaveClass('bg-surface')
  })

  it('applique border-2 et border-neutral-200 pour la variante "bordered"', () => {
    const { container } = renderCard({ variant: 'bordered' })
    expect(container.firstChild).toHaveClass('border-2', 'border-neutral-200')
  })

  it('applique shadow-lg pour la variante "elevated"', () => {
    const { container } = renderCard({ variant: 'elevated' })
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('applique card-variant-tribal pour la variante "tribal"', () => {
    const { container } = renderCard({ variant: 'tribal' })
    expect(container.firstChild).toHaveClass('card-variant-tribal')
  })

  it('applique card-variant-fire pour la variante "fire"', () => {
    const { container } = renderCard({ variant: 'fire' })
    expect(container.firstChild).toHaveClass('card-variant-fire')
  })

  it('applique card-variant-rusted pour la variante "rusted"', () => {
    const { container } = renderCard({ variant: 'rusted' })
    expect(container.firstChild).toHaveClass('card-variant-rusted')
  })

  it('applique card-variant-ancient pour la variante "ancient"', () => {
    const { container } = renderCard({ variant: 'ancient' })
    expect(container.firstChild).toHaveClass('card-variant-ancient')
  })

  it('retombe sur "bordered" si la variante est inconnue', () => {
    const { container } = renderCard({ variant: 'inconnue' })
    expect(container.firstChild).toHaveClass('border-2')
  })
})

// ---------------------------------------------------------------------------
// Card — padding
// ---------------------------------------------------------------------------

describe('Card — padding', () => {
  it('n\'applique pas de padding pour padding="none"', () => {
    const { container } = renderCard({ padding: 'none' })
    expect(container.firstChild).not.toHaveClass('p-3')
    expect(container.firstChild).not.toHaveClass('p-4')
    expect(container.firstChild).not.toHaveClass('p-6')
  })

  it('applique p-3 pour padding="sm"', () => {
    const { container } = renderCard({ padding: 'sm' })
    expect(container.firstChild).toHaveClass('p-3')
  })

  it('applique p-4 pour padding="md"', () => {
    const { container } = renderCard({ padding: 'md' })
    expect(container.firstChild).toHaveClass('p-4')
  })

  it('applique p-6 pour padding="lg"', () => {
    const { container } = renderCard({ padding: 'lg' })
    expect(container.firstChild).toHaveClass('p-6')
  })
})

// ---------------------------------------------------------------------------
// Card — hover
// ---------------------------------------------------------------------------

describe('Card — mode hover', () => {
  it('ajoute les classes de transition quand hover=true', () => {
    const { container } = renderCard({ hover: true })
    expect(container.firstChild).toHaveClass('hover:shadow-lg')
  })

  it('n\'ajoute pas les classes de hover quand hover=false (défaut)', () => {
    const { container } = renderCard({ hover: false })
    expect(container.firstChild).not.toHaveClass('hover:shadow-lg')
  })
})

// ---------------------------------------------------------------------------
// Card — effets et animations
// ---------------------------------------------------------------------------

describe('Card — effets', () => {
  it('applique card-effect-dust quand effects=["dust"]', () => {
    const { container } = renderCard({ effects: ['dust'] })
    expect(container.firstChild).toHaveClass('card-effect-dust')
  })

  it('applique plusieurs effets simultanément', () => {
    const { container } = renderCard({ effects: ['dust', 'weathered'] })
    expect(container.firstChild).toHaveClass('card-effect-dust', 'card-effect-weathered')
  })

  it('ignore les effets inconnus (ne plante pas)', () => {
    const { container } = renderCard({ effects: ['inexistant'] })
    expect(container.firstChild).toBeInTheDocument()
  })

  it('n\'applique pas d\'effets quand effects=[] (défaut)', () => {
    const { container } = renderCard({ effects: [] })
    expect(container.firstChild).not.toHaveClass('card-effect-dust')
  })
})

describe('Card — animations', () => {
  it('applique card-animate-emerge quand animation="emerge"', () => {
    const { container } = renderCard({ animation: 'emerge' })
    expect(container.firstChild).toHaveClass('card-animate-emerge')
  })

  it('applique card-animate-flicker quand animation="flicker"', () => {
    const { container } = renderCard({ animation: 'flicker' })
    expect(container.firstChild).toHaveClass('card-animate-flicker')
  })

  it('n\'applique pas de classe d\'animation quand animation=null (défaut)', () => {
    const { container } = renderCard({ animation: null })
    expect(container.firstChild).not.toHaveClass('card-animate-emerge')
    expect(container.firstChild).not.toHaveClass('card-animate-flicker')
  })

  it('n\'applique pas de classe si l\'animation est inconnue', () => {
    const { container } = renderCard({ animation: 'inconnue' })
    // Unknown animation maps to '' — no class added
    expect(container.firstChild).not.toHaveClass('card-animate-emerge')
  })
})

// ---------------------------------------------------------------------------
// Card — forwardRef
// ---------------------------------------------------------------------------

describe('Card — forwardRef', () => {
  it('transmet la ref au noeud DOM div', () => {
    const ref = { current: null }
    render(<Card ref={ref}>Ref test</Card>)
    expect(ref.current).not.toBeNull()
    expect(ref.current.tagName).toBe('DIV')
  })
})

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------

describe('CardHeader', () => {
  it('affiche le contenu enfant', () => {
    render(<CardHeader>Titre de section</CardHeader>)
    expect(screen.getByText('Titre de section')).toBeInTheDocument()
  })

  it('applique les classes de base px-4 py-3 border-b', () => {
    const { container } = render(<CardHeader>Titre</CardHeader>)
    expect(container.firstChild).toHaveClass('px-4', 'py-3', 'border-b')
  })

  it('applique card-content-layer', () => {
    const { container } = render(<CardHeader>Titre</CardHeader>)
    expect(container.firstChild).toHaveClass('card-content-layer')
  })

  it('accepte une className personnalisée', () => {
    const { container } = render(<CardHeader className="custom-header">Titre</CardHeader>)
    expect(container.firstChild).toHaveClass('custom-header')
  })

  it('transmet la ref au noeud DOM div', () => {
    const ref = { current: null }
    render(<CardHeader ref={ref}>Titre</CardHeader>)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

// ---------------------------------------------------------------------------
// CardBody
// ---------------------------------------------------------------------------

describe('CardBody', () => {
  it('affiche le contenu enfant', () => {
    render(<CardBody>Corps de la carte</CardBody>)
    expect(screen.getByText('Corps de la carte')).toBeInTheDocument()
  })

  it('applique la classe p-4', () => {
    const { container } = render(<CardBody>Corps</CardBody>)
    expect(container.firstChild).toHaveClass('p-4')
  })

  it('applique card-content-layer', () => {
    const { container } = render(<CardBody>Corps</CardBody>)
    expect(container.firstChild).toHaveClass('card-content-layer')
  })

  it('accepte une className personnalisée', () => {
    const { container } = render(<CardBody className="custom-body">Corps</CardBody>)
    expect(container.firstChild).toHaveClass('custom-body')
  })

  it('transmet la ref au noeud DOM div', () => {
    const ref = { current: null }
    render(<CardBody ref={ref}>Corps</CardBody>)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------

describe('CardFooter', () => {
  it('affiche le contenu enfant', () => {
    render(<CardFooter>Pied de carte</CardFooter>)
    expect(screen.getByText('Pied de carte')).toBeInTheDocument()
  })

  it('applique les classes de base px-4 py-3 border-t', () => {
    const { container } = render(<CardFooter>Pied</CardFooter>)
    expect(container.firstChild).toHaveClass('px-4', 'py-3', 'border-t')
  })

  it('applique card-content-layer et bg-neutral-50', () => {
    const { container } = render(<CardFooter>Pied</CardFooter>)
    expect(container.firstChild).toHaveClass('card-content-layer', 'bg-neutral-50')
  })

  it('accepte une className personnalisée', () => {
    const { container } = render(<CardFooter className="custom-footer">Pied</CardFooter>)
    expect(container.firstChild).toHaveClass('custom-footer')
  })

  it('transmet la ref au noeud DOM div', () => {
    const ref = { current: null }
    render(<CardFooter ref={ref}>Pied</CardFooter>)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

// ---------------------------------------------------------------------------
// Composition Card + sub-components
// ---------------------------------------------------------------------------

describe('Card — composition avec sous-composants', () => {
  it('rend correctement un Card complet avec Header, Body et Footer', () => {
    render(
      <Card>
        <CardHeader>En-tête</CardHeader>
        <CardBody>Corps</CardBody>
        <CardFooter>Pied</CardFooter>
      </Card>
    )
    expect(screen.getByText('En-tête')).toBeInTheDocument()
    expect(screen.getByText('Corps')).toBeInTheDocument()
    expect(screen.getByText('Pied')).toBeInTheDocument()
  })
})
