const { DataTypes } = require('sequelize');

// Generate a unique code for the DeliveryNote model


// Define the DeliveryNote model
const DeliveryNote =  {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
     num: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    codey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  


};

module.exports = DeliveryNote;
