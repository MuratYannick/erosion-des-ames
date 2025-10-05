import PropTypes from "prop-types";
import { useState } from "react";

// Composant principal
function Card({ children, className = "" }) {
  return (
    <div
      className={`
      flex flex-col bg-city-600 p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8
      ${className}
    `}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Sous-composant pour les titres principaux (H1)
function CardTitle({ children, className = "" }) {
  return (
    <h1
      className={`
        text-2xl md:text-3xl xl:text-4xl
        font-bold font-alternative-1
        text-ochre-400
        tracking-widest
        mb-6
        ${className}
      `}
    >
      {children}
    </h1>
  );
}

// Sous-composant pour les sous-titres (H2, H3, etc.)
function CardSubtitle({ children, className = "" }) {
  return (
    <h2
      className={`
        text-xl md:text-2xl xl:text-3xl
        font-semibold font-texte-corps
        text-ochre-300
        mt-6 mb-4 border-b-2 border-ochre-500 pb-1
        ${className}
      `}
    >
      {children}
    </h2>
  );
}

// Sous-composant pour le texte (Paragraphe)
function CardText({ children, className = "" }) {
  return (
    <p
      className={`
        text-base md:text-lg xl:text-xl
        text-city-900
        font-texte-corps
        whitespace-pre-wrap
        justify-self-auto
        mb-4
        ${className}
      `}
    >
      {children}
    </p>
  );
}

function CardImage({ src, className = "", alt = "", imageStyle = {}, imageHoverStyle = {} }) {
  const [isHovered, setIsHovered] = useState(false);

  const combinedStyle = {
    ...imageStyle,
    ...(isHovered ? imageHoverStyle : {}),
  };

  return (
    <div className={`flex justify-center my-8 overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover rounded"
        style={combinedStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
}

// Association des sous-composants à Card
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Text = CardText;
Card.Image = CardImage;

// Définition des PropTypes
CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardSubtitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageStyle: PropTypes.object,
  imageHoverStyle: PropTypes.object,
};

export default Card;
