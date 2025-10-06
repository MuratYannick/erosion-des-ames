const homeContent = {
  title: "Bienvenue dans l'Érosion des Âmes",
  catchphrase: "Survivre est une victoire... et revivre est un mythe.",
  containers: [
    {
      id: 1,
      title: "Découvrir l'Univers",
      image: "/illustrations/discoverUniverse.png",
      imageStyle: {
        filter: "sepia(65%)",
        transition: "filter 5s ease-in-out",
      },
      imageHoverStyle: {
        filter: "sepia(0%)",
      },
      link: "/intro",
    },
    {
      id: 2,
      title: "Rejoindre l'Aventure",
      image: "/illustrations/joinAdventure.png",
      imageStyle: {
        filter: "sepia(65%)",
        transition: "filter 5s ease-in-out",
      },
      imageHoverStyle: {
        filter: "sepia(0%)",
      },
      link: "/register",
    },
  ],
};

export default homeContent;
