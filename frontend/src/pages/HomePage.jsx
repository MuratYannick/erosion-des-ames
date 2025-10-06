import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    console.log("Fetching home data...");
    fetch("http://localhost:3000/api/portal/home")
      .then((response) => {
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données de la page d'accueil"
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-ochre-300 font-texte-corps">
        Chargement...
      </div>
    );
  if (error)
    return (
      <div className="text-ochre-600 text-center py-10 font-texte-corps">
        Erreur : {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Titre principal */}
      <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-titre-Jeu text-blood-700 tracking-wider text-center mb-6">
        {data.title}
      </h1>

      {/* Phrase d'accroche */}
      <p className="text-ochre-400 font-texte-corps text-xl md:text-2xl xl:text-3xl italic text-center mb-12">
        {data.catchphrase}
      </p>

      {/* Containers horizontaux cliquables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.containers.map((container) => {
          const isHovered = hoveredId === container.id;
          const imageStyle = {
            ...container.imageStyle,
            ...(isHovered ? container.imageHoverStyle : {}),
          };

          return (
            <Link
              key={container.id}
              to={container.link}
              className="group bg-city-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredId(container.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={container.image}
                  alt={container.title}
                  className="w-full h-64 object-cover"
                  style={imageStyle}
                />
              </div>

              {/* Titre */}
              <div className="p-6 bg-city-800">
                <h2 className="text-2xl md:text-3xl font-bold font-texte-corps text-ochre-400 group-hover:text-blood-700 transition-colors duration-300 text-center">
                  {container.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
