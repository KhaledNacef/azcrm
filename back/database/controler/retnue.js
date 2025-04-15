const db = require('../models');
const Reteune=db.models.reteune

// Create new reteune
exports.createReteune = async (req, res) => {
  try {
    const reteune = await Reteune.create(req.body);
    res.status(201).json(reteune);
  } catch (error) {
    console.error('Error creating Reteune:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get all reteunes
exports.getAllReteunes = async (req, res) => {
  try {
    const reteunes = await Reteune.findAll();
    res.status(200).json(reteunes);
  } catch (error) {
    console.error('Error fetching reteunes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get one reteune by ID
exports.getReteuneById = async (req, res) => {
  try {
    const id = req.params.id;
    const reteune = await Reteune.findByPk(id);
    if (!reteune) {
      return res.status(404).json({ message: 'Reteune non trouvé' });
    }
    res.status(200).json(reteune);
  } catch (error) {
    console.error('Error getting Reteune:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Delete reteune
exports.deleteReteune = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Reteune.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Reteune non trouvé' });
    }
    res.status(200).json({ message: 'Supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting Reteune:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
