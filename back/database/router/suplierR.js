const express = require('express');
const {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
  getidSuppliers
} = require('../controler/suplier'); // Adjust the path to your controller

const router = express.Router();

// Route to create a supplier
router.post('/suppliers', createSupplier);
router.get('/getsuppliers', getAllSuppliers);
router.get('/getidsuppliers', getidSuppliers);

// Route to update a supplier
router.put('/upsuppliers/:id', updateSupplier);

// Route to delete a supplier
router.delete('/delsuppliers/:id', deleteSupplier);

module.exports = router;
