// productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controler/product'); // Adjust the path accordingly

// Route to get all products
router.get('/getallp', productController.getAllProducts);

// Route to get a product by ID
router.get('/getprod/:id', productController.getProductById);

// Route to create a new product
router.post('/createproduct', productController.createProduct);

// Route to update an existing product
router.put('/upprod/:id', productController.updateProduct);

// Route to delete a product
router.delete('/proddel/:id', productController.deleteProduct);

module.exports = router;
