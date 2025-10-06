import { useState, useEffect } from "react";
import Card from "../components/ui/Card";

function LorePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching lore data...");
    fetch("http://localhost:3000/api/portal/lore")
      .then((response) => {
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données du lore"
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
    <div className="space-y-8">
      {/* En-tête de la page */}
      <Card>
        <Card.Title>{data.title}</Card.Title>
        <p className="text-blood-700 font-texte-corps text-lg md:text-xl xl:text-2xl italic text-center mb-4">
          {data.catchphrase}
        </p>
      </Card>

      {/* Sections du lore */}
      {data.sections.map((section, index) => (
        <Card key={index}>
          <Card.Subtitle>{section.subtitle}</Card.Subtitle>

          <Card.Text>{section.part1}</Card.Text>

          <Card.Image
            src={section.image}
            alt={section.subtitle}
            imageStyle={section.imageStyle}
            imageHoverStyle={section.imageHoverStyle}
          />

          <Card.Text>{section.part2}</Card.Text>
        </Card>
      ))}
    </div>
  );
}

export default LorePage;
