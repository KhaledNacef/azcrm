const Sequelize = require('sequelize');
const db  = require('../index'); 
const DeliveryNote =db.models.deliveryNote
const Stock =db.models.stock
const StockP =db.models.stockP







const getAllStockItemsByDeliveryNote = async (req, res) => {
  try {
    const { code } = req.params; // Assuming `code` is passed in the request body



    // Fetch all Stock items where BaId matches the DeliveryNote's id
    const stocks = await Stock.findAll({
      where: { BaId: code },
    });

    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching stock items by delivery note code:', error);
    res.status(500).json({ error: 'Failed to fetch stock items' });
  }
};




async function getAllDeliveryNotes(req, res) {
  try {
    // Fetch all delivery notes with their associated stock entries
    const deliveryNotes = await DeliveryNote.findAll();

    return res.status(200).json(deliveryNotes);
  } catch (error) {
    console.error('Error fetching delivery notes:', error);
    return res.status(500).json({
      error: 'Failed to fetch delivery notes',
    });
  }

}






// Controller to create a DeliveryNote
async function createDeliveryNote(req, res) {
  try {
    const {code, spulierId, timbre, products,spulierName} = req.body;

    // Step 1: Create the DeliveryNote (Bon d'achat)
    const deliveryNote = await DeliveryNote.create({
      spulierId:spulierId,
      timbre:timbre,
      code:code,
      spulierName:spulierName
    });

    // Step 2: Handle stock and stockP for each product
    const stockPromises = products.map(async (product) => {
      const { prixU_HT, tva, quantite, designation, Unite } = product;

      // **Step 2.1: Create a new Stock entry (always linked to the DeliveryNote)**
      await Stock.create({
        prixU_HT:prixU_HT,
        tva:tva,
        quantite:quantite,
        designation:designation,
        Unite:Unite,
        BaId:code
      });

      // **Step 2.2: Handle StockP (general stock)**
      const stockP = await StockP.findOne({
        where: {
          designation,
        },
      });

      if (stockP) {
        // If the StockP entry exists, update tva, prixU_HT, and add quantity
        await stockP.update(
          {
            prixU_HT:prixU_HT, // Update the price
            tva:tva, // Update the TVA
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
          prixU_HT:prixU_HT,
          tva:tva,
          quantite:quantite,
          designation:designation,
          Unite:Unite,
        });
      }
    });

    // Wait for all Stock and StockP entries to be processed
    await Promise.all(stockPromises);

    return res.status(201).json({
      message: 'DeliveryNote, Stock, and StockP successfully created',
      deliveryNote,
    });
  } catch (error) {
    console.error('Error creating DeliveryNote, Stock, and StockP:', error);
    return res.status(500).json({
      error: 'Failed to create DeliveryNote, Stock, and StockP',
    });
  }
}

// Controller to delete a DeliveryNote and associated Stock
async function deleteDeliveryNote(req, res) {
  try {
    const { deliveryNoteId } = req.params;

    // Step 1: Find the DeliveryNote by ID
    const deliveryNote = await DeliveryNote.findByPk(deliveryNoteId);
    if (!deliveryNote) {
      return res.status(404).json({
        error: 'DeliveryNote not found',
      });
    }

    // Step 2: Delete the associated Stock entries first
    await Stock.destroy({
      where: {
        BaId: deliveryNoteId, // Match by the DeliveryNote ID (BaId)
      },
    });

    // Step 3: Now delete the DeliveryNote
    await deliveryNote.destroy();

    return res.status(200).json({
      message: 'DeliveryNote and associated Stock deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting DeliveryNote and Stock:', error);
    return res.status(500).json({
      error: 'Failed to delete DeliveryNote and Stock',
    });
  }
}

module.exports = {
  createDeliveryNote,
  deleteDeliveryNote,getAllDeliveryNotes,getAllStockItemsByDeliveryNote
};
