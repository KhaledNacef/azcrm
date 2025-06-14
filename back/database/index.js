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
const FactureA=require('./models/factureA.js')
const FactureV=require('./models/factureV.js')
const FactureAP=require('../database/models/factureachatproduit.js')
const FactureVP=require('./models/factureventeproduit.js')
const Reteune=require('./models/reteune.js')
const StockH=require('./models/stockhistorique.js')
const StockT=require('./models/stocktrace.js')
const StockTE=require('./models/stocktraceetranger.js')
const Recipe=require('./models/fichetechnique.js')
const RecipeM=require('./models/monthlyreportreciep.js')



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
const factureA=db.define('factureA',FactureA)
const factureV=db.define('factureV',FactureV)
const factureap=db.define('factureap',FactureAP)
const facturevp=db.define('facturevp',FactureVP)
const reteune=db.define('reteune',Reteune)
const stockH=db.define('stockH',StockH)
const stockT=db.define('stockT',StockT)
const stockTE=db.define('stockTE',StockTE)
const recipe = db.define('recipe', Recipe); // Define Recipe model
const recipem = db.define('recipem', RecipeM); // Define Recipe model



db.sync().then(() => {
  console.log('User table created (if not exists)');
}).catch((error) => {
  console.error('Error creating User table:', error);
});

db.authenticate();

module.exports = db;
