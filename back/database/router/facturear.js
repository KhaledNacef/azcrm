// routes/factureARoutes.js
const express = require('express');
const router = express.Router();
const factureAController = require('../controler/factureachat');

// Route to fetch all FactureA
router.get('/factures/get', factureAController.getAllFactureA);
router.get('/factures/getE', factureAController.getAllFactureAE);

// Route to fetch FactureA by code
router.get('/factures/:code', factureAController.getFactureAByCode);

// Route to add a new FactureA
router.post('/factures', factureAController.addFactureA);

// Route to delete FactureA by ID
router.delete('/factures/:id', factureAController.deleteFactureA);

module.exports = router;
