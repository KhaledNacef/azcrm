
const { DataTypes } = require('sequelize');

const User =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensure email is valid
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

module.exports = User;
