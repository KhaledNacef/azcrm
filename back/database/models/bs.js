const { DataTypes } = require('sequelize');
import { v4 as uuidv4 } from 'uuid';

const generateUniqueCode = () => {
  return `DN-${uuidv4().slice(0, 8).toUpperCase()}`; // First 8 characters of UUID (e.g., DN-12345678)
};

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
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  code:{
    type:DataTypes.STRING,
    allowNull:true
  }
};
Bs.beforeCreate((note) => {
  note.code = generateUniqueCode();
});


module.exports = Bs;
