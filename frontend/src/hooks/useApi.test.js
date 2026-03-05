/**
 * Unit tests for useApi, useGet, useMutation hooks and invalidateCache utility
 *
 * Strategy: @/services/api is mocked with vi.mock so no real HTTP calls are made.
 * The module-level queryCache is shared across tests — we reset it by calling
 * invalidateCache('') (matches every key) in beforeEach.
 *
 * Coverage:
 * useApi:
 *   - execute() resolves: data updated, loading false, no error
 *   - execute() rejects: error set, loading false, data unchanged
 *   - onSuccess callback called on success
 *   - onError callback called on error
 *   - reset() clears data/error/loading
 *   - loading is true during the async call
 *
 * useGet:
 *   - fetches on mount (enabled=true default)
 *   - sets data, clears loading when done
 *   - sets error when API fails
 *   - does NOT fetch when enabled=false
 *   - cache: second call returns cached data without network call
 *   - cache: expired entry triggers a new network call
 *   - refetch() re-executes the query
 *
 * useMutation:
 *   - mutate() calls the apiFunc with arguments
 *   - data is set after success
 *   - loading is true during call, false after
 *   - onSuccess called with response data
 *   - onError called on failure
 *   - reset() clears state
 *   - does NOT auto-fetch on mount
 *
 * invalidateCache:
 *   - removes matching keys
 *   - does not remove non-matching keys
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useApi, useGet, useMutation, invalidateCache } from '@/hooks/useApi'

// ---------------------------------------------------------------------------
// Mock @/services/api
// ---------------------------------------------------------------------------

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

// Import the mock AFTER vi.mock so we get the mocked version
import api from '@/services/api'

// ---------------------------------------------------------------------------
// Stable config references — avoids the config={} identity issue where a new
// object literal on each render would change the useCallback deps, causing the
// effect to re-fire and making extra API calls.
// ---------------------------------------------------------------------------
const EMPTY_CONFIG = {}
const EMPTY_OPTIONS = {}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wraps response data in the format the hooks expect: response.data.data */
const makeApiResponse = (data) => ({ data: { data } })

/** Wraps response data without nested .data (response.data only) */
const makeApiResponseFlat = (data) => ({ data })

// ---------------------------------------------------------------------------
// Reset cache & mocks before each test
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  // Clear all cache entries — invalidateCache('') matches every key
  invalidateCache('')
})

// ---------------------------------------------------------------------------
// invalidateCache
// ---------------------------------------------------------------------------

describe('invalidateCache', () => {
  // We exercise the cache indirectly through useGet with cache:true,
  // then call invalidateCache to verify the next call goes to the network.

  it('vide les entrées correspondant au pattern', async () => {
    api.get
      .mockResolvedValueOnce(makeApiResponse('donnée initiale'))
      .mockResolvedValueOnce(makeApiResponse('donnée rechargée'))

    const { result } = renderHook(() =>
      useGet('/forum/categories', EMPTY_CONFIG, { cache: true, cacheTTL: 60000 })
    )

    // First fetch
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('donnée initiale')
    expect(api.get).toHaveBeenCalledTimes(1)

    // Invalidate the cache entry
    act(() => {
      invalidateCache('/forum/categories')
    })

    // Refetch — cache is gone so API must be called again
    await act(async () => {
      await result.current.refetch()
    })
    expect(api.get).toHaveBeenCalledTimes(2)
    expect(result.current.data).toBe('donnée rechargée')
  })

  it('ne vide pas les entrées dont la clé ne correspond pas au pattern', async () => {
    api.get.mockResolvedValue(makeApiResponse('données'))

    // Prime the cache for /forum/categories
    const { result } = renderHook(() =>
      useGet('/forum/categories', EMPTY_CONFIG, { cache: true, cacheTTL: 60000 })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))

    const callCountAfterFirstFetch = api.get.mock.calls.length

    // Invalidate a DIFFERENT key
    act(() => invalidateCache('/users'))

    // Refetch — cache for /forum/categories should still be valid
    await act(async () => {
      await result.current.refetch()
    })

    // The API should NOT have been called again (cache hit)
    expect(api.get.mock.calls.length).toBe(callCountAfterFirstFetch)
  })
})

// ---------------------------------------------------------------------------
// useApi
// ---------------------------------------------------------------------------

