import React, { useState, useEffect } from 'react';
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
    const mockClients = [
      { id: 1, fullName: 'Client A', tel: '123456789', fax: '987654321', adresse: 'Address 1', societe: 'Company A' },
      { id: 2, fullName: 'Client B', tel: '234567890', fax: '876543210', adresse: 'Address 2', societe: 'Company B' },
      { id: 3, fullName: 'Client C', tel: '345678901', fax: '765432109', adresse: 'Address 3', societe: 'Company C' },
    ];
    setClients(mockClients);
    setFilteredClients(mockClients);
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
      setClients((prevClients) =>
        prevClients.map((c) => (c.id === currentClient.id ? currentClient : c))
      );
      setFilteredClients((prevClients) =>
        prevClients.map((c) => (c.id === currentClient.id ? currentClient : c))
      );
    } else {
      const newClient = { ...currentClient, id: clients.length + 1 };
      setClients([...clients, newClient]);
      setFilteredClients([...clients, newClient]);
    }
    handleCloseDialog();
  };

  const handleDeleteClient = (clientId) => {
    const remainingClients = clients.filter((client) => client.id !== clientId);
    setClients(remainingClients);
    setFilteredClients(remainingClients);
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
