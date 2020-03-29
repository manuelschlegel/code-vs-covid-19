module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.UUID,
      primaryKey: true
    },
    macAddress: type.STRING,
    username: type.STRING,
    creationDate: type.DATE,
    lastScore: type.INTEGER,
    dailyConnections: type.INTEGER,
    title: type.STRING
  });
};
