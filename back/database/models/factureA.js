const { v4: uuidv4 } = require('uuid'); // Use require instead of import
const { DataTypes } = require('sequelize');

const generateUniqueCode = () => {
  return `DN-${uuidv4().slice(0, 8).toUpperCase()}`; // First 8 characters of UUID (e.g., DN-12345678)
};


const FactureA =  {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  spulierId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  timbre:{
    type:DataTypes.STRING,
    allowNull:false
  },
  code:{
    type:DataTypes.STRING,
    allowNull:true
  }
 
};

FactureA.beforeCreate((note) => {
  note.code = generateUniqueCode();
});


module.exports = FactureA;
