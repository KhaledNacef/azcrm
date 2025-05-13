const Sequelize = require('sequelize');
const db  = require('../index'); 
const DeliveryNote =db.models.deliveryNote
const Stock =db.models.stock
const StockP =db.models.stockP
const StockH=db.models.stockH



const getAllStockhistory = async (req, res) => {
  try {



    // Fetch all Stock items where BaId matches the DeliveryNote's id
    const stocks = await StockH.findAll();

    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching stock items by delivery note code:', error);
    res.status(500).json({ error: 'Failed to fetch stock items' });
  }
};



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

const getAllStockItemsByDeliveryNotey = async (req, res) => {
  try {
    const { codey } = req.params; // Assuming `code` is passed in the request body



    // Fetch all Stock items where BaId matches the DeliveryNote's id
    const stocks = await Stock.findAll({
      where: { codey: codey },
    });

    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching stock items by delivery note codey:', error);
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
    const {code,num, spulierId, timbre, products, spulierName, codey} = req.body;

    // Create the DeliveryNote
    const deliveryNote = await DeliveryNote.create({
      num:num,
      spulierId: spulierId,
      timbre: timbre,
      code: code,
      spulierName: spulierName,
      codey: codey
    });

    // Process each product
    const stockPromises = products.map(async (product) => {
      const {prixU_HT, tva, quantite, designation, Unite, rem} = product;

      // Create Stock entry
      await Stock.create({
        prixU_HT: prixU_HT,
        tva: tva,
        quantite: quantite,
        designation: designation,
        Unite: Unite,
        BaId: code,
        codey: codey,
        rem: rem,
        moyenneprix: 0,
        dernierprixU_HT: 0
      });


      await StockH.create({
        prixU_HT: prixU_HT,
        tva: tva,
        quantite: quantite,
        designation: designation,
        Unite: Unite,
        rem: rem,
        codesuplier:num
      });

      // Handle StockP
      const stockP = await StockP.findOne({ where: { designation } });

      if (stockP) {
        const oldQty = stockP.quantite;
        const newQty = quantite;
        const totalQty = oldQty + newQty;

        if (stockP.moyenneprix && stockP.moyenneprix > 0) {
          // Case 1: moyenneprix exists
          const oldAvgPrice = stockP.moyenneprix;
          const newPrice = prixU_HT;
          
          const totalValue = (oldAvgPrice * oldQty) + (newPrice * newQty);
          const newAvgPrice = totalValue / totalQty;

          await stockP.update({
            prixU_HT: oldAvgPrice, // prixU_HT = old moyenne prix
            tva: tva,
            quantite: totalQty,
            moyenneprix: newAvgPrice, // recalculated moyenne
            dernierprixU_HT: newPrice, // dernier prix = new price
            Unite: Unite,
            rem: rem
          });
        } else {
          // Case 2: no moyenneprix
          const existingPrice = stockP.prixU_HT;
          const newPrice = prixU_HT;
          
          const totalValue = (existingPrice * oldQty) + (newPrice * newQty);
          const newAvgPrice = totalValue / totalQty;

          await stockP.update({
            prixU_HT: existingPrice, // keep existing prixU_HT
            tva: tva,
            quantite: totalQty,
            moyenneprix: newAvgPrice, // calculate new moyenne
            dernierprixU_HT: newPrice, // dernier prix = new price
            Unite: Unite,
            rem: rem
          });
        }
      } else {
        // New StockP entry
        await StockP.create({
          prixU_HT: prixU_HT,
          tva: tva,
          quantite: quantite,
          designation: designation,
          Unite: Unite,
          rem: rem,
          moyenneprix: 0, // initial moyenne = first price
          dernierprixU_HT: 0 // initial dernier prix = first price
        });
      }
    });

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
  deleteDeliveryNote,getAllDeliveryNotes,getAllStockItemsByDeliveryNote,getAllStockItemsByDeliveryNotey,getAllStockhistory
};
