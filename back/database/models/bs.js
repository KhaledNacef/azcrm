const { DataTypes } = require('sequelize');

// Define the Bs model
const Bs = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
     timbre: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
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

// Ensure the model is exported correctly
module.exports = Bs;
