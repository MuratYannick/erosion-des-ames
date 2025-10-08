import { useAuth } from "../../contexts/AuthContext";
import TermsModal from "./TermsModal";
import PropTypes from "prop-types";

function TermsGuard({ children }) {
  const { user, isAuthenticated, acceptTerms } = useAuth();

  const handleAccept = async () => {
    try {
      await acceptTerms();
    } catch (error) {
      console.error("Erreur lors de l'acceptation des CGU:", error);
      alert("Une erreur est survenue lors de l'acceptation des CGU. Veuillez réessayer.");
    }
  };

  // Si l'utilisateur est connecté et n'a pas accepté les CGU, afficher le modal
  if (isAuthenticated && user && !user.terms_accepted) {
    return <TermsModal onAccept={handleAccept} />;
  }

  // Sinon, afficher le contenu normalement
  return <>{children}</>;
}

TermsGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TermsGuard;
