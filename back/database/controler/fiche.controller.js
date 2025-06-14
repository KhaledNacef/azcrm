const db = require('../database/index');
const Recipe = db.recipe;

exports.createRecipe = async (req, res) => {
  try {
    const { name, sellingPrice, ingredients } = req.body;

    // Basic validation
    if (!name || !sellingPrice || !ingredients) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array' });
    }

    // Calculate total cost
    const totalcost = ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
    const profit = sellingPrice - totalcost;

    // Create recipe
    const recipe = await Recipe.create({
      name,
      sellingPrice,
      ingredients,
      totalcost,
      profit
    });

    // Return simple response
    res.status(201).json(recipe);

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json( 
      
        'Invalid data'
    );
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recipes' });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recipe' });
  }
};