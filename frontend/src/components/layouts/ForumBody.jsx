import PropTypes from "prop-types";

function ForumBody({ children }) {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
  );
}

ForumBody.propTypes = {
  children: PropTypes.node.isRequired,
};

// Classes CSS réutilisables pour les pages du forum
ForumBody.styles = {
  // Titre principal de la page (h1)
  pageTitle: "text-3xl font-alternative-1 tracking-widest text-blood-700 mb-6",

  // Conteneur de section
  section: "bg-city-800 rounded-lg p-6 mb-6 border-2",

  // Bordures selon les factions
  borders: {
    default: "border-ochre-600",
    mutant: "border-mutant",
    pure: "border-pure",
    neutral: "border-neutral",
  },

  // Titre de section (h2)
  sectionTitle: "text-2xl font-alternative-1 tracking-wide text-ochre-500 mb-4",

  // Texte standard
  text: "text-city-500 font-texte-corps text-lg",

  // Lien
  link: "text-ochre-400 hover:text-blood-700 transition-colors duration-200 font-texte-corps",

  // Sujet du forum
  topic: "bg-city-700 rounded p-4 mb-3 border-l-4 hover:bg-city-600 transition-colors duration-200",

  // Titre de sujet
  topicTitle: "text-xl font-texte-corps text-ochre-300 mb-2",

  // Meta informations (auteur, date, etc.)
  meta: "text-sm text-city-500 font-texte-corps",
};

export default ForumBody;
