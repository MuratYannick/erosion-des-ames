import { UniverseHero } from './components'
import { ScrollToTop } from '@/components'

/**
 * Universe - Page de présentation de l'univers du jeu
 *
 * Présente le lore, les factions, les lieux, et l'histoire
 * du monde d'Erosion des Ames
 */
const Universe = () => {
  return (
    <div className="universe-page">
      <UniverseHero
        title="UNIVERS D'EROSION&#10;DES AMES"
        subtitle="Là où les ruines murmurent les secrets d'un monde oublié"
        description="Explorez un univers de dark fantasy tribale où les vestiges du passé côtoient les lueurs d'espoir d'un futur incertain. Découvrez les mystères des artefacts anciens, les rituels sacrés des tribus survivantes, et les ombres qui rôdent dans les décombres du monde ancien."
        ctaLabel="Explorer le Lore"
        ctaHref="/univers/explorer/lore"
        backgroundImage="/images/universe-bg.jpg"
      />

      {/* Placeholder pour les sections futures */}
      <section id="lore" className="py-20 px-6 bg-gradient-to-b from-[#2f2722] to-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-primary-900 mb-6">
            Prochainement...
          </h2>
          <p className="font-body text-primary-700">
            Les sections Lore, Factions et Lieux seront bientot disponibles.
          </p>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Universe
