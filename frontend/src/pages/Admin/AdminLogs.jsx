import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModerationActions } from '@/hooks/useAdmin';
import { ModerationActionRow, ACTION_CONFIG } from '@/components/admin';
import { Pagination } from '@/components/ui/Pagination/Pagination';

// ============================================
// CONSTANTS
// ============================================

const ACTION_TYPE_OPTIONS = [
  { value: '', label: 'Tous les types' },
  ...Object.entries(ACTION_CONFIG).map(([value, cfg]) => ({
    value,
    label: cfg.label,
  })),
];

// ============================================
// INLINE SVG ICONS
// ============================================

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconScroll = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// ============================================
// LOADING SKELETON
// ============================================

const LogsSkeleton = () => (
  <div className="animate-pulse rounded-lg overflow-hidden border border-[#6b3212]/40">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-[#6b3212]/20 bg-[#1a2027]">
        <div className="w-20 space-y-1 shrink-0">
          <div className="h-3 bg-[#2a3038] rounded w-full" />
          <div className="h-3 bg-[#2a3038] rounded w-2/3" />
        </div>
        <div className="w-8 h-8 bg-[#2a3038] rounded-full shrink-0" />
        <div className="h-4 bg-[#2a3038] rounded w-32" />
        <div className="w-8 h-8 bg-[#2a3038] rounded-full shrink-0" />
        <div className="h-4 bg-[#2a3038] rounded w-24" />
        <div className="flex-1">
          <div className="h-3 bg-[#2a3038] rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================
// MAIN PAGE
// ============================================

const AdminLogs = () => {
  const navigate = useNavigate();

  // --- Filter state ---
  const [actionType, setActionType] = useState('');
  const [moderatorId, setModeratorId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // --- Build params ---
  const params = {
    page,
    limit: 30,
    ...(actionType && { actionType }),
    ...(moderatorId.trim() && { moderatorId: moderatorId.trim() }),
    ...(targetUserId.trim() && { targetUserId: targetUserId.trim() }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data, loading, error, refetch } = useModerationActions(params);

  const actions = data?.items || [];
  const pagination = {
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    total: data?.total || 0,
  };

  const hasActiveFilters = actionType || moderatorId.trim() || targetUserId.trim() || startDate || endDate;

  // --- Handlers ---
  const handleResetFilters = useCallback(() => {
    setActionType('');
    setModeratorId('');
    setTargetUserId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleUserClick = useCallback((userId) => {
    navigate(`/admin/utilisateurs/${userId}`);
  }, [navigate]);

  const handleActionTypeChange = useCallback((e) => {
    setActionType(e.target.value);
    setPage(1);
  }, []);

  const handleModeratorIdChange = useCallback((e) => {
    setModeratorId(e.target.value);
    setPage(1);
  }, []);

  const handleTargetUserIdChange = useCallback((e) => {
    setTargetUserId(e.target.value);
    setPage(1);
  }, []);

  const handleStartDateChange = useCallback((e) => {
    setStartDate(e.target.value);
    setPage(1);
  }, []);

  const handleEndDateChange = useCallback((e) => {
    setEndDate(e.target.value);
    setPage(1);
  }, []);

  // --- Error state ---
  if (error) {
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
          {error?.message || 'Impossible de charger le journal de modération.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
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
            Journal de modération
          </h1>
        </div>
      </header>

      {/* Filter bar */}
      <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4">
        {/* Primary row: action type + toggle filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Action type filter */}
          <select
            value={actionType}
            onChange={handleActionTypeChange}
            className="flex-1 sm:flex-initial sm:min-w-[220px] px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 transition-colors cursor-pointer"
          >
            {ACTION_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Toggle advanced filters */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={[
              'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors',
              showFilters
                ? 'text-[#ff9635] border-[#ff9635]/40 bg-[#ff9635]/10'
                : 'text-[#8f99a5] border-[#6b3212]/40 hover:text-[#bba794] hover:border-[#6b3212]/60',
            ].join(' ')}
          >
            <IconFilter />
            Filtres avancés
          </button>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 text-[#8f99a5] text-sm hover:text-[#ff9635] border border-[#6b3212]/40 hover:border-[#ff9635]/40 rounded-md transition-colors whitespace-nowrap"
            >
              Réinitialiser
            </button>
          )}

          {/* Total count */}
          <span className="text-[#64707e] text-xs ml-auto whitespace-nowrap">
            {pagination.total} action{pagination.total > 1 ? 's' : ''}
          </span>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#6b3212]/20">
            {/* Moderator ID */}
            <div>
              <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                ID Modérateur
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64707e] pointer-events-none">
                  <IconSearch />
                </div>
                <input
                  type="text"
                  value={moderatorId}
                  onChange={handleModeratorIdChange}
                  placeholder="UUID..."
                  className="w-full pl-10 pr-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
                />
              </div>
            </div>

            {/* Target User ID */}
            <div>
              <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                ID Utilisateur cible
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64707e] pointer-events-none">
                  <IconSearch />
                </div>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={handleTargetUserIdChange}
                  placeholder="UUID..."
                  className="w-full pl-10 pr-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
                />
              </div>
            </div>

            {/* Start date */}
            <div>
              <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                Date début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors cursor-pointer"
              />
            </div>

            {/* End date */}
            <div>
              <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                Date fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Log list */}
      {loading ? (
        <LogsSkeleton />
      ) : actions.length === 0 ? (
        <div className="text-center py-12 bg-[#232930]/30 rounded-lg border border-[#6b3212]/20">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#64707e]/15 flex items-center justify-center text-[#64707e]">
            <IconScroll />
          </div>
          <p className="text-[#8f99a5] text-sm">Aucune action trouvée</p>
          {hasActiveFilters && (
            <p className="text-[#64707e] text-xs mt-1">Essayez de modifier ou réinitialiser les filtres</p>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg overflow-hidden border border-[#6b3212]/40">
            {actions.map((action) => (
              <ModerationActionRow
                key={action.id}
                action={action}
                onUserClick={handleUserClick}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

AdminLogs.displayName = 'AdminLogs';

export { AdminLogs };
export default AdminLogs;
