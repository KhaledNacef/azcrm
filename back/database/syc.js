const db = require('../database/index');
const Client = db.models.client
const FactureA = db.models.factureA
const FactureV = db.models.factureV
const Suplier = db.models.supplier
const FactureVp = db.models.facturevp
const Factureap = db.models.factureap
const Bs =db.models.bs
const Vente=db.models.vente
const StockP=db.models.stockP
const DeliveryNote =db.models.deliveryNote
const Reteune =db.models.reteune
const StockH=db.models.stockH
const StockT=db.models.stockT
const StockTE=db.models.stockTE
const Recipe=db.models.recipe
const Recipev=db.models.recipev
const Recipem=db.models.recipem
const ChargeCafe=db.models.chargecafe

async function syncDatabase() {
  try {
    await db.sync({ alter: true }); // This will update the schema without deleting data
    console.log('Database synced without deleting data.');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
}

syncDatabase();
