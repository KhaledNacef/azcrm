const db = require('../index');
const Recipem = db.models.recipem


exports.createRecipem = async (req, res) => {
  try {
    // Accept either direct array or { recipes } format
    let recipes = Array.isArray(req.body) ? req.body : req.body.recipes;

    if (!Array.isArray(recipes)) {
      return res.status(400).json({ 
        error: 'Payload must be an array of recipes or { recipes: [...] }' 
      });
    }

    // Validate each recipe
    const validatedRecipes = recipes.map(recipe => {
      if (!recipe || typeof recipe !== 'object') {
        throw new Error('Each recipe must be an object');
      }
      
      return {
        name: String(recipe.name || ''),
        sellingPrice: parseFloat(recipe.sellingPrice) || 0,
        quantite: parseInt(recipe.quantite) || 1,
        totalcost: parseFloat(recipe.totalcost) || 0,
        profit: parseFloat(recipe.profit) || 0,
        totalTTC: parseFloat(recipe.totalTTC || recipe.totalTCT || 0), // Handle both spellings
        totalcosts: parseFloat(recipe.totalcosts) || 0
      };
    });

    // Calculate totals
    const totalcosts = validatedRecipes.reduce((sum, r) => sum + r.totalcosts, 0);
    const totalTTC = validatedRecipes.reduce((sum, r) => sum + r.totalTTC, 0);

    const recipem = await Recipem.create({
      recieps: validatedRecipes,
      totalcosts,
      totalprofit:totalTTC
    });

    res.status(201).json(recipem);

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ 
      error: error.message || 'Invalid data format',
      details: error.stack // For debugging
    });
  }
};
exports.getAllRecipesM = async (req, res) => {
  try {
    const recipes = await Recipem.findAll();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recipes' });
  }
};

exports.getRecipeByIdM = async (req, res) => {
  try {
    const recipe = await Recipem.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recipe' });
  }
};
