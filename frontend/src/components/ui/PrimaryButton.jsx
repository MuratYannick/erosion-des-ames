function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-blood-700 hover:bg-ochre-500 text-city-900 hover:text-blood-700 font-texte-corps tracking-wide px-4 py-2 rounded transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
