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
  Snackbar,
  Alert,
} from '@mui/material';

const FournisseurPage = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '', pays: '', ville: '', tel: '', fax: '', codePostal: '', address: '',  matriculefisacl: ''
  });
  const [editData, setEditData] = useState(null);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/suplier/getsuppliers');
      setFournisseurs(response.data);
      setFilteredFournisseurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs :", error);
      setSnackbarMessage('Erreur lors de la récupération des fournisseurs');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFournisseurs(fournisseurs.filter(f => f.fullname.toLowerCase().includes(query)));
  };

  const handleAddFournisseur = async () => {
    try {
      const response = await axios.post('https://api.azcrm.deviceshopleader.com/api/suplier/suppliers', formData);
      setFournisseurs([...fournisseurs, response.data.supplier]);
      setFilteredFournisseurs([...fournisseurs, response.data.supplier]);
      setOpenAddDialog(false);
      setSnackbarMessage('Fournisseur ajouté avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout du fournisseur :", error);
      setSnackbarMessage('Erreur lors de l\'ajout du fournisseur');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditFournisseur = (fournisseur) => {
    setEditData(fournisseur);
    setOpenEditDialog(true);
  };

  const handleUpdateFournisseur = async () => {
    try {
      await axios.put(`https://api.azcrm.deviceshopleader.com/api/suplier/upsuppliers/${editData.id}`, editData);
      setFournisseurs(fournisseurs.map(f => (f.id === editData.id ? editData : f)));
      setFilteredFournisseurs(fournisseurs.map(f => (f.id === editData.id ? editData : f)));
      setOpenEditDialog(false);
      setSnackbarMessage('Fournisseur mis à jour avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du fournisseur :", error);
      setSnackbarMessage('Erreur lors de la mise à jour du fournisseur');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteFournisseur = async (id) => {
    try {
      await axios.delete(`https://api.azcrm.deviceshopleader.com/api/suplier/delsuppliers/${id}`);
      setFournisseurs(fournisseurs.filter(f => f.id !== id));
      setFilteredFournisseurs(filteredFournisseurs.filter(f => f.id !== id));
      setSnackbarMessage('Fournisseur supprimé avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la suppression du fournisseur :", error);
      setSnackbarMessage('Erreur lors de la suppression du fournisseur');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Fournisseurs</Typography>
      <TextField label="Rechercher" variant="outlined" fullWidth value={searchQuery} onChange={handleSearch} sx={{ mb: 2 }} />
      <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>Ajouter Fournisseur</Button>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFournisseurs.map(f => (
              <TableRow key={f.id}>
                <TableCell>{f.fullname}</TableCell>
                <TableCell>{f.pays}</TableCell>
                <TableCell>{f.ville}</TableCell>
                <TableCell>{f.tel}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEditFournisseur(f)}>Modifier</Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteFournisseur(f.id)} sx={{ ml: 1 }}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Supplier Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Ajouter Fournisseur</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map(key => (
            <TextField key={key} label={key} fullWidth margin="dense" variant="outlined" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Annuler</Button>
          <Button onClick={handleAddFournisseur} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Supplier Dialog */}
      {editData && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Modifier Fournisseur</DialogTitle>
          <DialogContent>
            {Object.keys(editData).map(key => (
              <TextField key={key} label={key} fullWidth margin="dense" variant="outlined" value={editData[key]} onChange={(e) => setEditData({ ...editData, [key]: e.target.value })} />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
            <Button onClick={handleUpdateFournisseur} color="primary">Mettre à jour</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbarOpen}   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FournisseurPage;
