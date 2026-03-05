import Loader from './Loader'

/**
 * Fallback plein écran utilisé par React.Suspense pendant le chargement des chunks lazy.
 * Réutilise le Loader tribal existant en mode fullscreen avec les pierres d'autel.
 */
const SuspenseFallback = () => (
  <Loader
    variant="spinner"
    size="lg"
    fullscreen
    showAura
    showAsh
    text="Chargement..."
  />
)

export default SuspenseFallback
