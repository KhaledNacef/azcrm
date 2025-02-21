const db = require('../database/index');
const Client = db.models.client
const FactureA = db.models.factureA
const FactureV = db.models.factureV
const Suplier = db.models.supplier

async function syncDatabase() {
  try {
    await db.sync({ alter: true }); // This will update the schema without deleting data
    console.log('Database synced without deleting data.');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
}

syncDatabase();
