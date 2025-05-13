const express = require('express');
const {
  createDeliveryNote,
  deleteDeliveryNote,
  getAllDeliveryNotes,
  getAllStockItemsByDeliveryNote,
  getAllStockItemsByDeliveryNotey,
  getAllStockhistory
} = require('../controler/BlC');

const router = express.Router();

// Routes for delivery notes
router.get('/stock/getallstockdelv/:code', getAllStockItemsByDeliveryNote);
router.get('/stock/codey/:codey', getAllStockItemsByDeliveryNotey);
router.get('/stock/getallSH', getAllStockhistory);

router.get('/stock/getall', getAllDeliveryNotes);
router.post('/add', createDeliveryNote);
router.delete('/stock/delete/:id', deleteDeliveryNote);
getAllStockhistory
module.exports = router;
