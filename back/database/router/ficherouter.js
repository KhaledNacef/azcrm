const express = require('express');
const router = express.Router();
const recipeController = require('../controler/fiche.controller');

// Create a new recipe
router.post('/createf', recipeController.createRecipe);

// Get all recipes
router.get('/getallf', recipeController.getAllRecipes);

// Get a single recipe by ID
router.get('/ficheid/:id', recipeController.getRecipeById);

module.exports = router;