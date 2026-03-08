import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useAdminForumCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
  useMoveTopic,
  useMergeTopics,
  useCategoryPermissions,
  useAddCategoryPermission,
  useRemoveCategoryPermission,
} from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
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

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ============================================
// TREE UTILITIES
// ============================================

/**
 * Construit un arbre à partir de la liste plate de catégories.
 * Retourne les racines (parentId === null) avec children imbriqués.
 */
const buildTree = (flatCategories) => {
  const map = {};
  const roots = [];

  // Créer une copie avec children vide pour chaque catégorie
  flatCategories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });

  // Rattacher chaque catégorie à son parent
  flatCategories.forEach(cat => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  // Trier par displayOrder à chaque niveau
  const sortChildren = (nodes) => {
    nodes.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    nodes.forEach(node => sortChildren(node.children));
  };
  sortChildren(roots);

  return roots;
};

/**
 * Aplatit l'arbre pour le dropdown parent avec indentation textuelle.
 */
const flattenTreeForSelect = (tree, depth = 0) => {
  const result = [];
  tree.forEach(node => {
    const prefix = depth > 0 ? '\u00A0\u00A0'.repeat(depth) + '└ ' : '';
    result.push({ id: node.id, label: prefix + node.name, depth });
    if (node.children?.length > 0) {
      result.push(...flattenTreeForSelect(node.children, depth + 1));
    }
  });
  return result;
};

/**
 * Retourne tous les IDs descendants d'une catégorie (pour exclure du select parent).
 */
const getDescendantIds = (categoryId, flatCategories) => {
  const ids = new Set();
  const collect = (parentId) => {
    flatCategories.forEach(cat => {
      if (cat.parentId === parentId && !ids.has(cat.id)) {
        ids.add(cat.id);
        collect(cat.id);
      }
    });
  };
  collect(categoryId);
  return ids;
};

// ============================================
// PERMISSION LABELS
// ============================================

const PERMISSION_LABELS = {
  access_category: 'Accéder à la catégorie',
  edit_category: 'Modifier la catégorie',
  create_subcategory: 'Créer une sous-catégorie',
  move_category: 'Déplacer la catégorie',
  create_topic: 'Créer un sujet',
  edit_topic: 'Modifier un sujet',
  move_topic: 'Déplacer un sujet',
  merge_topic: 'Fusionner des sujets',
};

const GRANTEE_LABELS = {
  public: 'Tout le monde (public)',
  player: 'Joueurs (PLAYER)',
  player_accepted_rules: 'Joueurs (règlement accepté)',
  player_with_character: 'Joueurs (avec personnage)',
  player_character_faction: 'Faction spécifique',
  player_character_clan: 'Clan spécifique',
  specific_user: 'Utilisateur spécifique',
  specific_character: 'Personnage spécifique',
  game_master: 'Maîtres du jeu (GAME_MASTER)',
  moderator: 'Modérateurs (MODERATOR)',
};

const GRANTEE_REQUIRES_ID = ['player_character_faction', 'player_character_clan', 'specific_user', 'specific_character'];

const GRANTEE_ID_LABELS = {
  player_character_faction: 'ID de la faction',
  player_character_clan: 'ID du clan',
  specific_user: 'UUID de l\'utilisateur',
  specific_character: 'UUID du personnage',
};

// ============================================
// CATEGORY PERMISSION EDITOR
// ============================================

