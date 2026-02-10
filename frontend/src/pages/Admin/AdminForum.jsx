import { useState, useCallback, useMemo } from 'react';
import {
  useAdminForumCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
  useMoveTopic,
  useMergeTopics,
} from '@/hooks/useAdmin';
import { MoveTopicModal } from '@/components/admin';

// ============================================
// INLINE SVG ICONS
// ============================================

const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const IconChevronUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconMove = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
    <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
    <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

const IconMerge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 009 9" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ============================================
// CATEGORY FORM (used inline for create/edit)
// ============================================

const EMPTY_FORM = {
  name: '',
  description: '',
  parentId: '',
  icon: '',
  isActive: true,
  isRp: false,
};

const CategoryForm = ({ initialData, onSubmit, onCancel, loading, categories = [], isEdit = false }) => {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        description: initialData.description || '',
        parentId: initialData.parentId ? String(initialData.parentId) : '',
        icon: initialData.icon || '',
        isActive: initialData.isActive ?? true,
        isRp: initialData.isRp ?? false,
      };
    }
    return { ...EMPTY_FORM };
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      parentId: form.parentId ? Number(form.parentId) : null,
      icon: form.icon.trim() || null,
      isActive: form.isActive,
      isRp: form.isRp,
    });
  };

  // Exclude self and own children from parent options
  const parentOptions = categories.filter(c => {
    if (!isEdit) return true;
    return c.id !== initialData?.id;
  });

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-5 space-y-4">
      <h3 className="text-[#d4c9ba] font-medium text-base">
        {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
            Nom <span className="text-[#c95951]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nom de la catégorie"
            className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
            required
          />
        </div>

        {/* Parent */}
        <div>
          <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
            Catégorie parente
          </label>
          <select
            value={form.parentId}
            onChange={(e) => handleChange('parentId', e.target.value)}
            className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 transition-colors cursor-pointer"
          >
            <option value="">Aucune (racine)</option>
            {parentOptions.map(cat => (
              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description de la catégorie (optionnel)"
          rows={2}
          className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Icon */}
        <div>
          <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
            Icône
          </label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            placeholder="URL ou classe"
            className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
          />
        </div>

        {/* isActive */}
        <label className="flex items-center gap-2 cursor-pointer self-end pb-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="w-4 h-4 rounded border-[#6b3212]/60 bg-[#232930] text-[#ff9635] focus:ring-[#ff9635]/30 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-[#bba794] text-sm">Active</span>
        </label>

        {/* isRp */}
        <label className="flex items-center gap-2 cursor-pointer self-end pb-2">
          <input
            type="checkbox"
            checked={form.isRp}
            onChange={(e) => handleChange('isRp', e.target.checked)}
            className="w-4 h-4 rounded border-[#6b3212]/60 bg-[#232930] text-[#ff9635] focus:ring-[#ff9635]/30 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-[#bba794] text-sm">Catégorie RP</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !form.name.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#ff9635]/30 border-t-[#ff9635] rounded-full animate-spin" />
          ) : (
            <IconCheck />
          )}
          {isEdit ? 'Enregistrer' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-sm text-[#8f99a5] hover:text-[#d4c9ba] border border-[#6b3212]/40 hover:border-[#6b3212]/60 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

// ============================================
// CATEGORY ROW
// ============================================

const CategoryRow = ({ category, index, total, onEdit, onDelete, onMoveUp, onMoveDown, reorderLoading }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group flex items-center gap-4 p-3 bg-[#232930]/60 hover:bg-[#232930] border border-[#6b3212]/20 hover:border-[#6b3212]/40 border-l-2 border-l-transparent hover:border-l-[#ff9635]/50 rounded-lg transition-colors">
      {/* Order arrows */}
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={index === 0 || reorderLoading}
          className="p-0.5 rounded text-[#64707e] hover:text-[#ff9635] hover:bg-[#ff9635]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Monter"
        >
          <IconChevronUp />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1 || reorderLoading}
          className="p-0.5 rounded text-[#64707e] hover:text-[#ff9635] hover:bg-[#ff9635]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Descendre"
        >
          <IconChevronDown />
        </button>
      </div>

      {/* Order number */}
      <span className="text-[#64707e] text-xs font-mono w-6 text-center shrink-0">
        {index + 1}
      </span>

      {/* Icon + Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[#ff9635]/70"><IconFolder /></span>
          <span className="text-[#d4c9ba] font-medium text-sm truncate">{category.name}</span>

          {category.parent && (
            <span className="text-[#64707e] text-xs shrink-0">
              dans {category.parent.name}
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-[#8f99a5] text-xs mt-0.5 truncate pl-7">{category.description}</p>
        )}
      </div>

      {/* Badges */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        {!category.isActive && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#c95951]/15 text-[#c95951] border border-[#c95951]/30">
            Inactive
          </span>
        )}
        {category.isRp && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#a890c0]/15 text-[#a890c0] border border-[#a890c0]/30">
            RP
          </span>
        )}
      </div>

      {/* Counts */}
      <div className="hidden sm:flex items-center gap-3 text-xs text-[#8f99a5] shrink-0">
        <span title="Sujets">{category.topicCount ?? 0} sujets</span>
        <span title="Posts">{category.postCount ?? 0} posts</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="p-1.5 rounded text-[#64707e] hover:text-[#ff9635] hover:bg-[#ff9635]/10 transition-colors"
          title="Modifier"
        >
          <IconEdit />
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDelete(category.id)}
              className="p-1.5 rounded text-[#c95951] hover:bg-[#c95951]/10 transition-colors text-xs font-medium"
              title="Confirmer la suppression"
            >
              <IconCheck />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="p-1.5 rounded text-[#64707e] hover:text-[#d4c9ba] transition-colors"
              title="Annuler"
            >
              <IconX />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded text-[#64707e] hover:text-[#c95951] hover:bg-[#c95951]/10 transition-colors"
            title="Supprimer"
          >
            <IconTrash />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// SECTION HEADER
// ============================================

const SectionHeader = ({ icon, title, count }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="text-[#ff9635]">{icon}</span>
    <h2 className="text-lg font-subheading text-[#d4c9ba] uppercase tracking-wide">{title}</h2>
    {count !== undefined && (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#ff9635]/15 text-[#ff9635] border border-[#ff9635]/30">
        {count}
      </span>
    )}
    <div className="flex-1 h-px bg-gradient-to-r from-[#6b3212]/40 to-transparent" />
  </div>
);

// ============================================
// LOADING SKELETON
// ============================================

const CategoriesSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 bg-[#232930]/60 border border-[#6b3212]/20 rounded-lg">
        <div className="w-6 h-10 bg-[#2a3038] rounded" />
        <div className="w-6 h-4 bg-[#2a3038] rounded" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 bg-[#2a3038] rounded w-1/3" />
          <div className="h-3 bg-[#2a3038] rounded w-2/3" />
        </div>
        <div className="h-4 bg-[#2a3038] rounded w-16" />
        <div className="h-4 bg-[#2a3038] rounded w-16" />
      </div>
    ))}
  </div>
);

// ============================================
// MAIN PAGE
// ============================================

const AdminForum = () => {
  // --- Category state ---
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // --- Topic tools state ---
  const [moveTopicId, setMoveTopicId] = useState('');
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [topicMessage, setTopicMessage] = useState(null);

  // --- Queries ---
  const { data: categoriesData, loading, error, refetch } = useAdminForumCategories();

  const categories = useMemo(() => {
    return categoriesData?.categories || [];
  }, [categoriesData]);

  // --- Category mutations ---
  const { mutate: createMutate, loading: createLoading } = useCreateCategory({
    onSuccess: () => {
      setShowCreateForm(false);
      refetch();
    },
  });

  const { mutate: updateMutate, loading: updateLoading } = useUpdateCategory({
    onSuccess: () => {
      setEditingCategory(null);
      refetch();
    },
  });

  const { mutate: deleteMutate } = useDeleteCategory({
    onSuccess: () => {
      setDeleteError(null);
      refetch();
    },
    onError: (err) => {
      setDeleteError(err?.response?.data?.message || err?.message || 'Erreur lors de la suppression');
    },
  });

  const { mutate: reorderMutate, loading: reorderLoading } = useReorderCategories({
    onSuccess: () => {
      refetch();
    },
  });

  // --- Topic mutations ---
  const { mutate: moveTopicMutate, loading: moveLoading } = useMoveTopic({
    onSuccess: (result) => {
      setMoveModalOpen(false);
      setMoveTopicId('');
      setTopicMessage({ type: 'success', text: result?.message || 'Sujet déplacé avec succès' });
      refetch();
    },
    onError: (err) => {
      setTopicMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Erreur lors du déplacement' });
    },
  });

  const { mutate: mergeMutate, loading: mergeLoading } = useMergeTopics({
    onSuccess: (result) => {
      setMergeSourceId('');
      setMergeTargetId('');
      setTopicMessage({ type: 'success', text: result?.message || 'Sujets fusionnés avec succès' });
      refetch();
    },
    onError: (err) => {
      setTopicMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Erreur lors de la fusion' });
    },
  });

  // --- Category handlers ---
  const handleCreateSubmit = useCallback((data) => {
    createMutate(data);
  }, [createMutate]);

  const handleEditSubmit = useCallback((data) => {
    if (editingCategory) {
      updateMutate({ id: editingCategory.id, data });
    }
  }, [editingCategory, updateMutate]);

  const handleDelete = useCallback((id) => {
    setDeleteError(null);
    deleteMutate(id);
  }, [deleteMutate]);

  const handleMoveUp = useCallback((index) => {
    if (index <= 0) return;
    const reordered = [...categories];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    const updates = reordered.map((cat, i) => ({ id: cat.id, displayOrder: i }));
    reorderMutate(updates);
  }, [categories, reorderMutate]);

  const handleMoveDown = useCallback((index) => {
    if (index >= categories.length - 1) return;
    const reordered = [...categories];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    const updates = reordered.map((cat, i) => ({ id: cat.id, displayOrder: i }));
    reorderMutate(updates);
  }, [categories, reorderMutate]);

  const handleStartEdit = useCallback((category) => {
    setEditingCategory(category);
    setShowCreateForm(false);
  }, []);

  const handleStartCreate = useCallback(() => {
    setShowCreateForm(true);
    setEditingCategory(null);
  }, []);

  // --- Topic handlers ---
  const handleOpenMoveModal = useCallback(() => {
    if (!moveTopicId.trim()) return;
    setTopicMessage(null);
    setMoveModalOpen(true);
  }, [moveTopicId]);

  const handleMoveConfirm = useCallback((categoryId) => {
    moveTopicMutate({ id: Number(moveTopicId), data: { categoryId } });
  }, [moveTopicId, moveTopicMutate]);

  const handleMerge = useCallback(() => {
    if (!mergeSourceId.trim() || !mergeTargetId.trim()) return;
    if (mergeSourceId === mergeTargetId) {
      setTopicMessage({ type: 'error', text: 'Les deux sujets doivent être différents' });
      return;
    }
    setTopicMessage(null);
    mergeMutate({
      sourceTopicId: Number(mergeSourceId),
      targetTopicId: Number(mergeTargetId),
    });
  }, [mergeSourceId, mergeTargetId, mergeMutate]);

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
          {error?.message || 'Impossible de charger les données du forum.'}
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
    <div className="space-y-8">
      {/* Page header */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#ff9635] to-[#c95951]" />
          <h1 className="text-2xl lg:text-3xl font-subheading text-[#d4c9ba] uppercase tracking-wide">
            Gestion du forum
          </h1>
        </div>
      </header>

      {/* ================================================ */}
      {/* SECTION: CATÉGORIES                              */}
      {/* ================================================ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader icon={<IconFolder />} title="Catégories" count={categories.length} />
        </div>

        {/* Delete error banner */}
        {deleteError && (
          <div className="mb-4 p-3 bg-[#c95951]/10 border border-[#c95951]/30 rounded-lg flex items-center justify-between">
            <p className="text-[#c95951] text-sm">{deleteError}</p>
            <button
              type="button"
              onClick={() => setDeleteError(null)}
              className="text-[#c95951] hover:text-[#c95951]/80 transition-colors"
            >
              <IconX />
            </button>
          </div>
        )}

        {/* Create button */}
        {!showCreateForm && !editingCategory && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 transition-colors"
          >
            <IconPlus />
            Nouvelle catégorie
          </button>
        )}

        {/* Create form */}
        {showCreateForm && (
          <div className="mb-4">
            <CategoryForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setShowCreateForm(false)}
              loading={createLoading}
              categories={categories}
            />
          </div>
        )}

        {/* Edit form */}
        {editingCategory && (
          <div className="mb-4">
            <CategoryForm
              initialData={editingCategory}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingCategory(null)}
              loading={updateLoading}
              categories={categories}
              isEdit
            />
          </div>
        )}

        {/* Category list */}
        {loading ? (
          <CategoriesSkeleton />
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-[#232930]/30 rounded-lg border border-[#6b3212]/20">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#64707e]/15 flex items-center justify-center text-[#64707e]">
              <IconFolder />
            </div>
            <p className="text-[#8f99a5] text-sm">Aucune catégorie créée</p>
            <p className="text-[#64707e] text-xs mt-1">Créez votre première catégorie pour organiser le forum</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <CategoryRow
                key={category.id}
                category={category}
                index={index}
                total={categories.length}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                reorderLoading={reorderLoading}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================================================ */}
      {/* SECTION: OUTILS SUJETS                           */}
      {/* ================================================ */}
      <section>
        <SectionHeader icon={<IconMove />} title="Outils sujets" />

        {/* Topic message */}
        {topicMessage && (
          <div className={`mb-4 p-3 rounded-lg border flex items-center justify-between ${
            topicMessage.type === 'success'
              ? 'bg-[#6b9664]/10 border-[#6b9664]/30 text-[#6b9664]'
              : 'bg-[#c95951]/10 border-[#c95951]/30 text-[#c95951]'
          }`}>
            <p className="text-sm">{topicMessage.text}</p>
            <button
              type="button"
              onClick={() => setTopicMessage(null)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <IconX />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Move topic */}
          <div className="bg-[#1a2027] border border-[#6b3212]/40 border-l-4 border-l-[#7ba5c9]/40 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#7ba5c9]"><IconMove /></span>
              <h3 className="text-[#d4c9ba] font-medium text-sm uppercase tracking-wide">
                Déplacer un sujet
              </h3>
            </div>
            <p className="text-[#8f99a5] text-xs mb-4">
              Entrez l'ID du sujet à déplacer, puis choisissez la catégorie de destination.
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                  ID du sujet
                </label>
                <input
                  type="number"
                  value={moveTopicId}
                  onChange={(e) => setMoveTopicId(e.target.value)}
                  placeholder="Ex: 42"
                  min="1"
                  className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleOpenMoveModal}
                disabled={!moveTopicId.trim()}
                className="px-4 py-2 rounded-md text-sm font-medium bg-[#7ba5c9]/20 border border-[#7ba5c9]/50 text-[#7ba5c9] hover:bg-[#7ba5c9]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Déplacer
              </button>
            </div>
          </div>

          {/* Merge topics */}
          <div className="bg-[#1a2027] border border-[#6b3212]/40 border-l-4 border-l-[#a890c0]/40 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#a890c0]"><IconMerge /></span>
              <h3 className="text-[#d4c9ba] font-medium text-sm uppercase tracking-wide">
                Fusionner deux sujets
              </h3>
            </div>
            <p className="text-[#8f99a5] text-xs mb-4">
              Les posts du sujet source seront déplacés vers le sujet cible. Le sujet source sera supprimé.
            </p>
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                  ID source (à supprimer)
                </label>
                <input
                  type="number"
                  value={mergeSourceId}
                  onChange={(e) => setMergeSourceId(e.target.value)}
                  placeholder="Ex: 10"
                  min="1"
                  className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
                  ID cible (conservé)
                </label>
                <input
                  type="number"
                  value={mergeTargetId}
                  onChange={(e) => setMergeTargetId(e.target.value)}
                  placeholder="Ex: 15"
                  min="1"
                  className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleMerge}
                disabled={!mergeSourceId.trim() || !mergeTargetId.trim() || mergeLoading}
                className="px-4 py-2 rounded-md text-sm font-medium bg-[#a890c0]/20 border border-[#a890c0]/50 text-[#a890c0] hover:bg-[#a890c0]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {mergeLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#a890c0]/30 border-t-[#a890c0] rounded-full animate-spin" />
                    Fusion...
                  </span>
                ) : (
                  'Fusionner'
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Move Topic Modal */}
      <MoveTopicModal
        isOpen={moveModalOpen}
        onClose={() => {
          setMoveModalOpen(false);
        }}
        onConfirm={handleMoveConfirm}
        topic={moveTopicId ? { id: Number(moveTopicId), title: `Sujet #${moveTopicId}` } : null}
        categories={categories}
        loading={moveLoading}
      />
    </div>
  );
};

AdminForum.displayName = 'AdminForum';

export { AdminForum };
export default AdminForum;
