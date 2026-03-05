/**
 * Tests basiques pour les pages d'erreur
 * Note: Ces tests nécessitent @testing-library/react et jest
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterEach, act } from 'vitest'
import { render, screen, fireEvent, act as rtlAct } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NotFound, Forbidden, ServerError, Maintenance } from './index'
import { ErrorBoundary } from '../../components/errors'

// Helper pour wrapper les composants avec Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('NotFound (404)', () => {
  it('affiche le code 404', () => {
    renderWithRouter(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('affiche le titre "Chemin Perdu"', () => {
    renderWithRouter(<NotFound />)
    expect(screen.getByText('Chemin Perdu')).toBeInTheDocument()
  })

  it('affiche le message principal', () => {
    renderWithRouter(<NotFound />)
    expect(screen.getByText(/les repères ancestraux/i)).toBeInTheDocument()
  })

  it('affiche les deux boutons d\'action', () => {
    renderWithRouter(<NotFound />)
    expect(screen.getAllByText(/retour à l'accueil/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/page précédente/i).length).toBeGreaterThan(0)
  })

  it('affiche l\'illustration de la boussole', () => {
    const { container } = renderWithRouter(<NotFound />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})

describe('Forbidden (403)', () => {
  it('affiche le code 403', () => {
    renderWithRouter(<Forbidden />)
    expect(screen.getByText('403')).toBeInTheDocument()
  })

  it('affiche le titre "Territoire Interdit"', () => {
    renderWithRouter(<Forbidden />)
    expect(screen.getByText('Territoire Interdit')).toBeInTheDocument()
  })

  it('affiche le bouton "Se connecter" si non authentifié', () => {
    renderWithRouter(<Forbidden userAuthenticated={false} />)
    expect(screen.getByText(/se connecter/i)).toBeInTheDocument()
  })

  it('n\'affiche pas le bouton "Se connecter" si authentifié', () => {
    renderWithRouter(<Forbidden userAuthenticated={true} />)
    expect(screen.queryByText(/se connecter/i)).not.toBeInTheDocument()
  })

  it('adapte le message selon l\'état d\'authentification', () => {
    const { rerender } = renderWithRouter(<Forbidden userAuthenticated={false} />)
    expect(screen.getByText(/vous devez vous identifier/i)).toBeInTheDocument()

    rerender(
      <BrowserRouter>
        <Forbidden userAuthenticated={true} />
      </BrowserRouter>
    )
    expect(screen.getByText(/vos privilèges actuels/i)).toBeInTheDocument()
  })
})

describe('ServerError (500)', () => {
  it('affiche le code 500', () => {
    renderWithRouter(<ServerError />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('affiche le titre "Perturbation Spirituelle"', () => {
    renderWithRouter(<ServerError />)
    expect(screen.getByText('Perturbation Spirituelle')).toBeInTheDocument()
  })

  it('affiche le bouton "Réessayer"', () => {
    renderWithRouter(<ServerError />)
    expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument()
  })

  it('appelle onRetry quand on clique sur Réessayer', () => {
    const mockRetry = vi.fn()
    renderWithRouter(<ServerError onRetry={mockRetry} />)

    const retryButton = screen.getByRole('button', { name: /réessayer/i })
    fireEvent.click(retryButton)

    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('recharge la page si pas de onRetry fourni', () => {
    const mockReload = vi.fn()
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: mockReload }
    })

    renderWithRouter(<ServerError />)

    const retryButton = screen.getByRole('button', { name: /réessayer/i })
    fireEvent.click(retryButton)

    expect(mockReload).toHaveBeenCalled()
  })
})

describe('Maintenance', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('affiche le titre "Rituel en Cours"', () => {
    renderWithRouter(<Maintenance />)
    expect(screen.getByText('Rituel en Cours')).toBeInTheDocument()
  })

  it('n\'affiche pas de code d\'erreur', () => {
    const { container } = renderWithRouter(<Maintenance />)
    // Vérifier qu'il n'y a pas de grand nombre affiché
    const errorCodes = ['400', '401', '403', '404', '500', '502', '503']
    errorCodes.forEach(code => {
      expect(screen.queryByText(code)).not.toBeInTheDocument()
    })
  })

  it('affiche le bouton "Rafraîchir"', () => {
    renderWithRouter(<Maintenance />)
    expect(screen.getByText(/rafraîchir/i)).toBeInTheDocument()
  })

  it('affiche la durée estimée si fournie', () => {
    renderWithRouter(<Maintenance estimatedTime="30 minutes" />)
    expect(screen.getByText(/30 minutes/i)).toBeInTheDocument()
  })

  it('affiche le message personnalisé si fourni', () => {
    const customMessage = "Message personnalisé de maintenance"
    renderWithRouter(<Maintenance message={customMessage} />)
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('affiche le compte à rebours pour l\'auto-refresh', () => {
    renderWithRouter(<Maintenance />)
    // Le composant devrait afficher "Rafraîchir (Xs)" avec X <= 60
    expect(screen.getByText(/rafraîchir \(\d+s\)/i)).toBeInTheDocument()
  })

  it('décrémente le compte à rebours chaque seconde', () => {
    renderWithRouter(<Maintenance />)

    // Compte initial (60s)
    expect(screen.getByText(/60s/i)).toBeInTheDocument()

    // Avancer de 1 seconde — envelopper dans act pour flush les mises à jour React
    rtlAct(() => {
      vi.advanceTimersByTime(1000)
    })

    // Vérifier que le compte a décrémenté
    expect(screen.getByText(/59s/i)).toBeInTheDocument()
  })

  it('permet de désactiver l\'auto-refresh', () => {
    renderWithRouter(<Maintenance />)

    const toggleButton = screen.getByText(/auto-refresh activé/i)
    fireEvent.click(toggleButton)

    expect(screen.getByText(/auto-refresh désactivé/i)).toBeInTheDocument()
  })
})

describe('ErrorBoundary', () => {
  // Supprimer les erreurs de console pour les tests d'ErrorBoundary
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  it('rend les enfants quand il n\'y a pas d\'erreur', () => {
    render(
      <ErrorBoundary>
        <div>Contenu normal</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Contenu normal')).toBeInTheDocument()
  })

  it('affiche le fallback quand une erreur est levée', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    // Par défaut, ErrorBoundary affiche ServerError
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('appelle onError quand une erreur est capturée', () => {
    const mockOnError = vi.fn()

    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(mockOnError).toHaveBeenCalled()
  })

  it('utilise le fallback personnalisé si fourni', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    const CustomFallback = () => <div>Erreur personnalisée</div>

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Erreur personnalisée')).toBeInTheDocument()
  })
})

describe('Responsive Design', () => {
  it('adapte la taille des illustrations selon le viewport', () => {
    const { container } = renderWithRouter(<NotFound />)

    // Vérifier que les classes responsive sont présentes
    const illustrationContainer = container.querySelector('.w-48')
    expect(illustrationContainer).toHaveClass('sm:w-56', 'md:w-64', 'lg:w-72')
  })
})

describe('Accessibilité', () => {
  it('utilise les attributs ARIA appropriés', () => {
    renderWithRouter(<NotFound />)

    const heading = screen.getByText('404')
    expect(heading).toHaveAttribute('aria-label', 'Erreur 404')
  })

  it('les SVG ont aria-hidden pour ne pas polluer les lecteurs d\'écran', () => {
    const { container } = renderWithRouter(<NotFound />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Animations', () => {
  it('applique les classes d\'animation CSS', () => {
    const { container } = renderWithRouter(<NotFound />)

    // Vérifier que l'animation est appliquée au code
    const errorCode = container.querySelector('.error-code-pulse')
    expect(errorCode).toBeInTheDocument()

    // Vérifier l'animation de l'illustration
    const illustration = container.querySelector('.illustration-float-lost')
    expect(illustration).toBeInTheDocument()
  })
})
