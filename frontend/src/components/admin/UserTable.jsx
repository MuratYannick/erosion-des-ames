import { Pagination } from '@/components/ui/Pagination/Pagination'
import UserSanctionBadge from './UserSanctionBadge'

// ============================================
// ROLE CONFIG
// ============================================

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Admin',
    classes: 'bg-[#944210]/20 text-[#ff9635] border-[#944210]/40',
  },
  MODERATOR: {
    label: 'Modérateur',
    classes: 'bg-[#5b8fb9]/20 text-[#7ba5c9] border-[#5b8fb9]/40',
  },
  GAME_MASTER: {
    label: 'Maître de jeu',
    classes: 'bg-[#8b6fa8]/20 text-[#a890c0] border-[#8b6fa8]/40',
  },
  PLAYER: {
    label: 'Joueur',
    classes: 'bg-[#64707e]/20 text-[#8f99a5] border-[#64707e]/40',
  },
}

const SORTABLE_COLUMNS = [
  { key: 'username', label: 'Utilisateur' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' },
  { key: 'createdAt', label: 'Inscription' },
  { key: 'lastLoginAt', label: 'Dernière connexion' },
]

// ============================================
// INLINE ICONS
// ============================================

const SortIcon = ({ active, direction }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={[
      'inline-block ml-1 transition-transform duration-150',
      active ? 'opacity-100' : 'opacity-30',
      active && direction === 'DESC' ? 'rotate-180' : '',
    ].join(' ')}
    aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const IconBan = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
  </svg>
)

const IconMute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)

const IconRole = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

// ============================================
// HELPERS
// ============================================

function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function getStatusInfo(user) {
  const hasBan = user.sanctions?.some(s => s.type === 'ban')
  const hasMute = user.sanctions?.some(s => s.type === 'mute')
  if (hasBan) return { color: 'bg-[#c95951]', glow: 'shadow-[0_0_6px_rgba(201,89,81,0.6)]', label: 'Banni' }
  if (hasMute) return { color: 'bg-[#ff9635]', glow: 'shadow-[0_0_6px_rgba(255,150,53,0.6)]', label: 'Muet' }
  if (user.isActive) return { color: 'bg-[#6b9664]', glow: '', label: 'Actif' }
  return { color: 'bg-[#64707e]', glow: '', label: 'Inactif' }
}

// ============================================
// AVATAR
// ============================================

const UserAvatar = ({ user }) => {
  const initials = (user.username || '?').charAt(0).toUpperCase()

  return user.avatar ? (
    <img
      src={user.avatar}
      alt={user.username}
      className="w-10 h-10 rounded-full border-2 border-[#6b3212]/60 object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full border-2 border-[#6b3212]/60 bg-[#232930] flex items-center justify-center text-[#8f99a5] font-subheading text-sm">
      {initials}
    </div>
  )
}

// ============================================
// SKELETON ROW
// ============================================

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-[#232930] rounded w-3/4" />
      </td>
    ))}
  </tr>
)

// ============================================
// ROLE BADGE
// ============================================

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.PLAYER
  return (
    <span className={[
      'inline-flex items-center px-2.5 py-1 rounded-md border',
      'text-xs font-medium uppercase tracking-wide font-ui',
      config.classes,
    ].join(' ')}>
      {config.label}
    </span>
  )
}

// ============================================
// ACTION BUTTON
// ============================================

