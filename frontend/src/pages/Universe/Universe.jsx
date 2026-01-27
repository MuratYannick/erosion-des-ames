import { UniverseHero, LoreSection, sampleLoreChapters, FactionSection, factionsData, GeographySection, DawnTransition, LocationSection, TimelineSection, timelineEras } from './components'
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
        ctaHref="#lore"
        backgroundImage="/images/universe-bg.jpg"
      />

      <LoreSection
        chapters={sampleLoreChapters}
        title="Le Codex des Anciens"
        subtitle="Les fragments d'histoire gravés dans la pierre du temps"
      />

      <FactionSection factions={factionsData} />

      <GeographySection />

      <DawnTransition />

      <LocationSection
        title="Territoires Maudits"
        subtitle="Explorez les terres brisées où rôdent ombres et mystères"
        onLocationClick={(location) => {
          console.log('Location clicked:', location)
          // TODO: Ouvrir une modal ou naviguer vers une page de détail
        }}
      />

      <TimelineSection
        eras={timelineEras}
        title="Le Fleuve des Âges"
        subtitle="L'histoire de notre monde gravée dans la pierre du temps"
      />

      <ScrollToTop />
    </div>
  )
}

export default Universe
