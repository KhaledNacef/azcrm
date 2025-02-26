// controllers/FactureAPController.js
// controllers/factureAController.js
const db  = require('../index'); // Adjust the path to your model as needed

const  FactureAP  = db.models.factureap // Adjust the path as per your project structure

// Get all FactureAPs
const getAllFactureAPs = async (req, res) => {
  try {
    const FactureAPs = await FactureAP.findAll();
    res.status(200).json(FactureAPs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureAPs' });
  }
};

// Get FactureAP by faId
const getFactureAPByFaId = async (req, res) => {
  const { code } = req.params;
  try {
    const FactureAPP = await FactureAP.findOne({ where: { code:code } });
    if (FactureAPP) {
      res.status(200).json(FactureAPP);
    } else {
      res.status(404).json({ error: 'FactureAP not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching FactureAP' });
  }
};

// Update FactureAP by faId
const updateFactureAPByFaId = async (req, res) => {
  const { faId } = req.params;
  const { prixU_HT, prixU_TTC, tva, netTTC, netHT, quantite, designation, Unite } = req.body;

  try {
    const FactureAP = await FactureAP.findOne({ where: { faId } });
    if (FactureAP) {
      FactureAP.prixU_HT = prixU_HT || FactureAP.prixU_HT;
      FactureAP.prixU_TTC = prixU_TTC || FactureAP.prixU_TTC;
      FactureAP.tva = tva || FactureAP.tva;
      FactureAP.netTTC = netTTC || FactureAP.netTTC;
      FactureAP.netHT = netHT || FactureAP.netHT;
      FactureAP.quantite = quantite || FactureAP.quantite;
      FactureAP.designation = designation || FactureAP.designation;
      FactureAP.Unite = Unite || FactureAP.Unite;

      await FactureAP.save();
      res.status(200).json(FactureAP);
    } else {
      res.status(404).json({ error: 'FactureAP not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating FactureAP' });
  }
};

// Delete FactureAP by faId
const deleteFactureAPByFaId = async (req, res) => {
  const { faId } = req.params;

  try {
    const FactureAP = await FactureAP.findOne({ where: { faId } });
    if (FactureAP) {
      await FactureAP.destroy();
      res.status(200).json({ message: 'FactureAP deleted successfully' });
    } else {
      res.status(404).json({ error: 'FactureAP not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting FactureAP' });
  }
};

module.exports = {
  getAllFactureAPs,
  getFactureAPByFaId,
  updateFactureAPByFaId,
  deleteFactureAPByFaId,
};
