'use strict';

const { CategoryPermission, ForumCategory } = require('../../../models');

jest.mock('../../../models', () => ({
  CategoryPermission: {
    findAll: jest.fn(),
    PERMISSIONS: [
      'access_category',
      'edit_category',
      'create_subcategory',
      'move_category',
      'create_topic',
      'edit_topic',
      'move_topic',
      'merge_topic',
    ],
  },
  ForumCategory: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
}));

const {
  resolvePermissions,
  userHasPermission,
  getCategoryPermissionsForUser,
  hasPermissionOrNoRestrictions,
  invalidateCache,
} = require('../../../services/categoryPermissionService');

describe('categoryPermissionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Vider le cache avant chaque test
    invalidateCache(null);
  });

  describe('resolvePermissions', () => {
    it('devrait retourner les permissions directes d\'une categorie sans parent', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
        { permission: 'create_topic', granteeType: 'player', granteeId: null },
      ]);

      const result = await resolvePermissions(1);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          { permission: 'access_category', granteeType: 'public', granteeId: null },
          { permission: 'create_topic', granteeType: 'player', granteeId: null },
        ])
      );
    });

    it('devrait inclure les permissions heritees du parent', async () => {
      // Categorie 2 (enfant) -> Categorie 1 (parent, racine)
      ForumCategory.findByPk
        .mockResolvedValueOnce({ id: 2, parentId: 1 })
        .mockResolvedValueOnce({ id: 1, parentId: null });

      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
        { permission: 'edit_topic', granteeType: 'moderator', granteeId: null },
      ]);

      const result = await resolvePermissions(2);

      // findAll doit recevoir les deux IDs de la chaine
      expect(CategoryPermission.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId: [2, 1] },
        })
      );
      expect(result).toHaveLength(2);
    });

    it('devrait dedupliquer les permissions identiques', async () => {
      ForumCategory.findByPk
        .mockResolvedValueOnce({ id: 2, parentId: 1 })
        .mockResolvedValueOnce({ id: 1, parentId: null });

      // Meme permission sur parent et enfant
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      const result = await resolvePermissions(2);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        permission: 'access_category',
        granteeType: 'public',
        granteeId: null,
      });
    });

    it('devrait retourner un tableau vide si la categorie n\'existe pas', async () => {
      ForumCategory.findByPk.mockResolvedValue(null);

      const result = await resolvePermissions(999);

      expect(result).toEqual([]);
      expect(CategoryPermission.findAll).not.toHaveBeenCalled();
    });

    it('devrait utiliser le cache pour les appels repetes', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      // Premier appel
      await resolvePermissions(1);
      // Deuxieme appel (devrait utiliser le cache)
      await resolvePermissions(1);

      // findAll ne devrait etre appele qu'une seule fois
      expect(CategoryPermission.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait detecter les references circulaires', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Categorie 1 -> parent 2, Categorie 2 -> parent 1 (circulaire)
      ForumCategory.findByPk
        .mockResolvedValueOnce({ id: 1, parentId: 2 })
        .mockResolvedValueOnce({ id: 2, parentId: 1 });

      CategoryPermission.findAll.mockResolvedValue([]);

      await resolvePermissions(1);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Circular reference')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('userHasPermission', () => {
    beforeEach(() => {
      // Setup par defaut : categorie simple sans parent
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
    });

    it('devrait toujours accorder la permission aux ADMIN', async () => {
      CategoryPermission.findAll.mockResolvedValue([]);
      const admin = { id: 'admin-1', role: 'ADMIN' };

      const result = await userHasPermission(admin, 1, 'edit_category');

      expect(result).toBe(true);
      // resolvePermissions ne devrait pas etre appele pour un admin
      expect(CategoryPermission.findAll).not.toHaveBeenCalled();
    });

    it('devrait accorder la permission avec le grantee "public"', async () => {
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      const result = await userHasPermission(null, 1, 'access_category');
      expect(result).toBe(true);
    });

    it('devrait accorder "public" meme a un visiteur (user null)', async () => {
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      const result = await userHasPermission(null, 1, 'access_category');
      expect(result).toBe(true);
    });

    it('devrait refuser si aucune permission ne correspond', async () => {
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      const player = { id: 'user-1', role: 'PLAYER' };
      const result = await userHasPermission(player, 1, 'edit_category');
      expect(result).toBe(false);
    });

    describe('grantee "moderator"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'edit_topic', granteeType: 'moderator', granteeId: null },
        ]);
      });

      it('devrait accorder au MODERATOR', async () => {
        const mod = { id: 'mod-1', role: 'MODERATOR' };
        const result = await userHasPermission(mod, 1, 'edit_topic');
        expect(result).toBe(true);
      });

      it('devrait refuser au PLAYER', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'edit_topic');
        expect(result).toBe(false);
      });

      it('devrait refuser au GAME_MASTER', async () => {
        const gm = { id: 'gm-1', role: 'GAME_MASTER' };
        const result = await userHasPermission(gm, 1, 'edit_topic');
        expect(result).toBe(false);
      });
    });

    describe('grantee "game_master"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'edit_topic', granteeType: 'game_master', granteeId: null },
        ]);
      });

      it('devrait accorder au GAME_MASTER', async () => {
        const gm = { id: 'gm-1', role: 'GAME_MASTER' };
        const result = await userHasPermission(gm, 1, 'edit_topic');
        expect(result).toBe(true);
      });

      it('devrait refuser au PLAYER', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'edit_topic');
        expect(result).toBe(false);
      });
    });

    describe('grantee "player"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'create_topic', granteeType: 'player', granteeId: null },
        ]);
      });

      it('devrait accorder au PLAYER', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic');
        expect(result).toBe(true);
      });

      it('devrait accorder au GAME_MASTER (est aussi un joueur)', async () => {
        const gm = { id: 'gm-1', role: 'GAME_MASTER' };
        const result = await userHasPermission(gm, 1, 'create_topic');
        expect(result).toBe(true);
      });

      it('devrait accorder au MODERATOR (est aussi un joueur)', async () => {
        const mod = { id: 'mod-1', role: 'MODERATOR' };
        const result = await userHasPermission(mod, 1, 'create_topic');
        expect(result).toBe(true);
      });

      it('devrait refuser aux visiteurs (user null)', async () => {
        const result = await userHasPermission(null, 1, 'create_topic');
        expect(result).toBe(false);
      });
    });

    describe('grantee "player_accepted_rules"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'create_topic', granteeType: 'player_accepted_rules', granteeId: null },
        ]);
      });

      it('devrait accorder si le joueur a accepte les regles', async () => {
        const player = { id: 'user-1', role: 'PLAYER', hasAcceptedRules: true };
        const result = await userHasPermission(player, 1, 'create_topic');
        expect(result).toBe(true);
      });

      it('devrait refuser si le joueur n\'a pas accepte les regles', async () => {
        const player = { id: 'user-1', role: 'PLAYER', hasAcceptedRules: false };
        const result = await userHasPermission(player, 1, 'create_topic');
        expect(result).toBe(false);
      });
    });

    describe('grantee "player_with_character"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'create_topic', granteeType: 'player_with_character', granteeId: null },
        ]);
      });

      it('devrait accorder si le joueur a un personnage selectionne', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', { characterId: 'char-1' });
        expect(result).toBe(true);
      });

      it('devrait refuser si le joueur n\'a pas de personnage', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', {});
        expect(result).toBe(false);
      });
    });

    describe('grantee "player_character_faction"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'create_topic', granteeType: 'player_character_faction', granteeId: '5' },
        ]);
      });

      it('devrait accorder si la faction du personnage correspond', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', {
          characterId: 'char-1', factionId: 5,
        });
        expect(result).toBe(true);
      });

      it('devrait refuser si la faction ne correspond pas', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', {
          characterId: 'char-1', factionId: 3,
        });
        expect(result).toBe(false);
      });

      it('devrait refuser si aucun personnage selectionne', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', { factionId: 5 });
        expect(result).toBe(false);
      });
    });

    describe('grantee "player_character_clan"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'create_topic', granteeType: 'player_character_clan', granteeId: '10' },
        ]);
      });

      it('devrait accorder si le clan du personnage correspond', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', {
          characterId: 'char-1', clanId: 10,
        });
        expect(result).toBe(true);
      });

      it('devrait refuser si le clan ne correspond pas', async () => {
        const player = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(player, 1, 'create_topic', {
          characterId: 'char-1', clanId: 7,
        });
        expect(result).toBe(false);
      });
    });

    describe('grantee "specific_user"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'edit_category', granteeType: 'specific_user', granteeId: 'user-42' },
        ]);
      });

      it('devrait accorder si l\'ID utilisateur correspond', async () => {
        const user = { id: 'user-42', role: 'PLAYER' };
        const result = await userHasPermission(user, 1, 'edit_category');
        expect(result).toBe(true);
      });

      it('devrait refuser si l\'ID utilisateur ne correspond pas', async () => {
        const user = { id: 'user-99', role: 'PLAYER' };
        const result = await userHasPermission(user, 1, 'edit_category');
        expect(result).toBe(false);
      });
    });

    describe('grantee "specific_character"', () => {
      beforeEach(() => {
        CategoryPermission.findAll.mockResolvedValue([
          { permission: 'access_category', granteeType: 'specific_character', granteeId: 'char-7' },
        ]);
      });

      it('devrait accorder si le personnage selectionne correspond', async () => {
        const user = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(user, 1, 'access_category', { characterId: 'char-7' });
        expect(result).toBe(true);
      });

      it('devrait refuser si le personnage ne correspond pas', async () => {
        const user = { id: 'user-1', role: 'PLAYER' };
        const result = await userHasPermission(user, 1, 'access_category', { characterId: 'char-99' });
        expect(result).toBe(false);
      });
    });
  });

  describe('getCategoryPermissionsForUser', () => {
    it('devrait retourner toutes les permissions pour un ADMIN', async () => {
      const admin = { id: 'admin-1', role: 'ADMIN' };
      const result = await getCategoryPermissionsForUser(admin, 1);

      expect(result).toEqual(CategoryPermission.PERMISSIONS);
    });

    it('devrait retourner les permissions correspondantes pour un joueur', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
        { permission: 'create_topic', granteeType: 'player', granteeId: null },
      ]);

      const player = { id: 'user-1', role: 'PLAYER' };
      const result = await getCategoryPermissionsForUser(player, 1);

      expect(result).toContain('access_category');
      expect(result).toContain('create_topic');
      expect(result).not.toContain('edit_category');
    });

    it('devrait retourner seulement les permissions publiques pour un visiteur', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
        { permission: 'create_topic', granteeType: 'player', granteeId: null },
      ]);

      const result = await getCategoryPermissionsForUser(null, 1);

      expect(result).toContain('access_category');
      expect(result).not.toContain('create_topic');
    });
  });

  describe('hasPermissionOrNoRestrictions', () => {
    it('devrait toujours accorder aux ADMIN', async () => {
      const admin = { id: 'admin-1', role: 'ADMIN' };
      const result = await hasPermissionOrNoRestrictions(admin, 1, 'edit_category');
      expect(result).toBe(true);
    });

    it('devrait accorder si aucune permission n\'est definie (retrocompatibilite)', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([]);

      const player = { id: 'user-1', role: 'PLAYER' };
      const result = await hasPermissionOrNoRestrictions(player, 1, 'edit_category');
      expect(result).toBe(true);
    });

    it('devrait verifier la permission si des permissions sont definies', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      const player = { id: 'user-1', role: 'PLAYER' };

      // access_category est definie et publique -> vrai
      const result1 = await hasPermissionOrNoRestrictions(player, 1, 'access_category');
      expect(result1).toBe(true);
    });

    it('devrait refuser si des permissions existent mais pas celle demandee', async () => {
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      const player = { id: 'user-1', role: 'PLAYER' };

      // edit_category n'est pas definie pour player -> faux
      const result = await hasPermissionOrNoRestrictions(player, 1, 'edit_category');
      expect(result).toBe(false);
    });
  });

  describe('invalidateCache', () => {
    it('devrait vider tout le cache avec null', async () => {
      // Remplir le cache
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);
      await resolvePermissions(1);

      // Vider le cache
      await invalidateCache(null);

      // Le prochain appel devrait refaire les requetes
      await resolvePermissions(1);

      expect(CategoryPermission.findAll).toHaveBeenCalledTimes(2);
    });

    it('devrait invalider le cache d\'une categorie specifique', async () => {
      // Remplir le cache pour la categorie 1
      ForumCategory.findByPk.mockResolvedValue({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);
      await resolvePermissions(1);

      // Invalider la categorie 1
      ForumCategory.findAll.mockResolvedValue([]);
      await invalidateCache(1);

      // Le prochain appel devrait refaire la requete
      await resolvePermissions(1);

      expect(CategoryPermission.findAll).toHaveBeenCalledTimes(2);
    });

    it('devrait invalider le cache des descendants', async () => {
      // Remplir le cache pour la categorie 2 (enfant de 1)
      ForumCategory.findByPk
        .mockResolvedValueOnce({ id: 2, parentId: 1 })
        .mockResolvedValueOnce({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);
      await resolvePermissions(2);

      // Invalider la categorie 1 (parent) -> devrait aussi invalider 2
      ForumCategory.findAll.mockResolvedValue([
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
      ]);
      await invalidateCache(1);

      // Reconfigurer les mocks pour un nouvel appel
      ForumCategory.findByPk
        .mockResolvedValueOnce({ id: 2, parentId: 1 })
        .mockResolvedValueOnce({ id: 1, parentId: null });
      CategoryPermission.findAll.mockResolvedValue([
        { permission: 'access_category', granteeType: 'public', granteeId: null },
      ]);

      // Appeler resolvePermissions(2) -> devrait refaire la requete
      await resolvePermissions(2);

      // findAll sur CategoryPermission appele 2 fois (initial + apres invalidation)
      expect(CategoryPermission.findAll).toHaveBeenCalledTimes(2);
    });
  });
});
