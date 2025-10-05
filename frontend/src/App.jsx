import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-wasteland-900 to-wasteland-800">
      <div className="container mx-auto px-4 py-16">
        {/* En-tête principal */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-mutant-light via-pure to-neutral-light bg-clip-text text-transparent">
            L'Érosion des Âmes
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Dans un monde post-apocalyptique déchiré par le cataclysme, deux
            factions s'affrontent pour la survie : les Éveillés et les Purs.
          </p>
        </div>

        {/* Cartes des factions */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Faction Mutante */}
          <div className="card faction-mutant hover:shadow-mutant/20 transition-shadow">
            <h3 className="text-2xl font-bold mb-3 text-mutant">
              Les Éveillés
            </h3>
            <p className="text-slate-300 mb-4">
              Mutants ayant évolué suite au cataclysme, ils croient être les
              élus d'un nouveau monde purifié par la nature.
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Peau grisâtre caractéristique</li>
              <li>• Connexion avec la nature mutée</li>
              <li>• Organisation en castes spécialisées</li>
            </ul>
          </div>

          {/* Faction Pure */}
          <div className="card faction-pure hover:shadow-pure/20 transition-shadow">
            <h3 className="text-2xl font-bold mb-3 text-pure">Les Purs</h3>
            <p className="text-slate-300 mb-4">
              Non-mutants préservant l'héritage de l'ancien monde, ils cherchent
              à restaurer la civilisation par la technologie.
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Apparence humaine inaltérée</li>
              <li>• Maîtrise des anciennes technologies</li>
              <li>• Organisation en clans hiérarchisés</li>
            </ul>
          </div>

          {/* Clans Neutres */}
          <div className="card faction-neutral hover:shadow-neutral/20 transition-shadow">
            <h3 className="text-2xl font-bold mb-3 text-neutral">
              Clans Neutres
            </h3>
            <p className="text-slate-300 mb-4">
              Groupes indépendants refusant de prendre parti, cherchant à
              survivre par leurs propres moyens.
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• Marchands, artisans, érudits</li>
              <li>• Liberté et pragmatisme</li>
              <li>• Alliances temporaires</li>
            </ul>
          </div>
        </div>

        {/* Appel à l'action */}
        <div className="text-center mt-16 space-x-4">
          <button className="btn-primary">Rejoindre les Éveillés</button>
          <button className="btn-secondary">Rejoindre les Purs</button>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-wasteland-900 text-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Le Monde d'Après</h2>

          <div className="card mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-mutant">
              Le Cataclysme
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Quelques générations après l'effondrement de la société, les
              humains qui peuplent ce monde n'ont qu'une vague idée du monde
              d'avant. Une obscurité noire s'installa sur le pays, un épais
              brouillard sembla s'infiltrer dans les âmes. La folie commença, et
              l'humanité se retourna contre elle-même.
            </p>
          </div>

          <div className="card mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-pure">
              L'Environnement Hostile
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Face à une nature devenue sauvage et hostile, les survivants
              découvrent un monde transformé où la faune et la flore ont muté en
              créatures dangereuses :
            </p>
            <ul className="text-slate-400 space-y-2">
              <li>
                • <strong className="text-slate-200">Le Strident</strong> :
                Canidés aux cris soniques
              </li>
              <li>
                • <strong className="text-slate-200">Le Fouisseur</strong> :
                Rongeurs géants fouisseurs
              </li>
              <li>
                • <strong className="text-slate-200">L'Écorcheur</strong> :
                Prédateurs aériens redoutables
              </li>
              <li>
                •{" "}
                <strong className="text-slate-200">La Vigne Étreignante</strong>{" "}
                : Plantes carnivores géantes
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-2xl font-semibold mb-4 text-neutral">
              La Survie
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Dans ce monde dévasté, chaque faction lutte pour sa vision de
              l'avenir. Les Éveillés cherchent à s'harmoniser avec le nouveau
              monde, les Purs tentent de restaurer l'ancien, tandis que les
              clans neutres naviguent entre les deux, cherchant simplement à
              survivre un jour de plus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-wasteland-950 text-slate-100 border-b border-wasteland-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-mutant">
              L'Érosion des Âmes
            </div>
            <div className="flex gap-6">
              <Link
                to="/"
                className="hover:text-mutant transition-colors font-medium"
              >
                Accueil
              </Link>
              <Link
                to="/about"
                className="hover:text-pure transition-colors font-medium"
              >
                L'Univers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
