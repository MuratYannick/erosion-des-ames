import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";
import TermsAcceptanceBox from "../components/ui/TermsAcceptanceBox";

function ForumTopicPage() {
  const styles = ForumBody.styles;
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/forum/topics/${id}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Erreur lors du chargement du topic"
          );
        }

        setTopic(result.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du topic:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  const breadcrumbItems = topic
    ? [
        { label: "Accueil", path: "/" },
        ...(topic.section?.category
          ? [
              {
                label: topic.section.category.name,
                path: `/forum/category/${topic.section.category.slug}`,
              },
            ]
          : []),
        ...(topic.section
          ? [
              {
                label: topic.section.name,
                path: `/forum/section/${topic.section.slug}`,
              },
            ]
          : []),
        { label: topic.title },
      ]
    : [];

  return (
    <div>
      {topic && <Breadcrumb items={breadcrumbItems} />}

      {loading && <p className={styles.text}>Chargement du topic...</p>}

      {error && (
        <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps">
          Erreur : {error}
        </div>
      )}

      {!loading && !error && topic && (
        <>
          <div className="mb-6">
            <h1 className={styles.pageTitle}>
              {topic.is_pinned && (
                <span className="text-ochre-400 mr-2">📌</span>
              )}
              {topic.is_locked && (
                <span className="text-blood-500 mr-2">🔒</span>
              )}
              {topic.title}
            </h1>
            <p className={styles.meta}>
              Créé par{" "}
              {topic.authorCharacter
                ? topic.authorCharacter.name
                : topic.authorUser?.username || "Anonyme"}{" "}
              • {new Date(topic.created_at).toLocaleDateString()} •{" "}
              {topic.views_count || 0} vues
            </p>
          </div>

          {/* Posts */}
          {topic.posts && topic.posts.length > 0 ? (
            <div className="space-y-6">
              {topic.posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`${styles.section} ${styles.borders.default}`}
                >
                  <div className="flex gap-4">
                    {/* Sidebar auteur */}
                    <div className="w-32 flex-shrink-0 text-center">
                      <div className="font-titre-Jeu text-ochre-400 text-sm mb-2">
                        {post.authorCharacter
                          ? post.authorCharacter.name
                          : post.authorUser?.username || "Anonyme"}
                      </div>
                      {post.authorCharacter && (
                        <div className="text-xs text-city-400">
                          Niveau {post.authorCharacter.level}
                        </div>
                      )}
                      <div className="text-xs text-city-500 mt-2">
                        {post.authorUser &&
                          `Membre depuis ${new Date(
                            post.authorUser.created_at
                          ).toLocaleDateString()}`}
                      </div>
                    </div>

                    {/* Contenu du post */}
                    <div className="flex-1 border-l border-city-700 pl-4">
                      <div className="flex justify-between items-start mb-4">
                        <p className={styles.meta}>
                          Posté le {new Date(post.created_at).toLocaleString()}
                          {index === 0 && (
                            <span className="ml-2 text-ochre-400">(Premier post)</span>
                          )}
                        </p>
                      </div>
                      <div
                        className={`${styles.text} prose prose-invert max-w-none whitespace-pre-wrap`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                      {post.updated_at !== post.created_at && (
                        <p className="text-xs text-city-600 mt-4 italic">
                          Modifié le{" "}
                          {new Date(post.updated_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.text}>Aucun message dans ce topic.</p>
          )}

          {/* Zone d'acceptation des CGU (uniquement pour le topic CGU) */}
          {topic.slug === "cgu" && <TermsAcceptanceBox />}

          {/* Informations du topic */}
          <div className="mt-8 p-4 bg-city-900 border border-city-700 rounded font-texte-corps text-sm text-city-400">
            {topic.is_locked ? (
              <p className="text-blood-400">
                🔒 Ce topic est verrouillé. Vous ne pouvez plus y répondre.
              </p>
            ) : (
              <p className="text-city-300">
                💬 Connectez-vous pour répondre à ce topic.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ForumTopicPage;
