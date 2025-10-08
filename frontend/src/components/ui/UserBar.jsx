import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { useAuth } from "../../contexts/AuthContext";

function UserBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="flex justify-end items-center gap-3 p-2">
        <span className="text-city-400 font-texte-corps text-sm tracking-wide">
          Invité
        </span>
        <Link to="/login">
          <PrimaryButton className="text-sm tracking-widest h-10">
            Se connecter
          </PrimaryButton>
        </Link>
        <Link to="/register">
          <SecondaryButton className="text-sm tracking-widest h-10">
            S'inscrire
          </SecondaryButton>
        </Link>
      </div>
    );
  }

  // Si l'utilisateur est connecté
  return (
    <div className="flex justify-end items-center gap-3 p-2">
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

export default UserBar;
