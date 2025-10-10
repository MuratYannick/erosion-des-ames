import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";

function MoveSectionForm({ section, onSuccess, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [destinationType, setDestinationType] = useState("category"); // 'category' ou 'section'
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Récupérer les catégories et sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer toutes les catégories
        const categoriesResponse = await fetch(
          "http://localhost:3000/api/forum/categories"
        );
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success) {
          setCategories(categoriesResult.data || []);
        }

        // Récupérer toutes les sections
        const sectionsResponse = await fetch(
          "http://localhost:3000/api/forum/sections"
        );
        const sectionsResult = await sectionsResponse.json();
        if (sectionsResult.success) {
          // Filtrer la section actuelle et ses sous-sections pour éviter les boucles
          const filteredSections = (sectionsResult.data || []).filter(
            (s) => s.id !== section.id
          );
          setSections(filteredSections);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Erreur lors du chargement des destinations");
      }
    };

    fetchData();
  }, [section.id]);

  const handleMove = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour déplacer une section");
      }

      const requestBody = {};
      if (destinationType === "category") {
        if (!selectedCategoryId) {
          throw new Error("Veuillez sélectionner une catégorie");
        }
        requestBody.new_category_id = parseInt(selectedCategoryId, 10);
      } else {
        if (!selectedSectionId) {
          throw new Error("Veuillez sélectionner une section");
        }
        requestBody.new_parent_section_id = parseInt(selectedSectionId, 10);
      }

      const response = await fetch(
        `http://localhost:3000/api/forum/sections/${section.id}/move`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    }
  };

  const getDestinationName = () => {
    if (destinationType === "category") {
      const cat = categories.find((c) => c.id === parseInt(selectedCategoryId, 10));
      return cat ? cat.name : "";
    } else {
      const sec = sections.find((s) => s.id === parseInt(selectedSectionId, 10));
      return sec ? sec.name : "";
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

        {/* Type de destination */}
        <div>
          <label className="block text-ochre-500 font-texte-corps mb-2">
            Destination
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-city-900 border border-ochre-700 rounded cursor-pointer hover:bg-city-800 transition-colors">
              <input
                type="radio"
                name="destinationType"
                value="category"
                checked={destinationType === "category"}
                onChange={(e) => setDestinationType(e.target.value)}
                className="w-4 h-4 text-ochre-600"
              />
              <span className="text-city-200 font-texte-corps">
                Déplacer vers une catégorie
              </span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-city-900 border border-ochre-700 rounded cursor-pointer hover:bg-city-800 transition-colors">
              <input
                type="radio"
                name="destinationType"
                value="section"
                checked={destinationType === "section"}
                onChange={(e) => setDestinationType(e.target.value)}
                className="w-4 h-4 text-ochre-600"
              />
              <span className="text-city-200 font-texte-corps">
                Déplacer comme sous-section
              </span>
            </label>
          </div>
        </div>

        {/* Sélection de la destination */}
        {destinationType === "category" ? (
          <div>
            <label
              htmlFor="categorySelect"
              className="block text-ochre-500 font-texte-corps mb-2"
            >
              Choisir la catégorie *
            </label>
            <select
              id="categorySelect"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
            >
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label
              htmlFor="sectionSelect"
              className="block text-ochre-500 font-texte-corps mb-2"
            >
              Choisir la section parente *
            </label>
            <select
              id="sectionSelect"
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
            >
              <option value="">-- Sélectionner une section --</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.category?.name} &gt; {sec.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
            disabled={
              loading ||
              (destinationType === "category"
                ? !selectedCategoryId
                : !selectedSectionId)
            }
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
        message={`Êtes-vous sûr de vouloir déplacer "${section.name}" vers "${getDestinationName()}" ?`}
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
