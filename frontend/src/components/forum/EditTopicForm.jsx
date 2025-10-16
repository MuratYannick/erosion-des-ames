import { useState } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";

function EditTopicForm({ topic, onSuccess, onCancel }) {
  const { authenticatedFetch } = useAuth();
  const [formData, setFormData] = useState({
    title: topic.title || "",
    is_locked: topic.is_locked || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/topics/${topic.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            is_locked: formData.is_locked,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la mise à jour du topic"
        );
      }

      // Succès - appeler le callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du topic:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/topics/${topic.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la suppression du topic"
        );
      }

      // Succès - appeler le callback avec null pour indiquer une suppression
      if (onSuccess) {
        onSuccess(null);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du topic:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowUpdateConfirm(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps">
            {error}
          </div>
        )}

        {/* Titre du topic */}
        <div>
          <label
            htmlFor="title"
            className="block text-ochre-500 font-texte-corps mb-2"
          >
            Titre du sujet *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
            placeholder="Ex: Besoin d'aide pour ma build"
          />
        </div>

        {/* Case à cocher pour verrouiller le topic */}
        <div className="flex items-center gap-3 p-4 bg-city-900 border border-ochre-700 rounded">
          <input
            type="checkbox"
            id="is_locked"
            name="is_locked"
            checked={formData.is_locked}
            onChange={handleChange}
            className="w-5 h-5 bg-city-800 border-ochre-600 rounded focus:ring-ochre-500 text-ochre-600 cursor-pointer"
          />
          <label
            htmlFor="is_locked"
            className="text-ochre-500 font-texte-corps cursor-pointer flex items-center gap-2"
          >
            <span>🔒</span>
            <span>Verrouiller le sujet (empêche les nouvelles réponses)</span>
          </label>
        </div>

        {formData.is_locked && (
          <div className="bg-ochre-900 border border-ochre-700 text-ochre-300 px-4 py-3 rounded font-texte-corps text-sm">
            <p>
              ⚠️ Un sujet verrouillé ne peut plus recevoir de nouvelles
              réponses. Seuls les modérateurs peuvent déverrouiller un sujet.
            </p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="px-6 py-2 bg-blood-800 text-blood-200 rounded font-texte-corps hover:bg-blood-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supprimer
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </div>
      </form>

      {/* Dialogue de confirmation pour la modification */}
      <ConfirmDialog
        isOpen={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={handleUpdate}
        title="Confirmer la modification"
        message={
          formData.is_locked && !topic.is_locked
            ? "Êtes-vous sûr de vouloir verrouiller ce sujet ? Les utilisateurs ne pourront plus y répondre."
            : "Êtes-vous sûr de vouloir modifier ce sujet ?"
        }
        confirmText="Modifier"
        type="warning"
      />

      {/* Dialogue de confirmation pour la suppression */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce sujet ? Tous les messages associés seront également supprimés. Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </>
  );
}

EditTopicForm.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    is_locked: PropTypes.bool,
  }).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default EditTopicForm;
