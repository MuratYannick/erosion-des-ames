'use strict';

module.exports = (sequelize, DataTypes) => {
  const PostReport = sequelize.define('PostReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM('spam', 'offensive', 'off_topic', 'other'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'post_reports',
    underscored: true,
    paranoid: false,
    timestamps: true,
    scopes: {
      pending: {
        where: { status: 'pending' },
      },
      reviewed: {
        where: { status: 'reviewed' },
      },
    },
  });

  PostReport.associate = (models) => {
    PostReport.belongsTo(models.ForumPost, { foreignKey: 'postId', as: 'post' });
    PostReport.belongsTo(models.User, { foreignKey: 'userId', as: 'reporter' });
    PostReport.belongsTo(models.User, { foreignKey: 'reviewedBy', as: 'reviewer' });
  };

  return PostReport;
};
