import { useState } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ui/ConfirmDialog";
import ForumTreeNavigator from "./ForumTreeNavigator";
import { useAuth } from "../../contexts/AuthContext";

function MovePostForm({ post, currentTopicId, onSuccess, onCancel }) {
  const { authenticatedFetch } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleMove = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!selectedTopic) {
        throw new Error("Veuillez sélectionner un topic");
      }

      const response = await authenticatedFetch(
        `http://localhost:3000/api/forum/posts/${post.id}/move`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_topic_id: selectedTopic.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors du déplacement du message"
        );
      }

      // Succès - appeler le callback avec toutes les infos (y compris oldTopicDeleted)
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Erreur lors du déplacement du message:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps">
            {error}
          </div>
        )}

        <div className="bg-city-900 border border-ochre-700 rounded p-4">
          <p className="text-ochre-500 font-texte-corps mb-2">
            Message à déplacer :
          </p>
          <p className="text-city-200 font-texte-corps text-sm">
            {post.content.substring(0, 100)}
            {post.content.length > 100 ? "..." : ""}
          </p>
        </div>

        {/* Topic sélectionné */}
        {selectedTopic && (
          <div className="bg-ochre-900 border border-ochre-600 rounded p-4">
            <p className="text-ochre-400 font-texte-corps text-sm mb-1">
              Topic de destination :
            </p>
            <p className="text-city-100 font-texte-corps font-bold">
              {selectedTopic.title}
            </p>
          </div>
        )}

        {/* Navigation arborescente */}
        <div>
          <label className="block text-ochre-500 font-texte-corps mb-2">
            Sélectionner le topic de destination *
          </label>
          <ForumTreeNavigator
            mode="topic"
            currentItemId={currentTopicId}
            onSelect={handleTopicSelect}
          />
          <p className="text-xs text-city-500 mt-2 font-texte-corps">
            Naviguez dans l'arborescence pour sélectionner un topic. Le topic actuel et les topics verrouillés sont désactivés.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 bg-city-800 text-city-300 rounded font-texte-corps hover:bg-city-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={loading || !selectedTopic}
            className="px-6 py-2 bg-ochre-600 text-city-950 rounded font-texte-corps hover:bg-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Déplacement..." : "Déplacer"}
          </button>
        </div>
      </div>

      {/* Dialogue de confirmation */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleMove}
        title="Confirmer le déplacement"
        message={`Êtes-vous sûr de vouloir déplacer ce message vers le topic "${selectedTopic?.title || "ce topic"}" ?`}
        confirmText="Déplacer"
        type="warning"
      />
    </>
  );
}

MovePostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  currentTopicId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default MovePostForm;
