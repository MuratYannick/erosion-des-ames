import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";

function CreateTopicForm({ sectionId, onSuccess, onCancel }) {
  const { authenticatedFetch } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author_character_id: "",
  });
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer les personnages de l'utilisateur
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await authenticatedFetch("http://localhost:3000/api/characters");

        if (response.ok) {
          const result = await response.json();
          setCharacters(result.data || []);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des personnages:", err);
      }
    };

    fetchCharacters();
  }, [authenticatedFetch]);

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
      const requestBody = {
        title: formData.title,
        content: formData.content,
        section_id: sectionId,
      };

      // Ajouter le personnage si sélectionné
      if (formData.author_character_id) {
        requestBody.author_character_id = parseInt(
          formData.author_character_id,
          10
        );
      }

      const response = await authenticatedFetch("http://localhost:3000/api/forum/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la création du topic"
        );
      }

      // Succès - appeler le callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur lors de la création du topic:", err);
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

      {/* Sélection du personnage (optionnel) */}
      {characters.length > 0 && (
        <div>
          <label
            htmlFor="author_character_id"
            className="block text-ochre-500 font-texte-corps mb-2"
          >
            Poster en tant que personnage (optionnel)
          </label>
          <select
            id="author_character_id"
            name="author_character_id"
            value={formData.author_character_id}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
          >
            <option value="">Votre compte utilisateur</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} (Niveau {char.level})
              </option>
            ))}
          </select>
          <p className="text-xs text-city-500 mt-1 font-texte-corps">
            Choisissez un personnage pour poster en RP (jeu de rôle)
          </p>
        </div>
      )}

      {/* Contenu du message */}
      <div>
        <label
          htmlFor="content"
          className="block text-ochre-500 font-texte-corps mb-2"
        >
          Votre message *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors resize-none"
          placeholder="Écrivez le contenu de votre message..."
        />
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
          {loading ? "Création..." : "Créer le sujet"}
        </button>
      </div>
    </form>
  );
}

CreateTopicForm.propTypes = {
  sectionId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default CreateTopicForm;
