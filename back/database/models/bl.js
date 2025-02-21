const { DataTypes } = require('sequelize');

const DeliveryNote =  {
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
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  code:{
    type:DataTypes.STRING,
    allowNull:false
  }
 
};



module.exports = DeliveryNote;
