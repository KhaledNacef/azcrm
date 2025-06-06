const db  = require('../index'); // Adjust the path to your model as needed

const Supplier =db.models.supplier
async function getAllSuppliers(req, res) {
  try {
    const suppliers = await Supplier.findAll();
    return res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({
      error: 'Failed to fetch suppliers',
    });
  }
}

async function getidSuppliers(req, res) {
  try {
    const { id } = req.params; // Extract ID from request parameters
    const parsedId = parseInt(id, 10); // Ensure id is an integer

    if (!parsedId) {
      return res.status(400).json({ error: 'Supplier ID is required' });
    }

    const supplier = await Supplier.findByPk(parsedId);

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    return res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return res.status(500).json({ error: 'Failed to fetch supplier' });
  }
}


// Create a new supplier
async function createSupplier(req, res) {
  try {
    const { fullname, pays, ville, tel, fax, codePostal, address,matriculefisacl } = req.body;

    const newSupplier = await Supplier.create({
      fullname,
      pays,
      ville,
      tel,
      fax,
      codePostal,
      address,
      matriculefisacl
    });

    return res.status(201).json({
      message: 'Supplier created successfully',
      supplier: newSupplier,
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({
      error: 'Failed to create supplier',
    });
  }
}

// Update an existing supplier
async function updateSupplier(req, res) {
  try {
    const { id } = req.params;
    const { fullname, pays, ville, tel, fax, codePostal, address, matriculefisacl } = req.body;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier not found',
      });
    }

    const updatedSupplier = await supplier.update({
      fullname,
      pays,
      ville,
      tel,
      fax,
      codePostal,
      address,
      matriculefisacl
    });

    return res.status(200).json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({
      error: 'Failed to update supplier',
    });
  }
}

// Delete a supplier
async function deleteSupplier(req, res) {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier not found',
      });
    }

    await supplier.destroy();

    return res.status(200).json({
      message: 'Supplier deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({
      error: 'Failed to delete supplier',
    });
  }
}

module.exports = {
  createSupplier,
  updateSupplier,
  deleteSupplier,getAllSuppliers,getidSuppliers
};
