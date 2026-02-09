'use strict';

module.exports = (sequelize, DataTypes) => {
  const ForumTopic = sequelize.define('ForumTopic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: {
          args: [3, 200],
          msg: 'Le titre doit contenir entre 3 et 200 caractères',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    postCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastPostId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastPostAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'forum_topics',
    underscored: true,
    paranoid: true,
    timestamps: true,
    scopes: {
      pinned: {
        where: { isPinned: true },
      },
      locked: {
        where: { isLocked: true },
      },
      withLastPost: () => ({
        include: [{ association: 'lastPost' }],
      }),
      withAuthor: () => ({
        include: [{ association: 'author' }],
      }),
    },
  });

  // Instance methods
  ForumTopic.prototype.generateSlug = function () {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return this.slug;
  };

  ForumTopic.prototype.pin = async function () {
    this.isPinned = true;
    return this.save();
  };

  ForumTopic.prototype.unpin = async function () {
    this.isPinned = false;
    return this.save();
  };

  ForumTopic.prototype.lock = async function () {
    this.isLocked = true;
    return this.save();
  };

  ForumTopic.prototype.unlock = async function () {
    this.isLocked = false;
    return this.save();
  };

  ForumTopic.prototype.incrementViews = async function () {
    this.viewCount += 1;
    return this.save();
  };

  ForumTopic.associate = (models) => {
    ForumTopic.belongsTo(models.ForumCategory, { foreignKey: 'categoryId', as: 'category' });
    ForumTopic.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
    ForumTopic.belongsTo(models.Character, { foreignKey: 'characterId', as: 'character' });
    ForumTopic.hasMany(models.ForumPost, { foreignKey: 'topicId', as: 'posts' });
    ForumTopic.belongsTo(models.ForumPost, { foreignKey: 'lastPostId', as: 'lastPost' });
    ForumTopic.hasMany(models.TopicRead, { foreignKey: 'topicId', as: 'reads' });
    ForumTopic.hasMany(models.TopicSubscription, { foreignKey: 'topicId', as: 'subscriptions' });
  };

  return ForumTopic;
};
