import { HeroSection, PresentationSection, NewsSection, QuickLinksSection } from './components'
import { ScrollToTop } from '@/components'
import { mockNews } from '@/data/mockNews'
import SEO from '@/components/common/SEO'
import './Home.css'

/**
 * Page d'accueil - Erosion des Ames
 *
 * Sections:
 * - Hero: Bannière d'accroche immersive
 * - Présentation: Texte d'immersion dans l'univers
 * - Actualités: Annonces et nouvelles récentes
 * - Liens rapides: Navigation vers sections clés
 */
const Home = () => {
  return (
    <div className="home-page w-full">
      <SEO
        title="Accueil"
        description="Bienvenue sur Erosion des Âmes, forum de jeu de rôle dark fantasy tribale. Rejoignez la communauté et plongez dans un monde de cendres et de désolation."
      />
      <HeroSection
        title="EROSION DES AMES"
        subtitle="Là où les pierres murmurent&#10;et les braises se souviennent"
        primaryCta={{ label: "Découvrir l'univers", href: "/universe" }}
        secondaryCta={{ label: "Éveiller ton âme", href: "/register" }}
        showBadge={true}
        badgeText="Alpha v0.1 - Premiers pas dans les ruines"
      />

      <PresentationSection
        title="Un Monde de Cendres et de Désolation"
      />

      <NewsSection
        title="Chroniques des Ruines"
        subtitle="Les dernières nouvelles des terres désolées"
        newsItems={mockNews}
        viewAllLink="/news"
      />

      <QuickLinksSection
        title="Sentiers des Ruines"
        subtitle="Choisis ton chemin dans les décombres"
      />

      <ScrollToTop />
    </div>
  )
}

export default Home
