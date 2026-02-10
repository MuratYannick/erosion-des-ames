import { useState, useCallback } from 'react';
import {
  useAdminReports,
  useUserSanctions,
  useAdminReviewReport,
  useUnbanUser,
  useUnmuteUser,
} from '@/hooks/useAdmin';
import { UserSanctionBadge } from '@/components/admin';
import { Pagination } from '@/components/ui/Pagination/Pagination';

// ============================================
// CONSTANTS
// ============================================

const TABS = [
  { key: 'reports', label: 'Signalements en attente' },
  { key: 'sanctions', label: 'Sanctions actives' },
];

const REPORT_REASON_LABELS = {
  spam: 'Spam',
  offensive: 'Offensant',
  off_topic: 'Hors-sujet',
  other: 'Autre',
};

const REPORT_REASON_COLORS = {
  spam: { bg: 'bg-[#ff9635]/15', border: 'border-[#ff9635]/30', text: 'text-[#ff9635]' },
  offensive: { bg: 'bg-[#c95951]/15', border: 'border-[#c95951]/30', text: 'text-[#c95951]' },
  off_topic: { bg: 'bg-[#7ba5c9]/15', border: 'border-[#7ba5c9]/30', text: 'text-[#7ba5c9]' },
  other: { bg: 'bg-[#8f99a5]/15', border: 'border-[#8f99a5]/30', text: 'text-[#8f99a5]' },
};

// ============================================
// INLINE SVG ICONS
// ============================================

const IconFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1" />
  </svg>
);

const IconExternalLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconUndo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
);

// ============================================
// HELPERS
// ============================================

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function truncateText(text, maxLen = 120) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '…';
}

// ============================================
// LOADING SKELETON
// ============================================

const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="p-4 bg-[#232930]/60 border border-[#6b3212]/20 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#2a3038] rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#2a3038] rounded w-1/3" />
            <div className="h-3 bg-[#2a3038] rounded w-2/3" />
            <div className="h-3 bg-[#2a3038] rounded w-1/2" />
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="h-8 w-20 bg-[#2a3038] rounded" />
            <div className="h-8 w-20 bg-[#2a3038] rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================
// REPORT CARD
// ============================================

