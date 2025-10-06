import PropTypes from "prop-types";

function CloseButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-4 right-4 text-ochre-400 hover:text-blood-700 transition-colors duration-200 ${className}`}
      aria-label="Fermer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="font-texte-corps"
          style={{ fontSize: "24px", fontWeight: "bold" }}
        >
          X
        </text>
      </svg>
    </button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CloseButton;
