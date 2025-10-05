import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import PortalLayout from "./components/layouts/PortalLayout";

import HomePage from "./pages/HomePage"
import IntroPage from "./pages/IntroPage"
import LorePage from "./pages/LorePage"
import RulesPage from "./pages/RulesPage"
import WikiPage from "./pages/WikiPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="intro" element={<IntroPage />} />
          <Route path="lore" element={<LorePage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="wiki" element={<WikiPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;