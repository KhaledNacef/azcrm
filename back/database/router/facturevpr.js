// routes/factureVPRoutes.js
const express = require('express');
const router = express.Router();
const factureVPController = require('../controler/facturevp');

// Route to fetch all FactureVP entries
router.get('/facturevp', factureVPController.getAllFactureVP);

// Route to fetch FactureVP by code
router.get('/facturevp/:code', factureVPController.getFactureVPByCode);

// Route to create a new FactureVP

// Route to update FactureVP by id
router.put('/facturevp/:id', factureVPController.updateFactureVPById);

// Route to delete FactureVP by id
router.delete('/facturevp/:id', factureVPController.deleteFactureVPById);

module.exports = router;
