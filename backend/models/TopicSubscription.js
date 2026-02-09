'use strict';

module.exports = (sequelize, DataTypes) => {
  const TopicSubscription = sequelize.define('TopicSubscription', {
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
  }, {
    tableName: 'topic_subscriptions',
    underscored: true,
    paranoid: false,
    timestamps: true,
    updatedAt: false,
  });

  TopicSubscription.associate = (models) => {
    TopicSubscription.belongsTo(models.ForumTopic, { foreignKey: 'topicId', as: 'topic' });
    TopicSubscription.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return TopicSubscription;
};
