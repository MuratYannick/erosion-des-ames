/**
 * Données de la Timeline - Le Fleuve des Âges
 * Structure des ères et événements de l'histoire du monde
 */

export const timelineEras = [
  {
    id: 'genesis',
    title: 'La Genèse',
    rune: '∆',
    timeline: 'An 0 - An 1000',
    temperature: 'cold',
    isCurrent: false,
    summary: 'Le monde naît dans les flammes primordiales. Les premières tribus découvrent le feu sacré et forgent les premières alliances.',
    description: `Dans les temps anciens, avant que les cendres ne recouvrent les terres, le monde était jeune et ardent. Les flammes primordiales dansaient à la surface, et de leur chaleur naquirent les premières consciences.

Les ancêtres découvrirent le feu sacré, une essence divine qui brûlait sans consumer, qui donnait la vie sans prendre. Autour de ces flammes éternelles, les premières tribus se formèrent, unies par un lien plus fort que le sang : la dévotion aux Braises.

Cette ère vit l'émergence des rituels fondamentaux, des runes primordiales, et des pactes sacrés qui allaient définir le destin de toutes les générations futures.`,
    events: [
      {
        id: 'event-genesis-1',
        year: 'An 0',
        title: "L'Éveil des Flammes",
        icon: 'flame',
        description: 'Les premières étincelles de conscience apparaissent dans le néant primordial. Le feu sacré prend forme.'
      },
      {
        id: 'event-genesis-2',
        year: 'An 347',
        title: 'La Première Tribu',
        icon: 'tribe',
        description: 'Les Gardiens des Braises s\'unissent autour du premier foyer sacré, fondant la civilisation.'
      },
      {
        id: 'event-genesis-3',
        year: 'An 892',
        title: 'Le Pacte des Cinq Feux',
        icon: 'pact',
        description: 'Les cinq grandes tribus scellent une alliance éternelle, partageant les secrets des runes.'
      }
    ],
    quote: 'Au commencement, il y eut le feu. Et le feu donna naissance aux âmes.',
    quoteAuthor: 'Première Tablette des Origines'
  },
  {
    id: 'cataclysm',
    title: 'Le Grand Cataclysme',
    rune: '⧖',
    timeline: 'An 1000 - An 1500',
    temperature: 'warm',
    isCurrent: false,
    summary: "Le monde s'effondre sous le poids de l'Érosion. Les âmes commencent à se fragmenter, et l'ancien ordre s'écroule.",
    description: `Nul ne sait exactement ce qui déclencha le Cataclysme. Certains parlent d'un rituel qui tourna mal, d'autres d'une punition divine. Ce que tous savent, c'est que le ciel se déchira.

Une fissure immense s'ouvrit dans la voûte céleste, déversant l'Érosion sur le monde. Cette force corrosive ne détruisait pas la chair, mais l'essence même des êtres. Les âmes commencèrent à s'effriter, à se fragmenter, perdant peu à peu leur humanité.

Les grandes cités tombèrent en quelques générations. Les connaissances accumulées durant un millénaire furent perdues. Le Pacte des Cinq Feux se brisa, et les tribus se retrouvèrent seules face à l'horreur.`,
    events: [
      {
        id: 'event-cataclysm-1',
        year: 'An 1000',
        title: 'La Fissure',
        icon: 'crack',
        description: "Une faille s'ouvre dans le ciel, déversant l'Érosion sur le monde. Rien ne sera plus jamais pareil."
      },
      {
        id: 'event-cataclysm-2',
        year: 'An 1156',
        title: 'La Chute de Valdris',
        icon: 'ruins',
        description: "La plus grande cité du monde ancien s'effondre en une nuit. Des millions d'âmes sont perdues."
      },
      {
        id: 'event-cataclysm-3',
        year: 'An 1423',
        title: 'Le Dernier Gardien',
        icon: 'guardian',
        description: "Le dernier des Gardiens originels s'éteint, emportant avec lui les secrets des runes anciennes."
      }
    ],
    quote: "Quand le ciel pleura des larmes de néant, nous comprîmes que les dieux eux-mêmes pouvaient mourir.",
    quoteAuthor: 'Chroniques de la Chute'
  },
  {
    id: 'survival',
    title: "L'Ère de la Survie",
    rune: '◇',
    timeline: 'An 1500 - An 2000',
    temperature: 'hot',
    isCurrent: false,
    summary: 'Les factions se forment dans les décombres. La lutte pour la survie forge de nouveaux héros et de nouvelles horreurs.',
    description: `Des cendres du Cataclysme émergèrent les survivants. Plus durs, plus impitoyables, mais aussi plus unis que jamais. Car face à l'Érosion, l'individualisme était un luxe mortel.

De nouvelles factions naquirent, chacune avec sa vision de la survie. Les Gardiens des Braises, descendants des anciennes tribus, cherchaient à préserver les traditions. Les Forgeurs d'Âmes tentaient de comprendre et maîtriser l'Érosion elle-même. Les Nomades des Cendres parcouraient les terres désolées, collectant les fragments du passé.

Cette ère vit l'émergence de nouvelles technologies, de nouvelles magies, et de nouvelles horreurs. Car l'Érosion ne détruisait pas seulement, elle transformait.`,
    events: [
      {
        id: 'event-survival-1',
        year: 'An 1534',
        title: 'La Fondation des Factions',
        icon: 'faction',
        description: 'Les trois grandes factions se forment officiellement, chacune choisissant sa voie de survie.'
      },
      {
        id: 'event-survival-2',
        year: 'An 1756',
        title: 'La Découverte du Nexus',
        icon: 'nexus',
        description: "Un ancien sanctuaire est découvert, contenant des fragments de connaissance préservés de l'Érosion."
      },
      {
        id: 'event-survival-3',
        year: 'An 1889',
        title: 'La Guerre des Trois Flammes',
        icon: 'war',
        description: 'Les factions s\'affrontent pour le contrôle des ressources. Des milliers périssent avant la trêve.'
      }
    ],
    quote: 'Nous avons survécu non pas malgré les ténèbres, mais en apprenant à y voir.',
    quoteAuthor: 'Matriarche des Nomades des Cendres'
  },
  {
    id: 'renaissance',
    title: 'La Renaissance',
    rune: '◉',
    timeline: 'An 2000 - Présent',
    temperature: 'incandescent',
    isCurrent: true,
    summary: "L'époque actuelle. Un nouvel espoir naît des cendres, alors que d'anciens secrets refont surface et que de nouveaux héros se lèvent.",
    description: `Nous vivons aujourd'hui dans une ère de renaissance fragile. Les factions ont trouvé un équilibre précaire, les connaissances anciennes sont redécouvertes, et pour la première fois depuis le Cataclysme, l'espoir renaît.

Les Cartographes des Cendres ont commencé à cartographier les territoires perdus. Les Forgeurs d'Âmes prétendent avoir trouvé un moyen de résister à l'Érosion. Les Gardiens des Braises ont ravivé certains des anciens rituels.

Mais les ombres s'agitent. Des forces anciennes se réveillent. Et dans les profondeurs du monde, quelque chose attend. Cette ère sera celle de la décision finale : la renaissance ou l'extinction définitive.`,
    events: [
      {
        id: 'event-renaissance-1',
        year: 'An 2000',
        title: 'Le Nouveau Pacte',
        icon: 'pact',
        description: 'Les factions signent un accord de coopération, marquant le début officiel de la Renaissance.'
      },
      {
        id: 'event-renaissance-2',
        year: 'An 2234',
        title: "L'Éveil du Nexus",
        icon: 'nexus',
        description: "Le Nexus découvert jadis s'active mystérieusement, révélant des passages vers des terres inconnues."
      },
      {
        id: 'event-renaissance-3',
        year: 'An 2500 (Aujourd\'hui)',
        title: 'Le Grand Éveil',
        icon: 'star',
        description: 'De nouveaux héros émergent, porteurs du pouvoir de changer le destin du monde à jamais.'
      }
    ],
    quote: 'Des cendres nous renaissons, plus forts, plus sages, plus déterminés. Le feu ne meurt jamais vraiment.',
    quoteAuthor: 'Prophétie de la Renaissance'
  }
]

export default timelineEras
