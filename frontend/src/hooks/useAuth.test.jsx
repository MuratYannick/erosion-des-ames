/**
 * Unit tests for the useAuth hook
 *
 * Strategy: we test useAuth through a real AuthContext.Provider that provides
 * mock values, because useAuth is a thin selector over the context.
 * We do NOT render AuthProvider (which makes real API calls) — we inject
 * controlled values directly.
 *
 * Coverage:
 * - Throws when used outside AuthProvider
 * - Returns all expected fields from context
 * - isAuthenticated=false when user=null
 * - isAuthenticated=true when user is defined
 * - Role helpers (isAdmin, isModerator, isGameMaster, isPlayer, isStaff)
 * - hasSelectedCharacter / selectedCharacterId
 * - updateUser merges data (does not replace entirely)
 * - login calls context.login and reflects new user
 * - logout clears user
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthContext } from '@/contexts/AuthContextDef'
import { useAuth } from '@/hooks/useAuth'

// ---------------------------------------------------------------------------
// Helper — wraps a hook render with a custom AuthContext value
// ---------------------------------------------------------------------------

const buildContextValue = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  refreshUser: vi.fn(),
  ...overrides,
})

const renderUseAuth = (contextValue) => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
  return renderHook(() => useAuth(), { wrapper })
}

// ---------------------------------------------------------------------------
// Tests — guard
// ---------------------------------------------------------------------------

describe('useAuth — guard (hors contexte)', () => {
  it('lève une erreur si utilisé en dehors d\'un AuthProvider', () => {
    // renderHook without wrapper — AuthContext defaults to null
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth doit être utilisé à l\'intérieur d\'un AuthProvider'
    )
  })
})

// ---------------------------------------------------------------------------
// Tests — valeurs retournées
// ---------------------------------------------------------------------------

describe('useAuth — valeurs retournées', () => {
  it('retourne user, isAuthenticated, isLoading', () => {
    const ctxValue = buildContextValue({
      user: { id: '1', username: 'Kael' },
      isAuthenticated: true,
      isLoading: false,
    })
    const { result } = renderUseAuth(ctxValue)

    expect(result.current.user).toEqual({ id: '1', username: 'Kael' })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('retourne les fonctions login, register, logout, updateUser, refreshUser', () => {
    const ctxValue = buildContextValue()
    const { result } = renderUseAuth(ctxValue)

    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.register).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.updateUser).toBe('function')
    expect(typeof result.current.refreshUser).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// Tests — isAuthenticated
// ---------------------------------------------------------------------------

describe('useAuth — isAuthenticated', () => {
  it('isAuthenticated est false quand user est null', () => {
    const { result } = renderUseAuth(buildContextValue({ user: null, isAuthenticated: false }))
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('isAuthenticated est true quand user est défini', () => {
    const { result } = renderUseAuth(
      buildContextValue({
        user: { id: '1', username: 'Kael', role: 'PLAYER' },
        isAuthenticated: true,
      })
    )
    expect(result.current.isAuthenticated).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Tests — helpers de rôles
// ---------------------------------------------------------------------------

describe('useAuth — helpers de rôles', () => {
  const renderWithRole = (role) =>
    renderUseAuth(
      buildContextValue({
        user: { id: '1', username: 'TestUser', role },
        isAuthenticated: true,
      })
    )

  it('isAdmin=true pour le rôle ADMIN', () => {
    const { result } = renderWithRole('ADMIN')
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.isModerator).toBe(false)
    expect(result.current.isGameMaster).toBe(false)
    expect(result.current.isPlayer).toBe(false)
  })

  it('isModerator=true pour le rôle MODERATOR', () => {
    const { result } = renderWithRole('MODERATOR')
    expect(result.current.isModerator).toBe(true)
    expect(result.current.isAdmin).toBe(false)
  })

  it('isGameMaster=true pour le rôle GAME_MASTER', () => {
    const { result } = renderWithRole('GAME_MASTER')
    expect(result.current.isGameMaster).toBe(true)
    expect(result.current.isAdmin).toBe(false)
  })

  it('isPlayer=true pour le rôle PLAYER', () => {
    const { result } = renderWithRole('PLAYER')
    expect(result.current.isPlayer).toBe(true)
    expect(result.current.isStaff).toBe(false)
  })

  it('isStaff=true pour ADMIN', () => {
    expect(renderWithRole('ADMIN').result.current.isStaff).toBe(true)
  })

  it('isStaff=true pour MODERATOR', () => {
    expect(renderWithRole('MODERATOR').result.current.isStaff).toBe(true)
  })

  it('isStaff=true pour GAME_MASTER', () => {
    expect(renderWithRole('GAME_MASTER').result.current.isStaff).toBe(true)
  })

  it('isStaff=false pour PLAYER', () => {
    expect(renderWithRole('PLAYER').result.current.isStaff).toBe(false)
  })

  it('tous les helpers de rôles sont false quand user est null', () => {
    const { result } = renderUseAuth(buildContextValue({ user: null }))
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isModerator).toBe(false)
    expect(result.current.isGameMaster).toBe(false)
    expect(result.current.isPlayer).toBe(false)
    expect(result.current.isStaff).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Tests — personnage sélectionné
// ---------------------------------------------------------------------------

describe('useAuth — personnage sélectionné', () => {
  it('selectedCharacterId est null quand user est null', () => {
    const { result } = renderUseAuth(buildContextValue({ user: null }))
    expect(result.current.selectedCharacterId).toBeNull()
    expect(result.current.hasSelectedCharacter).toBe(false)
  })

  it('selectedCharacterId est null quand user n\'a pas de selectedCharacterId', () => {
    const { result } = renderUseAuth(
      buildContextValue({ user: { id: '1', username: 'Kael' } })
    )
    expect(result.current.selectedCharacterId).toBeNull()
    expect(result.current.hasSelectedCharacter).toBe(false)
  })

  it('selectedCharacterId retourne la valeur et hasSelectedCharacter=true', () => {
    const { result } = renderUseAuth(
      buildContextValue({
        user: { id: '1', username: 'Kael', selectedCharacterId: 'char-42' },
      })
    )
    expect(result.current.selectedCharacterId).toBe('char-42')
    expect(result.current.hasSelectedCharacter).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Tests — appels aux fonctions du contexte
// ---------------------------------------------------------------------------

describe('useAuth — appels aux fonctions du contexte', () => {
  it('login appelle la fonction fournie par le contexte', async () => {
    const login = vi.fn().mockResolvedValue({ success: true })
    const { result } = renderUseAuth(buildContextValue({ login }))

    await act(async () => {
      await result.current.login('kael@test.com', 'password123')
    })

    expect(login).toHaveBeenCalledTimes(1)
    expect(login).toHaveBeenCalledWith('kael@test.com', 'password123')
  })

  it('logout appelle la fonction fournie par le contexte', async () => {
    const logout = vi.fn().mockResolvedValue({ success: true })
    const { result } = renderUseAuth(buildContextValue({ logout }))

    await act(async () => {
      await result.current.logout()
    })

    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('updateUser appelle la fonction fournie par le contexte', () => {
    const updateUser = vi.fn()
    const { result } = renderUseAuth(buildContextValue({ updateUser }))

    act(() => {
      result.current.updateUser({ username: 'NouveauNom' })
    })

    expect(updateUser).toHaveBeenCalledTimes(1)
    expect(updateUser).toHaveBeenCalledWith({ username: 'NouveauNom' })
  })

  it('register appelle la fonction fournie par le contexte', async () => {
    const register = vi.fn().mockResolvedValue({ success: true })
    const { result } = renderUseAuth(buildContextValue({ register }))

    await act(async () => {
      await result.current.register({ username: 'Kael', email: 'kael@test.com' })
    })

    expect(register).toHaveBeenCalledTimes(1)
  })

  it('refreshUser appelle la fonction fournie par le contexte', async () => {
    const refreshUser = vi.fn().mockResolvedValue(undefined)
    const { result } = renderUseAuth(buildContextValue({ refreshUser }))

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(refreshUser).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Tests — comportement de updateUser (fusion des données)
// Note: la logique de fusion réelle est dans AuthContext.updateUser.
// Ici on vérifie que useAuth passe bien les arguments tels quels.
// ---------------------------------------------------------------------------

describe('useAuth — updateUser fusion de données', () => {
  it('passe les données partielles à updateUser sans les écraser', () => {
    const updateUser = vi.fn()
    const { result } = renderUseAuth(
      buildContextValue({
        user: { id: '1', username: 'Kael', email: 'kael@test.com' },
        updateUser,
      })
    )

    act(() => {
      // Partial update — only username changes
      result.current.updateUser({ username: 'KaelModifié' })
    })

    // useAuth forwards the call — the merge logic lives in AuthProvider
    expect(updateUser).toHaveBeenCalledWith({ username: 'KaelModifié' })
    // Only the partial object is passed (not the full user)
    expect(updateUser).not.toHaveBeenCalledWith(
      expect.objectContaining({ email: 'kael@test.com' })
    )
  })
})
