const db  = require('../index'); // Adjust the path to your model as needed

const Client =db.models.client
// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  const {id} = req.params;  // Correct extraction of ID
  const parsedId = parseInt(id, 10); // Ensure id is an integer

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: error.message });
  }
};


// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { fullname, pays, ville, tel, fax, address } = req.body;
    const newClient = await Client.create({ fullname, pays, ville, tel, fax, address });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    await client.update(req.body);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
