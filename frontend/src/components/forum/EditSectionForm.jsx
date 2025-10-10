import { useState } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";

function EditSectionForm({ section, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: section.name || "",
    description: section.description || "",
    order: section.order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour modifier une section");
      }

      const response = await fetch(
        `http://localhost:3000/api/forum/sections/${section.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            order: parseInt(formData.order, 10) || 0,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la mise à jour de la section"
        );
      }

      // Succès - appeler le callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la section:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour supprimer une section");
      }

      const response = await fetch(
        `http://localhost:3000/api/forum/sections/${section.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Cas spécial : section contient des sous-sections ou topics
        if (result.hasSubsections || result.hasTopics) {
          setDeleteError(result.message);
          return;
        }
        throw new Error(
          result.message || "Erreur lors de la suppression de la section"
        );
      }

      // Succès - appeler le callback avec null pour indiquer une suppression
      if (onSuccess) {
        onSuccess(null);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la section:", err);
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

        {deleteError && (
          <div className="bg-ochre-900 border border-ochre-700 text-ochre-300 px-4 py-3 rounded font-texte-corps">
            <p className="font-bold mb-2">⚠️ Suppression impossible</p>
            <p>{deleteError}</p>
          </div>
        )}

        {/* Nom de la section */}
        <div>
          <label
            htmlFor="name"
            className="block text-ochre-500 font-texte-corps mb-2"
          >
            Nom de la section *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
            placeholder="Ex: Discussions générales"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-ochre-500 font-texte-corps mb-2"
          >
            Description (optionnelle)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors resize-none"
            placeholder="Décrivez brièvement le contenu de cette section..."
          />
        </div>

        {/* Ordre d'affichage */}
        <div>
          <label
            htmlFor="order"
            className="block text-ochre-500 font-texte-corps mb-2"
          >
            Ordre d&apos;affichage
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min={0}
            className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
          />
          <p className="text-xs text-city-500 mt-1 font-texte-corps">
            Plus le nombre est petit, plus la section apparaît en haut
          </p>
        </div>

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
        message="Êtes-vous sûr de vouloir modifier cette section ?"
        confirmText="Modifier"
        type="warning"
      />

      {/* Dialogue de confirmation pour la suppression */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette section ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </>
  );
}

EditSectionForm.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    order: PropTypes.number,
  }).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default EditSectionForm;
