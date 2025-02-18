const { DataTypes } = require('sequelize');
const db = require('../index'); // Adjust the path to your sequelize instance as needed

const Supplier = db.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fax: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codePostal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codeTVA: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matriculefisacl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Supplier;
