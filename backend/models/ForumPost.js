'use strict';

module.exports = (sequelize, DataTypes) => {
  const ForumPost = sequelize.define('ForumPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le contenu ne peut pas être vide',
        },
      },
    },
    isFirstPost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    quotedPostId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    editedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'forum_posts',
    underscored: true,
    paranoid: true,
    timestamps: true,
    scopes: {
      withAuthor: () => ({
        include: [{ association: 'author' }],
      }),
      withCharacter: () => ({
        include: [{ association: 'character' }],
      }),
      withQuotedPost: () => ({
        include: [{ association: 'quotedPost' }],
      }),
    },
  });

  ForumPost.associate = (models) => {
    ForumPost.belongsTo(models.ForumTopic, { foreignKey: 'topicId', as: 'topic' });
    ForumPost.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
    ForumPost.belongsTo(models.Character, { foreignKey: 'characterId', as: 'character' });
    ForumPost.belongsTo(models.ForumPost, { foreignKey: 'quotedPostId', as: 'quotedPost' });
    ForumPost.belongsTo(models.User, { foreignKey: 'editedBy', as: 'editor' });
    ForumPost.hasMany(models.PostReport, { foreignKey: 'postId', as: 'reports' });
  };

  return ForumPost;
};
