import { useState, useEffect } from "react";
import Card from "../components/ui/Card";

function IntroPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching intro data...");
    fetch("http://localhost:3000/api/portal/intro")
      .then((response) => {
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données de présentation"
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
    <Card>
      <Card.Title>{data.title}</Card.Title>

      <Card.Text>{data.part1}</Card.Text>

      <Card.Image
        src={data.image}
        alt="des survivants discutent autour d'un feu de camp"
        imageStyle={data.imageStyle}
        imageHoverStyle={data.imageHoverStyle}
      />

      <Card.Text>{data.part2}</Card.Text>
    </Card>
  );
}

export default IntroPage;
