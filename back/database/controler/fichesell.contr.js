const db = require('../index');
const Recipem = db.recipem


exports.createRecipem = async (req, res) => {
  try {
    const { recipes } = req.body; // Expecting array of recipes

    // Basic validation
    if (!recipes || !Array.isArray(recipes)) {
      return res.status(400).json({ error: 'Recipes must be provided as an array' });
    }

    // Calculate totals by summing all recipes' values
    const { totalTTC, totalcost } = recipes.reduce(
      (totals, recipe) => ({
        totalTTC: totals.totalTTC + (recipe.totalTTC || 0),
        totalcost: totals.totalcost + (recipe.totalcosts || 0),
      }),
      { totalTTC: 0, totalcost: 0 }
    );

    // Create the Recipem entry
    const recipem = await Recipem.create({
      recipes, // Store the full array of recipes
      totalcosts:totalcost, // Sum of all recipe.totalcost
      totalprofit: totalTTC, // Calculated profit (TTC - cost)
    });

    // Return the created record
    res.status(201).json(recipem);

  } catch (error) {
    console.error('Error creating Recipem:', error);
    res.status(400).json({
      error: error.name === 'SequelizeUniqueConstraintError'
        ? 'This collection already exists'
        : 'Failed to create recipe collection'
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
