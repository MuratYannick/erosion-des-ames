import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import ForumBody from "../layouts/ForumBody";

function TermsAcceptance() {
  const styles = ForumBody.styles;
  const { user, isAuthenticated } = useAuth();

  // Ne rien afficher si l'utilisateur n'est pas connecté ou a déjà accepté
  if (!isAuthenticated || (user && user.terms_accepted)) {
    return null;
  }

  return (
    <div className={`${styles.section} border-2 border-blood-700 mb-6`}>
      <div className="border-l-4 border-blood-700 pl-4">
        <h2 className={`${styles.sectionTitle} text-blood-600`}>
          ⚠️ Acceptation des Conditions Générales d'Utilisation
        </h2>
        <p className={`${styles.text}`}>
          Pour pouvoir participer pleinement au forum et au jeu, vous devez
          accepter nos Conditions Générales d'Utilisation. Rendez-vous sur le{" "}
          <Link
            to="/forum/topic/cgu"
            className="text-ochre-400 hover:text-ochre-300 underline"
          >
            topic des CGU
          </Link>{" "}
          pour les lire et les accepter.
        </p>
      </div>
    </div>
  );
}

export default TermsAcceptance;
