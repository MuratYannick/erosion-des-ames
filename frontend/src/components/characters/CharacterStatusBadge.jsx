import PropTypes from 'prop-types';

/**
 * Badge component displaying character workflow status
 * Each status has distinct visuals matching the tribal theme
 */
const CharacterStatusBadge = ({ status, size = 'md', showLabel = true }) => {
  const config = {
    draft: {
      label: 'Brouillon',
      className: 'bg-neutral-200 border-neutral-400 text-neutral-700',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    },
    pending: {
      label: 'En attente',
      className: 'bg-warning/20 border-warning text-warning-dark shadow-sm',
      icon: (
        <svg className="w-full h-full animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      )
    },
    approved: {
      label: 'Approuvé',
      className: 'bg-success/20 border-success text-success-dark',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    rejected: {
      label: 'Rejeté',
      className: 'bg-error/20 border-error text-error-dark',
      icon: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  };

  const sizeClasses = {
    sm: {
      container: 'px-2 py-0.5 gap-1',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'px-3 py-1 gap-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'px-4 py-1.5 gap-2',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const statusConfig = config[status] || config.draft;
  const sizes = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-ui font-medium ${statusConfig.className} ${sizes.container}`}
      role="status"
      aria-label={`Statut: ${statusConfig.label}`}
    >
      <span className={sizes.icon} aria-hidden="true">
        {statusConfig.icon}
      </span>
      {showLabel && (
        <span className={sizes.text}>
          {statusConfig.label}
        </span>
      )}
    </span>
  );
};

CharacterStatusBadge.propTypes = {
  status: PropTypes.oneOf(['draft', 'pending', 'approved', 'rejected']).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showLabel: PropTypes.bool
};

export default CharacterStatusBadge;
