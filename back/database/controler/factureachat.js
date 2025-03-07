// controllers/factureAController.js
const db  = require('../index'); // Adjust the path to your model as needed

const  FactureA  = db.models.factureA // Adjust the path as per your project structure
const  FactureAP  = db.models.factureap // Adjust the path as per your project structure

// Fetch all FactureA entries
const getAllFactureA = async (req, res) => {
  try {
    const factures = await FactureA.findAll();
    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching factures' });
  }
};

// Fetch FactureA by code
const getFactureAByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const facture = await FactureA.findOne({ where: { code } });
    if (facture) {
      res.status(200).json(facture);
    } else {
      res.status(404).json({ error: 'Facture not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching facture' });
  }
};

// Add a new FactureA
async function addFactureA(req, res) {
  try {
    const { code,spulierId,timbre, products,spulierName,codey} = req.body;

    // Step 1: Create the DeliveryNote (Bon d'achat)
    const deliveryNote = await FactureA.create({
      spulierId:spulierId,
      timbre:timbre,
      code:code,
      spulierName:spulierName,
      codey:codey
    });

    // Step 2: Handle stock and stockP for each product
    const stockPromises = products.map(async (product) => {
      const { prixU_HT, tva, quantite, designation, Unite } = product;

      await FactureAP.create({
        prixU_HT:prixU_HT,
        tva:tva,
        quantite:quantite,
        designation:designation,
        Unite:Unite,
        code:code,
        codey:codey
      });

   

      
    });

    // Wait for all Stock and StockP entries to be processed
    await Promise.all(stockPromises);

    return res.status(201).json({
      message: 'DeliveryNote, Stock, and StockP successfully created',
      deliveryNote,
    });
  } catch (error) {
    console.error('Error creating DeliveryNote, Stock, and StockP:', error);
    return res.status(500).json({
      error: 'Failed to create DeliveryNote, Stock, and StockP',
    });
  }
}

// Delete a FactureA by ID
const deleteFactureA = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await FactureA.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'Facture deleted successfully' });
    } else {
      res.status(404).json({ error: 'Facture not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting facture' });
  }
};

module.exports = {
  getAllFactureA,
  getFactureAByCode,
  addFactureA,
  deleteFactureA,
};
