import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";
import Modal from "../components/ui/Modal";
import CreateSectionForm from "../components/forum/CreateSectionForm";
import CreateTopicForm from "../components/forum/CreateTopicForm";
import EditSectionForm from "../components/forum/EditSectionForm";
import MoveSectionForm from "../components/forum/MoveSectionForm";

function ForumSectionPage() {
  const styles = ForumBody.styles;
  const { slug } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fonction pour recharger la section sans reload complet
  const refreshSection = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forum/sections/${slug}`
      );
      const result = await response.json();

      if (response.ok) {
        setSection(result.data);
      }
    } catch (err) {
      console.error("Erreur lors du rechargement de la section:", err);
    }
  };

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/forum/sections/${slug}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Erreur lors du chargement de la section"
          );
        }

        setSection(result.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la section:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [slug]);

  const handleSubsectionCreated = (newSubsection) => {
    // Fermer le modal
    setIsSectionModalOpen(false);

    // Recharger la section sans reload complet
    refreshSection();
  };

  const handleTopicCreated = (newTopic) => {
    // Fermer le modal
    setIsTopicModalOpen(false);

    // Recharger la section sans reload complet
    refreshSection();
  };

  const handleSectionUpdated = (updatedSection) => {
    // Si updatedSection est null, c'est une suppression
    if (!updatedSection) {
      setIsEditModalOpen(false);

      // Rediriger vers la catégorie parente ou la page d'accueil
      if (section.category) {
        navigate(`/forum/category/${section.category.slug}`);
      } else if (section.parentSection) {
        navigate(`/forum/section/${section.parentSection.slug}`);
      } else {
        navigate("/");
      }
      return;
    }

    // Sinon, c'est une mise à jour
    setIsEditModalOpen(false);

    // Recharger la section sans reload complet
    refreshSection();
  };

  const handleSectionMoved = (movedSection) => {
    // Fermer le modal
    setIsMoveModalOpen(false);

    // Recharger la section sans reload complet
    refreshSection();
  };

  // Construire le fil d'Ariane en remontant la hiérarchie
  const buildBreadcrumb = (section) => {
    if (!section) return [];

    const items = [{ label: "Accueil", path: "/" }];

    // Ajouter la catégorie
    if (section.category) {
      items.push({
        label: section.category.name,
        path: `/forum/category/${section.category.slug}`,
      });
    }

    // Construire la chaîne des sections parentes (du plus haut au plus bas)
    const parentChain = [];
    let currentParent = section.parentSection;

    while (currentParent) {
      parentChain.unshift(currentParent); // Ajouter au début pour inverser l'ordre
      currentParent = currentParent.parentSection;
    }

    // Ajouter les sections parentes
    parentChain.forEach((parent) => {
      items.push({
        label: parent.name,
        path: `/forum/section/${parent.slug}`,
      });
    });

    // Ajouter la section actuelle
    items.push({ label: section.name });

    return items;
  };

  const breadcrumbItems = buildBreadcrumb(section);

  return (
    <div>
      {section && <Breadcrumb items={breadcrumbItems} />}

      {loading && <p className={styles.text}>Chargement de la section...</p>}

      {error && (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps">
          Erreur : {error}
        </div>
      )}

      {!loading && !error && section && (
        <>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className={styles.pageTitle}>{section.name}</h1>
              {section.description && (
                <p className={`${styles.text} mb-6`}>{section.description}</p>
              )}
            </div>
            {isAuthenticated && (
              <div className="ml-4 flex gap-3">
                <button
                  onClick={() => setIsTopicModalOpen(true)}
                  className="px-4 py-2 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  <span>Nouveau sujet</span>
                </button>
                <button
                  onClick={() => setIsSectionModalOpen(true)}
                  className="px-4 py-2 bg-city-700 text-ochre-500 rounded font-texte-corps hover:bg-city-600 transition-colors flex items-center gap-2 border border-ochre-700"
                >
                  <span className="text-xl">+</span>
                  <span>Sous-section</span>
                </button>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2 border border-city-600"
                >
                  <span>✏️</span>
                  <span>Éditer</span>
                </button>
                <button
                  onClick={() => setIsMoveModalOpen(true)}
                  className="px-4 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2 border border-city-600"
                >
                  <span>📦</span>
                  <span>Déplacer</span>
                </button>
              </div>
            )}
          </div>

          {/* Sous-sections */}
          {section.subsections && section.subsections.length > 0 && (
            <div className="mb-8">
              <h2 className={styles.sectionTitle}>Sous-sections</h2>
              <div className="space-y-4">
                {section.subsections.map((subsection) => (
                  <Link
                    key={subsection.id}
                    to={`/forum/section/${subsection.slug}`}
                    className={`block ${styles.section} ${styles.borders.default} hover:border-ochre-500 transition-colors duration-200`}
                  >
                    <h3 className={styles.topicTitle}>{subsection.name}</h3>
                    {subsection.description && (
                      <p className={styles.meta}>{subsection.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {section.topics && section.topics.length > 0 ? (
            <div>
              <h2 className={styles.sectionTitle}>Topics</h2>
              <div className="space-y-4">
                {section.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/forum/topic/${topic.id}`}
                    className={`block ${styles.topic} ${styles.borders.default} hover:border-ochre-500 transition-colors duration-200`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className={styles.topicTitle}>
                          {topic.is_pinned && (
                            <span className="text-ochre-400 mr-2">📌</span>
                          )}
                          {topic.is_locked && (
                            <span className="text-blood-500 mr-2">🔒</span>
                          )}
                          {topic.title}
                        </h3>
                        <p className={styles.meta}>
                          Par{" "}
                          {topic.authorCharacter
                            ? topic.authorCharacter.name
                            : topic.authorUser?.username || "Anonyme"}{" "}
                          • {new Date(topic.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right text-xs text-city-400 font-texte-corps">
                        <div>{topic.views_count || 0} vues</div>
                        <div>{topic.posts_count || 0} réponses</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.text}>Aucun topic dans cette section.</p>
          )}
        </>
      )}

      {/* Modal de création de topic */}
      <Modal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title="Créer un nouveau sujet"
      >
        <CreateTopicForm
          sectionId={section?.id}
          onSuccess={handleTopicCreated}
          onCancel={() => setIsTopicModalOpen(false)}
        />
      </Modal>

      {/* Modal de création de sous-section */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Créer une nouvelle sous-section"
      >
        <CreateSectionForm
          parentSectionId={section?.id}
          onSuccess={handleSubsectionCreated}
          onCancel={() => setIsSectionModalOpen(false)}
        />
      </Modal>

      {/* Modal d'édition de section */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Éditer la section"
      >
        {section && (
          <EditSectionForm
            section={section}
            onSuccess={handleSectionUpdated}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal de déplacement de section */}
      <Modal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        title="Déplacer la section"
      >
        {section && (
          <MoveSectionForm
            section={section}
            onSuccess={handleSectionMoved}
            onCancel={() => setIsMoveModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}

export default ForumSectionPage;
