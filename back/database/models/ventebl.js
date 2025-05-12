const {  DataTypes } = require('sequelize');

const Vente =  {
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
    allowNull: true,
  },
 
  quantite: {
    type: DataTypes.FLOAT,
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
    allowNull: false,
  },
  codey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tva: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  rem: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  }
  ,
  sellprice: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  }
  
};

module.exports = Vente;
