import { useState } from "react";
import PropTypes from "prop-types";
import PrimaryButton from "./PrimaryButton";

function TermsModal({ onAccept }) {
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
      console.error("Erreur lors de l'acceptation des CGU:", error);
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
            Conditions Générales d'Utilisation
          </h2>
          <p className="text-city-300 font-texte-corps text-sm mt-2">
            Veuillez lire et accepter les CGU pour continuer
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-texte-corps text-city-200">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                1. Acceptation des conditions
              </h3>
              <p className="text-sm">
                En vous inscrivant et en utilisant L'Érosion des Âmes, vous
                acceptez d'être lié par ces conditions d'utilisation. Si vous
                n'acceptez pas ces conditions, vous ne pouvez pas utiliser ce
                service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                2. Comportement des joueurs
              </h3>
              <p className="text-sm mb-2">
                Vous vous engagez à :
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Respecter les autres joueurs et l'équipe de modération</li>
                <li>Ne pas utiliser de langage offensant, discriminatoire ou haineux</li>
                <li>Ne pas tricher, exploiter des bugs ou utiliser des outils externes</li>
                <li>Respecter l'univers et le roleplay du jeu</li>
                <li>Ne pas partager votre compte avec d'autres personnes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                3. Propriété intellectuelle
              </h3>
              <p className="text-sm">
                Tout le contenu du jeu (textes, graphismes, mécaniques, lore)
                reste la propriété de L'Érosion des Âmes. Vous conservez la
                propriété de vos créations roleplay, mais accordez au jeu une
                licence d'utilisation.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                4. Modération
              </h3>
              <p className="text-sm">
                L'équipe de modération se réserve le droit de suspendre ou
                bannir tout compte en cas de violation de ces conditions, sans
                préavis ni remboursement.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                5. Données personnelles
              </h3>
              <p className="text-sm">
                Vos données personnelles (email, nom d'utilisateur) sont
                collectées uniquement pour le fonctionnement du jeu et ne
                seront jamais partagées avec des tiers. Vous pouvez demander
                leur suppression à tout moment.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-ochre-300 mb-2">
                6. Modifications des CGU
              </h3>
              <p className="text-sm">
                Ces conditions peuvent être modifiées à tout moment. Les
                joueurs seront informés des modifications importantes et devront
                les accepter pour continuer à jouer.
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
                J'ai lu et j'accepte les Conditions Générales d'Utilisation de
                L'Érosion des Âmes. Je m'engage à respecter les règles du jeu
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
            Vous devez accepter les CGU pour pouvoir poster sur le forum et jouer
          </p>
        </div>
      </div>
    </div>
  );
}

TermsModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
};

export default TermsModal;
