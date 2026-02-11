'use strict';

module.exports = (sequelize, DataTypes) => {
  const { Op } = sequelize.Sequelize;

  const ModerationAction = sequelize.define('ModerationAction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actionType: {
      type: DataTypes.ENUM(
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
    },
    moderatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    targetType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    tableName: 'moderation_actions',
    underscored: true,
    // Audit log — records must never be soft-deleted
    paranoid: false,
    timestamps: true,
    scopes: {
      byType(type) {
        return { where: { actionType: type } };
      },
      byModerator(userId) {
        return { where: { moderatorId: userId } };
      },
      byTargetUser(userId) {
        return { where: { targetUserId: userId } };
      },
      recent: {
        where: {
          createdAt: {
            [Op.gte]: sequelize.Sequelize.literal(
              'DATE_SUB(NOW(), INTERVAL 30 DAY)'
            ),
          },
        },
      },
    },
  });

  // Static method: convenience wrapper to create an audit log entry.
  // All callers should go through this method instead of ModerationAction.create()
  // directly so that the call site stays clean and consistent.
  ModerationAction.log = function ({ actionType, moderatorId, targetUserId, targetId, targetType, reason, details, transaction }) {
    return ModerationAction.create({
      actionType,
      moderatorId,
      targetUserId,
      targetId,
      targetType,
      reason,
      details,
    }, transaction ? { transaction } : undefined);
  };

  ModerationAction.associate = (models) => {
    ModerationAction.belongsTo(models.User, { foreignKey: 'moderatorId', as: 'moderator' });
    ModerationAction.belongsTo(models.User, { foreignKey: 'targetUserId', as: 'targetUser' });
  };

  return ModerationAction;
};
