const express = require('express');
const router = express.Router();
const { createBs, deleteBs, getAllBss, getAllStockItemsByBs, getAllStockItemsByBscodey,getAllStockT,getAllStockTE,getAllBssE } = require('../controler/blv');

// Route to create a new Bs
router.post('/create', createBs);

// Route to get all Bss
router.get('/bs/get', getAllBss);
router.get('/bsE/get', getAllBssE);

router.get('/bs/getST', getAllStockT);
router.get('/bs/getSTE', getAllStockTE);

// Route to get all stock items by Bs code
router.get('/bs/stock/:code', getAllStockItemsByBs);
router.get('/bs/codey/:codey', getAllStockItemsByBscodey);

// Route to delete a Bs by ID
router.delete('/bs/:BsId', deleteBs);

module.exports = router;
