import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import PortalLayout from "./components/layouts/PortalLayout";

import HomePage from "./pages/HomePage"
import IntroPage from "./pages/IntroPage"
import LorePage from "./pages/LorePage"
import RulesPage from "./pages/RulesPage"
import WikiPage from "./pages/WikiPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortalLayout />}>
            <Route index element={<HomePage />} />
            <Route path="intro" element={<IntroPage />} />
            <Route path="lore" element={<LorePage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="wiki" element={<WikiPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;