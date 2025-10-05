function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-city-900 hover:bg-ochre-500 text-ochre-500 hover:text-city-900 font-texte-corps tracking-wide px-4 py-2 rounded border border-ochre-500 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
