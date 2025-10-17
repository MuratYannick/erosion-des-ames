import { useAuth } from "../../contexts/AuthContext";
import ForumRulesModal from "./ForumRulesModal";
import PropTypes from "prop-types";

function ForumRulesGuard({ children }) {
  const { user, isAuthenticated, acceptForumRules } = useAuth();

  const handleAccept = async () => {
    try {
      await acceptForumRules();
    } catch (error) {
      console.error("Erreur lors de l'acceptation du règlement du forum:", error);
      alert("Une erreur est survenue lors de l'acceptation du règlement du forum. Veuillez réessayer.");
    }
  };

  // Si l'utilisateur est connecté et n'a pas accepté le règlement du forum, afficher le modal
  if (isAuthenticated && user && !user.forum_rules_accepted) {
    return <ForumRulesModal onAccept={handleAccept} />;
  }

  // Sinon, afficher le contenu normalement
  return <>{children}</>;
}

ForumRulesGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ForumRulesGuard;
