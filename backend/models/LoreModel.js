const loreContent = {
  title: "L'Univers du jeu",
  catchphrase:
    "Le temps s'est arrêté, le monde s'est brisé, et les âmes des survivants avec ...",
  sections: [
    {
      subtitle: "Situation : Le Cataclysme et les Ruines",
      part1:
        "Il y a une génération, un événement que l'on nomme 'L'Érosion' a ravagé le monde connu. Les continents ont tremblé, la magie a dégénéré, et des créatures que l'on croyait mythiques ont émergé des abysses de la terre. Les survivants se sont regroupés dans des cités-refuges, souvent bâties sur les ruines des anciennes métropoles, luttant pour chaque morceau de terrain fertile.",
      image: "/illustrations/loreSituation.png",
      imageStyle: {
        filter: "sepia(65%)",
        transition: "filter 5s ease-in-out",
      },
      imageHoverStyle: {
        filter: "sepia(0%)",
      },
      part2:
        "La météo est imprévisible, le cycle jour/nuit est perturbé, et les anciennes lois de la physique semblent vaciller. Voyager est un risque constant, les ressources sont rares et les dangers omniprésents, qu'ils soient naturels, ou humains.",
    },
    {
      subtitle: "La Société : Fragmentée et Désespérée",
      part1:
        "La société s'est effondrée en micro-factions : les Cités-États, où règnent l'ordre et la peur ; les Clans Barbares, qui vivent de pillage et de commerce sauvage ; et les Nomades, qui sillonnent les étendues désolées à la recherche de lieux sûrs. La monnaie n'a plus de valeur ; le troc, l'eau potable, et surtout, les informations, sont les véritables richesses.",
      image: "/illustrations/loreSociety.png",
      imageStyle: {
        filter: "sepia(65%)",
        transition: "filter 5s ease-in-out",
      },
      imageHoverStyle: {
        filter: "sepia(0%)",
      },
      part2:
        "La méfiance est la règle d'or. Chaque étranger est un danger potentiel. De nouvelles doctrines religieuses ont émergé, cherchant à donner un sens à l'Érosion, et les conflits idéologiques sont aussi mortels que les affrontements armés. Trouver un allié est plus rare que trouver de l'or.",
    },
    {
      subtitle: "Le Bestiaire : Les Abominations du monde",
      part1:
        "L'Érosion n'a pas seulement détruit ; elle a perverti. Les animaux et même certaines plantes ont muté pour devenir des menaces cauchemardesques. Les créatures les plus dangereuses sont les 'Érodés', des êtres autrefois vivants, dont l'âme a été consumée, laissant derrière eux des corps animés par une faim et une violence irrationnelles.",
      image: "/illustrations/loreBestiary.png",
      imageStyle: {
        filter: "sepia(70%)",
        transition: "filter 5s ease-in-out",
      },
      imageHoverStyle: {
        filter: "sepia(0%)",
      },
      part2:
        "Chaque région a ses propres monstres uniques, adaptés à leur environnement hostile. Les joueurs devront apprendre à reconnaître leurs proies et leurs chasseurs. Le savoir est votre meilleure arme contre ces abominations qui n'ont ni pitié, ni âme.",
    },
  ],
};

export default loreContent;
