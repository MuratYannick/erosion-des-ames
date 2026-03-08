'use strict';

/**
 * Migration: add 'expire_sanction' to the action_type ENUM and allow
 * moderator_id to be NULL so that system-triggered actions (not performed
 * by a human moderator) can be recorded without a FK reference to users.
 *
 * MySQL requires re-defining the full ENUM to add a value, and altering
 * the column type implicitly drops the NOT NULL constraint, so we set it
 * back explicitly.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Extend the ENUM to include 'expire_sanction'
    await queryInterface.changeColumn('moderation_actions', 'action_type', {
      type: Sequelize.ENUM(
        'ban_user',
        'unban_user',
        'mute_user',
        'unmute_user',
        'warn_user',
        'change_role',
        'delete_user',
        'activate_user',
        'deactivate_user',
        'approve_character',
        'reject_character',
        'delete_character',
        'delete_post',
        'delete_topic',
        'lock_topic',
        'unlock_topic',
        'pin_topic',
        'unpin_topic',
        'move_topic',
        'merge_topics',
        'review_report',
        'edit_category',
        'delete_category',
        'expire_sanction'
      ),
      allowNull: false,
    });

    // 2. Allow moderator_id to be NULL for system-triggered audit entries.
    //    We must remove the FK constraint first, alter the column, then
    //    re-add the constraint so MySQL doesn't reject the change.
    await queryInterface.removeConstraint(
      'moderation_actions',
      'moderation_actions_ibfk_1'
    ).catch(() => {
      // Constraint name may differ across environments; ignore if not found.
      // The column change below will still succeed.
    });

    await queryInterface.changeColumn('moderation_actions', 'moderator_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Re-add the FK so referential integrity is maintained when a real
    // moderator ID is provided.
    await queryInterface.addConstraint('moderation_actions', {
      fields: ['moderator_id'],
      type: 'foreign key',
      name: 'moderation_actions_moderator_id_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the re-added FK before altering the column back
    await queryInterface.removeConstraint(
      'moderation_actions',
      'moderation_actions_moderator_id_fkey'
    ).catch(() => {});

    // Restore moderator_id as NOT NULL (may fail if NULLs exist in DB)
    await queryInterface.changeColumn('moderation_actions', 'moderator_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // Re-add original FK
    await queryInterface.addConstraint('moderation_actions', {
      fields: ['moderator_id'],
      type: 'foreign key',
      name: 'moderation_actions_ibfk_1',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Revert ENUM to original values (without 'expire_sanction')
    await queryInterface.changeColumn('moderation_actions', 'action_type', {
      type: Sequelize.ENUM(
        'ban_user',
        'unban_user',
        'mute_user',
        'unmute_user',
        'warn_user',
        'change_role',
        'delete_user',
        'activate_user',
        'deactivate_user',
        'approve_character',
        'reject_character',
        'delete_character',
        'delete_post',
        'delete_topic',
        'lock_topic',
        'unlock_topic',
        'pin_topic',
        'unpin_topic',
        'move_topic',
        'merge_topics',
        'review_report',
        'edit_category',
        'delete_category'
      ),
      allowNull: false,
    });
  },
};
