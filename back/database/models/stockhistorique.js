const { DataTypes } = require('sequelize');

const StockH = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prixU_HT: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tva: {
    type: DataTypes.FLOAT,
    allowNull: false,
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
  
  rem: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  
  codesuplier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    }
};


module.exports =  StockH;
