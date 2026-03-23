'use strict';

module.exports = (sequelize, DataTypes) => {
  const ForumCategory = sequelize.define('ForumCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 100],
          msg: 'Le nom doit contenir entre 2 et 100 caractères',
        },
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isRp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    topicCount: {
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
    permissionMode: {
      type: DataTypes.ENUM('inherit', 'override'),
      allowNull: false,
      defaultValue: 'inherit',
    },
  }, {
    tableName: 'forum_categories',
    underscored: true,
    paranoid: true,
    timestamps: true,
    scopes: {
      active: {
        where: { isActive: true },
      },
      root: {
        where: { parentId: null },
      },
      rp: {
        where: { isRp: true },
      },
    },
  });

  // Instance methods
  ForumCategory.prototype.generateSlug = function () {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return this.slug;
  };

  ForumCategory.prototype.incrementCounts = async function (field) {
    if (field === 'topic') {
      this.topicCount += 1;
    } else if (field === 'post') {
      this.postCount += 1;
    }
    return this.save();
  };

  ForumCategory.prototype.decrementCounts = async function (field) {
    if (field === 'topic') {
      this.topicCount = Math.max(0, this.topicCount - 1);
    } else if (field === 'post') {
      this.postCount = Math.max(0, this.postCount - 1);
    }
    return this.save();
  };

  ForumCategory.associate = (models) => {
    ForumCategory.belongsTo(models.ForumCategory, { foreignKey: 'parentId', as: 'parent' });
    ForumCategory.hasMany(models.ForumCategory, { foreignKey: 'parentId', as: 'children' });
    ForumCategory.hasMany(models.ForumTopic, { foreignKey: 'categoryId', as: 'topics' });
    ForumCategory.belongsTo(models.ForumPost, { foreignKey: 'lastPostId', as: 'lastPost' });
  };

  return ForumCategory;
};
