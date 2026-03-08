import { Link } from 'react-router-dom'
import { useDashboardStats, useModerationActions, usePendingCharacters } from '@/hooks/useAdmin'
import { StatCard, ModerationActionRow, CharacterApprovalCard } from '@/components/admin'

// ============================================
// INLINE SVG ICONS
// ============================================

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-1a6 6 0 0112 0v1" />
    <path d="M16 3.13a4 4 0 010 7.75" strokeOpacity="0.7" />
    <path d="M21 21v-1a4 4 0 00-3-3.85" strokeOpacity="0.7" />
  </svg>
)

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" strokeOpacity="0.8" />
  </svg>
)

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const IconFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
)

const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
)

// ============================================
// CONSTANTS
// ============================================

const ROLE_CONFIG = {
  ADMIN:       { label: 'Admin',     color: '#ff9635' },
  MODERATOR:   { label: 'Modérateur', color: '#7ba5c9' },
  GAME_MASTER: { label: 'MJ',        color: '#a890c0' },
  PLAYER:      { label: 'Joueur',    color: '#8f99a5' },
}

const STATUS_CONFIG = {
  draft:    { label: 'Brouillon', color: '#8f99a5' },
  pending:  { label: 'En attente', color: '#ff9635' },
  approved: { label: 'Approuvé', color: '#6b9664' },
  rejected: { label: 'Rejeté', color: '#c95951' },
}

// ============================================
// HELPERS
// ============================================

function formatRelativeTime(isoString) {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now - date
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes}min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 30) return `Il y a ${days}j`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ============================================
// SECTION HEADER
// ============================================

