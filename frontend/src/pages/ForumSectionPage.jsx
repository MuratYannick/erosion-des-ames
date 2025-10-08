import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";

function ForumSectionPage() {
  const styles = ForumBody.styles;
  const { slug } = useParams();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const breadcrumbItems = section
    ? [
        { label: "Accueil", path: "/" },
        ...(section.category
          ? [
              {
                label: section.category.name,
                path: `/forum/category/${section.category.slug}`,
              },
            ]
          : []),
        { label: section.name },
      ]
    : [];

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
          <h1 className={styles.pageTitle}>{section.name}</h1>
          {section.description && (
            <p className={`${styles.text} mb-6`}>{section.description}</p>
          )}

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
    </div>
  );
}

export default ForumSectionPage;
