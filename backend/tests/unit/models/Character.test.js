'use strict';

/**
 * Tests unitaires pour le modèle Character
 * Focus sur :
 * - Le hook afterUpdate (désélection automatique du personnage)
 * - Les validations de statut
 * - Les méthodes d'instance (approve, reject, archive)
 */

describe('Character Model', () => {
  let characterFactory;
  let mockSequelize;
  let DataTypes;
  let CharacterModel;
  let hooks;
  let mockUserUpdate;

  beforeEach(() => {
    jest.clearAllMocks();

    hooks = {};
    mockUserUpdate = jest.fn().mockResolvedValue([1]);

    // DataTypes minimal
    DataTypes = {
      INTEGER: 'INTEGER',
      UUID: 'UUID',
      STRING: jest.fn((len) => `STRING(${len})`),
      TEXT: 'TEXT',
      BOOLEAN: 'BOOLEAN',
      DATE: 'DATE',
      ENUM: jest.fn((...args) => `ENUM(${args.join(',')})`),
    };

    // Sequelize minimal avec modèles exposés pour les hooks
    mockSequelize = {
      Sequelize: {
        Op: { ne: Symbol('ne') },
      },
      define: jest.fn((name, attrs, options) => {
        const Model = {
          _name: name,
          _attrs: attrs,
          _options: options,
          beforeCreate: jest.fn((fn) => { hooks.beforeCreate = fn; }),
          beforeUpdate: jest.fn((fn) => { hooks.beforeUpdate = fn; }),
          afterUpdate: jest.fn((fn) => { hooks.afterUpdate = fn; }),
          associate: null,
          prototype: {},
          // Expose les modèles liés pour les hooks
          sequelize: {
            models: {
              User: { update: mockUserUpdate },
            },
          },
        };
        return Model;
      }),
    };

    characterFactory = require('../../../models/Character');
    CharacterModel = characterFactory(mockSequelize, DataTypes);

    // Simuler que le hook afterUpdate a accès à character.sequelize.models
    // via la propriété séquelisée de l'instance
  });

  // ─── Hook afterUpdate ──────────────────────────────────────────────────────

  describe('hook afterUpdate', () => {
    it('devrait désélectionner le personnage si son statut passe à non-approved', async () => {
      const characterInstance = {
        id: 1,
        status: 'pending', // Statut après update
        isActive: true,
        changed: jest.fn((field) => field === 'status'),
        sequelize: { models: { User: { update: mockUserUpdate } } },
      };

      await hooks.afterUpdate(characterInstance);

      expect(mockUserUpdate).toHaveBeenCalledWith(
        { selectedCharacterId: null },
        { where: { selectedCharacterId: 1 } }
      );
    });

    it('devrait désélectionner le personnage si son statut passe à rejected', async () => {
      const characterInstance = {
        id: 2,
        status: 'rejected',
        isActive: true,
        changed: jest.fn((field) => field === 'status'),
        sequelize: { models: { User: { update: mockUserUpdate } } },
      };

      await hooks.afterUpdate(characterInstance);

      expect(mockUserUpdate).toHaveBeenCalledWith(
        { selectedCharacterId: null },
        { where: { selectedCharacterId: 2 } }
      );
    });

    it('devrait désélectionner le personnage s\'il est désactivé', async () => {
      const characterInstance = {
        id: 3,
        status: 'approved',
        isActive: false, // Vient d'être désactivé
        changed: jest.fn((field) => field === 'isActive'),
        sequelize: { models: { User: { update: mockUserUpdate } } },
      };

      await hooks.afterUpdate(characterInstance);

      expect(mockUserUpdate).toHaveBeenCalledWith(
        { selectedCharacterId: null },
        { where: { selectedCharacterId: 3 } }
      );
    });

    it('ne devrait PAS désélectionner si le statut passe à approved', async () => {
      const characterInstance = {
        id: 4,
        status: 'approved', // Vient d'être approuvé
        isActive: true,
        changed: jest.fn((field) => field === 'status'),
        sequelize: { models: { User: { update: mockUserUpdate } } },
      };

      await hooks.afterUpdate(characterInstance);

      expect(mockUserUpdate).not.toHaveBeenCalled();
    });

    it('ne devrait PAS désélectionner si ni le statut ni isActive n\'a changé', async () => {
      const characterInstance = {
        id: 5,
        status: 'approved',
        isActive: true,
        // Autre champ a changé (ex: name)
        changed: jest.fn().mockReturnValue(false),
        sequelize: { models: { User: { update: mockUserUpdate } } },
      };

      await hooks.afterUpdate(characterInstance);

      expect(mockUserUpdate).not.toHaveBeenCalled();
    });

    it('ne devrait PAS désélectionner si isActive reste true', async () => {
      const characterInstance = {
        id: 6,
        status: 'approved',
        isActive: true, // isActive a changé MAIS reste true
        changed: jest.fn((field) => field === 'isActive'),
        sequelize: { models: { User: { update: mockUserUpdate } } },
      };

      // isActive a changé mais la valeur finale est true -> pas de désélection
      await hooks.afterUpdate(characterInstance);

      // Pas de désélection car !isActive === false
      expect(mockUserUpdate).not.toHaveBeenCalled();
    });
  });

  // ─── Validations du modèle ─────────────────────────────────────────────────

  describe('validations du statut', () => {
    it('le champ status devrait être un ENUM avec les bonnes valeurs', () => {
      const statusAttr = CharacterModel._attrs.status;

      // Vérifier que le type est bien un ENUM (notre mock retourne une string)
      expect(statusAttr.type).toContain('draft');
      expect(statusAttr.type).toContain('pending');
      expect(statusAttr.type).toContain('approved');
      expect(statusAttr.type).toContain('rejected');
    });

    it('le statut par défaut devrait être "draft"', () => {
      const statusAttr = CharacterModel._attrs.status;
      expect(statusAttr.defaultValue).toBe('draft');
    });

    it('allowNull du statut devrait être false', () => {
      const statusAttr = CharacterModel._attrs.status;
      expect(statusAttr.allowNull).toBe(false);
    });
  });

  // ─── Méthodes d'instance ───────────────────────────────────────────────────

  describe('méthode approve', () => {
    it('devrait mettre le statut à "approved" et enregistrer l\'approbateur', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      const characterInstance = {
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
        rejectionReason: 'Ancienne raison',
        save: mockSave,
      };

      const approveMethod = CharacterModel.prototype.approve;
      await approveMethod.call(characterInstance, 'admin-uuid');

      expect(characterInstance.status).toBe('approved');
      expect(characterInstance.approvedBy).toBe('admin-uuid');
      expect(characterInstance.approvedAt).toBeInstanceOf(Date);
      expect(characterInstance.rejectionReason).toBeNull();
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('méthode reject', () => {
    it('devrait mettre le statut à "rejected" et enregistrer la raison', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      const characterInstance = {
        status: 'pending',
        approvedBy: 'some-admin',
        approvedAt: new Date(),
        rejectionReason: null,
        save: mockSave,
      };

      const rejectMethod = CharacterModel.prototype.reject;
      await rejectMethod.call(characterInstance, 'La fiche est incomplète.');

      expect(characterInstance.status).toBe('rejected');
      expect(characterInstance.rejectionReason).toBe('La fiche est incomplète.');
      expect(characterInstance.approvedBy).toBeNull();
      expect(characterInstance.approvedAt).toBeNull();
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('méthode archive', () => {
    it('devrait désactiver le personnage en mettant isActive à false', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      const characterInstance = {
        isActive: true,
        save: mockSave,
      };

      const archiveMethod = CharacterModel.prototype.archive;
      await archiveMethod.call(characterInstance);

      expect(characterInstance.isActive).toBe(false);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  // ─── Scopes ────────────────────────────────────────────────────────────────

  describe('scopes', () => {
    it('le scope "active" devrait filtrer par isActive: true', () => {
      const activeScope = CharacterModel._options.scopes.active;
      expect(activeScope).toEqual({ where: { isActive: true } });
    });

    it('le scope "approved" devrait filtrer par status: "approved"', () => {
      const approvedScope = CharacterModel._options.scopes.approved;
      expect(approvedScope).toEqual({ where: { status: 'approved' } });
    });

    it('le scope "pending" devrait filtrer par status: "pending"', () => {
      const pendingScope = CharacterModel._options.scopes.pending;
      expect(pendingScope).toEqual({ where: { status: 'pending' } });
    });

    it('le scope "draft" devrait filtrer par status: "draft"', () => {
      const draftScope = CharacterModel._options.scopes.draft;
      expect(draftScope).toEqual({ where: { status: 'draft' } });
    });
  });

  // ─── Options du modèle ─────────────────────────────────────────────────────

  describe('options du modèle', () => {
    it('devrait avoir paranoid: true pour le soft delete', () => {
      expect(CharacterModel._options.paranoid).toBe(true);
    });

    it('devrait avoir underscored: true', () => {
      expect(CharacterModel._options.underscored).toBe(true);
    });

    it('devrait avoir tableName: "characters"', () => {
      expect(CharacterModel._options.tableName).toBe('characters');
    });
  });
});
