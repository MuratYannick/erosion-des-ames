import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";

function MoveTopicForm({ topic, onSuccess, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Récupérer toutes les catégories avec leurs sections
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/forum/categories"
        );
        const result = await response.json();
        if (result.success) {
          setCategories(result.data || []);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories:", err);
        setError("Erreur lors du chargement des sections");
      }
    };

    fetchCategories();
  }, []);

  const handleMove = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour déplacer un topic");
      }

      if (!selectedSectionId) {
        throw new Error("Veuillez sélectionner une section");
      }

      const response = await fetch(
        `http://localhost:3000/api/forum/topics/${topic.id}/move`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_section_id: parseInt(selectedSectionId, 10),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors du déplacement du topic"
        );
      }

      // Succès - appeler le callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur lors du déplacement du topic:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedSectionName = () => {
    for (const category of categories) {
      if (category.sections) {
        for (const section of category.sections) {
          if (section.id === parseInt(selectedSectionId, 10)) {
            return `${category.name} > ${section.name}`;
          }
          // Vérifier aussi les sous-sections
          if (section.subsections) {
            for (const subsection of section.subsections) {
              if (subsection.id === parseInt(selectedSectionId, 10)) {
                return `${category.name} > ${section.name} > ${subsection.name}`;
              }
            }
          }
        }
      }
    }
    return "";
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
            Topic à déplacer :
          </p>
          <p className="text-city-200 font-texte-corps font-bold">
            {topic.title}
          </p>
          {topic.section && (
            <p className="text-city-500 font-texte-corps text-sm mt-1">
              Section actuelle : {topic.section.name}
            </p>
          )}
        </div>

        {/* Sélection de la section de destination */}
        <div>
          <label
            htmlFor="sectionSelect"
            className="block text-ochre-500 font-texte-corps mb-2"
          >
            Déplacer vers la section *
          </label>
          <select
            id="sectionSelect"
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
          >
            <option value="">-- Sélectionner une section --</option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {category.sections &&
                  category.sections.map((section) => (
                    <>
                      <option
                        key={section.id}
                        value={section.id}
                        disabled={section.id === topic.section_id}
                      >
                        {section.name}
                        {section.id === topic.section_id ? " (actuelle)" : ""}
                      </option>
                      {section.subsections &&
                        section.subsections.map((subsection) => (
                          <option
                            key={subsection.id}
                            value={subsection.id}
                            disabled={subsection.id === topic.section_id}
                          >
                            &nbsp;&nbsp;└─ {subsection.name}
                            {subsection.id === topic.section_id
                              ? " (actuelle)"
                              : ""}
                          </option>
                        ))}
                    </>
                  ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-city-500 mt-2 font-texte-corps">
            La section actuelle est désactivée dans la liste
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
            disabled={loading || !selectedSectionId}
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
        message={`Êtes-vous sûr de vouloir déplacer "${topic.title}" vers "${getSelectedSectionName()}" ?`}
        confirmText="Déplacer"
        type="warning"
      />
    </>
  );
}

MoveTopicForm.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    section_id: PropTypes.number,
    section: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default MoveTopicForm;
