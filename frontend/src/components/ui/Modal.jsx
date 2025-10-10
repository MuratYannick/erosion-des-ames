import PropTypes from "prop-types";
import { useEffect } from "react";

function Modal({ isOpen, onClose, title, children }) {
  // Fermer le modal avec la touche Échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Empêcher le scroll de la page en arrière-plan
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-city-950 border-2 border-ochre-600 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-ochre-700">
          <h2 className="text-2xl font-titre-Jeu text-ochre-500">{title}</h2>
          <button
            onClick={onClose}
            className="text-city-400 hover:text-ochre-500 transition-colors text-3xl leading-none"
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
