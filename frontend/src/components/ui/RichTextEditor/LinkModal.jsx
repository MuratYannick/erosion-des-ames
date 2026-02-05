import { useState, useEffect } from 'react';
import Button from '../Button';
import Input from '../Input';

/**
 * LinkModal - Modal pour éditer les liens dans RichTextEditor
 * Style tribal cohérent avec le reste du système
 */
const LinkModal = ({
  isOpen,
  onClose,
  onSetLink,
  onRemoveLink,
  currentUrl = '',
  hasLink = false,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [error, setError] = useState('');

  useEffect(() => {
    setUrl(currentUrl);
    setError('');
  }, [currentUrl, isOpen]);

  const validateUrl = (value) => {
    if (!value) {
      return 'L\'URL est requise';
    }

    // Validation basique d'URL
    try {
      // Ajouter https:// si aucun protocole n'est spécifié
      const urlToTest = value.includes('://') ? value : `https://${value}`;
      new URL(urlToTest);
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
    onSetLink(finalUrl);
  };

  const handleRemove = () => {
    onRemoveLink();
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
        aria-labelledby="link-modal-title"
      >
        <div className="link-modal-content">
          {/* En-tête */}
          <div className="link-modal-header">
            <h3
              id="link-modal-title"
              className="text-lg font-subheading font-semibold text-primary-800"
            >
              {hasLink ? 'Modifier le lien' : 'Insérer un lien'}
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
              label="URL du lien"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://exemple.com"
              error={error}
              hint="Entrez l'adresse complète du lien"
              autoFocus
            />

            {/* Actions */}
            <div className="link-modal-actions">
              {hasLink && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleRemove}
                >
                  Supprimer le lien
                </Button>
              )}

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
                  {hasLink ? 'Modifier' : 'Insérer'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LinkModal;
