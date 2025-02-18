const { StockP } = require('../models'); // Adjust the path to your models

// Sell a product from the stock
const sellProduct = async (req, res) => {
  const { designation, quantiteToSell } = req.body; // Provide the product designation and the quantity to sell

  try {
    // Find the product in the stock by its designation
    const stock = await StockP.findOne({ where: { designation } });

    if (!stock) {
      return res.status(404).json({ error: 'Product not found in stock' });
    }

    // Check if there's enough quantity to sell
    if (stock.quantite < quantiteToSell) {
      return res.status(400).json({ error: 'Not enough quantity in stock to sell' });
    }

    // Deduct the quantity
    stock.quantite -= quantiteToSell;

    // Recalculate netTTC and netHT
    stock.netTTC = stock.prixU_TTC * stock.quantite;
    stock.netHT = stock.prixU_HT * stock.quantite;

    if (stock.quantite <= 0) {
      // If quantity is zero, remove the product from the stock
      await stock.destroy();
      return res.status(200).json({ message: 'Product sold and removed from stock' });
    } else {
      // Otherwise, save the updated stock
      await stock.save();
      return res.status(200).json({ message: 'Product sold and stock updated', stock });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sell product from stock' });
  }
};

// Get all stock items
const getAllStockItems = async (req, res) => {
  try {
    const stocks = await StockP.findAll();
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock items' });
  }
};

// Delete a specific stock item (optional utility)
const deleteStockItem = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await StockP.findByPk(id);

    if (!stock) {
      return res.status(404).json({ error: 'Stock item not found' });
    }

    await stock.destroy();
    res.status(200).json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
};

module.exports = {
  sellProduct,
  getAllStockItems,
  deleteStockItem,
};
