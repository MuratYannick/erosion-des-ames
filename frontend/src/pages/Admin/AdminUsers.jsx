import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUsers, useBanUser, useMuteUser, useChangeUserRole } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { UserTable, BanModal, MuteModal, RoleChangeModal } from '@/components/admin';

const ROLE_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MODERATOR', label: 'Modérateur' },
  { value: 'GAME_MASTER', label: 'Maître de jeu' },
  { value: 'PLAYER', label: 'Joueur' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'true', label: 'Actifs' },
  { value: 'false', label: 'Inactifs' },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isGameMaster } = useAuth();
  const canSanction = !isGameMaster;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  const [selectedUser, setSelectedUser] = useState(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = {
    page,
    limit: 20,
    ...(role && { role }),
    ...(isActive && { isActive: isActive === 'true' }),
    ...(debouncedSearch && { search: debouncedSearch }),
    sortBy,
    sortOrder,
  };

  const { data, loading, error, refetch } = useAdminUsers(params);

  const { mutate: banMutate, loading: banLoading } = useBanUser({
    onSuccess: () => {
      setBanModalOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  const { mutate: muteMutate, loading: muteLoading } = useMuteUser({
    onSuccess: () => {
      setMuteModalOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  const { mutate: roleChangeMutate, loading: roleChangeLoading } = useChangeUserRole({
    onSuccess: () => {
      setRoleModalOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  const hasActiveFilters = search || role || isActive;

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setRole('');
    setIsActive('');
    setPage(1);
  }, []);

  const handleSort = useCallback((columnKey) => {
    if (columnKey === sortBy) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(columnKey);
      setSortOrder('ASC');
    }
    setPage(1);
  }, [sortBy]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleUserClick = useCallback((userId) => {
    navigate(`/admin/utilisateurs/${userId}`);
  }, [navigate]);

  const handleBan = useCallback((user) => {
    setSelectedUser(user);
    setBanModalOpen(true);
  }, []);

  const handleMute = useCallback((user) => {
    setSelectedUser(user);
    setMuteModalOpen(true);
  }, []);

  const handleChangeRole = useCallback((user) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  }, []);

  const handleBanConfirm = useCallback(({ reason, durationHours }) => {
    if (selectedUser) {
      banMutate({ id: selectedUser.id, data: { reason, durationHours } });
    }
  }, [selectedUser, banMutate]);

  const handleMuteConfirm = useCallback(({ reason, durationHours }) => {
    if (selectedUser) {
      muteMutate({ id: selectedUser.id, data: { reason, durationHours } });
    }
  }, [selectedUser, muteMutate]);

  const handleRoleChangeConfirm = useCallback((newRole) => {
    if (selectedUser) {
      roleChangeMutate({ id: selectedUser.id, data: { role: newRole } });
    }
  }, [selectedUser, roleChangeMutate]);

  const handleRoleFilterChange = useCallback((e) => {
    setRole(e.target.value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setIsActive(e.target.value);
    setPage(1);
  }, []);

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
          {error?.message || 'Impossible de charger les utilisateurs.'}
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
            Gestion des utilisateurs
          </h1>
        </div>
      </header>

      {/* Filter bar */}
      <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64707e] pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
            />
          </div>

          {/* Role filter */}
          <select
            value={role}
            onChange={handleRoleFilterChange}
            className="px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 transition-colors cursor-pointer"
          >
            {ROLE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={isActive}
            onChange={handleStatusFilterChange}
            className="px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 transition-colors cursor-pointer"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

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
        </div>
      </div>

      {/* User table */}
      <UserTable
        users={data?.items || []}
        loading={loading}
        pagination={{
          page: data?.page || 1,
          totalPages: data?.totalPages || 1,
          total: data?.total || 0,
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onUserClick={handleUserClick}
        onBan={canSanction ? handleBan : undefined}
        onMute={canSanction ? handleMute : undefined}
        onChangeRole={handleChangeRole}
        showSanctions={canSanction}
      />

      {canSanction && (
        <BanModal
          isOpen={banModalOpen}
          onClose={() => {
            setBanModalOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleBanConfirm}
          user={selectedUser}
          loading={banLoading}
        />
      )}

      {canSanction && (
        <MuteModal
          isOpen={muteModalOpen}
          onClose={() => {
            setMuteModalOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleMuteConfirm}
          user={selectedUser}
          loading={muteLoading}
        />
      )}

      <RoleChangeModal
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleRoleChangeConfirm}
        user={selectedUser}
        loading={roleChangeLoading}
      />
    </div>
  );
};

AdminUsers.displayName = 'AdminUsers';

export { AdminUsers };
export default AdminUsers;
