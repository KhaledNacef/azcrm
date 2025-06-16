const db = require('../index'); 
const ChargeCafe=db.models.chargecafe

// Create new reteune
exports.createReteune = async (req, res) => {
  try {
    const chargeCafe = await ChargeCafe.create(req.body);
    res.status(201).json(chargeCafe);
  } catch (error) {
    console.error('Error creating ChargeCafe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get all reteunes
exports.getAllReteunes = async (req, res) => {
  try {
    const chargeCafe = await ChargeCafe.findAll();
    res.status(200).json(chargeCafe);
  } catch (error) {
    console.error('Error fetching ChargeCafe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get one reteune by ID
exports.getReteuneById = async (req, res) => {
  try {
    const id = req.params.id;
    const chargeCafe = await ChargeCafe.findByPk(id);
    if (!chargeCafe) {
      return res.status(404).json({ message: 'ChargeCafe non trouvé' });
    }
    res.status(200).json(chargeCafe);
  } catch (error) {
    console.error('Error getting ChargeCafe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Delete reteune
exports.deleteReteune = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ChargeCafe.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'ChargeCafe non trouvé' });
    }
    res.status(200).json({ message: 'Supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting ChargeCafe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
