const express = require('express');
const {
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controler/suplier'); // Adjust the path to your controller

const router = express.Router();

// Route to create a supplier
router.post('/suppliers', createSupplier);

// Route to update a supplier
router.put('/suppliers/:id', updateSupplier);

// Route to delete a supplier
router.delete('/suppliers/:id', deleteSupplier);

module.exports = router;
