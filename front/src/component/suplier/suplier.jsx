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

const FournisseurPage = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '', pays: '', ville: '', tel: '', fax: '', codePostal: '', address: '', codeTVA: ''
  });
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const mockFournisseurs = [
      { id: 1, fullname: 'Fournisseur A', pays: 'France', ville: 'Paris', tel: '0123456789', fax: '0123456789', codePostal: '75001', address: '10 Rue de Paris', codeTVA: 'FR123456789' },
      { id: 2, fullname: 'Fournisseur B', pays: 'Tunisie', ville: 'Tunis', tel: '9876543210', fax: '9876543210', codePostal: '1001', address: 'Avenue Habib Bourguiba', codeTVA: 'TN987654321' },
    ];
    setFournisseurs(mockFournisseurs);
    setFilteredFournisseurs(mockFournisseurs);
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFournisseurs(fournisseurs.filter(f => f.fullname.toLowerCase().includes(query)));
  };

  const handleAddFournisseur = () => {
    const newFournisseur = { id: fournisseurs.length + 1, ...formData };
    setFournisseurs([...fournisseurs, newFournisseur]);
    setFilteredFournisseurs([...fournisseurs, newFournisseur]);
    setOpenAddDialog(false);
  };

  const handleEditFournisseur = (fournisseur) => {
    setEditData(fournisseur);
    setOpenEditDialog(true);
  };

  const handleUpdateFournisseur = () => {
    setFournisseurs(fournisseurs.map(f => f.id === editData.id ? editData : f));
    setFilteredFournisseurs(fournisseurs.map(f => f.id === editData.id ? editData : f));
    setOpenEditDialog(false);
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
    </Box>
  );
};

export default FournisseurPage;
