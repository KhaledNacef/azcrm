// config/database.js

const { Sequelize } = require('sequelize');
const DeliveryNote = require('../database/models/bl.js');
const Bs = require('../database/models/bs.js');
const Client = require('../database/models/client.js');
const Product = require('../database/models/product.js');
const Stock = require('../database/models/stock.js');
const StockP=require('../database/models/stockproduct.js');
const Supplier=require('../database/models/suplier.js');
const User = require('../database/models/user.js');
const Vente=require('../database/models/ventebl.js');

const db = new Sequelize({
  dialect: 'mysql',     
  host: '195.200.15.61',    
  username: 'azmi',    
  password: 'K=U3X=Z9z5Dg4yeDmhp6', 
  database: 'azcrm' 
});

const deliveryNote=db.define('deliveryNote',DeliveryNote)
const bs=db.define('bs',Bs)
const client=db.define('client',Client)
const product=db.define('product',Product)
const stock=db.define('stock',Stock)
const stockP=db.define('stockP',StockP)
const supplier=db.define('supplier',Supplier)
const user=db.define('user',User)
const vente=db.define('vente',Vente)




db.sync().then(() => {
  console.log('User table created (if not exists)');
}).catch((error) => {
  console.error('Error creating User table:', error);
});

db.authenticate();

module.exports = db;
