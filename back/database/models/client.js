const { DataTypes } = require('sequelize');
const { UUID, UUIDV4 } = require('sequelize');

const Client ={
  id: {
    type: UUID, // UUID type for unique string IDs
    defaultValue: UUIDV4, // Generate UUIDs by default
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

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  }
};

module.exports = Client;
