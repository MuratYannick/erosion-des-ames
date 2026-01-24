import { HeroSection, PresentationSection } from './components'
import './Home.css'

/**
 * Page d'accueil - Erosion des Ames
 *
 * Sections:
 * - Hero: Bannière d'accroche immersive
 * - Présentation: Texte d'immersion dans l'univers
 * - Actualités: Annonces récentes (à venir)
 * - Liens rapides: Navigation vers sections clés (à venir)
 */
const Home = () => {
  return (
    <div className="home-page">
      <HeroSection
        title="EROSION DES AMES"
        subtitle="Là où les pierres murmurent&#10;et les braises se souviennent"
        primaryCta={{ label: "Découvrir l'univers", href: "/universe" }}
        secondaryCta={{ label: "Éveiller ton âme", href: "/register" }}
        showBadge={true}
        badgeText="Alpha v0.1 - Premiers pas dans les ruines"
      />

      <PresentationSection
        title="Un Monde de Cendres et de Murmures"
        images={{
          ruins: "/images/presentation-ruins.jpg",
          ritual: "/images/presentation-ritual.jpg",
          artifact: "/images/presentation-artifact.jpg"
        }}
      />

      {/* Placeholder pour les sections suivantes */}
      {/* <NewsSection /> */}
      {/* <QuickLinksSection /> */}
    </div>
  )
}

export default Home
