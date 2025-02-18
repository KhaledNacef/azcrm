const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const db = require('../index'); // Adjust the path to your Sequelize instance as needed

const Stock = db.define('Stock', {
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
    allowNull: false,
  },
  tva: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  netTTC: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  netHT: {
    type: DataTypes.FLOAT,
    allowNull: false,
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
  
  
});

// Add hooks to calculate dependent fields
Stock.beforeSave((Stock) => {
  // Calculate prixU_TTC from prixU_HT and tva
  Stock.prixU_TTC = Stock.prixU_HT + (Stock.prixU_HT * (Stock.tva / 100));

  // Calculate netTTC as prixU_TTC multiplied by quantity
  Stock.netTTC = Stock.prixU_TTC * Stock.quantite;

  // Calculate netHT as prixU_HT multiplied by quantity
  Stock.netHT = Stock.prixU_HT * Stock.quantite;

});

module.exports = Stock;
