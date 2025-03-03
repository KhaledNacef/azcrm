const db  = require('../index'); // Adjust the path to your model as needed
const Bs =db.models.bs
const Vente=db.models.vente
const StockP=db.models.stockP




const getAllStockItemsByBs = async (req, res) => {
  try {
    const { code } = req.params; // Assuming `code` is passed in the request body



    // Fetch all Stock items where BaId matches the Bs's id
    const stocks = await Vente.findAll({
      where: { code: code },
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

    return res.status(200).json(Bss);
  } catch (error) {
    console.error('Error fetching delivery notes:', error);
    return res.status(500).json({
      error: 'Failed to fetch delivery notess',
    });
  }
}


async function createBs(req, res) {
  try {
    const {code,clientId, timbre, products,clientName,codey } = req.body;

    // Step 1: Create the Bs (Bon de Sortie)
    const Bss = await Bs.create({
      clientId: clientId,
      timbre: timbre,
      code:code,
      clientName:clientName,
      codey:codey
    });

    // Step 2: Handle the products
    const stockPromises = products.map(async (product) => {
      const { prixU_HT, quantite, designation, Unite } = product;

      // Create a new Vente entry (always linked to the Bs)
      await Vente.create({
        prixU_HT: prixU_HT,
        net: prixU_HT * quantite,
        quantite: quantite,
        designation: designation,
        Unite: Unite,
        code:code
      });

      // Handle StockP (general stock)
      const stockP = await StockP.findOne({
        where: {
          designation,
        },
      });

      if (stockP) {
        // Update the StockP entry
        await stockP.update(
          {
         // Update the price
            quantite: stockP.quantite - quantite, // Deduct the sold quantity
          },
          {
            where: {
              designation,
            },
          }
        );
      }
    });

    // Wait for all Stock and StockP entries to be processed
    await Promise.all(stockPromises);

    return res.status(201).json({
      message: 'Bon de Sortie, Stock, and StockP successfully created',
      Bss,
    });
  } catch (error) {
    console.error('Error creating Bon de Sortie, Stock, and StockP:', error);
    return res.status(500).json({
      error: 'Failed to create Bon de Sortie, Stock, and StockP',
    });
  }
}



// Controller to delete a Bs and associated Stock
async function deleteBs(req, res) {
  try {
    const { BsId } = req.params;

    // Step 1: Find the Bs by ID
    const Bss = await Bs.findByPk(BsId);
    if (!Bss) {
      return res.status(404).json({
        error: 'Bs not found',
      });
    }

    // Step 2: Delete the associated Stock entries first
    await Vente.destroy({
      where: {
        code: BsId, // Match by the Bs ID (BaId)
      },
    });

    // Step 3: Now delete the Bs
    await Bss.destroy();

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
