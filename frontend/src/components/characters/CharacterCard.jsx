import { useState } from 'react';
import PropTypes from 'prop-types';
import CharacterStatusBadge from './CharacterStatusBadge';
import CharacterAvatar from './CharacterAvatar';

/**
 * Character card for "Mes Personnages" list
 * Shows avatar, status, basic info, and action buttons
 */
const CharacterCard = ({
  character,
  onView,
  onEdit,
  onSubmit,
  onDelete,
  onSelect,
  isSelected = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const { id, name, ethnicity, faction, clan, avatar, status, rejectionReason, age } = character;

  // Determine which actions are available based on status
  const canEdit = status === 'draft' || status === 'rejected';
  const canSubmit = status === 'draft' || status === 'rejected';

  const handleMenuToggle = () => setShowMenu(!showMenu);

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) onDelete(character);
  };

  return (
    <div className={`relative bg-surface border-2 rounded-xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 flex flex-col ${isSelected ? 'border-secondary-500 ring-2 ring-secondary-500/30 shadow-glow' : 'border-primary-400 hover:border-primary-500'}`}>
      {/* Active badge - top-left */}
      {isSelected && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-button bg-secondary-500 text-primary-900 shadow-sm">
            Actif
          </span>
        </div>
      )}

      {/* Status badge - absolute positioned top-right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <CharacterStatusBadge status={status} size="sm" />
      </div>

      {/* Avatar - centered */}
      <div className="flex justify-center mb-4 mt-2">
        <CharacterAvatar
          src={avatar}
          name={name}
          factionColor={faction?.color}
          size="md"
        />
      </div>

      {/* Character info */}
      <div className="text-center mb-4 space-y-1">
        <h3 className="font-subheading text-xl sm:text-2xl text-primary-900 leading-tight">
          {name}
        </h3>

        {ethnicity && (
          <p className="font-ui text-sm sm:text-base text-primary-700">
            {ethnicity.name}
          </p>
        )}

        {faction && (
          <p className="font-ui text-xs sm:text-sm font-medium" style={{ color: faction.color || '#7a6454' }}>
            {faction.name}
            {clan && ` - ${clan.name}`}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent mb-4" />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* View button - always visible */}
        <button
          onClick={() => onView && onView(character)}
          className="flex-1 min-w-[80px] px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 font-button text-sm sm:text-base rounded-lg transition-colors"
          aria-label={`Voir ${name}`}
        >
          Voir
        </button>

        {/* Edit button - draft/rejected only */}
        {canEdit && (
          <button
            onClick={() => onEdit && onEdit(character)}
            className="flex-1 min-w-[80px] px-3 py-2 bg-info/10 hover:bg-info/20 text-info-dark font-button text-sm sm:text-base rounded-lg transition-colors"
            aria-label={`Éditer ${name}`}
          >
            Éditer
          </button>
        )}

        {/* Submit button - draft/rejected only */}
        {canSubmit && (
          <button
            onClick={() => onSubmit && onSubmit(character)}
            className="flex-1 min-w-[90px] px-3 py-2 bg-secondary-500/80 hover:bg-secondary-500 text-primary-900 font-button text-sm sm:text-base rounded-lg transition-colors shadow-sm hover:shadow-glow"
            aria-label={`Soumettre ${name} pour approbation`}
          >
            Soumettre
          </button>
        )}

        {/* Select/Deselect button - approved only */}
        {status === 'approved' && onSelect && (
          <button
            onClick={() => onSelect(character)}
            className={`flex-1 min-w-[100px] px-3 py-2 font-button text-sm sm:text-base rounded-lg transition-colors ${
              isSelected
                ? 'bg-secondary-500/20 hover:bg-secondary-500/30 text-secondary-700 border border-secondary-500/40'
                : 'bg-secondary-500/80 hover:bg-secondary-500 text-primary-900 shadow-sm hover:shadow-glow'
            }`}
            aria-label={isSelected ? `Désélectionner ${name}` : `Sélectionner ${name}`}
          >
            {isSelected ? 'Désélectionner' : 'Sélectionner'}
          </button>
        )}

        {/* More menu button */}
        <div className="relative">
          <button
            onClick={handleMenuToggle}
            className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-button text-sm sm:text-base rounded-lg transition-colors"
            aria-label="Plus d'actions"
            aria-expanded={showMenu}
            aria-haspopup="true"
          >
            ⋮
          </button>

          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
                aria-hidden="true"
              />

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-1 w-36 bg-white border-2 border-primary-300 rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left font-ui text-sm text-error hover:bg-error/10 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rejection reason - only shown if rejected */}
      {status === 'rejected' && rejectionReason && (
        <div className="bg-error/10 border border-error/30 rounded px-3 py-2">
          <p className="font-ui text-xs text-error-dark leading-relaxed line-clamp-2">
            <strong>Raison du rejet:</strong> {rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
};

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    ethnicity: PropTypes.shape({
      name: PropTypes.string
    }),
    faction: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string
    }),
    clan: PropTypes.shape({
      name: PropTypes.string
    }),
    avatar: PropTypes.string,
    status: PropTypes.oneOf(['draft', 'pending', 'approved', 'rejected']).isRequired,
    rejectionReason: PropTypes.string,
    age: PropTypes.number
  }).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default CharacterCard;
