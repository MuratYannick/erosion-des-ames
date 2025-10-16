import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Composant de navigation arborescent pour le forum
 * Permet de naviguer dans la hiérarchie : Catégories > Sections > Topics
 *
 * Structure:
 * - Catégorie (level 0)
 *   - Section (level 1)
 *     - Sous-section (level 2)
 *       - Topic (level 3)
 */
function ForumTreeNavigator({
  mode, // 'section' pour MoveTopicForm, 'topic' pour MovePostForm, 'category-or-section' pour MoveSectionForm
  currentItemId, // ID de l'élément actuel à exclure
  onSelect, // Callback appelé quand un élément est sélectionné
  disabledIds = [], // IDs à désactiver (verrouillés, etc.)
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation state
  const [breadcrumb, setBreadcrumb] = useState([{ level: "root", name: "Catégories", id: null }]);
  const [currentLevel, setCurrentLevel] = useState("root"); // 'root', 'category', 'section'
  const [currentId, setCurrentId] = useState(null);

  // Data
  const [categories, setCategories] = useState([]);
  const [currentSections, setCurrentSections] = useState([]);
  const [currentTopics, setCurrentTopics] = useState([]);

  // Charger les catégories au démarrage
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/forum/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.data || []);
      } else {
        throw new Error("Erreur lors du chargement des catégories");
      }
    } catch (err) {
      console.error("Erreur fetchCategories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      // Trouver la catégorie dans les données déjà chargées
      const category = categories.find(cat => cat.id === categoryId);
      if (category && category.sections) {
        setCurrentSections(category.sections || []);
      } else {
        // Si pas trouvé, faire un appel API avec le slug
        const categoryData = categories.find(cat => cat.id === categoryId);
        if (categoryData?.slug) {
          const response = await fetch(`http://localhost:3000/api/forum/categories/${categoryData.slug}`);
          const result = await response.json();
          if (result.success && result.data.sections) {
            setCurrentSections(result.data.sections || []);
          } else {
            throw new Error("Erreur lors du chargement des sections");
          }
        } else {
          setCurrentSections([]);
        }
      }
    } catch (err) {
      console.error("Erreur fetchSectionsByCategory:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicsBySection = async (sectionId) => {
    setLoading(true);
    setError(null);
    try {
      // Trouver la section dans les données déjà chargées
      const section = currentSections.find(sec => sec.id === sectionId);

      if (section) {
        // Si la section a déjà les topics, les utiliser
        if (section.topics) {
          setCurrentTopics(section.topics || []);
        } else if (section.slug) {
          // Sinon, faire un appel API avec le slug
          const response = await fetch(`http://localhost:3000/api/forum/sections/${section.slug}`);
          const result = await response.json();
          if (result.success && result.data.topics) {
            setCurrentTopics(result.data.topics || []);
          } else {
            throw new Error("Erreur lors du chargement des topics");
          }
        } else {
          setCurrentTopics([]);
        }
      } else {
        setCurrentTopics([]);
      }
    } catch (err) {
      console.error("Erreur fetchTopicsBySection:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Naviguer vers une catégorie
  const navigateToCategory = (category) => {
    setCurrentLevel("category");
    setCurrentId(category.id);
    setBreadcrumb([
      { level: "root", name: "Catégories", id: null },
      { level: "category", name: category.name, id: category.id }
    ]);
    fetchSectionsByCategory(category.id);
  };

  // Naviguer vers une section
  const navigateToSection = (section) => {
    setCurrentLevel("section");
    setCurrentId(section.id);
    const categoryName = breadcrumb.find(b => b.level === "category")?.name || "Catégorie";
    setBreadcrumb([
      { level: "root", name: "Catégories", id: null },
      { level: "category", name: categoryName, id: breadcrumb.find(b => b.level === "category")?.id },
      { level: "section", name: section.name, id: section.id }
    ]);

    // Si on est en mode 'topic', charger les topics de cette section
    if (mode === "topic") {
      fetchTopicsBySection(section.id);
    }
  };

  // Remonter dans l'arborescence
  const navigateBack = () => {
    if (breadcrumb.length <= 1) return;

    const newBreadcrumb = breadcrumb.slice(0, -1);
    const parent = newBreadcrumb[newBreadcrumb.length - 1];

    setBreadcrumb(newBreadcrumb);
    setCurrentLevel(parent.level);
    setCurrentId(parent.id);

    // Charger les données appropriées
    if (parent.level === "root") {
      // Retour aux catégories (déjà chargées)
      setCurrentSections([]);
      setCurrentTopics([]);
    } else if (parent.level === "category") {
      fetchSectionsByCategory(parent.id);
      setCurrentTopics([]);
    } else if (parent.level === "section") {
      if (mode === "topic") {
        fetchTopicsBySection(parent.id);
      }
    }
  };

  // Sélectionner un élément
  const handleSelect = (item, type) => {
    if (onSelect) {
      onSelect(item, type);
    }
  };

  // Vérifier si un élément est désactivé
  const isDisabled = (id) => {
    return id === currentItemId || disabledIds.includes(id);
  };

  // Rendu du contenu selon le niveau actuel
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-city-400 font-texte-corps">
          Chargement...
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps">
          {error}
        </div>
      );
    }

    // Niveau racine : afficher les catégories
    if (currentLevel === "root") {
      return (
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-city-500 font-texte-corps text-center py-4">
              Aucune catégorie disponible
            </p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex gap-2">
                {/* Bouton pour naviguer dans la catégorie */}
                <button
                  onClick={() => navigateToCategory(category)}
                  className="flex-1 px-4 py-3 bg-city-900 border border-ochre-700 rounded text-left hover:bg-city-800 transition-colors flex items-center justify-between group"
                >
                  <span className="text-city-200 font-texte-corps">
                    {category.name}
                  </span>
                  <span className="text-ochre-500 group-hover:text-ochre-400">
                    →
                  </span>
                </button>

                {/* Bouton de sélection (seulement en mode category-or-section) */}
                {mode === "category-or-section" && (
                  <button
                    onClick={() => handleSelect(category, "category")}
                    className="flex-shrink-0 px-4 py-3 bg-ochre-900 border border-ochre-600 rounded hover:bg-ochre-800 transition-colors"
                    title="Sélectionner cette catégorie"
                  >
                    <span className="text-ochre-300">✓</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      );
    }

    // Niveau catégorie : afficher les sections
    if (currentLevel === "category") {
      return (
        <div className="space-y-2">
          {currentSections.length === 0 ? (
            <p className="text-city-500 font-texte-corps text-center py-4">
              Aucune section dans cette catégorie
            </p>
          ) : (
            currentSections.map((section) => {
              const disabled = isDisabled(section.id) || section.is_locked;
              return (
                <div key={section.id} className="space-y-1">
                  <div className="flex gap-2">
                    {/* Bouton pour descendre dans la section (si mode topic) */}
                    {mode === "topic" && !disabled && (
                      <button
                        onClick={() => navigateToSection(section)}
                        className="flex-shrink-0 px-3 py-3 bg-city-900 border border-ochre-700 rounded hover:bg-city-800 transition-colors"
                        title="Voir les topics"
                      >
                        <span className="text-ochre-500">→</span>
                      </button>
                    )}

                    {/* Bouton de sélection */}
                    <button
                      onClick={() => !disabled && handleSelect(section, "section")}
                      disabled={disabled}
                      className={`flex-1 px-4 py-3 bg-city-900 border rounded text-left transition-colors ${
                        disabled
                          ? "border-city-700 text-city-600 cursor-not-allowed opacity-50"
                          : "border-ochre-700 hover:bg-ochre-900 text-city-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-texte-corps">
                          {section.name}
                          {section.id === currentItemId && " (actuel)"}
                          {section.is_locked && " 🔒"}
                        </span>
                        {(mode === "section" || mode === "category-or-section") && !disabled && (
                          <span className="text-ochre-500">✓ Sélectionner</span>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Sous-sections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="ml-8 space-y-1">
                      {section.subsections.map((subsection) => {
                        const subDisabled = isDisabled(subsection.id) || subsection.is_locked;
                        return (
                          <button
                            key={subsection.id}
                            onClick={() => !subDisabled && handleSelect(subsection, "section")}
                            disabled={subDisabled}
                            className={`w-full px-4 py-2 bg-city-900 border rounded text-left transition-colors ${
                              subDisabled
                                ? "border-city-700 text-city-600 cursor-not-allowed opacity-50"
                                : "border-ochre-700 hover:bg-ochre-900 text-city-200"
                            }`}
                          >
                            <span className="font-texte-corps text-sm">
                              └─ {subsection.name}
                              {subsection.id === currentItemId && " (actuel)"}
                              {subsection.is_locked && " 🔒"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      );
    }

    // Niveau section : afficher les topics (pour MovePostForm)
    if (currentLevel === "section" && mode === "topic") {
      return (
        <div className="space-y-2">
          {currentTopics.length === 0 ? (
            <p className="text-city-500 font-texte-corps text-center py-4">
              Aucun topic dans cette section
            </p>
          ) : (
            currentTopics.map((topic) => {
              const disabled = isDisabled(topic.id) || topic.is_locked;
              return (
                <button
                  key={topic.id}
                  onClick={() => !disabled && handleSelect(topic, "topic")}
                  disabled={disabled}
                  className={`w-full px-4 py-3 bg-city-900 border rounded text-left transition-colors ${
                    disabled
                      ? "border-city-700 text-city-600 cursor-not-allowed opacity-50"
                      : "border-ochre-700 hover:bg-ochre-900 text-city-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-texte-corps">
                      {topic.is_pinned && "📌 "}
                      {topic.title}
                      {topic.id === currentItemId && " (actuel)"}
                      {topic.is_locked && " 🔒"}
                    </span>
                    {!disabled && (
                      <span className="text-ochre-500">✓ Sélectionner</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumb.map((crumb, index) => (
          <div key={`${crumb.level}-${crumb.id}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-city-600">/</span>}
            <button
              onClick={() => {
                if (index < breadcrumb.length - 1) {
                  // Clic sur un élément parent du breadcrumb
                  const newBreadcrumb = breadcrumb.slice(0, index + 1);
                  setBreadcrumb(newBreadcrumb);
                  setCurrentLevel(crumb.level);
                  setCurrentId(crumb.id);

                  if (crumb.level === "root") {
                    setCurrentSections([]);
                    setCurrentTopics([]);
                  } else if (crumb.level === "category") {
                    fetchSectionsByCategory(crumb.id);
                    setCurrentTopics([]);
                  } else if (crumb.level === "section" && mode === "topic") {
                    fetchTopicsBySection(crumb.id);
                  }
                }
              }}
              className={`font-texte-corps ${
                index === breadcrumb.length - 1
                  ? "text-ochre-500 font-bold"
                  : "text-city-400 hover:text-ochre-400 transition-colors"
              }`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* Bouton retour */}
      {breadcrumb.length > 1 && (
        <button
          onClick={navigateBack}
          className="px-4 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>Retour</span>
        </button>
      )}

      {/* Contenu */}
      <div className="max-h-96 overflow-y-auto border border-city-700 rounded p-4 bg-city-950">
        {renderContent()}
      </div>
    </div>
  );
}

ForumTreeNavigator.propTypes = {
  mode: PropTypes.oneOf(["section", "topic", "category-or-section"]).isRequired,
  currentItemId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  disabledIds: PropTypes.arrayOf(PropTypes.number),
};

export default ForumTreeNavigator;
