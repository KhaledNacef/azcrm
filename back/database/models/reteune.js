const { DataTypes } = require('sequelize');

// Generate a unique code for the DeliveryNote model


// Define the DeliveryNote model
const Reteune =  {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    num: {
      type: DataTypes.INTEGER,
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
    Totalretune: {
      type: DataTypes.FLOAT,
      allowNull: true,
    }

  


};

module.exports = Reteune;
