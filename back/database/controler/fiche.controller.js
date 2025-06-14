const db = require('../index');
const Recipe = db.models.recipe;


exports.createRecipe = async (req, res) => {
  try {
   const { name, sellingPrice, ingredients } = req.body;

if (!name || !sellingPrice || !Array.isArray(ingredients)) {
  return res.status(400).json({ error: 'Missing or invalid required fields' });
}

const totalcost = ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
const profit = sellingPrice - totalcost;

const recipe = await Recipe.create({
  name:name,
  sellingPrice:sellingPrice,
  ingredients:ingredients,
  totalcost:parseFloat(totalcost),
  profit:parseFloat(profit)
});

    res.status(201).json(recipe);

  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(400).json({ error: 'Invalid data' });
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