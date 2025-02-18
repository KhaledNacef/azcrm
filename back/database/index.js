// config/database.js

const { Sequelize } = require('sequelize');
const User =require('../database/models/user');
const User = require('../database/models/user');
const User = require('../database/models/user');
const db = new Sequelize({
  dialect: 'mysql',     
  host: '195.200.15.61',    
  username: 'azmi',    
  password: 'K=U3X=Z9z5Dg4yeDmhp6', 
  database: 'azcrm', 
  logging: false,  
});
const User=db.define('user',User)

module.exports = db;
