const { DataTypes } = require('sequelize');

const FactureAP = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prixU_HT: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  prixU_TTC: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  tva: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  netTTC: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  netHT: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Unite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rem: {
    type: DataTypes.FLOAT,
    allowNull: true, // Allow null because it's computed dynamically
  },
  dernierprixU_HT: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  moyenneprix: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
};


module.exports =  FactureAP;
