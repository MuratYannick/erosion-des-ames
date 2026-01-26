import PropTypes from 'prop-types'
import FactionCard from './FactionCard'
import './FactionSection.css'

/**
 * FactionSection - Présentation des factions du monde
 * Layout: Grille responsive avec titre tribal et motif de séparation
 */
const FactionSection = ({ factions }) => {
  return (
    <section className="faction-section" id="factions">
      {/* Header avec décoration tribale */}
      <header className="faction-section__header">
        <div className="faction-section__rune-line" aria-hidden="true">
          <span className="faction-section__rune">◆</span>
          <span className="faction-section__rune">◆</span>
          <span className="faction-section__rune">◆</span>
        </div>

        <h2 className="faction-section__title">Les Tribus des Terres Désolées</h2>

        <p className="faction-section__intro">
          Dans l'ombre des ruines anciennes, cinq factions luttent pour leur survie.
          Chacune porte en elle une vision du monde, une philosophie forgée dans les
          braises de l'Érosion. Découvrez leurs symboles, leurs valeurs, et leurs âmes.
        </p>

        <div className="faction-section__divider" aria-hidden="true">
          <div className="faction-section__divider-line" />
          <span className="faction-section__divider-icon">⬥</span>
          <div className="faction-section__divider-line" />
        </div>
      </header>

      {/* Grille de cartes */}
      <div className="faction-section__grid">
        {factions.map((faction) => (
          <FactionCard key={faction.id} faction={faction} />
        ))}
      </div>

      {/* Footer avec citation atmosphérique */}
      <footer className="faction-section__footer">
        <blockquote className="faction-section__quote">
          "Cinq bannières dans la tempête de cendres.
          <br />
          Cinq chemins vers la rédemption ou l'oubli."
        </blockquote>
        <cite className="faction-section__cite">— Codex des Érodés, Tablette VII</cite>
      </footer>
    </section>
  )
}

FactionSection.propTypes = {
  factions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tagline: PropTypes.string.isRequired,
      philosophy: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.string).isRequired,
      colors: PropTypes.shape({
        primary: PropTypes.string.isRequired,
        accent: PropTypes.string.isRequired,
        glow: PropTypes.string.isRequired,
      }).isRequired,
      Emblem: PropTypes.elementType.isRequired,
    })
  ).isRequired,
}

export default FactionSection
