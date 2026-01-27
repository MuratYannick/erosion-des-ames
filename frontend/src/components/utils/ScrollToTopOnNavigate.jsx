/**
 * ScrollToTopOnNavigate - Scroll automatique en haut au changement de route
 * À placer dans le Router pour un scroll automatique à chaque navigation
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll en haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // instant pour éviter l'animation au changement de page
    })
  }, [pathname])

  return null // Ce composant ne rend rien
}

export default ScrollToTopOnNavigate
