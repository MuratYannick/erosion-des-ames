import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";

function PermissionsForm({ entityType, entityId, entityName, onSuccess, onCancel }) {
  const { authenticatedFetch } = useAuth();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [factions, setFactions] = useState([]);
  const [clans, setClans] = useState([]);
  const [activeTab, setActiveTab] = useState("view");

  // Charger les permissions existantes et les données de référence
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [permissionsRes, factionsRes, clansRes] = await Promise.all([
          fetch(`http://localhost:3000/api/forum/permissions/${entityType}/${entityId}`),
          fetch("http://localhost:3000/api/factions"),
          fetch("http://localhost:3000/api/clans"),
        ]);

        if (permissionsRes.ok) {
          const permissionsData = await permissionsRes.json();
          setPermissions(permissionsData.data);
        }

        if (factionsRes.ok) {
          const factionsData = await factionsRes.json();
          setFactions(factionsData.data || []);
        }

        if (clansRes.ok) {
          const clansData = await clansRes.json();
          setClans(clansData.data || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityType, entityId]);

  const updateOperationPermission = (operation, field, value) => {
    setPermissions((prev) => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        [field]: value,
      },
    }));
  };

  const handleInheritFromParent = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/permissions/${entityType}/${entityId}/inherit`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'héritage des permissions");
      }

      setPermissions(result.data);
      alert("Permissions héritées du parent avec succès !");
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/permissions/${entityType}/${entityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(permissions),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la mise à jour des permissions");
      }

      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-city-400 font-texte-corps">
        Chargement des permissions...
      </div>
    );
  }

  if (!permissions) {
    return (
      <div className="text-center py-8 text-blood-400 font-texte-corps">
        Erreur lors du chargement des permissions
      </div>
    );
  }

  // Définir OperationPermissionForm avant de l'utiliser
  function OperationPermissionForm({ operation }) {
    const perm = permissions[operation];

    // Afficher un badge si la permission est héritée
    const InheritedBadge = () => {
      if (!perm?.inherited) return null;

      const inheritedFromText = {
        category: "de la catégorie parent",
        parent_section: "de la section parent",
        section: "de la section parent",
      }[perm.inherited_from] || "du parent";

      return (
        <div className="bg-ochre-900 border border-ochre-700 rounded p-3 mb-4">
          <div className="flex items-center gap-2 text-ochre-400 font-texte-corps text-sm">
            <span>ℹ️</span>
            <span>Ces permissions sont héritées {inheritedFromText}. Modifiez-les pour définir des permissions spécifiques à cet élément.</span>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <InheritedBadge />
        {/* 1. RÔLES (Switch) */}
        <div className="border border-ochre-800 rounded p-4">
          <h5 className="text-ochre-400 font-texte-corps text-sm font-bold mb-3">
            1. Niveau de rôle requis
          </h5>
          <div className="space-y-2">
            {[
              { value: "admin", label: "Admin uniquement" },
              { value: "admin_moderator", label: "Admin + Modérateur" },
              { value: "admin_moderator_gm", label: "Admin + Modérateur + Game Master" },
              { value: "admin_moderator_player", label: "Admin + Modérateur + Player" },
              { value: "admin_moderator_gm_player", label: "Admin + Modérateur + Game Master + Player" },
              { value: "everyone", label: "Tout le monde (public)" },
            ].map((role) => (
              <label key={role.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`role_level_${operation}`}
                  value={role.value}
                  checked={perm.role_level === role.value}
                  onChange={(e) => updateOperationPermission(operation, "role_level", e.target.value)}
                  className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 focus:ring-ochre-500 focus:ring-2"
                />
                <span className="ml-2 text-city-300 font-texte-corps text-sm">
                  {role.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 2. AUTEUR (Toggle) */}
        <div className="border border-ochre-800 rounded p-4">
          <h5 className="text-ochre-400 font-texte-corps text-sm font-bold mb-3">
            2. Permission auteur (ajout)
          </h5>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={perm.allow_author}
              onChange={(e) => updateOperationPermission(operation, "allow_author", e.target.checked)}
              className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 rounded focus:ring-ochre-500 focus:ring-2"
            />
            <span className="ml-2 text-city-300 font-texte-corps text-sm">
              OU permet à l'auteur (même si rôle insuffisant)
            </span>
          </label>
        </div>

        {/* 3. PERSONNAGE (Switch - pour Players uniquement) */}
        <div className="border border-ochre-800 rounded p-4">
          <h5 className="text-ochre-400 font-texte-corps text-sm font-bold mb-3">
            3. Exigence de personnage (pour Players uniquement)
          </h5>
          <div className="space-y-2">
            {[
              { value: "none", label: "Aucune (tout player)" },
              { value: "alive", label: "Personnage vivant" },
              { value: "clan_member", label: "Membre du clan spécifique + vivant" },
              { value: "faction_member", label: "Membre de la faction spécifique + vivant" },
              { value: "clan_leader", label: "Chef du clan spécifique + vivant" },
            ].map((req) => (
              <label key={req.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`character_requirement_${operation}`}
                  value={req.value}
                  checked={perm.character_requirement === req.value}
                  onChange={(e) => updateOperationPermission(operation, "character_requirement", e.target.value)}
                  className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 focus:ring-ochre-500 focus:ring-2"
                />
                <span className="ml-2 text-city-300 font-texte-corps text-sm">
                  {req.label}
                </span>
              </label>
            ))}
          </div>

          {/* Faction spécifique */}
          {perm.character_requirement === "faction_member" && (
            <div className="mt-3">
              <label className="block text-city-400 font-texte-corps text-xs mb-1">
                Faction spécifique
              </label>
              <select
                value={perm.required_faction_id || ""}
                onChange={(e) => updateOperationPermission(operation, "required_faction_id", e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps text-sm focus:outline-none focus:border-ochre-500"
              >
                <option value="">-- Sélectionner une faction --</option>
                {factions.map((faction) => (
                  <option key={faction.id} value={faction.id}>
                    {faction.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clan spécifique */}
          {(perm.character_requirement === "clan_member" || perm.character_requirement === "clan_leader") && (
            <div className="mt-3">
              <label className="block text-city-400 font-texte-corps text-xs mb-1">
                Clan spécifique
              </label>
              <select
                value={perm.required_clan_id || ""}
                onChange={(e) => updateOperationPermission(operation, "required_clan_id", e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3 py-2 bg-city-900 border border-ochre-700 rounded text-city-200 font-texte-corps text-sm focus:outline-none focus:border-ochre-500"
              >
                <option value="">-- Sélectionner un clan --</option>
                {clans.map((clan) => (
                  <option key={clan.id} value={clan.id}>
                    {clan.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 4. AUTEUR PERSONNAGE (Toggle + Radio) */}
        <div className="border border-ochre-800 rounded p-4">
          <h5 className="text-ochre-400 font-texte-corps text-sm font-bold mb-3">
            4. Règle auteur personnage (pour Players)
          </h5>
          <label className="flex items-center cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={perm.enable_author_character_rule}
              onChange={(e) => updateOperationPermission(operation, "enable_author_character_rule", e.target.checked)}
              className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 rounded focus:ring-ochre-500 focus:ring-2"
            />
            <span className="ml-2 text-city-300 font-texte-corps text-sm font-bold">
              Activer la règle auteur personnage
            </span>
          </label>

          {perm.enable_author_character_rule && (
            <div className="ml-6 space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`author_character_mode_${operation}`}
                  value="exclusive"
                  checked={perm.author_character_mode === "exclusive"}
                  onChange={(e) => updateOperationPermission(operation, "author_character_mode", e.target.value)}
                  className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 focus:ring-ochre-500 focus:ring-2"
                />
                <span className="ml-2 text-city-300 font-texte-corps text-sm">
                  QUI est l'auteur (exclusif - seulement l'auteur)
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`author_character_mode_${operation}`}
                  value="inclusive"
                  checked={perm.author_character_mode === "inclusive"}
                  onChange={(e) => updateOperationPermission(operation, "author_character_mode", e.target.value)}
                  className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 focus:ring-ochre-500 focus:ring-2"
                />
                <span className="ml-2 text-city-300 font-texte-corps text-sm">
                  OU est l'auteur (inclusif - aussi l'auteur)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 5. CONDITIONS OBLIGATOIRES (Toggle unique) */}
        <div className="border border-ochre-800 rounded p-4">
          <h5 className="text-ochre-400 font-texte-corps text-sm font-bold mb-3">
            5. Conditions obligatoires
          </h5>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={perm.require_terms_accepted}
              onChange={(e) => updateOperationPermission(operation, "require_terms_accepted", e.target.checked)}
              className="w-4 h-4 text-ochre-600 bg-city-900 border-ochre-700 rounded focus:ring-ochre-500 focus:ring-2"
            />
            <span className="ml-2 text-city-300 font-texte-corps text-sm">
              CGU ET Règlement du forum acceptés requis
            </span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
      {error && (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps text-sm">
          {error}
        </div>
      )}

      {/* En-tête */}
      <div className="bg-city-800 border border-ochre-700 rounded p-4">
        <h3 className="text-ochre-400 font-texte-corps text-lg mb-2">
          Gestion des permissions
        </h3>
        <p className="text-city-300 font-texte-corps text-sm">
          {entityType === "category" && "Catégorie"}
          {entityType === "section" && "Section"}
          {entityType === "topic" && "Topic"}
          {" : "}
          <span className="text-ochre-500">{entityName}</span>
        </p>

        {/* Bouton héritage */}
        {entityType !== "category" && (
          <button
            type="button"
            onClick={handleInheritFromParent}
            disabled={saving}
            className="mt-3 px-4 py-2 bg-city-700 text-city-300 rounded font-texte-corps hover:bg-city-600 transition-colors disabled:opacity-50 text-sm"
          >
            📥 Hériter des permissions du parent
          </button>
        )}
      </div>

      {/* Onglets pour chaque opération */}
      <div className="border-b border-city-700">
        <div className="flex gap-2 flex-wrap">
          {/* VOIR - Disponible pour tous les types */}
          <button
            type="button"
            onClick={() => setActiveTab("view")}
            className={`px-4 py-2 font-texte-corps text-sm transition-colors ${
              activeTab === "view"
                ? "bg-ochre-600 text-city-950 border-b-2 border-ochre-400"
                : "bg-city-800 text-city-400 hover:bg-city-700"
            }`}
          >
            👁️ VOIR
          </button>

          {/* CRÉER SECTION - Uniquement pour category et section */}
          {(entityType === "category" || entityType === "section") && (
            <button
              type="button"
              onClick={() => setActiveTab("create_section")}
              className={`px-4 py-2 font-texte-corps text-sm transition-colors ${
                activeTab === "create_section"
                  ? "bg-ochre-600 text-city-950 border-b-2 border-ochre-400"
                  : "bg-city-800 text-city-400 hover:bg-city-700"
              }`}
            >
              📁 CRÉER SECTION
            </button>
          )}

          {/* CRÉER TOPIC - Uniquement pour section */}
          {entityType === "section" && (
            <button
              type="button"
              onClick={() => setActiveTab("create_topic")}
              className={`px-4 py-2 font-texte-corps text-sm transition-colors ${
                activeTab === "create_topic"
                  ? "bg-ochre-600 text-city-950 border-b-2 border-ochre-400"
                  : "bg-city-800 text-city-400 hover:bg-city-700"
              }`}
            >
              💬 CRÉER TOPIC
            </button>
          )}

          {/* ÉPINGLER/VERROUILLER - Uniquement pour section et topic */}
          {(entityType === "section" || entityType === "topic") && (
            <button
              type="button"
              onClick={() => setActiveTab("pin_lock")}
              className={`px-4 py-2 font-texte-corps text-sm transition-colors ${
                activeTab === "pin_lock"
                  ? "bg-ochre-600 text-city-950 border-b-2 border-ochre-400"
                  : "bg-city-800 text-city-400 hover:bg-city-700"
              }`}
            >
              📌 ÉPINGLER/VERROUILLER
            </button>
          )}

          {/* MODIFIER/SUPPRIMER - Uniquement pour section et topic */}
          {(entityType === "section" || entityType === "topic") && (
            <button
              type="button"
              onClick={() => setActiveTab("edit_delete")}
              className={`px-4 py-2 font-texte-corps text-sm transition-colors ${
                activeTab === "edit_delete"
                  ? "bg-ochre-600 text-city-950 border-b-2 border-ochre-400"
                  : "bg-city-800 text-city-400 hover:bg-city-700"
              }`}
            >
              ✏️ MODIFIER/SUPPRIMER
            </button>
          )}

          {/* DÉPLACER - Disponible pour tous les types */}
          <button
            type="button"
            onClick={() => setActiveTab("move_children")}
            className={`px-4 py-2 font-texte-corps text-sm transition-colors ${
              activeTab === "move_children"
                ? "bg-ochre-600 text-city-950 border-b-2 border-ochre-400"
                : "bg-city-800 text-city-400 hover:bg-city-700"
            }`}
          >
            🔀 DÉPLACER ENFANTS
          </button>
        </div>
      </div>

      {/* Formulaire de l'opération active */}
      <div className="py-2">
        <OperationPermissionForm operation={activeTab} />
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-city-950 pb-2 border-t border-city-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-6 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Enregistrement..." : "💾 Enregistrer"}
        </button>
      </div>
    </form>
  );
}

PermissionsForm.propTypes = {
  entityType: PropTypes.oneOf(["category", "section", "topic"]).isRequired,
  entityId: PropTypes.number.isRequired,
  entityName: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default PermissionsForm;
