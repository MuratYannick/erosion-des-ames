import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";

function EditSectionForm({ section, onSuccess, onCancel }) {
  const { authenticatedFetch } = useAuth();
  const [formData, setFormData] = useState({
    name: section.name || "",
    description: section.description || "",
    order: section.order || 0,
    faction_id: section.faction_id || "",
    clan_id: section.clan_id || "",
    is_public: section.is_public !== undefined ? section.is_public : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [factions, setFactions] = useState([]);
  const [clans, setClans] = useState([]);
  const [allClans, setAllClans] = useState([]);

  // Fetch factions and clans on component mount
  useEffect(() => {
    const fetchFactionsAndClans = async () => {
      try {
        const [factionsRes, clansRes] = await Promise.all([
          fetch("http://localhost:3000/api/factions"),
          fetch("http://localhost:3000/api/clans"),
        ]);

        if (factionsRes.ok) {
          const factionsData = await factionsRes.json();
          setFactions(factionsData.data || []);
        }

        if (clansRes.ok) {
          const clansData = await clansRes.json();
          setAllClans(clansData.data || []);

          // Filter clans based on current faction_id
          if (section.faction_id) {
            const filteredClans = clansData.data.filter(
              (clan) => clan.faction_id === section.faction_id
            );
            setClans(filteredClans);
          } else {
            setClans(clansData.data || []);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des factions/clans:", err);
      }
    };

    fetchFactionsAndClans();
  }, [section.faction_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Handle faction change - filter clans
    if (name === "faction_id") {
      const factionId = value ? parseInt(value, 10) : null;
      if (factionId) {
        const filteredClans = allClans.filter(
          (clan) => clan.faction_id === factionId
        );
        setClans(filteredClans);
      } else {
        setClans(allClans);
      }
      // Reset clan_id when faction changes
      setFormData((prev) => ({
        ...prev,
        faction_id: value,
        clan_id: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        name: formData.name,
        description: formData.description,
        order: parseInt(formData.order, 10) || 0,
        is_public: formData.is_public,
      };

      // Ajouter faction_id et clan_id si spécifiés
      if (formData.faction_id) {
        requestBody.faction_id = parseInt(formData.faction_id, 10);
      } else {
        requestBody.faction_id = null;
      }

      if (formData.clan_id) {
        requestBody.clan_id = parseInt(formData.clan_id, 10);
      } else {
        requestBody.clan_id = null;
      }

      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/sections/${section.id}`,
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
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/sections/${section.id}`,
        {
          method: "DELETE",
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

        {/* Contrôle d'accès */}
        <div className="border-t border-ochre-800 pt-4 space-y-4">
          <h3 className="text-ochre-400 font-texte-corps text-lg">
            Contrôle d&apos;accès
          </h3>

          {/* Faction */}
          <div>
            <label
              htmlFor="faction_id"
              className="block text-ochre-500 font-texte-corps mb-2"
            >
              Faction propriétaire (optionnel)
            </label>
            <select
              id="faction_id"
              name="faction_id"
              value={formData.faction_id}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
            >
              <option value="">-- Aucune faction --</option>
              {factions.map((faction) => (
                <option key={faction.id} value={faction.id}>
                  {faction.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-city-500 mt-1 font-texte-corps">
              Hérité de la section parent si non spécifié
            </p>
          </div>

          {/* Clan */}
          <div>
            <label
              htmlFor="clan_id"
              className="block text-ochre-500 font-texte-corps mb-2"
            >
              Clan propriétaire (optionnel)
            </label>
            <select
              id="clan_id"
              name="clan_id"
              value={formData.clan_id}
              onChange={handleChange}
              disabled={!formData.faction_id && clans.length === 0}
              className="w-full px-4 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Aucun clan --</option>
              {clans.map((clan) => (
                <option key={clan.id} value={clan.id}>
                  {clan.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-city-500 mt-1 font-texte-corps">
              {formData.faction_id && clans.length === 0
                ? "Aucun clan pour cette faction"
                : "Hérité de la section parent si non spécifié"}
            </p>
          </div>

          {/* Public/Privé */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 rounded focus:ring-ochre-500 focus:ring-2"
            />
            <label
              htmlFor="is_public"
              className="ml-2 text-ochre-500 font-texte-corps"
            >
              Section publique
            </label>
          </div>
          <p className="text-xs text-city-500 font-texte-corps">
            {formData.is_public
              ? "La section est visible par tous les utilisateurs"
              : "La section est réservée aux membres de la faction/clan"}
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
    faction_id: PropTypes.number,
    clan_id: PropTypes.number,
    is_public: PropTypes.bool,
  }).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default EditSectionForm;
