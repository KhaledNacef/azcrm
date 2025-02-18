const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const db = require('../index'); // Adjust the path to your Sequelize instance as needed

const Vente = db.define('Vente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prixU_HT: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  net: {
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
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  
  
});

module.exports = Vente;
