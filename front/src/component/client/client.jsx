import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClient, setCurrentClient] = useState({ fullName: '', tel: '', fax: '', adresse: '', societe: '' });

  useEffect(() => {
    // Fetch clients data from the backend API
    axios.get('https://195.200.15.61/api/clients/getclient')
      .then((response) => {
        setClients(response.data);
        setFilteredClients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients data:", error);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = clients.filter(
      (client) =>
        client.fullName.toLowerCase().includes(query) ||
        client.tel.toString().includes(query) ||
        client.fax.toString().includes(query) ||
        client.adresse.toLowerCase().includes(query) ||
        client.societe.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  const handleOpenDialog = (client = null) => {
    setEditMode(!!client);
    setCurrentClient(client || { fullName: '', tel: '', fax: '', adresse: '', societe: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveClient = () => {
    if (editMode) {
      // Update the client via API
      axios.put(`https://195.200.15.61/api/clients/upclient/${currentClient.id}`, currentClient)
        .then((response) => {
          setClients((prevClients) =>
            prevClients.map((c) => (c.id === currentClient.id ? response.data : c))
          );
          setFilteredClients((prevClients) =>
            prevClients.map((c) => (c.id === currentClient.id ? response.data : c))
          );
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Error updating client:", error);
        });
    } else {
      // Create a new client via API
      axios.post('https://195.200.15.61/api/clients/addclient', currentClient)
        .then((response) => {
          setClients([...clients, response.data]);
          setFilteredClients([...clients, response.data]);
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Error creating client:", error);
        });
    }
  };

  const handleDeleteClient = (clientId) => {
    // Delete client via API
    axios.delete(`https://195.200.15.61/api/clients/delclient/${clientId}`)
      .then(() => {
        const remainingClients = clients.filter((client) => client.id !== clientId);
        setClients(remainingClients);
        setFilteredClients(remainingClients);
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clients
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add Client
      </Button>

      <TextField
        label="Search by Name, Tel, Fax, or Address"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Full Name</strong></TableCell>
              <TableCell><strong>Phone (Tel)</strong></TableCell>
              <TableCell><strong>Fax</strong></TableCell>
              <TableCell><strong>Address</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.fullName}</TableCell>
                <TableCell>{client.tel}</TableCell>
                <TableCell>{client.fax}</TableCell>
                <TableCell>{client.adresse}</TableCell>
                <TableCell>{client.societe}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(client)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteClient(client.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Client' : 'Add Client'}</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth value={currentClient.fullName} onChange={(e) => setCurrentClient({ ...currentClient, fullName: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Phone (Tel)" fullWidth value={currentClient.tel} onChange={(e) => setCurrentClient({ ...currentClient, tel: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Fax" fullWidth value={currentClient.fax} onChange={(e) => setCurrentClient({ ...currentClient, fax: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Address (Adresse)" fullWidth value={currentClient.adresse} onChange={(e) => setCurrentClient({ ...currentClient, adresse: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Company Name (Societe)" fullWidth value={currentClient.societe} onChange={(e) => setCurrentClient({ ...currentClient, societe: e.target.value })} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveClient} color="primary">{editMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientPage;
