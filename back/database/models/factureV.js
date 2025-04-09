const { DataTypes } = require('sequelize');

// Define the FactureV model
const FactureV =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
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
  },
  codey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  devise: {
    type: DataTypes.STRING,
    allowNull: true,
  }
};


module.exports = FactureV;
