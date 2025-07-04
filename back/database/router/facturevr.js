// routes/factureVRoutes.js
const express = require('express');
const router = express.Router();
const factureVController = require('../controler/factureVente');

// Route to fetch all FactureV entries
router.get('/facturev/get', factureVController.getAllFactureV);
router.get('/facturevE/get', factureVController.getAllFactureVe);

// Route to fetch FactureV by code
router.get('/facturev/:code', factureVController.getFactureVByCode);
router.get('/codey/:codey', factureVController.getFactureVBycodey);

// Route to create a new FactureV
router.post('/facturev', factureVController.createbv);

// Route to update FactureV by id
router.put('/facturev/:id', factureVController.updateFactureVById);

// Route to delete FactureV by id
router.delete('/facturev/:id', factureVController.deleteFactureVById);

module.exports = router;
