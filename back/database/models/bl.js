const { DataTypes } = require('sequelize');

// Generate a unique code for the DeliveryNote model


// Define the DeliveryNote model
const DeliveryNote =  {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    spulierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timbre: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spulierName: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  


};

module.exports = DeliveryNote;
