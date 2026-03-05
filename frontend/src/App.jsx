import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MainLayout, AdminLayout } from '@/layouts'
import {
  ToastProvider,
  useToast,
  Sidebar,
  SidebarHeader,
  SidebarSection,
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarDivider,
  Avatar,
  Badge,
  ScrollToTopOnNavigate,
} from '@/components'
import { ErrorBoundary } from '@/components/errors'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components'
import SuspenseFallback from '@/components/ui/Loader/SuspenseFallback'

// ---------------------------------------------------------------------------
// Lazy imports — pages principales
// Le code splitting Vite génère un chunk séparé pour chaque page.
// Les layouts, providers et composants UI restent en import statique.
// ---------------------------------------------------------------------------

// Pages publiques
const Home = lazy(() => import('@/pages/Home/Home'))
const Foreword = lazy(() => import('@/pages/Foreword/Foreword'))
const Universe = lazy(() => import('@/pages/Universe/Universe'))
const Characters = lazy(() => import('@/pages/Characters/Characters'))

// Forum
const ForumIndex = lazy(() => import('@/pages/Forum/ForumIndex'))
const ForumCategory = lazy(() => import('@/pages/Forum/ForumCategory'))
const ForumTopic = lazy(() => import('@/pages/Forum/ForumTopic'))
const ForumCreateTopic = lazy(() => import('@/pages/Forum/ForumCreateTopic'))
const ForumEditTopic = lazy(() => import('@/pages/Forum/ForumEditTopic'))
const ForumEditPost = lazy(() => import('@/pages/Forum/ForumEditPost'))
const ForumSearch = lazy(() => import('@/pages/Forum/ForumSearch'))
const ForumModeration = lazy(() => import('@/pages/Forum/ForumModeration'))

// Mes personnages
const MyCharactersList = lazy(() => import('@/pages/MyCharacters/MyCharactersList'))
const MyCharacterDetail = lazy(() => import('@/pages/MyCharacters/MyCharacterDetail'))
const MyCharacterCreate = lazy(() => import('@/pages/MyCharacters/MyCharacterCreate'))
const MyCharacterEdit = lazy(() => import('@/pages/MyCharacters/MyCharacterEdit'))

// Auth
const Login = lazy(() => import('@/pages/Auth/Login'))
const Register = lazy(() => import('@/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'))
const VerifyEmail = lazy(() => import('@/pages/Auth/VerifyEmail'))

// Profil
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))
const ProfileSettings = lazy(() => import('@/pages/Profile/ProfileSettings'))

// Admin
const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'))
const AdminUsers = lazy(() => import('@/pages/Admin/AdminUsers'))
const AdminUserDetail = lazy(() => import('@/pages/Admin/AdminUserDetail'))
const AdminCharacters = lazy(() => import('@/pages/Admin/AdminCharacters'))
const AdminForum = lazy(() => import('@/pages/Admin/AdminForum'))
const AdminModeration = lazy(() => import('@/pages/Admin/AdminModeration'))
const AdminLogs = lazy(() => import('@/pages/Admin/AdminLogs'))

// Erreurs
const NotFound = lazy(() => import('@/pages/errors/NotFound'))
const Forbidden = lazy(() => import('@/pages/errors/Forbidden'))
const ServerError = lazy(() => import('@/pages/errors/ServerError'))
const Maintenance = lazy(() => import('@/pages/errors/Maintenance'))

// Placeholder pages
function AvantProposPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-primary-800 mb-4">Avant-propos</h1>
      <p className="font-body text-skin-secondary">Contenu a venir...</p>
    </div>
  )
}

// Icons for sidebar
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
    <path d="M8 2v16M16 6v16" />
  </svg>
)

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ScrollIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

// Layout with Sidebar for Univers section
function UniversLayout() {
  return (
    <div className="flex min-h-[calc(100vh-200px)]">
      <Sidebar variant="navigation" collapsible showCollapseButton>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <GlobeIcon />
            <span className="sidebar-text font-heading text-lg">UNIVERS</span>
          </div>
        </SidebarHeader>

        <SidebarSection title="Exploration">
          <SidebarNav>
            <SidebarNavItem icon={<MapIcon />} href="/univers" active>
              Carte du Monde
            </SidebarNavItem>
            <SidebarNavItem icon={<BookIcon />} href="/univers/lore">
              Lore & Histoire
            </SidebarNavItem>
            <SidebarNavItem icon={<UsersIcon />} href="/univers/factions">
              Factions
            </SidebarNavItem>
          </SidebarNav>
        </SidebarSection>

        <SidebarDivider />

        <SidebarNavGroup title="Regions" defaultExpanded>
          <SidebarNavItem href="/univers/regions/nord">Terres du Nord</SidebarNavItem>
          <SidebarNavItem href="/univers/regions/sud">Desert du Sud</SidebarNavItem>
          <SidebarNavItem href="/univers/regions/est">Forets de l'Est</SidebarNavItem>
          <SidebarNavItem href="/univers/regions/ouest">Ruines de l'Ouest</SidebarNavItem>
        </SidebarNavGroup>

        <SidebarDivider />

        <SidebarSection title="Ressources">
          <SidebarNav>
            <SidebarNavItem icon={<ScrollIcon />} href="/univers/archives">
              Archives
            </SidebarNavItem>
          </SidebarNav>
        </SidebarSection>
      </Sidebar>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

function UniversPage() {
  return (
    <div>
      <h1 className="font-display text-4xl text-primary-800 mb-4">Carte du Monde</h1>
      <p className="font-body text-skin-secondary mb-6">
        Decouvrez le monde d'Erosion des Ames, un univers post-apocalyptique
        ou les tribus survivantes luttent pour leur existence.
      </p>
      <div className="bg-surface-elevated rounded-lg p-6 border border-primary-200">
        <h2 className="font-heading text-xl text-primary-700 mb-3">Sidebar Demo</h2>
        <ul className="font-body text-skin-secondary space-y-2">
          <li>Navigation contextuelle avec icones tribales</li>
          <li>Groupes collapsibles (cliquez sur "Regions")</li>
          <li>Bouton de collapse en bas (diamant tribal)</li>
          <li>Ember glow sur l'item actif</li>
          <li>Bordure verticale gravee</li>
        </ul>
      </div>
    </div>
  )
}

function UniversLorePage() {
  return (
    <div>
      <h1 className="font-display text-4xl text-primary-800 mb-4">Lore & Histoire</h1>
      <p className="font-body text-skin-secondary">L'histoire du monde...</p>
    </div>
  )
}

function UniversFactionsPage() {
  return (
    <div>
      <h1 className="font-display text-4xl text-primary-800 mb-4">Factions</h1>
      <p className="font-body text-skin-secondary">Les differentes factions...</p>
    </div>
  )
}

function PersonnagesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-primary-800 mb-4">Personnages</h1>
      <p className="font-body text-skin-secondary">Les personnages du jeu...</p>
    </div>
  )
}




