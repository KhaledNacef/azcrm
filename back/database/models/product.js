const { DataTypes } = require('sequelize');
const db = require('../index'); // Adjust the path to your sequelize instance as needed

const Product = db.define('Supplier', {
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
 
});

module.exports = Product;
