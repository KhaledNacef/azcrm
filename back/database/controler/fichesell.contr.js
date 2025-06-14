const db = require('../index');
const Recipem = db.models.recipem


exports.createRecipem = async (req, res) => {
  try {
    const { recipes } = req.body;

    // Validate input
    if (!Array.isArray(recipes)) {
      return res.status(400).json({ error: 'Recipes must be provided as an array' });
    }

    // Validate each recipe structure
 
    // Calculate totals
    const totalcosts = recipes.reduce((sum, recipe) => sum + recipe.totalcosts, 0);
    const totalTTC = recipes.reduce((sum, recipe) => sum + recipe.totalTTC, 0);

    // Create the collection
    const recipem = await Recipem.create({
      recipes: recipes,
      totalcosts,
      totalprofit:totalTTC
    });

    res.status(201).json(recipem);

  } catch (error) {
    console.error('Error creating Recipem:', error);
    
    let errorMessage = 'Failed to create recipe collection';
    if (error.message === 'Invalid recipe format') {
      errorMessage = 'Each recipe must contain: name, sellingPrice, quantite, totalcost, profit, totalTTC, totalcosts';
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'This collection already exists';
    }

    res.status(400).json({ 
      error: errorMessage,
      details: error.message
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
