import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  useAdminUser,
  useChangeUserRole,
  useBanUser,
  useUnbanUser,
  useMuteUser,
  useUnmuteUser,
  useUpdateUserStatus,
} from '@/hooks/useAdmin';
import {
  UserSanctionBadge,
  BanModal,
  MuteModal,
  RoleChangeModal,
  RoleBadge,
} from '@/components/admin';

// SectionHeader component for consistent section styling
const SectionHeader = ({ title, count, color = '#ff9635' }) => (
  <div className="mb-4">
    <div className="flex items-center gap-3 mb-2">
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
    <div
      className="h-px"
      style={{
        background: `linear-gradient(to right, ${color}60, ${color}20, transparent)`,
      }}
    />
  </div>
);

// Character status configuration (keys match lowercase DB values)
const CHARACTER_STATUS_CONFIG = {
  draft: {
    label: 'Brouillon',
    color: '#8f99a5',
  },
  submitted: {
    label: 'En attente',
    color: '#ff9635',
  },
  approved: {
    label: 'Approuvé',
    color: '#6b9664',
  },
  rejected: {
    label: 'Rejeté',
    color: '#c95951',
  },
};

// Format date to French locale
const formatDate = (dateString) => {
  if (!dateString) return 'Jamais';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const { isAdmin, isGameMaster } = useAuth();
  const canSanction = !isGameMaster;
  const { data, loading, error, refetch } = useAdminUser(id);

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);

  // Mutations (onSuccess at creation time)
  const { mutate: changeRole, loading: roleLoading } = useChangeUserRole({
    onSuccess: () => { setIsRoleModalOpen(false); refetch(); },
  });
  const { mutate: banUser, loading: banLoading } = useBanUser({
    onSuccess: () => { setIsBanModalOpen(false); refetch(); },
  });
  const { mutate: unbanUser, loading: unbanLoading } = useUnbanUser({
    onSuccess: () => refetch(),
  });
  const { mutate: muteUser, loading: muteLoading } = useMuteUser({
    onSuccess: () => { setIsMuteModalOpen(false); refetch(); },
  });
  const { mutate: unmuteUser, loading: unmuteLoading } = useUnmuteUser({
    onSuccess: () => refetch(),
  });
  const { mutate: updateStatus, loading: statusLoading } = useUpdateUserStatus({
    onSuccess: () => refetch(),
  });

  // Check for active sanctions (types are lowercase in DB)
  const hasActiveBan = data?.activeSanctions?.some((s) => s.type === 'ban' && s.isActive);
  const hasActiveMute = data?.activeSanctions?.some((s) => s.type === 'mute' && s.isActive);

  // Handlers
  const handleRoleChange = useCallback(
    (newRole) => {
      changeRole({ id, data: { role: newRole } });
    },
    [id, changeRole]
  );

  const handleBan = useCallback(
    (banData) => {
      banUser({ id, data: banData });
    },
    [id, banUser]
  );

  const handleUnban = useCallback(async () => {
    try {
      await unbanUser(id);
    } catch {
      // Error is already stored in mutation state
    }
  }, [id, unbanUser]);

  const handleMute = useCallback(
    (muteData) => {
      muteUser({ id, data: muteData });
    },
    [id, muteUser]
  );

  const handleUnmute = useCallback(async () => {
    try {
      await unmuteUser(id);
    } catch {
      // Error is already stored in mutation state
    }
  }, [id, unmuteUser]);

  const isActive = data?.user?.isActive;
  const handleToggleStatus = useCallback(async () => {
    try {
      await updateStatus({ id, data: { isActive: !isActive } });
    } catch {
      // Error is already stored in mutation state
    }
  }, [id, isActive, updateStatus]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Back link skeleton */}
        <div className="h-6 w-40 bg-[#232930] rounded animate-pulse" />

        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-[#232930] rounded animate-pulse" />
          <div className="h-1 w-full bg-[#232930] rounded animate-pulse" />
        </div>

        {/* Profile card skeleton */}
        <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#232930] animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-48 bg-[#232930] rounded animate-pulse" />
              <div className="h-5 w-64 bg-[#232930] rounded animate-pulse" />
              <div className="h-6 w-24 bg-[#232930] rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-16 bg-[#232930] rounded animate-pulse" />
            <div className="h-16 bg-[#232930] rounded animate-pulse" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4">
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-32 bg-[#232930] rounded animate-pulse" />
            <div className="h-10 w-32 bg-[#232930] rounded animate-pulse" />
            <div className="h-10 w-32 bg-[#232930] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/utilisateurs"
          className="inline-flex items-center gap-2 text-[#bba794] hover:text-[#ff9635] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>

        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 mb-4 text-[#c95951]">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg text-[#d4c9ba] mb-2">Erreur de chargement</p>
          <p className="text-[#8f99a5] mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#ff9635]/10 border border-[#ff9635]/40 text-[#ff9635] rounded hover:bg-[#ff9635]/20 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const { user, characters = [], activeSanctions = [], forumStats } = data || {};

  if (!user) {
    return null;
  }

  // Generate initials for avatar fallback
  const initials = user.username
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/admin/utilisateurs"
        className="inline-flex items-center gap-2 text-[#bba794] hover:text-[#ff9635] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #ff9635, #ff963580)' }}
          />
          <h1 className="text-2xl lg:text-3xl font-subheading text-[#d4c9ba] uppercase tracking-wide">
            Détail utilisateur
          </h1>
        </div>
        <div
          className="h-px"
          style={{ background: 'linear-gradient(to right, #ff963560, #ff963520, transparent)' }}
        />
      </div>

      {/* Profile card */}
      <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6 flex-col sm:flex-row">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-full border-2 border-[#6b3212]/60 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-[#6b3212]/60 bg-[#232930] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#8f99a5]">{initials}</span>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-subheading text-[#d4c9ba] mb-2 break-words">
              {user.username}
            </h2>
            <p className="text-[#bba794] mb-3 break-all">{user.email}</p>
            <div className="flex flex-wrap items-center gap-3">
              <RoleBadge role={user.role} />
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: user.isActive ? '#6b9664' : '#64707e',
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: user.isActive ? '#6b9664' : '#64707e',
                  }}
                >
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#6b3212]/40">
          <div className="bg-[#232930] rounded p-3">
            <div className="text-xs text-[#8f99a5] mb-1 uppercase tracking-wide">
              Inscrit le
            </div>
            <div className="text-[#d4c9ba] font-medium">{formatDate(user.createdAt)}</div>
          </div>
          <div className="bg-[#232930] rounded p-3">
            <div className="text-xs text-[#8f99a5] mb-1 uppercase tracking-wide">
              Dernière connexion
            </div>
            <div className="text-[#d4c9ba] font-medium">{formatDate(user.lastLoginAt)}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4">
        <div className="flex flex-wrap gap-3">
          {/* Change role */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            disabled={roleLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9635]/10 border border-[#ff9635]/40 text-[#ff9635] rounded hover:bg-[#ff9635]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Changer le rôle
          </button>

          {/* Ban/Unban */}
          {canSanction && (hasActiveBan ? (
            <button
              onClick={handleUnban}
              disabled={unbanLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6b9664]/10 border border-[#6b9664]/40 text-[#6b9664] rounded hover:bg-[#6b9664]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Débannir
            </button>
          ) : (
            <button
              onClick={() => setIsBanModalOpen(true)}
              disabled={banLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c95951]/10 border border-[#c95951]/40 text-[#c95951] rounded hover:bg-[#c95951]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Bannir
            </button>
          ))}

          {/* Mute/Unmute */}
          {canSanction && (hasActiveMute ? (
            <button
              onClick={handleUnmute}
              disabled={unmuteLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6b9664]/10 border border-[#6b9664]/40 text-[#6b9664] rounded hover:bg-[#6b9664]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              Démuter
            </button>
          ) : (
            <button
              onClick={() => setIsMuteModalOpen(true)}
              disabled={muteLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9635]/10 border border-[#ff9635]/40 text-[#ff9635] rounded hover:bg-[#ff9635]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
              Muter
            </button>
          ))}

          {/* Toggle active status */}
          {isAdmin && (
            <button
              onClick={handleToggleStatus}
              disabled={statusLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                user.isActive
                  ? 'bg-[#64707e]/10 border border-[#64707e]/40 text-[#64707e] hover:bg-[#64707e]/20'
                  : 'bg-[#6b9664]/10 border border-[#6b9664]/40 text-[#6b9664] hover:bg-[#6b9664]/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {user.isActive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              {user.isActive ? 'Désactiver le compte' : 'Activer le compte'}
            </button>
          )}
        </div>
      </div>

      {/* Active sanctions */}
      {activeSanctions.length > 0 && (
        <div>
          <SectionHeader title="Sanctions actives" color="#c95951" />
          <div className="space-y-3">
            {activeSanctions.map((sanction) => (
              <div
                key={sanction.id}
                className="bg-[#1a2027] border border-[#c95951]/40 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <UserSanctionBadge type={sanction.type} expiresAt={sanction.expiresAt} />
                  <div className="text-sm text-[#8f99a5]">
                    {formatDate(sanction.startsAt)}
                  </div>
                </div>
                <p className="text-[#bba794] mb-3">{sanction.reason}</p>
                <div className="flex items-center gap-2 text-sm text-[#8f99a5]">
                  <span>Émise par</span>
                  <span className="text-[#d4c9ba] font-medium">
                    {sanction.issuer?.username || 'Système'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Characters */}
      <div>
        <SectionHeader title="Personnages" count={characters.length} color="#6b9664" />
        {characters.length === 0 ? (
          <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-[#64707e]">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-[#8f99a5]">Aucun personnage</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map((character) => {
              const statusConfig = CHARACTER_STATUS_CONFIG[character.status] || { label: character.status, color: '#64707e' };
              return (
                <div
                  key={character.id}
                  className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-subheading text-[#d4c9ba] break-words">
                      {character.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: statusConfig.color }}
                      />
                      <span
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: statusConfig.color }}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-[#8f99a5]">
                    Créé le {formatDate(character.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forum stats */}
      {forumStats && (
        <div>
          <SectionHeader title="Activité forum" color="#ff9635" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-[#ff9635] mb-1">
                    {forumStats.topicCount}
                  </div>
                  <div className="text-sm text-[#bba794]">Sujets créés</div>
                </div>
                <div className="w-12 h-12 text-[#ff9635]/40">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-[#ff9635] mb-1">
                    {forumStats.postCount}
                  </div>
                  <div className="text-sm text-[#bba794]">Messages publiés</div>
                </div>
                <div className="w-12 h-12 text-[#ff9635]/40">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <RoleChangeModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onConfirm={handleRoleChange}
        user={user}
        loading={roleLoading}
      />

      {canSanction && (
        <BanModal
          isOpen={isBanModalOpen}
          onClose={() => setIsBanModalOpen(false)}
          onConfirm={handleBan}
          user={user}
          loading={banLoading}
        />
      )}

      {canSanction && (
        <MuteModal
          isOpen={isMuteModalOpen}
          onClose={() => setIsMuteModalOpen(false)}
          onConfirm={handleMute}
          user={user}
          loading={muteLoading}
        />
      )}
    </div>
  );
};

AdminUserDetail.displayName = 'AdminUserDetail';

export { AdminUserDetail };
export default AdminUserDetail;
