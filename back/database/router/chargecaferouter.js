const express = require('express');
const router = express.Router();
const chargeCafeController = require('../controler/chargecontroler'); // Adjust path as needed

// Create a new ChargeCafe
router.post('/chargecreate', chargeCafeController.createchargecafe);

// Get all ChargeCafes
router.get('/chargeget', chargeCafeController.getAllchargecafe);

// Get a single ChargeCafe by ID
router.get('/chargegetid/:id', chargeCafeController.getchargecafeById);

// Delete a ChargeCafe
router.delete('/chargedel/:id', chargeCafeController.deletechargecafe);

module.exports = router;