const ActionButton = ({ icon, label, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={[
      'p-2 rounded-md bg-[#232930] border border-[#6b3212]/40',
      'text-[#bba794] hover:border-[#ff9635]/60 hover:text-[#ff9635]',
      'hover:shadow-[0_0_8px_rgba(255,150,53,0.2)]',
      'transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none',
    ].join(' ')}
    aria-label={label}
    title={label}
  >
    {icon}
  </button>
)

// ============================================
// MOBILE CARD
// ============================================

const UserMobileCard = ({ user, onUserClick, onBan, onMute, onChangeRole, showSanctions = true }) => {
  const statusInfo = getStatusInfo(user)

  return (
    <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onUserClick?.(user.id)}
            className="text-[#d4c9ba] text-sm font-medium hover:text-[#ff9635] transition-colors truncate block"
          >
            {user.username}
          </button>
          <p className="text-[#8f99a5] text-xs truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} ${statusInfo.glow}`}
            title={statusInfo.label} />
          <RoleBadge role={user.role} />
        </div>
      </div>

      {/* Sanctions */}
      {user.sanctions?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {user.sanctions.map((s, i) => (
            <UserSanctionBadge key={i} type={s.type} expiresAt={s.expiresAt} />
          ))}
        </div>
      )}

      {/* Meta + Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#6b3212]/20">
        <span className="text-[#64707e] text-xs tabular-nums">
          Inscrit le {formatDate(user.createdAt)}
        </span>
        <div className="flex gap-1">
          <ActionButton icon={<IconRole />} label="Changer le rôle" onClick={() => onChangeRole?.(user)} />
          {showSanctions && <ActionButton icon={<IconBan />} label="Bannir" onClick={() => onBan?.(user)} />}
          {showSanctions && <ActionButton icon={<IconMute />} label="Muter" onClick={() => onMute?.(user)} />}
        </div>
      </div>
    </div>
  )
}

// ============================================
// USER TABLE
// ============================================

const UserTable = ({
  users = [],
  loading = false,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onUserClick,
  onBan,
  onMute,
  onChangeRole,
  showSanctions = true,
  className = '',
}) => {
  const handleSort = (columnKey) => {
    onSort?.(columnKey)
  }

  // Mobile layout
  const mobileView = (
    <div className="md:hidden space-y-3">
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#232930]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#232930] rounded w-1/2" />
                <div className="h-3 bg-[#232930] rounded w-3/4" />
              </div>
            </div>
          </div>
        ))
      ) : users.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[#64707e] text-sm">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        users.map((user) => (
          <UserMobileCard
            key={user.id}
            user={user}
            onUserClick={onUserClick}
            onBan={onBan}
            onMute={onMute}
            onChangeRole={onChangeRole}
            showSanctions={showSanctions}
          />
        ))
      )}
    </div>
  )

  // Desktop layout
  const desktopView = (
    <div className="hidden md:block bg-[#1a2027] border border-[#6b3212]/40 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#232930] border-b-2 border-[#6b3212]/60">
              {SORTABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-4 py-3 text-left',
                    'text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold',
                    'cursor-pointer hover:text-[#ff9635] transition-colors duration-150 select-none',
                  ].join(' ')}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon active={sortBy === col.key} direction={sortOrder} />
                </th>
              ))}
              <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-[#64707e] text-sm">Aucun utilisateur trouvé</p>
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const statusInfo = getStatusInfo(user)

                return (
                  <tr
                    key={user.id}
                    className={[
                      index % 2 === 0 ? 'bg-[#1a2027]' : 'bg-[#1d2229]',
                      'border-b border-[#6b3212]/20',
                      'hover:bg-[#232930] transition-colors duration-150',
                    ].join(' ')}
                  >
                    {/* Username + Avatar */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <button
                          type="button"
                          onClick={() => onUserClick?.(user.id)}
                          className="text-[#d4c9ba] text-sm font-medium hover:text-[#ff9635] transition-colors cursor-pointer"
                        >
                          {user.username}
                        </button>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 text-[#8f99a5] text-sm">{user.email}</td>

                    {/* Role */}
                    <td className="px-4 py-4"><RoleBadge role={user.role} /></td>

                    {/* Registration */}
                    <td className="px-4 py-4 text-[#8f99a5] text-sm tabular-nums">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Last login */}
                    <td className="px-4 py-4 text-[#8f99a5] text-sm tabular-nums">
                      {formatDate(user.lastLoginAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusInfo.color} ${statusInfo.glow}`}
                          title={statusInfo.label}
                        />
                        {user.sanctions?.map((s, i) => (
                          <UserSanctionBadge key={i} type={s.type} expiresAt={s.expiresAt} />
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex gap-1 justify-end">
                        <ActionButton
                          icon={<IconRole />}
                          label="Changer le rôle"
                          onClick={() => onChangeRole?.(user)}
                        />
                        {showSanctions && (
                          <ActionButton
                            icon={<IconBan />}
                            label="Bannir"
                            onClick={() => onBan?.(user)}
                          />
                        )}
                        {showSanctions && (
                          <ActionButton
                            icon={<IconMute />}
                            label="Muter"
                            onClick={() => onMute?.(user)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className={className}>
      {mobileView}
      {desktopView}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-[#8f99a5] text-sm font-ui">
            {pagination.total} utilisateur{pagination.total > 1 ? 's' : ''}
          </span>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            showInfo
          />
        </div>
      )}
    </div>
  )
}

UserTable.displayName = 'UserTable'

export default UserTable
export { UserTable, RoleBadge, ROLE_CONFIG }
