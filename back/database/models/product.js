const { DataTypes } = require('sequelize');

const Product =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  Unite: {
    type: DataTypes.STRING,
    allowNull: true,
  }
 
};

module.exports = Product;
