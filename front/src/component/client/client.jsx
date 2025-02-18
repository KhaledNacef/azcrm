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
  const [currentClient, setCurrentClient] = useState({ fullName: '', tel: '', fax: '', adresse: '', ville: '', pays: '' });

  useEffect(() => {
    // Fetch clients data from the backend API
    axios.get('https://api.azcrm.deviceshopleader.com/api/clients/getclient')
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
        client.ville.toLowerCase().includes(query) ||
        client.pays.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  const handleOpenDialog = (client = null) => {
    setEditMode(!!client);
    setCurrentClient(client || { fullName: '', tel: '', fax: '', adresse: '', ville: '', pays: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveClient = () => {
    if (editMode) {
      // Update the client via API
      axios.put(`https://api.azcrm.deviceshopleader.com/api/clients/upclient/${currentClient.id}`, currentClient)
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
      axios.post('https://api.azcrm.deviceshopleader.com/api/clients/addclient', currentClient)
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
    axios.delete(`https://api.azcrm.deviceshopleader.com/api/clients/delclient/${clientId}`)
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
        Ajouter un Client
      </Button>

      <TextField
        label="Rechercher par Nom, Tel, Fax, ou Adresse"
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
              <TableCell><strong>Nom Complet</strong></TableCell>
              <TableCell><strong>Téléphone (Tel)</strong></TableCell>
              <TableCell><strong>Fax</strong></TableCell>
              <TableCell><strong>Adresse</strong></TableCell>
              <TableCell><strong>Ville</strong></TableCell>
              <TableCell><strong>Pays</strong></TableCell>
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
                <TableCell>{client.ville}</TableCell>
                <TableCell>{client.pays}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(client)}>
                    Modifier
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteClient(client.id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Modifier Client' : 'Ajouter Client'}</DialogTitle>
        <DialogContent>
          <TextField label="Nom Complet" fullWidth value={currentClient.fullName} onChange={(e) => setCurrentClient({ ...currentClient, fullName: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Téléphone (Tel)" fullWidth value={currentClient.tel} onChange={(e) => setCurrentClient({ ...currentClient, tel: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Fax" fullWidth value={currentClient.fax} onChange={(e) => setCurrentClient({ ...currentClient, fax: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Adresse" fullWidth value={currentClient.adresse} onChange={(e) => setCurrentClient({ ...currentClient, adresse: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Ville" fullWidth value={currentClient.ville} onChange={(e) => setCurrentClient({ ...currentClient, ville: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Pays" fullWidth value={currentClient.pays} onChange={(e) => setCurrentClient({ ...currentClient, pays: e.target.value })} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Annuler</Button>
          <Button onClick={handleSaveClient} color="primary">{editMode ? 'Mettre à Jour' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientPage;
