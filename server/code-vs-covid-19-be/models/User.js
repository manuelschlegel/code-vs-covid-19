module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: type.STRING,
    userMacAddress: type.STRING,
    username: type.STRING,
    creationDate: type.DATE,
    userScore: type.INTEGER,
    userRank: type.INTEGER,
    userTitle: type.STRING,
    userDailyConnections: type.INTEGER
  });
};
