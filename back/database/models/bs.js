const { v4: uuidv4 } = require('uuid'); // Use require instead of import
const { DataTypes } = require('sequelize');
const db=require('../index')

// Generate a unique code for the Bs model
const generateUniqueCode = () => {
  return `DN-${uuidv4().slice(0, 8).toUpperCase()}`; // First 8 characters of UUID (e.g., DN-12345678)
};

// Define the Bs model
const Bs = () => {
  const bs = db.define('bs', {
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
  });

  // Hook to generate a unique code before creating a new Bs record
  bs.beforeCreate((noteInstance) => {
    noteInstance.code = generateUniqueCode();
  });

  return bs;
};

module.exports = Bs;
