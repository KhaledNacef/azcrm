const express = require('express');
const router = express.Router();
const { createBs, deleteBs, getAllBss, getAllStockItemsByBs } = require('../controler/blv');

// Route to create a new Bs
router.post('/bs/create', createBs);

// Route to get all Bss
router.get('/bs/get', getAllBss);

// Route to get all stock items by Bs code
router.get('/bs/stock/:code', getAllStockItemsByBs);

// Route to delete a Bs by ID
router.delete('/bs/:BsId', deleteBs);

module.exports = router;
