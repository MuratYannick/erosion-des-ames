import { Link } from "react-router-dom";
import UserBar from "../ui/UserBar";
import { useAuth } from "../../contexts/AuthContext";

function ForumHeader() {
  const { isAuthenticated } = useAuth();

  const categories = [
    { name: "Général", path: "/forum/general", requireAuth: false },
    { name: "Jeu", path: "/forum/game", requireAuth: true },
    { name: "Support", path: "/forum/support", requireAuth: true },
  ];

  return (
    <header className="bg-city-900 border-b-4 border-blood-700 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Logo et titre */}
        <div className="flex items-center justify-between py-4 border-b-2 border-city-700">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/logos/logo.png"
              alt="Logo L'Érosion des Âmes"
              className="h-16 w-16"
            />
            <h1 className="text-2xl md:text-3xl font-titre-Jeu text-blood-700 tracking-wider">
              L'Érosion des Âmes - Forum
            </h1>
          </Link>
          <UserBar />
        </div>

        {/* Navbar des catégories */}
        <nav className="py-3">
          <ul className="flex gap-6 justify-center">
            {categories.map((category) => {
              const isDisabled = category.requireAuth && !isAuthenticated;

              return (
                <li key={category.path}>
                  {isDisabled ? (
                    <span className="text-city-600 font-texte-corps text-lg tracking-wide cursor-not-allowed opacity-50">
                      {category.name}
                    </span>
                  ) : (
                    <Link
                      to={category.path}
                      className="text-ochre-400 hover:text-blood-700 font-texte-corps text-lg tracking-wide transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default ForumHeader;
