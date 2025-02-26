// controllers/FactureAPController.js
// controllers/factureAController.js
const db  = require('../index'); // Adjust the path to your model as needed

const  FactureVP  = db.models.facturevp // Adjust the path as per your project structure


// Get all FactureVP entries
const getAllFactureVP = async (req, res) => {
  try {
    const factureVPs = await FactureVP.findAll();
    res.status(200).json(factureVPs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureVP entries' });
  }
};

// Get FactureVP by code
const getFactureVPByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const factureVP = await FactureVP.findAll({ where: { code:code } });
    if (factureVP) {
      res.status(200).json(factureVP);
    } else {
      res.status(404).json({ error: 'FactureVP not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureVP by code' });
  }
};

// Update FactureVP by id
const updateFactureVPById = async (req, res) => {
  const { id } = req.params;
  const { prixU_HT, quantite, designation, Unite, code } = req.body;

  try {
    const factureVP = await FactureVP.findOne({ where: { id } });
    if (factureVP) {
      factureVP.prixU_HT = prixU_HT || factureVP.prixU_HT;
      factureVP.quantite = quantite || factureVP.quantite;
      factureVP.designation = designation || factureVP.designation;
      factureVP.Unite = Unite || factureVP.Unite;
      factureVP.code = code || factureVP.code;

      await factureVP.save();
      res.status(200).json(factureVP);
    } else {
      res.status(404).json({ error: 'FactureVP not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating FactureVP' });
  }
};

// Delete FactureVP by id
const deleteFactureVPById = async (req, res) => {
  const { id } = req.params;

  try {
    const factureVP = await FactureVP.findOne({ where: { id } });
    if (factureVP) {
      await factureVP.destroy();
      res.status(200).json({ message: 'FactureVP deleted successfully' });
    } else {
      res.status(404).json({ error: 'FactureVP not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting FactureVP' });
  }
};

module.exports = {
  getAllFactureVP,
  getFactureVPByCode,
  updateFactureVPById,
  deleteFactureVPById,
};
