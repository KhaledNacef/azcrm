// config/database.js

const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: 'mysql',     
  host: '195.200.15.61',    
  username: 'azmi',    
  password: 'K=U3X=Z9z5Dg4yeDmhp6', 
  database: 'azcrm', 
  logging: false,  
});

module.exports = db;
