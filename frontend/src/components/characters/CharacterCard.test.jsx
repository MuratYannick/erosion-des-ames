/**
 * Unit tests for the CharacterCard component
 *
 * Coverage:
 * - Renders character name
 * - Status badge present for every status (draft, pending, approved, rejected)
 * - "Actif" badge shown only when isSelected=true
 * - "Voir" button: always present, calls onView with the character object
 * - "Éditer" button: visible for draft/rejected, hidden for pending/approved
 * - "Soumettre" button: visible for draft/rejected, hidden for pending/approved
 * - "Sélectionner"/"Désélectionner" button: only for approved + onSelect provided
 * - Rejection reason: shown only for rejected status + rejectionReason provided
 * - "⋮" menu: opens on click, shows "Supprimer", calls onDelete
 * - Backdrop click closes the menu
 * - Optional fields (ethnicity, faction, clan) — rendered when provided
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CharacterCard from '@/components/characters/CharacterCard'

// ---------------------------------------------------------------------------
// CharacterAvatar makes network calls for avatar images — mock it simply.
// We mock via the alias path which Vitest resolves the same way as the source.
// CharacterStatusBadge is a pure presentational component, no need to mock.
// ---------------------------------------------------------------------------
vi.mock('@/components/characters/CharacterAvatar', () => ({
  default: ({ name }) => <div data-testid="avatar">{name}</div>,
}))

// Also ensure Button CSS imported transitively does not break the test suite
vi.mock('@/components/ui/Button/Button.css', () => ({}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const buildCharacter = (overrides = {}) => ({
  id: '1',
  name: 'Kael Thornwood',
  status: 'draft',
  avatar: null,
  ethnicity: null,
  faction: null,
  clan: null,
  rejectionReason: null,
  age: 25,
  ...overrides,
})

const defaultProps = (overrides = {}) => ({
  character: buildCharacter(),
  onView: vi.fn(),
  onEdit: vi.fn(),
  onSubmit: vi.fn(),
  onDelete: vi.fn(),
  onSelect: undefined,
  isSelected: false,
  ...overrides,
})

const renderCard = (props = {}) => render(<CharacterCard {...defaultProps(props)} />)

// ---------------------------------------------------------------------------
// Tests — rendu du nom
// ---------------------------------------------------------------------------

describe('CharacterCard — nom du personnage', () => {
  it('affiche le nom du personnage', () => {
    renderCard()
    expect(screen.getByRole('heading', { name: 'Kael Thornwood' })).toBeInTheDocument()
  })

  it('affiche le nom dans un h3', () => {
    const { container } = renderCard()
    const heading = container.querySelector('h3')
    expect(heading).toHaveTextContent('Kael Thornwood')
  })
})

// ---------------------------------------------------------------------------
// Tests — badge de statut
// ---------------------------------------------------------------------------

describe('CharacterCard — badge de statut', () => {
  const statusLabels = {
    draft: 'Brouillon',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
  }

  Object.entries(statusLabels).forEach(([status, label]) => {
    it(`affiche le badge "${label}" pour le statut "${status}"`, () => {
      renderCard({ character: buildCharacter({ status }) })
      // The status badge has role="status" and aria-label
      expect(screen.getByRole('status', { name: `Statut: ${label}` })).toBeInTheDocument()
    })
  })
})

// ---------------------------------------------------------------------------
// Tests — badge "Actif"
// ---------------------------------------------------------------------------

describe('CharacterCard — badge "Actif"', () => {
  it('n\'affiche pas le badge "Actif" quand isSelected=false', () => {
    renderCard({ isSelected: false })
    expect(screen.queryByText('Actif')).not.toBeInTheDocument()
  })

  it('affiche le badge "Actif" quand isSelected=true', () => {
    renderCard({ isSelected: true })
    expect(screen.getByText('Actif')).toBeInTheDocument()
  })

  it('applique la classe de bordure sélectionnée quand isSelected=true', () => {
    const { container } = renderCard({ isSelected: true })
    expect(container.firstChild).toHaveClass('border-secondary-500')
  })
})

// ---------------------------------------------------------------------------
// Tests — bouton "Voir"
// ---------------------------------------------------------------------------

describe('CharacterCard — bouton "Voir"', () => {
  it('affiche toujours le bouton "Voir"', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /voir kael thornwood/i })).toBeInTheDocument()
  })

  it('appelle onView avec le personnage au clic', async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const character = buildCharacter()
    render(<CharacterCard {...defaultProps({ character, onView })} />)
    await user.click(screen.getByRole('button', { name: /voir kael thornwood/i }))
    expect(onView).toHaveBeenCalledTimes(1)
    expect(onView).toHaveBeenCalledWith(character)
  })

  it('ne plante pas si onView n\'est pas fourni', async () => {
    const user = userEvent.setup()
    render(<CharacterCard {...defaultProps({ onView: undefined })} />)
    // Should not throw
    await user.click(screen.getByRole('button', { name: /voir/i }))
  })
})

// ---------------------------------------------------------------------------
// Tests — bouton "Éditer"
// ---------------------------------------------------------------------------

describe('CharacterCard — bouton "Éditer"', () => {
  it('affiche le bouton "Éditer" pour un personnage en brouillon (draft)', () => {
    renderCard({ character: buildCharacter({ status: 'draft' }) })
    expect(screen.getByRole('button', { name: /éditer kael thornwood/i })).toBeInTheDocument()
  })

  it('affiche le bouton "Éditer" pour un personnage rejeté (rejected)', () => {
    renderCard({ character: buildCharacter({ status: 'rejected' }) })
    expect(screen.getByRole('button', { name: /éditer kael thornwood/i })).toBeInTheDocument()
  })

  it('n\'affiche pas le bouton "Éditer" pour un personnage en attente (pending)', () => {
    renderCard({ character: buildCharacter({ status: 'pending' }) })
    expect(screen.queryByRole('button', { name: /éditer/i })).not.toBeInTheDocument()
  })

  it('n\'affiche pas le bouton "Éditer" pour un personnage approuvé (approved)', () => {
    renderCard({ character: buildCharacter({ status: 'approved' }) })
    expect(screen.queryByRole('button', { name: /éditer/i })).not.toBeInTheDocument()
  })

  it('appelle onEdit avec le personnage au clic', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const character = buildCharacter({ status: 'draft' })
    render(<CharacterCard {...defaultProps({ character, onEdit })} />)
    await user.click(screen.getByRole('button', { name: /éditer kael thornwood/i }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledWith(character)
  })
})

// ---------------------------------------------------------------------------
// Tests — bouton "Soumettre"
// ---------------------------------------------------------------------------

describe('CharacterCard — bouton "Soumettre"', () => {
  it('affiche le bouton "Soumettre" pour un personnage en brouillon (draft)', () => {
    renderCard({ character: buildCharacter({ status: 'draft' }) })
    expect(screen.getByRole('button', { name: /soumettre kael thornwood/i })).toBeInTheDocument()
  })

  it('affiche le bouton "Soumettre" pour un personnage rejeté (rejected)', () => {
    renderCard({ character: buildCharacter({ status: 'rejected' }) })
    expect(screen.getByRole('button', { name: /soumettre kael thornwood/i })).toBeInTheDocument()
  })

  it('n\'affiche pas le bouton "Soumettre" pour un personnage en attente (pending)', () => {
    renderCard({ character: buildCharacter({ status: 'pending' }) })
    expect(screen.queryByRole('button', { name: /soumettre/i })).not.toBeInTheDocument()
  })

  it('n\'affiche pas le bouton "Soumettre" pour un personnage approuvé (approved)', () => {
    renderCard({ character: buildCharacter({ status: 'approved' }) })
    expect(screen.queryByRole('button', { name: /soumettre/i })).not.toBeInTheDocument()
  })

  it('appelle onSubmit avec le personnage au clic', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const character = buildCharacter({ status: 'draft' })
    render(<CharacterCard {...defaultProps({ character, onSubmit })} />)
    await user.click(screen.getByRole('button', { name: /soumettre kael thornwood/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(character)
  })
})

// ---------------------------------------------------------------------------
// Tests — bouton "Sélectionner"
// ---------------------------------------------------------------------------

describe('CharacterCard — bouton "Sélectionner"', () => {
  it('n\'affiche pas le bouton "Sélectionner" si onSelect n\'est pas fourni', () => {
    renderCard({ character: buildCharacter({ status: 'approved' }), onSelect: undefined })
    expect(screen.queryByRole('button', { name: /sélectionner/i })).not.toBeInTheDocument()
  })

  it('n\'affiche pas le bouton "Sélectionner" si le statut n\'est pas approved (même si onSelect fourni)', () => {
    renderCard({
      character: buildCharacter({ status: 'draft' }),
      onSelect: vi.fn(),
    })
    expect(screen.queryByRole('button', { name: /sélectionner/i })).not.toBeInTheDocument()
  })

  it('affiche le bouton "Sélectionner" pour approved + onSelect fourni', () => {
    renderCard({
      character: buildCharacter({ status: 'approved' }),
      onSelect: vi.fn(),
    })
    expect(
      screen.getByRole('button', { name: /sélectionner kael thornwood/i })
    ).toBeInTheDocument()
  })

  it('affiche "Désélectionner" quand isSelected=true', () => {
    renderCard({
      character: buildCharacter({ status: 'approved' }),
      onSelect: vi.fn(),
      isSelected: true,
    })
    expect(
      screen.getByRole('button', { name: /désélectionner kael thornwood/i })
    ).toBeInTheDocument()
  })

  it('appelle onSelect avec le personnage au clic', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const character = buildCharacter({ status: 'approved' })
    render(<CharacterCard {...defaultProps({ character, onSelect })} />)
    await user.click(screen.getByRole('button', { name: /sélectionner kael thornwood/i }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(character)
  })
})

// ---------------------------------------------------------------------------
// Tests — raison de rejet
// ---------------------------------------------------------------------------

describe('CharacterCard — raison de rejet', () => {
  it('n\'affiche pas la raison de rejet si le statut n\'est pas rejected', () => {
    renderCard({
      character: buildCharacter({ status: 'draft', rejectionReason: 'Trop générique' }),
    })
    expect(screen.queryByText(/raison du rejet/i)).not.toBeInTheDocument()
  })

  it('n\'affiche pas la raison de rejet si rejected mais rejectionReason est null', () => {
    renderCard({
      character: buildCharacter({ status: 'rejected', rejectionReason: null }),
    })
    expect(screen.queryByText(/raison du rejet/i)).not.toBeInTheDocument()
  })

  it('affiche la raison de rejet quand statut=rejected et rejectionReason fournie', () => {
    renderCard({
      character: buildCharacter({
        status: 'rejected',
        rejectionReason: 'Le personnage manque de profondeur',
      }),
    })
    expect(screen.getByText(/raison du rejet/i)).toBeInTheDocument()
    expect(screen.getByText(/le personnage manque de profondeur/i)).toBeInTheDocument()
  })

  it('affiche le texte exact de la raison de rejet', () => {
    const reason = 'Contenu inapproprié pour l\'univers du jeu'
    renderCard({
      character: buildCharacter({ status: 'rejected', rejectionReason: reason }),
    })
    expect(screen.getByText(new RegExp(reason))).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Tests — menu "⋮"
// ---------------------------------------------------------------------------

describe('CharacterCard — menu "⋮" (plus d\'actions)', () => {
  it('le menu est fermé par défaut', () => {
    renderCard()
    expect(screen.queryByText('Supprimer')).not.toBeInTheDocument()
  })

  it('ouvre le menu au clic sur "⋮"', async () => {
    const user = userEvent.setup()
    renderCard()
    const menuButton = screen.getByRole('button', { name: /plus d'actions/i })
    await user.click(menuButton)
    expect(screen.getByText('Supprimer')).toBeInTheDocument()
  })

  it('le bouton menu a aria-expanded=false par défaut', () => {
    renderCard()
    const menuButton = screen.getByRole('button', { name: /plus d'actions/i })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('le bouton menu a aria-expanded=true une fois ouvert', async () => {
    const user = userEvent.setup()
    renderCard()
    const menuButton = screen.getByRole('button', { name: /plus d'actions/i })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('appelle onDelete avec le personnage au clic sur "Supprimer"', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const character = buildCharacter()
    render(<CharacterCard {...defaultProps({ character, onDelete })} />)

    // Open the menu
    await user.click(screen.getByRole('button', { name: /plus d'actions/i }))
    // Click delete
    await user.click(screen.getByText('Supprimer'))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(character)
  })

  it('ferme le menu après avoir cliqué sur "Supprimer"', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('button', { name: /plus d'actions/i }))
    expect(screen.getByText('Supprimer')).toBeInTheDocument()

    await user.click(screen.getByText('Supprimer'))
    expect(screen.queryByText('Supprimer')).not.toBeInTheDocument()
  })

  it('ferme le menu quand on clique sur le backdrop', () => {
    renderCard()

    // Open the menu via fireEvent (simpler for backdrop test)
    fireEvent.click(screen.getByRole('button', { name: /plus d'actions/i }))
    expect(screen.getByText('Supprimer')).toBeInTheDocument()

    // Click the backdrop (aria-hidden div that sits behind the menu)
    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop)

    expect(screen.queryByText('Supprimer')).not.toBeInTheDocument()
  })

  it('ne plante pas si onDelete n\'est pas fourni', async () => {
    const user = userEvent.setup()
    render(<CharacterCard {...defaultProps({ onDelete: undefined })} />)
    await user.click(screen.getByRole('button', { name: /plus d'actions/i }))
    // Should not throw
    await user.click(screen.getByText('Supprimer'))
  })
})

// ---------------------------------------------------------------------------
// Tests — champs optionnels (ethnicity, faction, clan)
// ---------------------------------------------------------------------------

describe('CharacterCard — champs optionnels', () => {
  it('affiche l\'ethnie si fournie', () => {
    renderCard({
      character: buildCharacter({ ethnicity: { name: 'Akori' } }),
    })
    expect(screen.getByText('Akori')).toBeInTheDocument()
  })

  it('n\'affiche pas l\'ethnie si null', () => {
    renderCard({ character: buildCharacter({ ethnicity: null }) })
    // No ethnicity text — hard to assert negatively without a specific test id,
    // but we can verify the component still renders without error
    expect(screen.getByRole('heading', { name: 'Kael Thornwood' })).toBeInTheDocument()
  })

  it('affiche la faction si fournie', () => {
    renderCard({
      character: buildCharacter({ faction: { name: 'Les Cendres', color: '#ff0000' } }),
    })
    expect(screen.getByText('Les Cendres')).toBeInTheDocument()
  })

  it('affiche faction et clan concaténés si les deux sont fournis', () => {
    renderCard({
      character: buildCharacter({
        faction: { name: 'Les Cendres', color: '#ff0000' },
        clan: { name: 'Clan du Feu' },
      }),
    })
    expect(screen.getByText('Les Cendres - Clan du Feu')).toBeInTheDocument()
  })

  it('n\'affiche pas le clan si la faction est null', () => {
    renderCard({
      character: buildCharacter({ faction: null, clan: { name: 'Clan du Feu' } }),
    })
    expect(screen.queryByText(/clan du feu/i)).not.toBeInTheDocument()
  })
})
