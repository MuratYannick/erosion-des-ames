'use strict';

module.exports = (sequelize, DataTypes) => {
  const TopicRead = sequelize.define('TopicRead', {
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
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'topic_reads',
    underscored: true,
    paranoid: false,
    timestamps: false,
  });

  TopicRead.associate = (models) => {
    TopicRead.belongsTo(models.ForumTopic, { foreignKey: 'topicId', as: 'topic' });
    TopicRead.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return TopicRead;
};