const CategoryPermissionEditor = ({ categoryId }) => {
  const [newPermission, setNewPermission] = useState('access_category');
  const [newGranteeType, setNewGranteeType] = useState('public');
  const [newGranteeId, setNewGranteeId] = useState('');
  const [permError, setPermError] = useState(null);

  const { data: permData, loading: permLoading, refetch: refetchPerms } = useCategoryPermissions(categoryId);

  const { mutate: addMutate, loading: addLoading } = useAddCategoryPermission({
    onSuccess: () => {
      setNewGranteeId('');
      setPermError(null);
      refetchPerms();
    },
    onError: (err) => {
      setPermError(err?.response?.data?.message || err?.message || 'Erreur lors de l\'ajout');
    },
  });

  const { mutate: removeMutate } = useRemoveCategoryPermission({
    onSuccess: () => {
      setPermError(null);
      refetchPerms();
    },
    onError: (err) => {
      setPermError(err?.response?.data?.message || err?.message || 'Erreur lors de la suppression');
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const requiresId = GRANTEE_REQUIRES_ID.includes(newGranteeType);
    if (requiresId && !newGranteeId.trim()) {
      setPermError('L\'identifiant de la cible est requis pour ce type');
      return;
    }
    setPermError(null);
    addMutate({
      categoryId,
      data: {
        permission: newPermission,
        granteeType: newGranteeType,
        granteeId: requiresId ? newGranteeId.trim() : undefined,
      },
    });
  };

  const handleRemove = (permId) => {
    removeMutate({ categoryId, permissionId: permId });
  };

  const directPerms = permData?.direct || [];
  const inheritedPerms = permData?.inherited || [];
  const requiresId = GRANTEE_REQUIRES_ID.includes(newGranteeType);

  if (permLoading && !permData) {
    return (
      <div className="flex items-center gap-2 py-4 text-[#8f99a5] text-sm">
        <div className="w-4 h-4 border-2 border-[#ff9635]/30 border-t-[#ff9635] rounded-full animate-spin" />
        Chargement des permissions...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {permError && (
        <div className="p-3 bg-[#c95951]/10 border border-[#c95951]/30 rounded-lg flex items-center justify-between">
          <p className="text-[#c95951] text-sm">{permError}</p>
          <button type="button" onClick={() => setPermError(null)} className="text-[#c95951] hover:text-[#c95951]/80 transition-colors">
            <IconX />
          </button>
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">Permission</label>
          <select value={newPermission} onChange={(e) => setNewPermission(e.target.value)}
            className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 transition-colors cursor-pointer">
            {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">Cible</label>
          <select value={newGranteeType} onChange={(e) => { setNewGranteeType(e.target.value); setNewGranteeId(''); }}
            className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm rounded-md focus:outline-none focus:border-[#ff9635]/60 transition-colors cursor-pointer">
            {Object.entries(GRANTEE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {requiresId && (
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5">
              {GRANTEE_ID_LABELS[newGranteeType]} <span className="text-[#c95951]">*</span>
            </label>
            <input type="text" value={newGranteeId} onChange={(e) => setNewGranteeId(e.target.value)}
              placeholder="ID / UUID"
              className="w-full px-3 py-2 bg-[#232930] border border-[#6b3212]/40 text-[#bba794] text-sm placeholder:text-[#64707e] rounded-md focus:outline-none focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/20 focus:ring-offset-0 transition-colors"
            />
          </div>
        )}

        <button type="submit" disabled={addLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {addLoading ? (
            <div className="w-4 h-4 border-2 border-[#ff9635]/30 border-t-[#ff9635] rounded-full animate-spin" />
          ) : (
            <IconPlus />
          )}
          Ajouter
        </button>
      </form>

      {directPerms.length > 0 && (
        <div>
          <h4 className="text-[#8f99a5] text-xs uppercase tracking-wide mb-2">Permissions directes ({directPerms.length})</h4>
          <div className="space-y-1">
            {directPerms.map((perm) => (
              <div key={perm.id} className="flex items-center gap-3 py-2 px-3 bg-[#232930]/60 border border-[#6b3212]/20 rounded-md text-sm">
                <span className="text-[#d4c9ba] font-medium min-w-[180px]">{PERMISSION_LABELS[perm.permission] || perm.permission}</span>
                <span className="text-[#bba794]">{GRANTEE_LABELS[perm.granteeType] || perm.granteeType}</span>
                {perm.granteeId && <span className="text-[#64707e] font-mono text-xs">{perm.granteeId}</span>}
                <div className="flex-1" />
                <button type="button" onClick={() => handleRemove(perm.id)}
                  className="p-1 rounded text-[#64707e] hover:text-[#c95951] hover:bg-[#c95951]/10 transition-colors" title="Supprimer">
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {inheritedPerms.length > 0 && (
        <div>
          <h4 className="text-[#64707e] text-xs uppercase tracking-wide mb-2">Permissions héritées ({inheritedPerms.length})</h4>
          <div className="space-y-1 opacity-60">
            {inheritedPerms.map((perm, idx) => (
              <div key={`inh-${idx}`} className="flex items-center gap-3 py-2 px-3 bg-[#232930]/30 border border-[#6b3212]/10 rounded-md text-sm">
                <span className="text-[#8f99a5] min-w-[180px]">{PERMISSION_LABELS[perm.permission] || perm.permission}</span>
                <span className="text-[#64707e]">{GRANTEE_LABELS[perm.granteeType] || perm.granteeType}</span>
                {perm.granteeId && <span className="text-[#64707e] font-mono text-xs">{perm.granteeId}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {directPerms.length === 0 && inheritedPerms.length === 0 && (
        <p className="text-[#64707e] text-sm py-2">
          Aucune permission définie. Sans permission, toutes les actions sont autorisées (rétrocompatibilité).
        </p>
      )}
    </div>
  );
};

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

  // Build tree for select and exclude self + descendants in edit mode
  const parentSelectOptions = useMemo(() => {
    const tree = buildTree(categories);
    const flatOptions = flattenTreeForSelect(tree);
    if (!isEdit) return flatOptions;
    const excludeIds = getDescendantIds(initialData?.id, categories);
    excludeIds.add(initialData?.id);
    return flatOptions.filter(opt => !excludeIds.has(opt.id));
  }, [categories, isEdit, initialData?.id]);

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
            {parentSelectOptions.map(opt => (
              <option key={opt.id} value={String(opt.id)}>{opt.label}</option>
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
// TOPIC ICONS
// ============================================

const IconMessageSquare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
    <path d="M12 17v5" /><path d="M9 10.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V16h14v-.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5.76z" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// ============================================
// TOPIC ROW (leaf node in tree)
// ============================================

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

const TopicRow = ({ topic, depth }) => (
  <div
    className="flex items-center gap-3 py-2 px-3 text-sm border-b border-[#6b3212]/10 last:border-b-0 hover:bg-[#232930]/40 transition-colors"
    style={{ marginLeft: depth * 24 }}
  >
    <span className="text-[#64707e]"><IconMessageSquare /></span>
    <span className="text-[#bba794] truncate flex-1 min-w-0">
      {topic.title}
    </span>

    {/* Indicators */}
    <div className="flex items-center gap-1.5 shrink-0">
      {topic.isPinned && (
        <span className="text-[#ff9635]" title="Épinglé"><IconPin /></span>
      )}
      {topic.isLocked && (
        <span className="text-[#c95951]" title="Verrouillé"><IconLock /></span>
      )}
    </div>

    {/* Author */}
    <span className="hidden md:inline text-[#64707e] text-xs shrink-0">
      {topic.author?.username || '—'}
    </span>

    {/* Stats */}
    <div className="hidden sm:flex items-center gap-3 text-xs text-[#64707e] shrink-0 tabular-nums">
      <span>{topic.postCount ?? 0} msg</span>
      <span>{topic.viewCount ?? 0} vues</span>
    </div>

    {/* Date */}
    <span className="hidden lg:inline text-[#64707e] text-xs shrink-0 tabular-nums">
      {formatDate(topic.createdAt)}
    </span>

    {/* ID badge */}
    <span className="text-[#64707e] text-xs font-mono shrink-0" title="ID du sujet">
      #{topic.id}
    </span>
  </div>
);

// ============================================
// CATEGORY TREE NODE (recursive)
// ============================================

const CategoryTreeNode = ({
  category,
  depth = 0,
  siblings,
  index,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  reorderLoading,
  showTopics = false,
  expandedIds,
  onToggleExpand,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const hasChildren = category.children?.length > 0;
  const hasTopics = showTopics && category.topics?.length > 0;
  const hasExpandableContent = hasChildren || hasTopics;
  const isExpanded = expandedIds.has(category.id);

  // Permissions effectives de l'utilisateur sur cette catégorie
  const perms = category.userPermissions || [];
  const canEditCategory = perms.includes('edit_category');
  const canMoveCategory = perms.includes('move_category');
  const hasAnyAction = canEditCategory || canMoveCategory;

  return (
    <>
      <div
        className="group flex items-center gap-3 p-3 bg-[#232930]/60 hover:bg-[#232930] border border-[#6b3212]/20 hover:border-[#6b3212]/40 border-l-2 border-l-transparent hover:border-l-[#ff9635]/50 rounded-lg transition-colors"
        style={{ marginLeft: depth * 24 }}
      >
        {/* Expand / collapse toggle */}
        <button
          type="button"
          onClick={() => hasExpandableContent && onToggleExpand(category.id)}
          disabled={!hasExpandableContent}
          className={`p-0.5 rounded transition-transform duration-150 ${
            hasExpandableContent
              ? 'text-[#bba794] hover:text-[#ff9635] cursor-pointer'
              : 'text-transparent cursor-default'
          } ${isExpanded ? 'rotate-90' : ''}`}
          aria-label={isExpanded ? 'Replier' : 'Déplier'}
        >
          <IconChevronRight />
        </button>

        {/* Order arrows */}
        {canMoveCategory && (
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => onMoveUp(category, siblings)}
              disabled={index === 0 || reorderLoading}
              className="p-0.5 rounded text-[#64707e] hover:text-[#ff9635] hover:bg-[#ff9635]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Monter"
            >
              <IconChevronUp />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(category, siblings)}
              disabled={index === siblings.length - 1 || reorderLoading}
              className="p-0.5 rounded text-[#64707e] hover:text-[#ff9635] hover:bg-[#ff9635]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Descendre"
            >
              <IconChevronDown />
            </button>
          </div>
        )}

        {/* Icon + Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={depth === 0 ? 'text-[#ff9635]/70' : 'text-[#ff9635]/40'}><IconFolder /></span>
            <span className="text-[#d4c9ba] font-medium text-sm truncate">{category.name}</span>
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

        {/* Children count indicator */}
        {hasChildren && (
          <span className="text-[#64707e] text-xs shrink-0" title="Sous-catégories">
            {category.children.length} sous-cat.
          </span>
        )}

        {/* Actions */}
        {hasAnyAction && (
          <div className="flex items-center gap-1 shrink-0">
            {canEditCategory && (
              <button
                type="button"
                onClick={() => onEdit(category)}
                className="p-1.5 rounded text-[#64707e] hover:text-[#ff9635] hover:bg-[#ff9635]/10 transition-colors"
                title="Modifier"
              >
                <IconEdit />
              </button>
            )}

            {canEditCategory && (
              confirmDelete ? (
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
              )
            )}
          </div>
        )}
      </div>

      {/* Recursive children + topics */}
      {hasExpandableContent && isExpanded && (
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute top-0 bottom-0 border-l border-[#6b3212]/30"
            style={{ left: depth * 24 + 20 }}
          />
          {/* Sub-categories */}
          {category.children?.map((child, childIndex) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              siblings={category.children}
              index={childIndex}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              reorderLoading={reorderLoading}
              showTopics={showTopics}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
          {/* Topics */}
          {hasTopics && category.topics.map(topic => (
            <TopicRow key={`t-${topic.id}`} topic={topic} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
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
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Refs ---
  const editFormRef = useRef(null);

  // --- Category state ---
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [defaultParentId, setDefaultParentId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showTopics, setShowTopics] = useState(false);

  // --- Topic tools state ---
  const [moveTopicId, setMoveTopicId] = useState('');
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [mergeSourceId, setMergeSourceId] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [topicMessage, setTopicMessage] = useState(null);

  // --- Auto-open create form from URL ?parentId=X ---
  useEffect(() => {
    const parentIdParam = searchParams.get('parentId');
    if (parentIdParam) {
      setDefaultParentId(Number(parentIdParam));
      setShowCreateForm(true);
      // Clean up the URL
      searchParams.delete('parentId');
      setSearchParams(searchParams, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Queries ---
  const { data: categoriesData, loading, error, refetch } = useAdminForumCategories({ includeTopics: showTopics });

  const categories = useMemo(() => {
    return categoriesData?.categories || [];
  }, [categoriesData]);

  // Permissions dérivées des données — pas de hardcode par rôle
  const canCreateCategory = useMemo(() => {
    return categories.some(c => c.userPermissions?.includes('create_subcategory'));
  }, [categories]);

  // --- Tree structure ---
  const categoryTree = useMemo(() => {
    const tree = buildTree(categories);
    // Auto-expand: parent categories + categories with topics when showTopics is on
    if (categories.length > 0) {
      setExpandedIds(prev => {
        const next = new Set(prev);
        categories.forEach(c => {
          // Always expand parent nodes
          if (categories.some(ch => ch.parentId === c.id)) next.add(c.id);
          // Expand categories with topics when showTopics is on
          if (showTopics && c.topics?.length > 0) next.add(c.id);
        });
        return next.size !== prev.size ? next : prev;
      });
    }
    return tree;
  }, [categories, showTopics]);

  const handleToggleExpand = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // --- Category mutations ---
  const { mutate: createMutate, loading: createLoading } = useCreateCategory({
    onSuccess: () => {
      setShowCreateForm(false);
      refetch();
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: err?.response?.data?.message || err?.message || 'Erreur lors de la création',
      });
    },
  });

  const { mutate: updateMutate, loading: updateLoading } = useUpdateCategory({
    onSuccess: () => {
      setEditingCategory(null);
      refetch();
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: err?.response?.data?.message || err?.message || 'Erreur lors de la modification',
      });
    },
  });

  const { mutate: deleteMutate } = useDeleteCategory({
    onSuccess: () => {
      setDeleteError(null);
      refetch();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression';
      setDeleteError(msg);
      addToast({ variant: 'error', title: 'Erreur', message: msg });
    },
  });

  const { mutate: reorderMutate, loading: reorderLoading } = useReorderCategories({
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        message: err?.response?.data?.message || err?.message || 'Erreur lors du réordonnement',
      });
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
      const msg = err?.response?.data?.message || err?.message || 'Erreur lors du déplacement';
      setTopicMessage({ type: 'error', text: msg });
      addToast({ variant: 'error', title: 'Erreur', message: msg });
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
      const msg = err?.response?.data?.message || err?.message || 'Erreur lors de la fusion';
      setTopicMessage({ type: 'error', text: msg });
      addToast({ variant: 'error', title: 'Erreur', message: msg });
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

  const handleMoveUp = useCallback((category, siblings) => {
    const idx = siblings.findIndex(s => s.id === category.id);
    if (idx <= 0) return;
    const reordered = [...siblings];
    [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
    const updates = reordered.map((cat, i) => ({ id: cat.id, displayOrder: i }));
    reorderMutate(updates);
  }, [reorderMutate]);

  const handleMoveDown = useCallback((category, siblings) => {
    const idx = siblings.findIndex(s => s.id === category.id);
    if (idx >= siblings.length - 1) return;
    const reordered = [...siblings];
    [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
    const updates = reordered.map((cat, i) => ({ id: cat.id, displayOrder: i }));
    reorderMutate(updates);
  }, [reorderMutate]);

  const handleStartEdit = useCallback((category) => {
    setEditingCategory(category);
    setShowCreateForm(false);
    // Scroll vers le formulaire après le rendu
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
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

        {/* Toolbar: create button + topic toggle */}
        <div className="flex items-center gap-3 mb-4">
          {canCreateCategory && !showCreateForm && !editingCategory && (
            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 transition-colors"
            >
              <IconPlus />
              Nouvelle catégorie
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowTopics(prev => !prev)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
              showTopics
                ? 'bg-[#7ba5c9]/20 border-[#7ba5c9]/50 text-[#7ba5c9]'
                : 'bg-[#232930]/60 border-[#6b3212]/40 text-[#64707e] hover:text-[#8f99a5] hover:border-[#6b3212]/60'
            }`}
          >
            <IconMessageSquare />
            {showTopics ? 'Masquer les sujets' : 'Afficher les sujets'}
          </button>
        </div>

        {/* Create form */}
        {showCreateForm && (
          <div className="mb-4">
            <CategoryForm
              initialData={defaultParentId ? { parentId: defaultParentId } : undefined}
              onSubmit={handleCreateSubmit}
              onCancel={() => { setShowCreateForm(false); setDefaultParentId(null); }}
              loading={createLoading}
              categories={categories}
            />
          </div>
        )}

        {/* Edit form */}
        {editingCategory && (
          <div ref={editFormRef} className="mb-4 space-y-4">
            <CategoryForm
              initialData={editingCategory}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingCategory(null)}
              loading={updateLoading}
              categories={categories}
              isEdit
            />
            {isAdmin && (
              <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-5">
                <h3 className="text-[#d4c9ba] font-medium text-base mb-4">Permissions</h3>
                <CategoryPermissionEditor categoryId={editingCategory.id} />
              </div>
            )}
          </div>
        )}

        {/* Category tree */}
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
          <div className="space-y-1">
            {categoryTree.map((category, index) => (
              <CategoryTreeNode
                key={category.id}
                category={category}
                depth={0}
                siblings={categoryTree}
                index={index}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                reorderLoading={reorderLoading}
                showTopics={showTopics}
                expandedIds={expandedIds}
                onToggleExpand={handleToggleExpand}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
