import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";
import TermsAcceptance from "../components/ui/TermsAcceptance";

function ForumGeneralPage() {
  const styles = ForumBody.styles;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbItems = [
    { label: "Accueil", path: "/" },
    { label: "Forum Général" },
  ];

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/forum/sections");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Erreur lors du chargement des sections");
        }

        setSections(result.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des sections:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.pageTitle}>Forum Général</h1>

      {/* Composant d'acceptation des CGU pour les utilisateurs connectés non validés */}
      <TermsAcceptance />

      {loading && (
        <p className={styles.text}>Chargement des sections...</p>
      )}

      {error && (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps">
          Erreur : {error}
        </div>
      )}

      {!loading && !error && sections.length === 0 && (
        <p className={styles.text}>
          Aucune section disponible pour le moment.
        </p>
      )}

      {!loading && !error && sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section) => (
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
                {section.category && (
                  <span className="text-xs text-ochre-400 font-texte-corps">
                    {section.category.name}
                  </span>
                )}
              </div>

              {section.subsections && section.subsections.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className={styles.meta}>Sous-sections ({section.subsections.length}) :</p>
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
      )}
    </div>
  );
}

export default ForumGeneralPage;
