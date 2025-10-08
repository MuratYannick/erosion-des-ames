import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PrimaryButton from "./PrimaryButton";
import ForumBody from "../layouts/ForumBody";

function TermsAcceptanceBox() {
  const styles = ForumBody.styles;
  const { user, isAuthenticated, acceptTerms } = useAuth();
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ne rien afficher si l'utilisateur n'est pas connecté ou a déjà accepté
  if (!isAuthenticated || (user && user.terms_accepted)) {
    return null;
  }

  const handleAccept = async () => {
    if (!isAccepted) {
      setError("Vous devez cocher la case pour accepter les CGU");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await acceptTerms();
    } catch (err) {
      console.error("Erreur lors de l'acceptation des CGU:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.section} border-2 border-ochre-600 mt-6`}>
      <div className="bg-city-950 rounded p-4">
        <h3 className="text-lg font-titre-Jeu text-ochre-400 mb-4">
          📝 Acceptation requise
        </h3>

        {error && (
          <div className="bg-blood-900 border border-blood-700 text-blood-300 px-4 py-3 rounded mb-4 font-texte-corps text-sm">
            {error}
          </div>
        )}

        <label className="flex items-start cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={isAccepted}
            onChange={(e) => {
              setIsAccepted(e.target.checked);
              if (e.target.checked) setError(null);
            }}
            className="mt-1 mr-3 h-5 w-5 text-ochre-500 border-city-600 rounded focus:ring-ochre-500 focus:ring-2"
          />
          <span className="text-city-200 font-texte-corps text-sm">
            J'ai lu et j'accepte les Conditions Générales d'Utilisation de
            L'Érosion des Âmes. Je m'engage à respecter les règles du jeu et à
            adopter un comportement respectueux envers la communauté.
          </span>
        </label>

        <PrimaryButton
          onClick={handleAccept}
          disabled={!isAccepted || loading}
          className="w-full text-lg"
        >
          {loading ? "Acceptation en cours..." : "Accepter les CGU"}
        </PrimaryButton>

        <p className="text-xs text-city-500 text-center mt-3 font-texte-corps">
          Tant que vous n'avez pas accepté les CGU, vous ne pourrez pas poster
          sur le forum ni accéder à certaines fonctionnalités du jeu.
        </p>
      </div>
    </div>
  );
}

export default TermsAcceptanceBox;
