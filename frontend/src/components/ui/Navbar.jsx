import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-blood-700 border-2 hidden xl:flex justify-evenly grow gap-2 p-2">
      <Link
        to="/intro"
        className="text-ochre-500 focus:text-blood-700 font-texte-corps hover:bg-ochre-500 hover:text-city-900 flex justify-center items-center text-2xl 2xl:text-3xl px-2 transition-colors duration-200"
      >
        Intro
      </Link>
      <Link
        to="/lore"
        className="text-ochre-500 focus:text-blood-700 font-texte-corps hover:bg-ochre-500 hover:text-city-900 flex justify-center items-center text-2xl 2xl:text-3xl px-2 transition-colors duration-200"
      >
        Univers
      </Link>
      <Link
        to="/rules"
        className="text-ochre-500 focus:text-blood-700 font-texte-corps hover:bg-ochre-500 hover:text-city-900 flex justify-center items-center text-2xl 2xl:text-3xl px-2 transition-colors duration-200"
      >
        Règles
      </Link>
      <Link
        to="/wiki"
        className="text-ochre-500 focus:text-blood-700 font-texte-corps hover:bg-ochre-500 hover:text-city-900 flex justify-center items-center text-2xl 2xl:text-3xl px-2 transition-colors duration-200"
      >
        Wiki
      </Link>
    </nav>
  );
}

export default Navbar;