describe('useApi — succès', () => {
  it('met à jour data après un appel réussi', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse({ items: [1, 2] }))
    const { result } = renderHook(() => useApi(apiFunc))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual({ items: [1, 2] })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('gère une réponse sans .data.data (réponse plate)', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponseFlat('réponse plate'))
    const { result } = renderHook(() => useApi(apiFunc))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toBe('réponse plate')
  })

  it('appelle le callback onSuccess avec les données', async () => {
    const onSuccess = vi.fn()
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse('ok'))
    const { result } = renderHook(() => useApi(apiFunc, { onSuccess }))

    await act(async () => {
      await result.current.execute()
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith('ok')
  })

  it('passe les arguments à la fonction API', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse(null))
    const { result } = renderHook(() => useApi(apiFunc))

    await act(async () => {
      await result.current.execute('arg1', 42)
    })

    expect(apiFunc).toHaveBeenCalledWith('arg1', 42)
  })

  it('loading est true pendant l\'appel puis false ensuite', async () => {
    let resolveApi
    const apiFunc = vi.fn(
      () => new Promise((resolve) => { resolveApi = resolve })
    )
    const { result } = renderHook(() => useApi(apiFunc))

    act(() => {
      result.current.execute()
    })

    // Loading should be true while the promise is pending
    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveApi(makeApiResponse('done'))
    })

    expect(result.current.loading).toBe(false)
  })
})

