const { DataTypes } = require('sequelize');

const Recipe = {
    id:{
 type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,  
    },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.JSON, // Stores array of {name, cost}
    allowNull: false,
    defaultValue: []
  },
  totalcost: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  profit: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
};

module.exports = Recipe;