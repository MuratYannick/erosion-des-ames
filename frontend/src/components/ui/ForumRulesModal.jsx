import { useState } from "react";
import PropTypes from "prop-types";
import PrimaryButton from "./PrimaryButton";

function ForumRulesModal({ onAccept }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!isAccepted) {
      return;
    }

    setLoading(true);
    try {
      await onAccept();
    } catch (error) {
      console.error("Erreur lors de l'acceptation du règlement du forum:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-city-900 border-2 border-ochre-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-city-700">
          <h2 className="text-2xl font-titre-Jeu text-ochre-400">
            Règlement du Forum
          </h2>
          <p className="text-city-300 font-texte-corps text-sm mt-2">
            Veuillez lire et accepter le règlement du forum pour continuer
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-texte-corps text-city-200">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                1. Respect et courtoisie
              </h3>
              <p className="text-sm">
                Tous les membres du forum doivent faire preuve de respect et de courtoisie
                envers les autres utilisateurs. Les insultes, le harcèlement, les propos
                discriminatoires ou offensants ne seront pas tolérés.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                2. Contenu approprié
              </h3>
              <p className="text-sm mb-2">
                Les publications doivent être appropriées et en rapport avec le thème du forum :
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Pas de contenu pornographique, violent ou illégal</li>
                <li>Pas de spam, de publicité non autorisée ou de flood</li>
                <li>Pas de divulgation d'informations personnelles d'autrui</li>
                <li>Respecter les droits d'auteur et la propriété intellectuelle</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                3. Organisation des discussions
              </h3>
              <p className="text-sm mb-2">
                Pour maintenir un forum organisé et agréable :
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Postez dans la section appropriée</li>
                <li>Utilisez des titres clairs et descriptifs</li>
                <li>Évitez le multi-post (poster plusieurs fois d'affilée)</li>
                <li>Utilisez la fonction de recherche avant de créer un nouveau sujet</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                4. Roleplay et univers du jeu
              </h3>
              <p className="text-sm">
                Dans les sections dédiées au roleplay, respectez l'univers de L'Érosion des Âmes
                et les règles du jeu. Évitez le métagaming (utiliser des informations hors-jeu
                dans le jeu) et respectez les actions des autres joueurs.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                5. Modération
              </h3>
              <p className="text-sm mb-2">
                L'équipe de modération se réserve le droit de :
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Éditer, déplacer ou supprimer tout contenu inapproprié</li>
                <li>Avertir, suspendre ou bannir les utilisateurs en cas de violation</li>
                <li>Fermer ou fusionner des sujets si nécessaire</li>
              </ul>
              <p className="text-sm mt-2">
                Les décisions de modération sont définitives. En cas de désaccord, vous pouvez
                contacter l'équipe de modération par message privé.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                6. Signalement
              </h3>
              <p className="text-sm">
                Si vous observez un comportement inapproprié ou du contenu enfreignant ces
                règles, utilisez la fonction de signalement ou contactez un modérateur.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                7. Modifications du règlement
              </h3>
              <p className="text-sm">
                Ce règlement peut être modifié à tout moment. Les utilisateurs seront informés
                des modifications importantes et devront les accepter pour continuer à utiliser
                le forum.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-city-700 bg-city-950">
          <div className="mb-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
                className="mt-1 mr-3 h-5 w-5 text-ochre-500 border-city-600 rounded focus:ring-ochre-500 focus:ring-2"
              />
              <span className="text-city-200 font-texte-corps text-sm">
                J'ai lu et j'accepte le Règlement du Forum de
                L'Érosion des Âmes. Je m'engage à respecter les règles du forum
                et à adopter un comportement respectueux envers la communauté.
              </span>
            </label>
          </div>

          <PrimaryButton
            onClick={handleAccept}
            disabled={!isAccepted || loading}
            className="w-full text-lg"
          >
            {loading ? "Acceptation en cours..." : "Accepter et continuer"}
          </PrimaryButton>

          <p className="text-xs text-city-500 text-center mt-3 font-texte-corps">
            Vous devez accepter le règlement du forum pour pouvoir poster sur le forum
          </p>
        </div>
      </div>
    </div>
  );
}

ForumRulesModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
};

export default ForumRulesModal;
