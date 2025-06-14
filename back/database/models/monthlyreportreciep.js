const { DataTypes } = require('sequelize');

const RecipeM = {
    id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,  
    },
  recieps: {
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: []
  },
  totalcosts: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  totalprofit: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
};

module.exports = RecipeM;