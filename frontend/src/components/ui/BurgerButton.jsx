function BurgerButton({ menuIsOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-city-700 rounded-md shadow-lg relative flex flex-col justify-center items-center size-10 sm:size-12 md:size-14 lg:size-16 xl:hidden transition-all duration-500"
    >
      {/* Les barres du menu burger */}
      <div
        className={`bg-ochre-300 rounded-full w-6 sm:w-8 md:w-10 lg:w-12 h-0.5 md:h-1
          transition-all duration-500 ${
            menuIsOpen
            ? "rotate-45 translate-y-2"
            : ""
          }`}
      ></div>
      <div
        className={`bg-ochre-300 rounded-full w-6 sm:w-8 md:w-10 lg:w-12 h-0.5 md:h-1 my-1 md:my-2
          transition-all duration-500 ${
            menuIsOpen
            ? "opacity-0"
            : ""
          }`}
      ></div>
      <div
        className={`bg-ochre-300 rounded-full w-6 sm:w-8 md:w-10 lg:w-12 h-0.5 md:h-1
          transition-all duration-500 ${
            menuIsOpen
            ? "-rotate-45 -translate-y-2"
            : ""
          }`}
      ></div>
    </button>
  );
}

export default BurgerButton;
