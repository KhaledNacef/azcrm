const db = require('../database/index');
const Client = db.models.Client

async function syncDatabase() {
  try {
    await db.sync({ alter: true }); // This will update the schema without deleting data
    console.log('Database synced without deleting data.');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
}

syncDatabase();
