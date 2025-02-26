const { DataTypes } = require('sequelize');

// Define the Bs model
const Bs = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timbre: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  }
  ,
  clientName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}



module.exports = Bs;
