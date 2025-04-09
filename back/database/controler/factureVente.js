// controllers/FactureAPController.js
// controllers/factureAController.js
const db  = require('../index'); // Adjust the path to your model as needed

const  FactureV  = db.models.factureV // Adjust the path as per your project structure
const FactureVP=db.models.facturevp
// Create a new FactureV entry

async function createbv(req, res) {
  try {
    const {code, clientId, products,clientName,codey,devise } = req.body;

    // Step 1: Create the Bs (Bon de Sortie)
    const Bss = await FactureV.create({
      clientId: clientId,
      code:code,
      clientName:clientName,
      codey:codey,
      devise:devise
    
    });

    // Step 2: Handle the products
    const stockPromises = products.map(async (product) => {
      const { prixU_HT, quantite, designation, Unite,percentage } = product;

      // Create a new Vente entry (always linked to the Bs)
      await FactureVP.create({
        prixU_HT: prixU_HT,
        quantite: quantite,
        designation: designation,
        Unite: Unite,
        code:code,
        codey:codey,
        percentage:percentage
      });


    
     
    });

    // Wait for all Stock and StockP entries to be processed
    await Promise.all(stockPromises);

    return res.status(201).json({
      message: 'Bon de Sortie, Stock, and StockP successfully created',
      Bss,
    });
  } catch (error) {
    console.error('Error creating Bon de Sortie, Stock, and StockP:', error);
    return res.status(500).json({
      error: 'Failed to create Bon de Sortie, Stock, and StockP',
    });
  }
}


// Get all FactureV entries
const getAllFactureV = async (req, res) => {
  try {
    const factures = await FactureV.findAll();
    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureV entries' });
  }
};

// Get FactureV by code
const getFactureVByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const facture = await FactureVP.findAll({ where: { code } });
    if (facture) {
      res.status(200).json(facture);
    } else {
      res.status(404).json({ error: 'FactureV not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureV by code' });
  }
};
const getFactureVBycodey = async (req, res) => {
  const { codey } = req.params;
  try {
    const facture = await FactureVP.findAll({ where: { codey } });
    if (facture) {
      res.status(200).json(facture);
    } else {
      res.status(404).json({ error: 'FactureV not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureV by codey' });
  }
};
// Update FactureV by id
const updateFactureVById = async (req, res) => {
  const { id } = req.params;
  const { clientId, timbre, code } = req.body;

  try {
    const facture = await FactureV.findOne({ where: { id } });
    if (facture) {
      facture.clientId = clientId || facture.clientId;
      facture.timbre = timbre !== undefined ? timbre : facture.timbre;
      facture.code = code || facture.code;

      await facture.save();
      res.status(200).json(facture);
    } else {
      res.status(404).json({ error: 'FactureV not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating FactureV' });
  }
};

// Delete FactureV by id
const deleteFactureVById = async (req, res) => {
  const { id } = req.params;

  try {
    const facture = await FactureV.findOne({ where: { id } });
    if (facture) {
      await facture.destroy();
      res.status(200).json({ message: 'FactureV deleted successfully' });
    } else {
      res.status(404).json({ error: 'FactureV not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting FactureV' });
  }
};

module.exports = {
  createbv,
  getAllFactureV,
  getFactureVByCode,
  updateFactureVById,
  deleteFactureVById,
  getFactureVBycodey
};
