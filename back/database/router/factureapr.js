// routes/factureAPRoutes.js
const express = require('express');
const router = express.Router();
const factureAPController = require('../controler/factureapc'); // Adjust the path as per your project structure

// Route to fetch all FactureAP entries
router.get('/factureap', factureAPController.getAllFactureAPs);

// Route to fetch FactureAP by faId
router.get('/factureap/:faId', factureAPController.getFactureAPByFaId);

// Route to create a new FactureAP
router.post('/factureap', factureAPController.createFactureAP);

// Route to update FactureAP by faId
router.put('/factureap/:faId', factureAPController.updateFactureAPByFaId);

// Route to delete FactureAP by faId
router.delete('/factureap/:faId', factureAPController.deleteFactureAPByFaId);

module.exports = router;
