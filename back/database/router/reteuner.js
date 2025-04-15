const express = require('express');
const router = express.Router();
const reteuneController = require('../controler/retnue');

// Create
router.post('/retp', reteuneController.createReteune);

// Get all
router.get('/reta', reteuneController.getAllReteunes);

// Get by ID
router.get('/retgeto/:id', reteuneController.getReteuneById);

// Delete
router.delete('/retd/:id', reteuneController.deleteReteune);

module.exports = router;