const SectionHeader = ({ title, count, linkTo, linkLabel, color = '#ff9635' }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${color}, ${color}80)` }}
        />
        <h2 className="text-lg font-subheading text-[#d4c9ba] uppercase tracking-wide">
          {title}
        </h2>
        {count != null && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold font-mono"
            style={{
              backgroundColor: `${color}20`,
              color,
              border: `1px solid ${color}40`,
            }}
          >
            {count}
          </span>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-xs flex items-center gap-1 transition-colors hover:gap-2 group"
          style={{ color }}
        >
          <span>{linkLabel || 'Tout voir'}</span>
          <IconArrowRight />
        </Link>
      )}
    </div>
    <div
      className="h-px"
      style={{ background: `linear-gradient(to right, ${color}60, ${color}20, transparent)` }}
    />
  </div>
)

// ============================================
// DISTRIBUTION BAR
// ============================================

const DistributionBar = ({ items, total }) => {
  if (!total) return null

  return (
    <div className="space-y-3">
      {/* Visual bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-[#232930]">
        {items.map((item) => {
          const pct = (item.value / total) * 100
          if (pct === 0) return null
          return (
            <div
              key={item.label}
              className="transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: item.color }}
              title={`${item.label}: ${item.value}`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#8f99a5]">{item.label}</span>
            <span className="text-[#d4c9ba] font-mono font-medium tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// RECENT USERS LIST
// ============================================

const RecentUsersList = ({ users }) => {
  if (!users || users.length === 0) return null

  return (
    <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg overflow-hidden">
      <div className="bg-[#232930] border-b border-[#6b3212]/40 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#d4c9ba] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
            <span className="text-[#5b8fb9]"><IconUsers /></span>
            Nouveaux utilisateurs
          </h3>
          <span className="text-[#64707e] text-xs font-mono">5 derniers</span>
        </div>
      </div>

      <div className="divide-y divide-[#6b3212]/20">
        {users.map((user, idx) => {
          const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.PLAYER
          const initials = (user.username || '?').charAt(0).toUpperCase()

          return (
            <div
              key={user.id}
              className="p-4 hover:bg-[#232930]/50 transition-colors border-l-2 border-transparent hover:border-[#5b8fb9]/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#6b3212]/60 bg-[#232930] flex items-center justify-center text-[#8f99a5] text-sm font-ui font-medium flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[#d4c9ba] text-sm font-medium truncate">
                      {user.username}
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border uppercase tracking-wide"
                      style={{
                        color: role.color,
                        borderColor: `${role.color}40`,
                        backgroundColor: `${role.color}15`,
                      }}
                    >
                      {role.label}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] text-[#ff9635] font-bold uppercase tracking-wide bg-[#ff9635]/10 px-1.5 py-0.5 rounded">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <span className="text-[#64707e] text-xs truncate block">{user.email}</span>
                </div>
                <div className="flex items-center gap-1 text-[#64707e] flex-shrink-0">
                  <IconClock />
                  <span className="text-xs font-mono">{formatRelativeTime(user.createdAt)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-[#232930] border-t border-[#6b3212]/40 p-3">
        <Link
          to="/admin/utilisateurs"
          className="text-xs text-[#5b8fb9] hover:text-[#ff9635] transition-colors flex items-center justify-center gap-1"
        >
          <span>Voir tous les utilisateurs</span>
          <IconArrowRight />
        </Link>
      </div>
    </div>
  )
}

// ============================================
// LOADING SKELETON
// ============================================

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Stats grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-5 border-l-4 border-l-[#6b3212]/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#232930]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-[#232930] rounded" />
              <div className="h-7 w-16 bg-[#232930] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Distribution */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
          <div className="h-5 w-40 bg-[#232930] rounded mb-4" />
          <div className="h-3 w-full bg-[#232930] rounded-full mb-3" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-3 w-16 bg-[#232930] rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Lists */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg overflow-hidden">
          <div className="bg-[#232930] border-b border-[#6b3212]/40 p-4">
            <div className="h-5 w-40 bg-[#1a2027] rounded" />
          </div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#232930] rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-[#232930] rounded" />
                  <div className="h-3 w-3/4 bg-[#232930] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ============================================
// ERROR STATE
// ============================================

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-[#c95951]/20 flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#c95951]" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p className="text-[#d4c9ba] text-lg font-medium mb-2">Erreur de chargement</p>
    <p className="text-[#8f99a5] text-sm mb-6">{message || 'Impossible de récupérer les données du tableau de bord.'}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 transition-colors"
      >
        Réessayer
      </button>
    )}
  </div>
)

// ============================================
// ADMIN DASHBOARD PAGE
// ============================================

const AdminDashboard = () => {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats()
  const { data: recentActions, loading: actionsLoading } = useModerationActions({ page: 1, limit: 5 })
  const { data: pendingChars, loading: pendingLoading } = usePendingCharacters({ page: 1, limit: 3 })

  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Loading state
  if (statsLoading) {
    return <DashboardSkeleton />
  }

  // Error state
  if (statsError) {
    return <ErrorState message={statsError.message} onRetry={refetchStats} />
  }

  // Extract data
  const users = stats?.users || {}
  const characters = stats?.characters || {}
  const forum = stats?.forum || {}
  const moderation = stats?.moderation || {}
  const recentUsers = stats?.recentUsers || []

  // Distribution data
  const roleItems = Object.entries(users.byRole || {}).map(([role, count]) => ({
    label: ROLE_CONFIG[role]?.label || role,
    value: count,
    color: ROLE_CONFIG[role]?.color || '#8f99a5',
  }))

  const statusItems = Object.entries(characters.byStatus || {}).map(([status, count]) => ({
    label: STATUS_CONFIG[status]?.label || status,
    value: count,
    color: STATUS_CONFIG[status]?.color || '#8f99a5',
  }))

  const actionItems = recentActions?.items || recentActions || []
  const pendingCharList = pendingChars?.items || pendingChars || []

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#ff9635] to-[#c95951]" />
          <h1 className="text-2xl lg:text-3xl font-subheading text-[#d4c9ba] uppercase tracking-wide">
            Tableau de bord
          </h1>
        </div>
        <p className="text-[#8f99a5] text-sm ml-4 capitalize">{dateStr}</p>
      </header>

      {/* Stat cards grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Utilisateurs"
          value={users.total || 0}
          icon={<IconUsers />}
          variant="users"
          trend={users.active != null ? { value: Math.round((users.active / (users.total || 1)) * 100), direction: 'up' } : undefined}
        />
        <StatCard
          label="Personnages"
          value={characters.total || 0}
          icon={<IconShield />}
          variant="characters"
          trend={characters.byStatus?.pending ? { value: characters.byStatus.pending, direction: 'up' } : undefined}
        />
        <StatCard
          label="Sujets forum"
          value={forum.totalTopics || 0}
          icon={<IconChat />}
          variant="forum"
        />
        <StatCard
          label="Signalements"
          value={moderation.pendingReports || 0}
          icon={<IconFlag />}
          variant="moderation"
          trend={moderation.activeSanctions ? { value: moderation.activeSanctions, direction: 'up' } : undefined}
        />
      </section>

      {/* Distribution charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role distribution */}
        <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
          <SectionHeader title="Répartition des rôles" color="#5b8fb9" />
          <DistributionBar items={roleItems} total={users.total || 0} />
        </div>

        {/* Character status distribution */}
        <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
          <SectionHeader title="Statuts des personnages" color="#6b9664" />
          <DistributionBar items={statusItems} total={characters.total || 0} />
        </div>
      </section>

      {/* Forum overview bar */}
      {(forum.totalTopics > 0 || forum.totalPosts > 0) && (
        <section className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
          <SectionHeader title="Activité forum" color="#ff9635" linkTo="/admin/forum" linkLabel="Gérer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#232930] rounded-md border border-[#6b3212]/20">
              <p className="text-2xl font-subheading text-[#d4c9ba] tabular-nums">
                {(forum.totalTopics || 0).toLocaleString('fr-FR')}
              </p>
              <p className="text-xs text-[#8f99a5] uppercase tracking-wide mt-1">Sujets</p>
            </div>
            <div className="text-center p-4 bg-[#232930] rounded-md border border-[#6b3212]/20">
              <p className="text-2xl font-subheading text-[#d4c9ba] tabular-nums">
                {(forum.totalPosts || 0).toLocaleString('fr-FR')}
              </p>
              <p className="text-xs text-[#8f99a5] uppercase tracking-wide mt-1">Messages</p>
            </div>
            <div className="text-center p-4 bg-[#232930] rounded-md border border-[#6b3212]/20">
              <p className="text-2xl font-subheading text-[#d4c9ba] tabular-nums">
                {forum.totalTopics > 0 ? (forum.totalPosts / forum.totalTopics).toFixed(1) : '0'}
              </p>
              <p className="text-xs text-[#8f99a5] uppercase tracking-wide mt-1">Msg/sujet</p>
            </div>
            <div className="text-center p-4 bg-[#232930] rounded-md border border-[#6b3212]/20">
              <div className="flex items-center justify-center gap-1.5">
                <div className={[
                  'w-2 h-2 rounded-full animate-pulse',
                  moderation.pendingReports > 0 ? 'bg-[#c95951]' : 'bg-[#6b9664]',
                ].join(' ')} />
                <p className="text-2xl font-subheading text-[#d4c9ba] tabular-nums">
                  {moderation.pendingReports || 0}
                </p>
              </div>
              <p className="text-xs text-[#8f99a5] uppercase tracking-wide mt-1">Signalements</p>
            </div>
          </div>
        </section>
      )}

      {/* Quick lists */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent users */}
        <RecentUsersList users={recentUsers} />

        {/* Recent moderation actions */}
        <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg overflow-hidden">
          <div className="bg-[#232930] border-b border-[#6b3212]/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#d4c9ba] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                <span className="text-[#c95951]"><IconFlag /></span>
                Actions de modération
              </h3>
              <span className="text-[#64707e] text-xs font-mono">5 dernières</span>
            </div>
          </div>

          {actionsLoading ? (
            <div className="p-4 space-y-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#232930] rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-[#232930] rounded" />
                    <div className="h-3 w-3/4 bg-[#232930] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : actionItems.length > 0 ? (
            <div>
              {actionItems.map((action) => (
                <ModerationActionRow
                  key={action.id}
                  action={action}
                  onUserClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#6b9664]/20 flex items-center justify-center text-[#6b9664]">
                <IconCheckCircle />
              </div>
              <p className="text-[#8f99a5] text-sm">Aucune action récente</p>
            </div>
          )}

          <div className="bg-[#232930] border-t border-[#6b3212]/40 p-3">
            <Link
              to="/admin/journal"
              className="text-xs text-[#c95951] hover:text-[#ff9635] transition-colors flex items-center justify-center gap-1"
            >
              <span>Voir le journal complet</span>
              <IconArrowRight />
            </Link>
          </div>
        </div>

        {/* Pending characters */}
        <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg overflow-hidden">
          <div className="bg-[#232930] border-b border-[#6b3212]/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#d4c9ba] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                <span className="text-[#6b9664]"><IconShield /></span>
                Personnages en attente
              </h3>
              {pendingCharList.length > 0 && (
                <span className="text-xs font-bold text-[#ff9635] bg-[#ff9635]/15 px-2 py-0.5 rounded-full border border-[#ff9635]/30">
                  {pendingCharList.length}
                </span>
              )}
            </div>
          </div>

          {pendingLoading ? (
            <div className="p-4 space-y-3 animate-pulse">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-[#232930] rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-[#232930] rounded" />
                    <div className="h-3 w-20 bg-[#232930] rounded" />
                    <div className="h-3 w-full bg-[#232930] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : pendingCharList.length > 0 ? (
            <div className="p-4 space-y-4">
              {pendingCharList.map((character) => (
                <CharacterApprovalCard
                  key={character.id}
                  character={character}
                  onApprove={() => {}}
                  onReject={() => {}}
                  onView={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#6b9664]/20 flex items-center justify-center text-[#6b9664]">
                <IconCheckCircle />
              </div>
              <p className="text-[#8f99a5] text-sm">Aucun personnage en attente</p>
              <p className="text-[#64707e] text-xs mt-1">Tous les personnages ont été traités</p>
            </div>
          )}

          <div className="bg-[#232930] border-t border-[#6b3212]/40 p-3">
            <Link
              to="/admin/personnages"
              className="text-xs text-[#6b9664] hover:text-[#ff9635] transition-colors flex items-center justify-center gap-1"
            >
              <span>Voir tous les personnages</span>
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

AdminDashboard.displayName = 'AdminDashboard'

export default AdminDashboard
export { AdminDashboard }