const ReportCard = ({ report, onReview, onDismiss, loading }) => {
  const [showActions, setShowActions] = useState(false);
  const reasonConfig = REPORT_REASON_COLORS[report.reason] || REPORT_REASON_COLORS.other;
  const reasonLabel = REPORT_REASON_LABELS[report.reason] || report.reason;

  return (
    <div className="p-4 bg-[#232930]/60 hover:bg-[#232930] border border-[#6b3212]/20 hover:border-[#6b3212]/40 border-l-2 border-l-[#c95951]/40 rounded-lg transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Reporter info */}
        <div className="flex items-center gap-2 shrink-0">
          {report.reporter?.avatar ? (
            <img
              src={report.reporter.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#6b3212]/40"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1a2027] border border-[#6b3212]/40 flex items-center justify-center text-[#64707e]">
              <IconUser />
            </div>
          )}
          <div className="sm:hidden">
            <span className="text-[#bba794] text-sm font-medium">{report.reporter?.username || 'Inconnu'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="hidden sm:inline text-[#bba794] text-sm font-medium">
              {report.reporter?.username || 'Inconnu'}
            </span>
            <span className="text-[#64707e] text-xs">a signalé</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${reasonConfig.bg} ${reasonConfig.border} ${reasonConfig.text} border`}>
              {reasonLabel}
            </span>
            <span className="text-[#64707e] text-xs">
              {formatDateTime(report.createdAt)}
            </span>
          </div>

          {/* Post preview */}
          {report.post && (
            <div className="p-2.5 bg-[#1a2027] rounded border border-[#6b3212]/20 mb-2">
              <div className="flex items-center gap-2 mb-1">
                {report.post.topic && (
                  <a
                    href={`/forum/topics/${report.post.topic.slug || report.post.topic.id}`}
                    className="text-[#7ba5c9] text-xs hover:underline inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {report.post.topic.title}
                    <IconExternalLink />
                  </a>
                )}
              </div>
              <p className="text-[#8f99a5] text-xs leading-relaxed">
                {truncateText(report.post.content)}
              </p>
            </div>
          )}

          {/* Description */}
          {report.description && (
            <p className="text-[#8f99a5] text-xs italic">
              &laquo; {report.description} &raquo;
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!showActions ? (
            <button
              type="button"
              onClick={() => setShowActions(true)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#8f99a5] hover:text-[#d4c9ba] border border-[#6b3212]/40 hover:border-[#6b3212]/60 transition-colors"
            >
              Traiter
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onReview(report.id)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#6b9664]/20 border border-[#6b9664]/50 text-[#6b9664] hover:bg-[#6b9664]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Signalement justifié — contenu à traiter"
              >
                <IconCheck />
                Valider
              </button>
              <button
                type="button"
                onClick={() => onDismiss(report.id)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#c95951]/20 border border-[#c95951]/50 text-[#c95951] hover:bg-[#c95951]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Classer sans suite"
              >
                <IconX />
                Rejeter
              </button>
              <button
                type="button"
                onClick={() => setShowActions(false)}
                className="p-1.5 rounded text-[#64707e] hover:text-[#d4c9ba] transition-colors"
                title="Annuler"
              >
                <IconX />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SANCTION ROW
// ============================================

const SanctionRow = ({ sanction, onRevoke, loading }) => {
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const handleRevoke = () => {
    if (sanction.type === 'ban') {
      onRevoke('unban', sanction.userId);
    } else {
      onRevoke('unmute', sanction.userId);
    }
  };

  return (
    <div className="p-4 bg-[#232930]/60 hover:bg-[#232930] border border-[#6b3212]/20 hover:border-[#6b3212]/40 border-l-2 border-l-transparent hover:border-l-[#ff9635]/50 rounded-lg transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* User info */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          {sanction.user?.avatar ? (
            <img
              src={sanction.user.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#6b3212]/40"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1a2027] border border-[#6b3212]/40 flex items-center justify-center text-[#64707e]">
              <IconUser />
            </div>
          )}
          <span className="text-[#d4c9ba] text-sm font-medium truncate">
            {sanction.user?.username || 'Utilisateur inconnu'}
          </span>
        </div>

        {/* Sanction badge */}
        <UserSanctionBadge
          type={sanction.type}
          expiresAt={sanction.expiresAt}
          reason={sanction.reason}
        />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[#8f99a5] text-xs truncate" title={sanction.reason}>
            {truncateText(sanction.reason, 80)}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[#64707e] text-xs">
            <span>Par {sanction.issuer?.username || '—'}</span>
            <span>le {formatDate(sanction.startsAt)}</span>
            {sanction.expiresAt && (
              <span>expire le {formatDate(sanction.expiresAt)}</span>
            )}
            {!sanction.expiresAt && (
              <span className="text-[#c95951]/80">permanent</span>
            )}
          </div>
        </div>

        {/* Revoke action */}
        <div className="flex items-center gap-1 shrink-0">
          {confirmRevoke ? (
            <>
              <button
                type="button"
                onClick={handleRevoke}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <IconCheck />
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirmRevoke(false)}
                className="p-1.5 rounded text-[#64707e] hover:text-[#d4c9ba] transition-colors"
              >
                <IconX />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRevoke(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#8f99a5] hover:text-[#ff9635] border border-[#6b3212]/40 hover:border-[#ff9635]/40 transition-colors"
              title="Révoquer cette sanction"
            >
              <IconUndo />
              Révoquer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// EMPTY STATES
// ============================================

const EmptyState = ({ tab }) => {
  const config = tab === 'reports'
    ? { icon: <IconFlag />, title: 'Aucun signalement en attente', subtitle: 'Tous les signalements ont été traités' }
    : { icon: <IconShield />, title: 'Aucune sanction active', subtitle: 'Aucun utilisateur n\'est actuellement sanctionné' };

  return (
    <div className="text-center py-12 bg-[#232930]/30 rounded-lg border border-[#6b3212]/20">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#64707e]/15 flex items-center justify-center text-[#64707e]">
        {config.icon}
      </div>
      <p className="text-[#8f99a5] text-sm">{config.title}</p>
      <p className="text-[#64707e] text-xs mt-1">{config.subtitle}</p>
    </div>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reportsPage, setReportsPage] = useState(1);
  const [sanctionsPage, setSanctionsPage] = useState(1);

  // --- Queries ---
  const {
    data: reportsData,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useAdminReports(
    { page: reportsPage, limit: 15 },
    { enabled: activeTab === 'reports' }
  );

  const {
    data: sanctionsData,
    loading: sanctionsLoading,
    error: sanctionsError,
    refetch: refetchSanctions,
  } = useUserSanctions(
    { page: sanctionsPage, limit: 15, isActive: true },
    { enabled: activeTab === 'sanctions' }
  );

  // --- Mutations ---
  const { mutate: reviewMutate, loading: reviewLoading } = useAdminReviewReport({
    onSuccess: () => {
      refetchReports();
    },
  });

  const { mutate: unbanMutate, loading: unbanLoading } = useUnbanUser({
    onSuccess: () => {
      refetchSanctions();
    },
  });

  const { mutate: unmuteMutate, loading: unmuteLoading } = useUnmuteUser({
    onSuccess: () => {
      refetchSanctions();
    },
  });

  // --- Handlers ---
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleReviewReport = useCallback((reportId) => {
    reviewMutate({ id: reportId, data: { status: 'reviewed' } });
  }, [reviewMutate]);

  const handleDismissReport = useCallback((reportId) => {
    reviewMutate({ id: reportId, data: { status: 'dismissed' } });
  }, [reviewMutate]);

  const handleRevokeSanction = useCallback((action, userId) => {
    if (action === 'unban') {
      unbanMutate(userId);
    } else {
      unmuteMutate(userId);
    }
  }, [unbanMutate, unmuteMutate]);

  const handleReportsPageChange = useCallback((page) => {
    setReportsPage(page);
  }, []);

  const handleSanctionsPageChange = useCallback((page) => {
    setSanctionsPage(page);
  }, []);

  // --- Derived data ---
  const reports = reportsData?.items || [];
  const reportsPagination = {
    page: reportsData?.page || 1,
    totalPages: reportsData?.totalPages || 1,
    total: reportsData?.total || 0,
  };

  const sanctions = sanctionsData?.items || [];
  const sanctionsPagination = {
    page: sanctionsData?.page || 1,
    totalPages: sanctionsData?.totalPages || 1,
    total: sanctionsData?.total || 0,
  };

  const pendingCount = activeTab === 'reports' ? reportsPagination.total : null;
  const activeError = activeTab === 'reports' ? reportsError : sanctionsError;
  const revokeLoading = unbanLoading || unmuteLoading;

  // --- Error state ---
  if (activeError) {
    return (
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
        <p className="text-[#8f99a5] text-sm mb-6">
          {activeError?.message || 'Impossible de charger les données de modération.'}
        </p>
        <button
          type="button"
          onClick={() => activeTab === 'reports' ? refetchReports() : refetchSanctions()}
          className="px-5 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#ff9635] to-[#c95951]" />
          <h1 className="text-2xl lg:text-3xl font-subheading text-[#d4c9ba] uppercase tracking-wide">
            Modération
          </h1>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-1 flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const showBadge = tab.key === 'reports' && pendingCount > 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={[
                'px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-150 whitespace-nowrap',
                'flex items-center gap-2',
                isActive
                  ? 'bg-[#232930] text-[#ff9635] border border-[#ff9635]/40 shadow-[0_0_8px_rgba(255,150,53,0.15)]'
                  : 'text-[#8f99a5] hover:text-[#bba794] hover:bg-[#232930]/50 border border-transparent',
              ].join(' ')}
            >
              {tab.key === 'reports' ? <IconFlag /> : <IconShield />}
              {tab.label}
              {showBadge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#ff9635]/20 text-[#ff9635] border border-[#ff9635]/40">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================================================ */}
      {/* TAB: SIGNALEMENTS                                */}
      {/* ================================================ */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reportsLoading ? (
            <ListSkeleton rows={4} />
          ) : reports.length === 0 ? (
            <EmptyState tab="reports" />
          ) : (
            <>
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onReview={handleReviewReport}
                  onDismiss={handleDismissReport}
                  loading={reviewLoading}
                />
              ))}

              {reportsPagination.totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={reportsPagination.page}
                    totalPages={reportsPagination.totalPages}
                    onPageChange={handleReportsPageChange}
                  />
                </div>
              )}

              <p className="text-[#64707e] text-xs text-center">
                {reportsPagination.total} signalement{reportsPagination.total > 1 ? 's' : ''} en attente
              </p>
            </>
          )}
        </div>
      )}

      {/* ================================================ */}
      {/* TAB: SANCTIONS ACTIVES                           */}
      {/* ================================================ */}
      {activeTab === 'sanctions' && (
        <div className="space-y-3">
          {sanctionsLoading ? (
            <ListSkeleton rows={4} />
          ) : sanctions.length === 0 ? (
            <EmptyState tab="sanctions" />
          ) : (
            <>
              {sanctions.map((sanction) => (
                <SanctionRow
                  key={sanction.id}
                  sanction={sanction}
                  onRevoke={handleRevokeSanction}
                  loading={revokeLoading}
                />
              ))}

              {sanctionsPagination.totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={sanctionsPagination.page}
                    totalPages={sanctionsPagination.totalPages}
                    onPageChange={handleSanctionsPageChange}
                  />
                </div>
              )}

              <p className="text-[#64707e] text-xs text-center">
                {sanctionsPagination.total} sanction{sanctionsPagination.total > 1 ? 's' : ''} active{sanctionsPagination.total > 1 ? 's' : ''}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

AdminModeration.displayName = 'AdminModeration';

export { AdminModeration };
export default AdminModeration;
