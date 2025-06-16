const { DataTypes } = require('sequelize');

const Charge ={
 id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mantant_location: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cnss: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    impots: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    salaire_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    electricity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    water: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    beinsport: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    wifi: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    faris_divers: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalcharge: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
};

module.exports = Charge;
