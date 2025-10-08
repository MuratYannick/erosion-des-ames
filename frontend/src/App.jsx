import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import PortalLayout from "./components/layouts/PortalLayout";
import ForumLayout from "./components/layouts/ForumLayout";

import HomePage from "./pages/HomePage"
import IntroPage from "./pages/IntroPage"
import LorePage from "./pages/LorePage"
import RulesPage from "./pages/RulesPage"
import WikiPage from "./pages/WikiPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForumGeneralPage from "./pages/ForumGeneralPage"
import ForumCategoryPage from "./pages/ForumCategoryPage"
import ForumSectionPage from "./pages/ForumSectionPage"
import ForumTopicPage from "./pages/ForumTopicPage"

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
          <Route path="/forum" element={<ForumLayout />}>
            <Route index element={<ForumGeneralPage />} />
            <Route path="general" element={<ForumGeneralPage />} />
            <Route path="category/:slug" element={<ForumCategoryPage />} />
            <Route path="section/:slug" element={<ForumSectionPage />} />
            <Route path="topic/:id" element={<ForumTopicPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;