const { DataTypes } = require('sequelize');

const FactureA =  {
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
 
};



module.exports = FactureA;
