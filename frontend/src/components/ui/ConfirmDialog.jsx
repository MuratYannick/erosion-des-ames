import PropTypes from "prop-types";
import Modal from "./Modal";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "warning", // warning, danger, info
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-blood-700 hover:bg-blood-600",
          icon: "⚠️",
        };
      case "info":
        return {
          button: "bg-city-600 hover:bg-city-500",
          icon: "ℹ️",
        };
      case "warning":
      default:
        return {
          button: "bg-ochre-600 hover:bg-ochre-500",
          icon: "⚠️",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {/* Message */}
        <div className="flex items-start gap-4">
          <span className="text-3xl">{styles.icon}</span>
          <p className="text-city-200 font-texte-corps flex-1">{message}</p>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 text-city-950 rounded font-texte-corps transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["warning", "danger", "info"]),
};

export default ConfirmDialog;
