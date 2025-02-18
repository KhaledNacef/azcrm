const { DataTypes } = require('sequelize');

const Bs =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  clientId:{
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

// Add hooks to calculate dependent fields
Bs.beforeSave((Bs) => {
  // Calculate prixU_TTC from prixU_HT and tva
  Bs.prixU_TTC = Bs.prixU_HT + (Bs.prixU_HT * (Bs.tva / 100));

  // Calculate netTTC as prixU_TTC multiplied by quantity
  Bs.netTTC = Bs.prixU_TTC * Bs.quantite;

  // Calculate netHT as prixU_HT multiplied by quantity
  Bs.netHT = Bs.prixU_HT * Bs.quantite;

});

module.exports = Bs;
