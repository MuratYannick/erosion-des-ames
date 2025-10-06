import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { useAuth } from "../../contexts/AuthContext";

function ConnectBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex justify-end items-center grow gap-3 p-2">
        <span className="text-ochre-400 font-texte-corps text-sm tracking-wide">
          {user.username}
        </span>
        <SecondaryButton
          onClick={handleLogout}
          className="text-sm tracking-widest h-10"
        >
          Déconnexion
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className="flex justify-end grow gap-2 p-2">
      <Link to="/login">
        <PrimaryButton className="text-sm tracking-widest h-10 w-25">
          Connexion
        </PrimaryButton>
      </Link>
      <Link to="/register">
        <SecondaryButton className="text-sm tracking-widest h-10 w-25">
          Inscription
        </SecondaryButton>
      </Link>
    </div>
  );
}

export default ConnectBar;
