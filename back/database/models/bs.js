const { DataTypes } = require('sequelize');

// Define the Bs model
const Bs = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
   num: {
    type: DataTypes.INTEGER,
    allowNull: false,

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
  },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    }
};

// Ensure the model is exported correctly
module.exports = Bs;
