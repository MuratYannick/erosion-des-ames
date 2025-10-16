import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ForumBody from "../components/layouts/ForumBody";
import Breadcrumb from "../components/ui/Breadcrumb";
import TermsAcceptanceBox from "../components/ui/TermsAcceptanceBox";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditTopicForm from "../components/forum/EditTopicForm";
import CreatePostForm from "../components/forum/CreatePostForm";
import MoveTopicForm from "../components/forum/MoveTopicForm";
import MovePostForm from "../components/forum/MovePostForm";

function ForumTopicPage() {
  const styles = ForumBody.styles;
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated: authIsAuthenticated, user, authenticatedFetch } = useAuth();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMovePostModalOpen, setIsMovePostModalOpen] = useState(false);
  const [movingPost, setMovingPost] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState("");
  const [showDeleteTopicConfirm, setShowDeleteTopicConfirm] = useState(false);
  const [showDeletePostConfirm, setShowDeletePostConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Utiliser l'authentification du contexte
  const isAuthenticated = authIsAuthenticated;
  const currentUserId = user?.id;

  const fetchTopic = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

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

    // Recharger le topic pour avoir les données à jour
    fetchTopic();
  };

  const handlePostCreated = (newPost) => {
    // Fermer le modal
    setIsReplyModalOpen(false);

    // Recharger le topic pour afficher la nouvelle réponse
    fetchTopic();
  };

  const handleTopicMoved = (movedTopic) => {
    // Fermer le modal
    setIsMoveModalOpen(false);

    // Recharger le topic pour voir les nouvelles données
    fetchTopic();
  };

  const handlePostMoved = (result) => {
    // Fermer le modal
    setIsMovePostModalOpen(false);
    setMovingPost(null);

    // Si le topic d'origine a été supprimé, rediriger vers la section
    if (result.oldTopicDeleted) {
      if (topic.section) {
        navigate(`/forum/section/${topic.section.slug}`);
      } else {
        navigate("/");
      }
    } else {
      // Sinon, recharger le topic pour voir les nouvelles données
      fetchTopic();
    }
  };

  const handleMovePost = (post) => {
    setMovingPost(post);
    setIsMovePostModalOpen(true);
  };

  // Épingler/désépingler le topic
  const handleTogglePin = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/topics/${topic.id}/pin`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();
      if (response.ok) {
        fetchTopic();
      } else {
        alert(result.message || "Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'opération");
    }
  };

  // Verrouiller/déverrouiller le topic
  const handleToggleLock = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/topics/${topic.id}/lock`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();
      if (response.ok) {
        fetchTopic();
      } else {
        alert(result.message || "Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'opération");
    }
  };

  // Supprimer le topic
  const confirmDeleteTopic = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/topics/${topic.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Rediriger vers la section
        if (topic.section) {
          navigate(`/forum/section/${topic.section.slug}`);
        } else {
          navigate("/");
        }
      } else {
        alert(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setShowDeleteTopicConfirm(false);
    }
  };

  // Éditer un post
  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditingPostContent(post.content);
  };

  // Sauvegarder les modifications d'un post
  const handleSavePost = async (postId) => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editingPostContent }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setEditingPostId(null);
        setEditingPostContent("");
        fetchTopic();
      } else {
        alert(result.message || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification");
    }
  };

  // Ouvrir la confirmation de suppression d'un post
  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeletePostConfirm(true);
  };

  // Supprimer un post (après confirmation)
  const confirmDeletePost = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/posts/${postToDelete}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Si le topic a été supprimé, rediriger vers la section
        if (result.topicDeleted) {
          if (topic.section) {
            navigate(`/forum/section/${topic.section.slug}`);
          } else {
            navigate("/");
          }
        } else {
          // Sinon, recharger le topic
          fetchTopic();
        }
      } else {
        alert(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setShowDeletePostConfirm(false);
      setPostToDelete(null);
    }
  };

  // Annuler l'édition d'un post
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingPostContent("");
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
            {isAuthenticated && (
              <div className="ml-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2 border border-city-600 text-sm"
                >
                  <span>✏️</span>
                  <span>Éditer</span>
                </button>
                <button
                  onClick={() => setIsMoveModalOpen(true)}
                  className="px-3 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2 border border-city-600 text-sm"
                >
                  <span>📦</span>
                  <span>Déplacer</span>
                </button>
                <button
                  onClick={handleTogglePin}
                  className={`px-3 py-2 ${topic.is_pinned ? 'bg-ochre-800 text-ochre-300' : 'bg-city-800 text-city-300'} rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2 border border-city-600 text-sm`}
                >
                  <span>{topic.is_pinned ? '📍' : '📌'}</span>
                  <span>{topic.is_pinned ? 'Désépingler' : 'Épingler'}</span>
                </button>
                <button
                  onClick={handleToggleLock}
                  className={`px-3 py-2 ${topic.is_locked ? 'bg-blood-800 text-blood-300' : 'bg-city-800 text-city-300'} rounded font-texte-corps hover:bg-city-700 transition-colors flex items-center gap-2 border border-city-600 text-sm`}
                >
                  <span>{topic.is_locked ? '🔓' : '🔒'}</span>
                  <span>{topic.is_locked ? 'Déverrouiller' : 'Verrouiller'}</span>
                </button>
                <button
                  onClick={() => setShowDeleteTopicConfirm(true)}
                  className="px-3 py-2 bg-blood-900 text-blood-300 rounded font-texte-corps hover:bg-blood-800 transition-colors flex items-center gap-2 border border-blood-700 text-sm"
                >
                  <span>🗑️</span>
                  <span>Supprimer</span>
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
                        {/* Boutons d'édition/suppression pour tout utilisateur authentifié */}
                        {isAuthenticated && (
                            <div className="flex gap-2">
                              {editingPostId === post.id ? (
                                <>
                                  <button
                                    onClick={() => handleSavePost(post.id)}
                                    className="px-2 py-1 bg-nature-700 text-nature-200 rounded text-xs font-texte-corps hover:bg-nature-600 transition-colors"
                                  >
                                    ✓ Enregistrer
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-2 py-1 bg-city-800 text-city-400 rounded text-xs font-texte-corps hover:bg-city-700 transition-colors"
                                  >
                                    ✕ Annuler
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditPost(post)}
                                    className="px-2 py-1 bg-city-800 text-city-400 rounded text-xs font-texte-corps hover:bg-city-700 transition-colors"
                                  >
                                    ✏️ Éditer
                                  </button>
                                  <button
                                    onClick={() => handleMovePost(post)}
                                    className="px-2 py-1 bg-ochre-800 text-ochre-300 rounded text-xs font-texte-corps hover:bg-ochre-700 transition-colors"
                                  >
                                    📦 Déplacer
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="px-2 py-1 bg-blood-900 text-blood-400 rounded text-xs font-texte-corps hover:bg-blood-800 transition-colors"
                                  >
                                    🗑️ Supprimer
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                      </div>
                      {/* Contenu éditable ou lecture seule */}
                      {editingPostId === post.id ? (
                        <textarea
                          value={editingPostContent}
                          onChange={(e) => setEditingPostContent(e.target.value)}
                          className="w-full h-40 px-4 py-3 bg-city-900 border border-city-700 rounded font-texte-corps text-city-200 focus:outline-none focus:border-ochre-500 resize-vertical"
                          placeholder="Contenu de votre message..."
                        />
                      ) : (
                        <div
                          className={`${styles.text} prose prose-invert max-w-none whitespace-pre-wrap`}
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      )}
                      {post.is_edited && post.edited_at && (
                        <p className="text-xs text-city-600 mt-4 italic">
                          Modifié le{" "}
                          {new Date(post.edited_at).toLocaleString()}
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

      {/* Modal de déplacement de post */}
      <Modal
        isOpen={isMovePostModalOpen}
        onClose={() => {
          setIsMovePostModalOpen(false);
          setMovingPost(null);
        }}
        title="Déplacer le message"
      >
        {movingPost && topic && (
          <MovePostForm
            post={movingPost}
            currentTopicId={topic.id}
            onSuccess={handlePostMoved}
            onCancel={() => {
              setIsMovePostModalOpen(false);
              setMovingPost(null);
            }}
          />
        )}
      </Modal>

      {/* Dialogue de confirmation de suppression de topic */}
      <ConfirmDialog
        isOpen={showDeleteTopicConfirm}
        onClose={() => setShowDeleteTopicConfirm(false)}
        onConfirm={confirmDeleteTopic}
        title="Supprimer le sujet"
        message={`Êtes-vous sûr de vouloir supprimer le sujet "${topic?.title}" ?\n\nCette action est irréversible et supprimera également tous les messages associés.`}
        confirmText="Supprimer"
        type="danger"
      />

      {/* Dialogue de confirmation de suppression de post */}
      <ConfirmDialog
        isOpen={showDeletePostConfirm}
        onClose={() => {
          setShowDeletePostConfirm(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDeletePost}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ?\n\nSi c'est le dernier message du sujet, le sujet sera également supprimé."
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
}

export default ForumTopicPage;
