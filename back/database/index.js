// config/database.js

const { Sequelize } = require('sequelize');
const User =require('../database/models/user');
const User = require('../database/models/user');
const User = require('../database/models/user');
const db = new Sequelize({
  dialect: 'mysql',     
  host: 'localhost',    
  username: 'root',    
  password: 'yourpassword', 
  database: 'yourdatabase', 
  logging: false,  
});
const User=db.define('user',User)

module.exports = db;
