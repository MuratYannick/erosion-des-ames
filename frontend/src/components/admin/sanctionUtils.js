/**
 * Returns a human-readable string for the remaining time before a sanction expires.
 * Returns null if the sanction is permanent (no expiresAt) or already expired.
 *
 * @param {string|Date|null} expiresAt
 * @returns {string|null}
 */
export function formatRemainingTime(expiresAt) {
  if (!expiresAt) return null

  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires - now

  if (diffMs <= 0) return null

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`
  }
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  return `${minutes}m`
}
