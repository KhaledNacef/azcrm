// controllers/FactureAPController.js
// controllers/factureAController.js
const db  = require('../index'); // Adjust the path to your model as needed

const  FactureV  = db.models.factureV // Adjust the path as per your project structure

// Create a new FactureV entry
const createFactureV = async (req, res) => {
  const { clientId, timbre, code } = req.body;

  try {
    const newFactureV = await FactureV.create({
      clientId,
      timbre,
      code
    });
    res.status(201).json(newFactureV);
  } catch (error) {
    res.status(500).json({ error: 'Error creating FactureV' });
  }
};

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
    const facture = await FactureV.findOne({ where: { code } });
    if (facture) {
      res.status(200).json(facture);
    } else {
      res.status(404).json({ error: 'FactureV not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureV by code' });
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
  createFactureV,
  getAllFactureV,
  getFactureVByCode,
  updateFactureVById,
  deleteFactureVById,
};
