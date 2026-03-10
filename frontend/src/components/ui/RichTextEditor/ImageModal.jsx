import { useState } from 'react';
import Button from '../Button';
import Input from '../Input';

/**
 * ImageModal - Modal pour insérer des images dans RichTextEditor
 * Style tribal cohérent avec LinkModal
 */
const ImageModal = ({
  isOpen,
  onClose,
  onSetImage,
  currentUrl = '',
  currentAlt = '',
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [alt, setAlt] = useState(currentAlt);
  const [error, setError] = useState('');

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevCurrentUrl, setPrevCurrentUrl] = useState(currentUrl);
  const [prevCurrentAlt, setPrevCurrentAlt] = useState(currentAlt);

  if (isOpen !== prevIsOpen || currentUrl !== prevCurrentUrl || currentAlt !== prevCurrentAlt) {
    setPrevIsOpen(isOpen);
    setPrevCurrentUrl(currentUrl);
    setPrevCurrentAlt(currentAlt);
    setUrl(currentUrl);
    setAlt(currentAlt);
    setError('');
  }

  const validateUrl = (value) => {
    if (!value) {
      return 'L\'URL de l\'image est requise';
    }

    // Validation basique d'URL
    try {
      // Ajouter https:// si aucun protocole n'est spécifié
      const urlToTest = value.includes('://') ? value : `https://${value}`;
      new URL(urlToTest);

      // Vérifier que c'est une URL d'image (basique)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext =>
        value.toLowerCase().includes(ext)
      );

      if (!hasImageExtension && !value.includes('imgur') && !value.includes('cloudinary')) {
        return 'L\'URL ne semble pas être une image valide';
      }

      return '';
    } catch {
      return 'URL invalide';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Ajouter https:// si nécessaire
    const finalUrl = url.includes('://') ? url : `https://${url}`;
    onSetImage({ src: finalUrl, alt: alt || 'Image' });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="link-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="link-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-modal-title"
      >
        <div className="link-modal-content">
          {/* En-tête */}
          <div className="link-modal-header">
            <h3
              id="image-modal-title"
              className="text-lg font-subheading font-semibold text-primary-800"
            >
              Insérer une image
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="link-modal-close"
              aria-label="Fermer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Corps */}
          <form onSubmit={handleSubmit} className="link-modal-body">
            <Input
              label="URL de l'image"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://exemple.com/image.jpg"
              error={error}
              hint="URL complète de l'image (jpg, png, gif, webp)"
              autoFocus
            />

            <div className="mt-4">
              <Input
                label="Texte alternatif (optionnel)"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Description de l'image"
                hint="Pour l'accessibilité et le référencement"
              />
            </div>

            {/* Actions */}
            <div className="link-modal-actions">
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Insérer
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ImageModal;