/**
 * Composant qui écoute l'événement auth:muted et affiche un toast d'avertissement
 */
function MuteNotifier() {
  const toast = useToast()

  useEffect(() => {
    const handleMuted = (event) => {
      const { expiresAt } = event.detail || {}
      const expiry = expiresAt
        ? ` Expire le ${new Date(expiresAt).toLocaleDateString('fr-FR')}.`
        : ' Cette sanction est permanente.'
      toast.warning(
        `Vous êtes actuellement sous silence (mute). Vous ne pouvez pas publier de contenu.${expiry}`
      )
    }

    window.addEventListener('auth:muted', handleMuted)
    return () => window.removeEventListener('auth:muted', handleMuted)
  }, [toast])

  return null
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTopOnNavigate />
            <ToastProvider position="top-right">
              <MuteNotifier />
              {/* Suspense enveloppe toutes les Routes pour capturer les lazy chunks */}
              <Suspense fallback={<SuspenseFallback />}>
                <Routes>
                {/* Routes auth - sans MainLayout */}
                <Route path="/connexion" element={<Login />} />
                <Route path="/inscription" element={<Register />} />
                <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
                <Route path="/verifier-email" element={<VerifyEmail />} />

                {/* Routes admin - avec AdminLayout (ProtectedRoute ADMIN/MODERATOR intégré) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="utilisateurs" element={<AdminUsers />} />
                  <Route path="utilisateurs/:id" element={<AdminUserDetail />} />
                  <Route path="personnages" element={<AdminCharacters />} />
                  <Route path="forum" element={<AdminForum />} />
                  <Route path="moderation" element={<ProtectedRoute roles={['ADMIN', 'MODERATOR']}><AdminModeration /></ProtectedRoute>} />
                  <Route path="journal" element={<ProtectedRoute roles={['ADMIN', 'MODERATOR']}><AdminLogs /></ProtectedRoute>} />
                </Route>

                {/* Routes principales - avec MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/avant-propos" element={<Foreword />} />
                  <Route path="/univers" element={<Universe />} />
                  <Route path="/univers/explorer" element={<UniversLayout />}>
                    <Route index element={<UniversPage />} />
                    <Route path="lore" element={<UniversLorePage />} />
                    <Route path="factions" element={<UniversFactionsPage />} />
                    <Route path="regions/:region" element={<UniversPage />} />
                    <Route path="archives" element={<UniversPage />} />
                  </Route>
                  <Route path="/personnages" element={<Characters />} />
                  <Route path="/forum" element={<ForumIndex />} />
                  <Route path="/forum/recherche" element={<ForumSearch />} />
                  <Route path="/forum/moderation" element={<ProtectedRoute roles={['ADMIN', 'MODERATOR']}><ForumModeration /></ProtectedRoute>} />
                  <Route path="/forum/:categorySlug" element={<ForumCategory />} />
                  <Route path="/forum/:categorySlug/nouveau-sujet" element={<ProtectedRoute><ForumCreateTopic /></ProtectedRoute>} />
                  <Route path="/forum/:categorySlug/:topicId" element={<ForumTopic />} />
                  <Route path="/forum/:categorySlug/:topicId/modifier" element={<ProtectedRoute><ForumEditTopic /></ProtectedRoute>} />
                  <Route path="/forum/:categorySlug/:topicId/modifier-post/:postId" element={<ProtectedRoute><ForumEditPost /></ProtectedRoute>} />

                  {/* Routes profil - statique avant dynamique */}
                  <Route path="/profil/parametres" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                  <Route path="/profil/:id" element={<ProfilePage />} />
                  <Route path="/mes-personnages" element={<ProtectedRoute><MyCharactersList /></ProtectedRoute>} />
                  <Route path="/mes-personnages/creer" element={<ProtectedRoute><MyCharacterCreate /></ProtectedRoute>} />
                  <Route path="/mes-personnages/:id" element={<ProtectedRoute><MyCharacterDetail /></ProtectedRoute>} />
                  <Route path="/mes-personnages/:id/modifier" element={<ProtectedRoute><MyCharacterEdit /></ProtectedRoute>} />

                  {/* Routes d'erreur */}
                  <Route path="/interdit" element={<Forbidden />} />
                  <Route path="/erreur" element={<ServerError />} />
                  <Route path="/maintenance" element={<Maintenance />} />

                  {/* Route 404 - catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
                </Routes>
              </Suspense>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
