const homeContent = {
  title: "Bienvenue dans l'Érosion des Âmes",
  catchphrase: "Survivre est une victoire... et revivre est un mythe.",
  containers: [
    {
      id: 1,
      title: "Accéder à la communauté",
      image: "/illustrations/communityAccess.png",
      imageStyle: {
        filter: "sepia(65%)",
        transition: "filter 5s ease-in-out",
      },
      imageHoverStyle: {
        filter: "sepia(0%)",
      },
      link: "/forum/general",
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
