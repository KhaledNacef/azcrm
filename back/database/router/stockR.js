const express = require('express');
const { sellProduct, getAllStockItems, deleteStockItem } = require('../controler/stockC');

const router = express.Router();

// Route to sell a product from stock
router.post('/sell', sellProduct);

// Route to get all stock items
router.get('/getall', getAllStockItems);

// Route to delete a specific stock item
router.delete('/delete/:id', deleteStockItem);

module.exports = router;
