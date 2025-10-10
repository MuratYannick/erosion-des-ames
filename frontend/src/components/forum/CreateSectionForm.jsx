import { useState } from "react";
import PropTypes from "prop-types";

function CreateSectionForm({ categoryId, parentSectionId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour créer une section");
      }

      const requestBody = {
        name: formData.name,
        description: formData.description,
        order: parseInt(formData.order, 10) || 0,
      };

      // Ajouter soit category_id soit parent_section_id
      if (categoryId) {
        requestBody.category_id = categoryId;
      }
      if (parentSectionId) {
        requestBody.parent_section_id = parentSectionId;
      }

      const response = await fetch("http://localhost:3000/api/forum/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la création de la section");
      }

      // Succès - appeler le callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur lors de la création de la section:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps">
          {error}
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
      <div className="flex justify-end space-x-3 pt-4">
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
          {loading ? "Création..." : "Créer la section"}
        </button>
      </div>
    </form>
  );
}

CreateSectionForm.propTypes = {
  categoryId: PropTypes.number,
  parentSectionId: PropTypes.number,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default CreateSectionForm;
