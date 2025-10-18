import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";
import TermsAcceptance from "../components/ui/TermsAcceptance";
import ForumRulesAcceptance from "../components/ui/ForumRulesAcceptance";
import Modal from "../components/ui/Modal";
import CreateSectionForm from "../components/forum/CreateSectionForm";
import PermissionsForm from "../components/forum/PermissionsForm";

function ForumCategoryPage() {
  const styles = ForumBody.styles;
  const { slug } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // Déterminer le slug de la catégorie depuis l'URL
  const categorySlug = slug || location.pathname.split('/').pop() || 'general';

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/forum/categories/${categorySlug}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Erreur lors du chargement de la catégorie"
          );
        }

        setCategory(result.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la catégorie:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  const handleSectionCreated = (newSection) => {
    // Ajouter la nouvelle section à la liste
    setCategory((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
    setIsModalOpen(false);
  };

  const breadcrumbItems = category
    ? [
        { label: "Accueil", path: "/" },
        { label: category.name },
      ]
    : [];

  return (
    <div>
      {category && <Breadcrumb items={breadcrumbItems} />}

      {loading && <p className={styles.text}>Chargement de la catégorie...</p>}

      {error && (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps">
          Erreur : {error}
        </div>
      )}

      {!loading && !error && category && (
        <>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className={styles.pageTitle}>{category.name}</h1>
              {category.description && (
                <p className={`${styles.text} mb-6`}>{category.description}</p>
              )}
            </div>
            {isAuthenticated && (
              <div className="ml-4 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  <span>Créer une section</span>
                </button>
                <button
                  onClick={() => setIsPermissionsModalOpen(true)}
                  className="px-4 py-2 bg-city-700 text-ochre-500 rounded font-texte-corps hover:bg-city-600 transition-colors flex items-center gap-2 border border-ochre-700"
                >
                  <span>🔒</span>
                  <span>Permissions</span>
                </button>
              </div>
            )}
          </div>

          {/* Composant d'acceptation des CGU pour les utilisateurs connectés non validés */}
          <TermsAcceptance />

          {/* Composant d'acceptation du règlement du forum pour les utilisateurs connectés non validés */}
          <ForumRulesAcceptance />

          {/* Sections */}
          {category.sections && category.sections.length > 0 ? (
            <div className="space-y-6">
              {category.sections.map((section) => (
                <Link
                  key={section.id}
                  to={`/forum/section/${section.slug}`}
                  className={`block ${styles.section} ${styles.borders.default} hover:border-ochre-500 transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className={styles.sectionTitle}>{section.name}</h2>
                      {section.description && (
                        <p className={styles.text}>{section.description}</p>
                      )}
                    </div>
                  </div>

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className={styles.meta}>
                        Sous-sections ({section.subsections.length}) :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {section.subsections.map((subsection) => (
                          <span
                            key={subsection.id}
                            className="text-xs text-city-300 bg-city-800 px-2 py-1 rounded"
                          >
                            {subsection.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.text}>
              Aucune section disponible dans cette catégorie.
            </p>
          )}
        </>
      )}

      {/* Modal de création de section */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer une nouvelle section"
      >
        <CreateSectionForm
          categoryId={category?.id}
          onSuccess={handleSectionCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Modal de gestion des permissions */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title="Gérer les permissions"
      >
        {category && (
          <PermissionsForm
            entityType="category"
            entityId={category.id}
            entityName={category.name}
            onSuccess={() => {
              setIsPermissionsModalOpen(false);
              alert("Permissions mises à jour avec succès !");
            }}
            onCancel={() => setIsPermissionsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}

export default ForumCategoryPage;
