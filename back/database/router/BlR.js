const express = require('express');
const {
  createDeliveryNote,
  deleteDeliveryNote,
  getAllDeliveryNotes,
  getAllStockItemsByDeliveryNote
  
} = require('../controler/BlC');

const router = express.Router();

// Routes for delivery notes
router.get('/stock/getallstockdelv', getAllStockItemsByDeliveryNote);

router.get('/stock/getall', getAllDeliveryNotes);
router.post('/stock/add/:delid', createDeliveryNote);
router.delete('/stock/delete/:id', deleteDeliveryNote);

module.exports = router;
