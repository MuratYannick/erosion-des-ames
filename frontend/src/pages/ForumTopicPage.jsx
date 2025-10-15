import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";
import TermsAcceptanceBox from "../components/ui/TermsAcceptanceBox";
import Modal from "../components/ui/Modal";
import EditTopicForm from "../components/forum/EditTopicForm";
import CreatePostForm from "../components/forum/CreatePostForm";
import MoveTopicForm from "../components/forum/MoveTopicForm";
import EditPostForm from "../components/forum/EditPostForm";

function ForumTopicPage() {
  const styles = ForumBody.styles;
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Récupérer l'ID de l'utilisateur depuis le profil
    if (token) {
      fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setCurrentUserId(data.data.id);
          }
        })
        .catch((err) => console.error("Erreur profil:", err));
    }
  }, []);

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

  // Fonction pour recharger le topic sans reload complet de la page
  const refreshTopic = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forum/topics/${id}`
      );
      const result = await response.json();

      if (response.ok) {
        setTopic(result.data);
      }
    } catch (err) {
      console.error("Erreur lors du rechargement du topic:", err);
    }
  };

  const handleTopicUpdated = (updatedTopic) => {
    // Si updatedTopic est null, c'est une suppression
    if (!updatedTopic) {
      setIsEditModalOpen(false);

      // Rediriger vers la section parente
      if (topic.section) {
        navigate(`/forum/section/${topic.section.slug}`);
      } else {
        navigate("/");
      }
      return;
    }

    // Sinon, c'est une mise à jour
    setIsEditModalOpen(false);

    // Recharger le topic sans reload complet
    refreshTopic();
  };

  const handlePostCreated = (newPost) => {
    // Fermer le modal
    setIsReplyModalOpen(false);

    // Recharger le topic pour afficher la nouvelle réponse
    refreshTopic();
  };

  const handleTopicMoved = (movedTopic) => {
    // Fermer le modal
    setIsMoveModalOpen(false);

    // Recharger le topic pour voir les nouvelles données
    refreshTopic();
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsEditPostModalOpen(true);
  };

  const handlePostUpdated = (updatedPost) => {
    setIsEditPostModalOpen(false);
    setSelectedPost(null);

    // Recharger le topic pour afficher le post mis à jour
    refreshTopic();
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/forum/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Recharger le topic
        refreshTopic();
      } else {
        const result = await response.json();
        alert(result.message || "Erreur lors de la suppression du post");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du post:", err);
      alert("Erreur lors de la suppression du post");
    }
  };

  // Vérifier si l'utilisateur est l'auteur du topic
  const isAuthor = topic && currentUserId && topic.author_user_id === currentUserId;

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
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
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
            {isAuthenticated && isAuthor && (
              <div className="ml-4 flex gap-3">
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
                        {/* Boutons d'édition/suppression pour l'auteur */}
                        {isAuthenticated && currentUserId === post.author_user_id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="px-3 py-1 bg-city-800 text-city-300 rounded text-sm font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-1 border border-city-600"
                              title="Éditer ce post"
                            >
                              <span>✏️</span>
                              <span>Éditer</span>
                            </button>
                            {/* Ne pas permettre la suppression du premier post */}
                            {index !== 0 && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="px-3 py-1 bg-blood-900 text-blood-300 rounded text-sm font-texte-corps hover:bg-blood-800 transition-colors flex items-center gap-1 border border-blood-700"
                                title="Supprimer ce post"
                              >
                                <span>🗑️</span>
                                <span>Supprimer</span>
                              </button>
                            )}
                          </div>
                        )}
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

          {/* Zone de réponse */}
          <div className="mt-8">
            {topic.is_locked ? (
              <div className="p-4 bg-blood-900 border border-blood-700 rounded font-texte-corps text-blood-300">
                🔒 Ce topic est verrouillé. Vous ne pouvez plus y répondre.
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={() => setIsReplyModalOpen(true)}
                className="w-full px-6 py-3 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>Répondre à ce sujet</span>
              </button>
            ) : (
              <div className="p-4 bg-city-900 border border-city-700 rounded font-texte-corps text-city-300 text-center">
                💬 Connectez-vous pour répondre à ce topic.
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal d'édition de topic */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Éditer le sujet"
      >
        {topic && (
          <EditTopicForm
            topic={topic}
            onSuccess={handleTopicUpdated}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal de réponse */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title="Répondre au sujet"
      >
        {topic && (
          <CreatePostForm
            topicId={topic.id}
            onSuccess={handlePostCreated}
            onCancel={() => setIsReplyModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal de déplacement de topic */}
      <Modal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        title="Déplacer le sujet"
      >
        {topic && (
          <MoveTopicForm
            topic={topic}
            onSuccess={handleTopicMoved}
            onCancel={() => setIsMoveModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal d'édition de post */}
      <Modal
        isOpen={isEditPostModalOpen}
        onClose={() => {
          setIsEditPostModalOpen(false);
          setSelectedPost(null);
        }}
        title="Éditer le message"
      >
        {selectedPost && (
          <EditPostForm
            post={selectedPost}
            onSuccess={handlePostUpdated}
            onCancel={() => {
              setIsEditPostModalOpen(false);
              setSelectedPost(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default ForumTopicPage;
