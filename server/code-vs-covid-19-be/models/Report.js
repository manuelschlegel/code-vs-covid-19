module.exports = (sequelize, type) => {
  return sequelize.define("report", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: type.STRING,
    userMacAddress: type.STRING,
    detectedDeviceMacAddress: type.STRING,
    detectedDeviceName: type.STRING,
    detectedDeviceRssi: type.STRING,
    timeStamp: type.DATE
  });
};
