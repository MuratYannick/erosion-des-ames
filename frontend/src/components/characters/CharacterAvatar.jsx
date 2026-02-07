import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Hexagonal avatar component with faction glow effect
 * Falls back to initials if image is unavailable
 */
const CharacterAvatar = ({ src, name, factionColor, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-32 h-32 text-4xl',
    xl: 'w-48 h-48 text-6xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Hexagonal clip-path
  const clipPath = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

  // Get initials from name (first 2 characters)
  const getInitials = (name) => {
    if (!name) return '?';
    return name.substring(0, 2).toUpperCase();
  };

  // Container style with optional faction glow
  const containerStyle = factionColor ? {
    position: 'relative',
    filter: `drop-shadow(0 0 12px ${factionColor}40)`
  } : {};

  const showImage = src && !imageError;

  return (
    <div style={containerStyle} className="inline-block">
      <div
        className={`${sizeClass} relative border-2 border-primary-500 bg-gradient-to-br from-primary-300 to-primary-500`}
        style={{ clipPath }}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            style={{ clipPath }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary-800 font-subheading font-bold">
            {getInitials(name)}
          </div>
        )}
      </div>
    </div>
  );
};

CharacterAvatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  factionColor: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default CharacterAvatar;