describe('useApi — erreur', () => {
  it('met à jour error quand l\'API échoue', async () => {
    const err = new Error('Erreur réseau')
    const apiFunc = vi.fn().mockRejectedValue(err)
    const { result } = renderHook(() => useApi(apiFunc))

    await act(async () => {
      await result.current.execute().catch(() => {})
    })

    expect(result.current.error).toBe(err)
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('appelle le callback onError avec l\'erreur', async () => {
    const onError = vi.fn()
    const err = new Error('Serveur KO')
    const apiFunc = vi.fn().mockRejectedValue(err)
    const { result } = renderHook(() => useApi(apiFunc, { onError }))

    await act(async () => {
      await result.current.execute().catch(() => {})
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(err)
  })

  it('re-lève l\'erreur (throw) pour que l\'appelant puisse la gérer', async () => {
    const apiFunc = vi.fn().mockRejectedValue(new Error('Oops'))
    const { result } = renderHook(() => useApi(apiFunc))

    await expect(
      act(async () => {
        await result.current.execute()
      })
    ).rejects.toThrow('Oops')
  })
})

describe('useApi — reset', () => {
  it('reset() remet data, error, loading à leur valeur initiale', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse('données'))
    const { result } = renderHook(() => useApi(apiFunc))

    await act(async () => {
      await result.current.execute()
    })
    expect(result.current.data).toBe('données')

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// useGet
// ---------------------------------------------------------------------------

describe('useGet — fetch automatique au montage', () => {
  it('déclenche l\'appel API au montage et met à jour data', async () => {
    api.get.mockResolvedValueOnce(makeApiResponse([{ id: 1 }]))

    const { result } = renderHook(() => useGet('/users', EMPTY_CONFIG))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/users', expect.objectContaining({ skipErrorRedirect: true }))
    expect(result.current.data).toEqual([{ id: 1 }])
    expect(result.current.error).toBeNull()
  })

  it('loading commence à false, passe à true pendant le fetch, revient à false', async () => {
    let resolveGet
    api.get.mockReturnValueOnce(new Promise((r) => { resolveGet = r }))

    const { result } = renderHook(() => useGet('/users', EMPTY_CONFIG))

    // Immediately after mount, loading is true
    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveGet(makeApiResponse([]))
    })

    expect(result.current.loading).toBe(false)
  })

  it('met à jour error quand le fetch échoue', async () => {
    const err = new Error('404')
    api.get.mockRejectedValueOnce(err)

    const { result } = renderHook(() => useGet('/missing', EMPTY_CONFIG))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(err)
    expect(result.current.data).toBeNull()
  })
})

describe('useGet — option enabled=false', () => {
  it('ne déclenche pas l\'appel API quand enabled=false', async () => {
    const { result } = renderHook(() => useGet('/users', EMPTY_CONFIG, { enabled: false }))

    // Wait a tick to confirm no call was made
    await act(async () => {})

    expect(api.get).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('refetch() ne déclenche pas d\'appel non plus quand enabled=false', async () => {
    const { result } = renderHook(() => useGet('/users', EMPTY_CONFIG, { enabled: false }))

    await act(async () => {
      await result.current.refetch()
    })

    expect(api.get).not.toHaveBeenCalled()
  })
})

describe('useGet — cache', () => {
  it('met en cache les données et ne rappelle pas l\'API lors d\'un refetch dans le TTL', async () => {
    api.get.mockResolvedValue(makeApiResponse('données en cache'))

    const { result } = renderHook(() =>
      useGet('/forum/categories', EMPTY_CONFIG, { cache: true, cacheTTL: 60000 })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(api.get).toHaveBeenCalledTimes(1)

    // Refetch immediately — should hit cache
    await act(async () => {
      await result.current.refetch()
    })

    // API should still have been called only once
    expect(api.get).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe('données en cache')
  })

  it('rappelle l\'API quand le cache est expiré (TTL=0)', async () => {
    api.get
      .mockResolvedValueOnce(makeApiResponse('données fraîches 1'))
      .mockResolvedValueOnce(makeApiResponse('données fraîches 2'))

    // TTL of 0 means every call is a cache miss
    const { result } = renderHook(() =>
      useGet('/forum/categories', EMPTY_CONFIG, { cache: true, cacheTTL: 0 })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(api.get).toHaveBeenCalledTimes(1)

    // Refetch — cache is always expired with TTL=0
    await act(async () => {
      await result.current.refetch()
    })

    expect(api.get).toHaveBeenCalledTimes(2)
    expect(result.current.data).toBe('données fraîches 2')
  })

  it('appelle onSuccess avec les données du cache lors d\'un cache hit', async () => {
    const onSuccess = vi.fn()
    api.get.mockResolvedValueOnce(makeApiResponse('depuis cache'))

    const { result } = renderHook(() =>
      useGet('/forum/categories', EMPTY_CONFIG, { cache: true, cacheTTL: 60000, onSuccess })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    onSuccess.mockClear()

    // Refetch from cache — onSuccess should still be called
    await act(async () => {
      await result.current.refetch()
    })

    expect(onSuccess).toHaveBeenCalledWith('depuis cache')
  })
})

describe('useGet — refetch', () => {
  it('refetch() re-exécute la requête et met à jour data', async () => {
    api.get
      .mockResolvedValueOnce(makeApiResponse('v1'))
      .mockResolvedValueOnce(makeApiResponse('v2'))

    const { result } = renderHook(() => useGet('/data', EMPTY_CONFIG))

    await waitFor(() => expect(result.current.data).toBe('v1'))

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data).toBe('v2')
    expect(api.get).toHaveBeenCalledTimes(2)
  })
})

// ---------------------------------------------------------------------------
// useMutation
// ---------------------------------------------------------------------------

describe('useMutation — comportement de base', () => {
  it('ne déclenche pas d\'appel API au montage', async () => {
    const apiFunc = vi.fn()
    renderHook(() => useMutation(apiFunc))

    await act(async () => {})

    expect(apiFunc).not.toHaveBeenCalled()
  })

  it('mutate() appelle la fonction API avec les arguments', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse('ok'))
    const { result } = renderHook(() => useMutation(apiFunc))

    await act(async () => {
      await result.current.mutate({ username: 'kael' })
    })

    expect(apiFunc).toHaveBeenCalledTimes(1)
    expect(apiFunc).toHaveBeenCalledWith({ username: 'kael' })
  })

  it('met à jour data après un appel réussi', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse({ id: '99', name: 'Kael' }))
    const { result } = renderHook(() => useMutation(apiFunc))

    await act(async () => {
      await result.current.mutate()
    })

    expect(result.current.data).toEqual({ id: '99', name: 'Kael' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})

describe('useMutation — loading', () => {
  it('loading est true pendant l\'appel puis false après', async () => {
    let resolveMutation
    const apiFunc = vi.fn(
      () => new Promise((resolve) => { resolveMutation = resolve })
    )
    const { result } = renderHook(() => useMutation(apiFunc))

    act(() => {
      result.current.mutate()
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveMutation(makeApiResponse('done'))
    })

    expect(result.current.loading).toBe(false)
  })
})

describe('useMutation — callbacks', () => {
  it('appelle onSuccess avec les données de la réponse', async () => {
    const onSuccess = vi.fn()
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse('créé'))
    const { result } = renderHook(() => useMutation(apiFunc, { onSuccess }))

    await act(async () => {
      await result.current.mutate()
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith('créé')
  })

  it('appelle onError quand la mutation échoue', async () => {
    const onError = vi.fn()
    const err = new Error('Conflit')
    const apiFunc = vi.fn().mockRejectedValue(err)
    const { result } = renderHook(() => useMutation(apiFunc, { onError }))

    await act(async () => {
      await result.current.mutate().catch(() => {})
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(err)
  })

  it('met à jour error et loading=false quand la mutation échoue', async () => {
    const err = new Error('500')
    const apiFunc = vi.fn().mockRejectedValue(err)
    const { result } = renderHook(() => useMutation(apiFunc))

    await act(async () => {
      await result.current.mutate().catch(() => {})
    })

    expect(result.current.error).toBe(err)
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('re-lève l\'erreur pour que l\'appelant puisse la capturer', async () => {
    const apiFunc = vi.fn().mockRejectedValue(new Error('Oops'))
    const { result } = renderHook(() => useMutation(apiFunc))

    await expect(
      act(async () => {
        await result.current.mutate()
      })
    ).rejects.toThrow('Oops')
  })
})

describe('useMutation — reset', () => {
  it('reset() remet data, error, loading à leur valeur initiale', async () => {
    const apiFunc = vi.fn().mockResolvedValue(makeApiResponse('données'))
    const { result } = renderHook(() => useMutation(apiFunc))

    await act(async () => {
      await result.current.mutate()
    })

    expect(result.current.data).toBe('données')

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
