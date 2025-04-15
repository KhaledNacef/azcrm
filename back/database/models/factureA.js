const { DataTypes } = require('sequelize');

// Define the FactureA model
const FactureA =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  spulierId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timbre: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  }
  ,
    spulierName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codey: {
      type: DataTypes.STRING,
      allowNull: true,
    }
   
};



module.exports = FactureA;
