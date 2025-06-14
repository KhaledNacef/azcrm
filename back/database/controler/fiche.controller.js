const db = require('../index');
const Recipe = db.recipe;


exports.createRecipe = async (req, res) => {
  try {
    const { name, sellingPrice, ingredients } = req.body;

    // Basic validation matching model requirements
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Valid name (string) is required' });
    }

    if (typeof sellingPrice !== 'number' || isNaN(sellingPrice)) {
      return res.status(400).json({ error: 'Valid sellingPrice (number) is required' });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array' });
    }

    // Process ingredients according to model
    const processedIngredients = ingredients.map(ing => ({
      name: String(ing.name || ''),
      cost: parseFloat(ing.cost) || 0
    }));

    // Calculate derived fields
    const totalcost = processedIngredients.reduce((sum, ing) => sum + ing.cost, 0);
    const profit = sellingPrice - totalcost;

    // Create with model structure
    const recipe = await Recipe.create({
      name,
      sellingPrice,
      ingredients: processedIngredients,
      totalcost,
      profit
    });

    res.status(201).json(recipe);

  } catch (error) {
    console.error('Database error:', error);
    res.status(400).json({ 
      error: error.name === 'SequelizeValidationError'
        ? error.errors.map(e => e.message).join(', ')
        : 'Invalid data format'
    });
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