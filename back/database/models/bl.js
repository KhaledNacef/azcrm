const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../index'); // Adjust the path to your Sequelize instance as needed

const DeliveryNote = sequelize.define('DeliveryNote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  spulierId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  timbre:{
    type:DataTypes.STRING,
    allowNull:false
  },
  code:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
 
});



module.exports = DeliveryNote;
