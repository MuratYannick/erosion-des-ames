import PropTypes from 'prop-types';

// Section component for consistent styling
const Section = ({ title, content, icon }) => {
  if (!content || content.trim() === '') return null;

  return (
    <section className="mb-8 last:mb-0">
      {/* Section header with icon and decorative line */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
        <h2 className="font-heading text-xl sm:text-2xl text-primary-900 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-primary-400 to-transparent" />
      </div>

      {/* Section content */}
      <div className="font-body text-base sm:text-lg text-primary-800 leading-relaxed whitespace-pre-line pl-0 sm:pl-10">
        {content}
      </div>
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  icon: PropTypes.node.isRequired
};

/**
 * Full character detail sheet with scroll/parchment aesthetic
 * Displays all character fields in organized sections with tribal separators
 */
const CharacterSheet = ({ character }) => {
  const { appearance, personality, background, goals } = character;

  return (
    <div className="bg-surface border-2 border-primary-400 rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
      {/* Appearance section */}
      <Section
        title="Apparence"
        content={appearance}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      {/* Personality section */}
      <Section
        title="Personnalité"
        content={personality}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      {/* Background/History section */}
      <Section
        title="Histoire"
        content={background}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      {/* Goals & Motivations section */}
      <Section
        title="Objectifs & Motivations"
        content={goals}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        }
      />

      {/* Show message if all sections are empty */}
      {!appearance && !personality && !background && !goals && (
        <div className="text-center py-12">
          <p className="font-ui text-lg text-neutral-500">
            Aucun détail disponible pour ce personnage.
          </p>
        </div>
      )}
    </div>
  );
};

CharacterSheet.propTypes = {
  character: PropTypes.shape({
    appearance: PropTypes.string,
    personality: PropTypes.string,
    background: PropTypes.string,
    goals: PropTypes.string
  }).isRequired
};

export default CharacterSheet;
