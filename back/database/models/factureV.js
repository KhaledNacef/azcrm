const { v4: uuidv4 } = require('uuid'); // Use require instead of import
const { DataTypes } = require('sequelize');
const db = require('../index'); // Assuming db is the Sequelize instance

// Generate a unique code for the FactureV model
const generateUniqueCode = () => {
  return `DN-${uuidv4().slice(0, 8).toUpperCase()}`; // First 8 characters of UUID (e.g., DN-12345678)
};

// Define the FactureV model
const FactureV = db.define('factureV', {
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
    allowNull: false
  }
});

// Hook to generate a unique code before creating a new FactureV record
FactureV.beforeCreate((factureInstance) => {
  factureInstance.code = generateUniqueCode();
});

module.exports = FactureV;
