import { useState, useRef, useEffect } from 'react';

/**
 * EmojiPicker - Sélecteur d'emojis tribal
 * Liste hardcodée d'emojis populaires organisés par catégorie
 */

const EMOJI_CATEGORIES = {
  frequent: {
    label: 'Fréquents',
    emojis: ['😀', '😂', '❤️', '👍', '👎', '🔥', '⚔️', '💀', '🗡️', '🛡️']
  },
  expressions: {
    label: 'Expressions',
    emojis: ['😊', '😎', '🤔', '😱', '😈', '🤣', '😢', '😤', '🥳', '😏']
  },
  actions: {
    label: 'Actions',
    emojis: ['👋', '🙏', '💪', '✊', '🤝', '👏', '🎯', '⚡', '💥', '🌟']
  },
  rpg: {
    label: 'RPG',
    emojis: ['🧙', '🗺️', '🏰', '🐉', '🧝', '🧟', '👹', '🦇', '🌑', '🔮']
  }
};

const EmojiPicker = ({ isOpen, onClose, onSelectEmoji }) => {
  const [selectedCategory, setSelectedCategory] = useState('frequent');
  const pickerRef = useRef(null);

  // Fermer au clic extérieur
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleEmojiClick = (emoji) => {
    onSelectEmoji(emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="emoji-picker" ref={pickerRef}>
      {/* En-tête avec onglets de catégories */}
      <div className="emoji-picker-header">
        {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            type="button"
            className={[
              'emoji-picker-tab',
              selectedCategory === key && 'emoji-picker-tab--active'
            ].filter(Boolean).join(' ')}
            onClick={() => setSelectedCategory(key)}
            title={category.label}
          >
            {category.emojis[0]}
          </button>
        ))}
      </div>

      {/* Grille d'emojis */}
      <div className="emoji-picker-grid">
        {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            type="button"
            className="emoji-picker-item"
            onClick={() => handleEmojiClick(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Label de catégorie */}
      <div className="emoji-picker-footer">
        {EMOJI_CATEGORIES[selectedCategory].label}
      </div>
    </div>
  );
};

export default EmojiPicker;
