import { useState } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";
import ForumTreeNavigator from "./ForumTreeNavigator";
import { useAuth } from "../../contexts/AuthContext";

function MoveSectionForm({ section, onSuccess, onCancel }) {
  const { authenticatedFetch } = useAuth();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinationType, setDestinationType] = useState(null); // 'category' ou 'section'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDestinationSelect = (destination, type) => {
    setSelectedDestination(destination);
    setDestinationType(type);
  };

  const handleMove = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!selectedDestination) {
        throw new Error("Veuillez sélectionner une destination");
      }

      const requestBody = {};
      if (destinationType === "category") {
        requestBody.new_category_id = selectedDestination.id;
      } else {
        requestBody.new_parent_section_id = selectedDestination.id;
      }

      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/sections/${section.id}/move`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors du déplacement de la section"
        );
      }

      // Succès - appeler le callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur lors du déplacement de la section:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps">
            {error}
          </div>
        )}

        <div className="bg-city-900 border border-ochre-700 rounded p-4">
          <p className="text-ochre-500 font-texte-corps mb-2">
            Section à déplacer :
          </p>
          <p className="text-city-200 font-texte-corps font-bold">
            {section.name}
          </p>
        </div>

        {/* Destination sélectionnée */}
        {selectedDestination && (
          <div className="bg-ochre-900 border border-ochre-600 rounded p-4">
            <p className="text-ochre-400 font-texte-corps text-sm mb-1">
              {destinationType === "category"
                ? "Déplacer vers la catégorie :"
                : "Déplacer comme sous-section de :"}
            </p>
            <p className="text-city-100 font-texte-corps font-bold">
              {selectedDestination.name}
            </p>
            <p className="text-ochre-300 font-texte-corps text-xs mt-1">
              {destinationType === "category"
                ? "La section deviendra une section de premier niveau dans cette catégorie"
                : "La section deviendra une sous-section"}
            </p>
          </div>
        )}

        {/* Navigation arborescente */}
        <div>
          <label className="block text-ochre-500 font-texte-corps mb-2">
            Sélectionner la destination *
          </label>
          <ForumTreeNavigator
            mode="category-or-section"
            currentItemId={section.id}
            onSelect={handleDestinationSelect}
          />
          <p className="text-xs text-city-500 mt-2 font-texte-corps">
            • Cliquez sur le bouton <span className="text-ochre-500">✓</span> à côté d'une catégorie pour déplacer la section vers cette catégorie
            <br />
            • Naviguez dans une catégorie et sélectionnez une section pour créer une sous-section
            <br />
            • La section actuelle est désactivée pour éviter les boucles
          </p>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={loading || !selectedDestination}
            className="px-6 py-2 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Déplacement..." : "Déplacer"}
          </button>
        </div>
      </div>

      {/* Dialogue de confirmation */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleMove}
        title="Confirmer le déplacement"
        message={`Êtes-vous sûr de vouloir déplacer "${section.name}" ${destinationType === "category" ? `vers la catégorie "${selectedDestination?.name}"` : `comme sous-section de "${selectedDestination?.name}"`} ?`}
        confirmText="Déplacer"
        type="warning"
      />
    </>
  );
}

MoveSectionForm.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default MoveSectionForm;
