import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage avec une vraie implémentation Map-backed
// Les vi.fn() nus ne stockent rien — les tests api.test.js ont besoin de vraies lectures/écritures
const createLocalStorageMock = () => {
  const store = new Map()
  return {
    getItem: vi.fn((key) => store.get(key) ?? null),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    get length() { return store.size },
    key: vi.fn((i) => [...store.keys()][i] ?? null),
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock(),
  writable: true,
})
