import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import ForumBody from "../layouts/ForumBody";

function ForumRulesAcceptance() {
  const styles = ForumBody.styles;
  const { user, isAuthenticated } = useAuth();

  // Ne rien afficher si l'utilisateur n'est pas connecté ou a déjà accepté
  if (!isAuthenticated || (user && user.forum_rules_accepted)) {
    return null;
  }

  return (
    <div className={`${styles.section} border-2 border-blood-700 mb-6`}>
      <div className="border-l-4 border-blood-700 pl-4">
        <h2 className={`${styles.sectionTitle} text-blood-600`}>
          ⚠️ Acceptation du Règlement du Forum
        </h2>
        <p className={`${styles.text}`}>
          Pour pouvoir participer pleinement au forum, vous devez
          accepter notre Règlement du Forum. Rendez-vous sur le{" "}
          <Link
            to="/forum/topic/reglement"
            className="text-ochre-400 hover:text-ochre-300 underline"
          >
            topic du règlement du forum
          </Link>{" "}
          pour le lire et l'accepter.
        </p>
      </div>
    </div>
  );
}

export default ForumRulesAcceptance;
