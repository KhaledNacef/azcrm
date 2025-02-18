const express = require('express');
const router = express.Router();
const clientController = require('../controler/client');

// Routes for managing clients
router.get('/getclient', clientController.getAllClients);           // Get all clients
router.get('/:id', clientController.getClientById);       // Get client by ID
router.post('/addclient', clientController.createClient);          // Create a new client
router.put('/upclient/:id', clientController.updateClient);        // Update an existing client
router.delete('/delclient/:id', clientController.deleteClient);    // Delete a client

module.exports = router;
