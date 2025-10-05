import { Link } from "react-router-dom";

function BurgerPanel({ menuIsOpen }) {
  return (
    <nav
      className={`
        absolute top-0 left-0 px-2 bg-city-900 z-10 xl:hidden
        transition-[max-height] duration-1000 overflow-hidden ${
          menuIsOpen ? "max-h-96" : "max-h-0"
        }`}
    >
      <div className="flex flex-col">
        <Link
          to="/intro"
          className="text-ochre-500 focus:text-blood-700 font-texte-corps text-xs sm:text-base md:text-lg lg:text-xl border-b border-city-400 py-2"
        >
          Intro
        </Link>
        <Link
          to="/lore"
          className="text-ochre-500 focus:text-blood-700 font-texte-corps text-xs sm:text-base md:text-lg lg:text-xl border-b border-city-400 py-2"
        >
          Univers
        </Link>
        <Link
          to="/rules"
          className="text-ochre-500 focus:text-blood-700 font-texte-corps text-xs sm:text-base md:text-lg lg:text-xl border-b border-city-400 py-2"
        >
          Règles
        </Link>
        <Link
          to="/wiki"
          className="text-ochre-500 focus:text-blood-700 font-texte-corps text-xs sm:text-base md:text-lg lg:text-xl py-2"
        >
          Wiki
        </Link>
      </div>
    </nav>
  );
}

export default BurgerPanel;
