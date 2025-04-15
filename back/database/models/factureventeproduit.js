const {  DataTypes } = require('sequelize');

const FactureVP =  {
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
  },
  codey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rem: {
    type: DataTypes.FLOAT,
    allowNull: true, 
  },
  
  
};

module.exports = FactureVP;
