const { DataTypes } = require('sequelize');

const StockP = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prixU_HT: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  prixU_TTC: {
    type: DataTypes.FLOAT,
    allowNull: true, // Computed field
  },
  tva: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  netTTC: {
    type: DataTypes.FLOAT,
    allowNull: true, // Computed field
  },
  netHT: {
    type: DataTypes.FLOAT,
    allowNull: true, // Computed field
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Unite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  dernierprixU_HT: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  rem: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  moyenneprix: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
};


module.exports =  StockP;
