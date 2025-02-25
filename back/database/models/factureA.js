const { v4: uuidv4 } = require('uuid'); // Use require instead of import
const { DataTypes } = require('sequelize');
const db=require('../index')

// Generate a unique code for the FactureA model
const generateUniqueCode = () => {
  return `DN-${uuidv4().slice(0, 8).toUpperCase()}`; // First 8 characters of UUID (e.g., DN-12345678)
};

// Define the FactureA model
const FactureA = () => {
  const factureA = db.define('factureA', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    spulierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timbre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  // Hook to generate a unique code before creating a new FactureA record
  factureA.beforeCreate((noteInstance) => {
    noteInstance.code = generateUniqueCode();
  });

  return factureA;
};

module.exports = FactureA;
