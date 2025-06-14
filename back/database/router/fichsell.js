const express = require('express');
const router = express.Router();
const recipeController = require('../controler/fichesell.contr');



// Recipem Routes
router.post('/mc', recipeController.createRecipem);      // Create a Recipem collection
router.get('/m', recipeController.getAllRecipesM);      // Get all Recipem collections
router.get('/mi/:id', recipeController.getRecipeByIdM);  // Get single Recipem collection

module.exports = router;