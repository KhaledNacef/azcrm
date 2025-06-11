const {  DataTypes } = require('sequelize');

const StockTE =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prixU_HT: {
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
  codeClient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tva: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  rem: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  }
  ,
  sellprice: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  devise: {
    type: DataTypes.STRING,
    allowNull: true,
  }
};

module.exports = StockTE;
