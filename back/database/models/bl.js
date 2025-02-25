const { v4: uuidv4 } = require('uuid'); // Use require instead of import
const { DataTypes } = require('sequelize');
const db=require('../index')

// Generate a unique code for the DeliveryNote model
const generateUniqueCode = () => {
  return `DN-${uuidv4().slice(0, 8).toUpperCase()}`; // First 8 characters of UUID (e.g., DN-12345678)
};

// Define the DeliveryNote model
const DeliveryNote = (sequelize) => {
  const note = db.define('deliveryNote', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    spulierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timbre: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  // Hook to generate unique code before creating a new delivery note
  note.beforeCreate((noteInstance) => {
    noteInstance.code = generateUniqueCode();
  });

  return note;
};

module.exports = DeliveryNote;
