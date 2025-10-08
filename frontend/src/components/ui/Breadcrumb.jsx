import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="mb-6" aria-label="Fil d'Ariane">
      <ol className="flex items-center space-x-2 text-sm font-texte-corps">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-city-700 font-medium select-none">
                  /
                </span>
              )}
              {isLast ? (
                <span className="text-ochre-700 font-medium">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-city-900 hover:text-blood-800 transition-colors duration-200 hover:font-semibold"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumb;
