const { Bs, Stock, StockP } = require('../models'); // Adjust model imports
const Sequelize = require('sequelize');
const Op = Sequelize.Op;





const getAllStockItemsByBs = async (req, res) => {
  try {
    const { code } = req.body; // Assuming `code` is passed in the request body



    // Fetch all Stock items where BaId matches the Bs's id
    const stocks = await Stock.findAll({
      where: { BaId: code },
    });

    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching stock items by delivery note code:', error);
    res.status(500).json({ error: 'Failed to fetch stock items' });
  }
};




async function getAllBss(req, res) {
  try {
    // Fetch all delivery notes with their associated stock entries
    const Bss = await Bs.findAll();

    return res.status(200).json({
      message: 'Delivery notes fetched successfully',
      Bss,
    });
  } catch (error) {
    console.error('Error fetching delivery notes:', error);
    return res.status(500).json({
      error: 'Failed to fetch delivery notes',
    });
  }
}






// Controller to create a Bs
async function createBs(req, res) {
  try {
    const { spulierId, timbre, products,code } = req.body;

    // Step 1: Create the Bs (Bon d'achat)
    const Bs = await Bs.create({
      spulierId,
      timbre,
      code
    });

    // Step 2: Handle stock and stockP for each product
    const stockPromises = products.map(async (product) => {
      const {
        prixU_HT,
        quantite,
        designation,
        Unite,
      } = product;

      // **Step 2.1: Create a new Stock entry (always linked to the Bs)**
      await Stock.create({
        prixU_HT,
        tva,
        quantite,
        designation,
        Unite,
        BaId: code, // Link Stock with Bs ID
      });

      // **Step 2.2: Handle StockP (general stock)**
      const stockP = await StockP.findOne({
        where: {
          designation,
        },
      });

      if (stockP) {
        // If the StockP entry exists, update tva, prixU_HT, and add quantity
        await StockP.update(
          {
            prixU_HT, // Update the price
            tva, // Update the TVA
            quantite: stockP.quantite + quantite, // Add the new quantity to the existing quantity
          },
          {
            where: {
              designation,
            },
          }
        );
      } else {
        // If the StockP entry does not exist, create a new one
        await StockP.create({
          prixU_HT,
          tva,
          quantite,
          designation,
          Unite,
        });
      }
    });

    // Wait for all Stock and StockP entries to be processed
    await Promise.all(stockPromises);

    return res.status(201).json({
      message: 'Bs, Stock, and StockP successfully created',
      Bs,
    });
  } catch (error) {
    console.error('Error creating Bs, Stock, and StockP:', error);
    return res.status(500).json({
      error: 'Failed to create Bs, Stock, and StockP',
    });
  }
}

// Controller to delete a Bs and associated Stock
async function deleteBs(req, res) {
  try {
    const { BsId } = req.params;

    // Step 1: Find the Bs by ID
    const Bs = await Bs.findByPk(BsId);
    if (!Bs) {
      return res.status(404).json({
        error: 'Bs not found',
      });
    }

    // Step 2: Delete the associated Stock entries first
    await Stock.destroy({
      where: {
        BaId: BsId, // Match by the Bs ID (BaId)
      },
    });

    // Step 3: Now delete the Bs
    await Bs.destroy();

    return res.status(200).json({
      message: 'Bs and associated Stock deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Bs and Stock:', error);
    return res.status(500).json({
      error: 'Failed to delete Bs and Stock',
    });
  }
}

module.exports = {
  createBs,
  deleteBs,getAllBss,getAllStockItemsByBs
};
