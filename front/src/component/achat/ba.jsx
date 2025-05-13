import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BonAchatPage = () => {
  const navigate = useNavigate();

  // States
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bonachat/stock/getall');
      setDeliveryNotes(response.data);
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch delivery notes',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter notes based on search
  const filteredNotes = deliveryNotes.filter(note =>
    note.num?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle reteune creation
  const handleCreateReteune = async () => {
    if (!selectedNote) return;

    try {
      const payload = {
        num:selectedNote.num,
        spulierId: selectedNote.spulierId,
        timbre: selectedNote.timbre,
        code: selectedNote.code,
        spulierName: selectedNote.spulierName,
        codey: selectedNote.codey,
        Totalretune: 0,
      };

      await axios.post('https://api.azcrm.deviceshopleader.com/api/v1/reteune/retp', payload);
      
      setSnackbar({
        open: true,
        message: 'Reteune créé avec succès !',
        severity: 'success',
      });
      
      // Refresh the list
      fetchDeliveryNotes();
    } catch (error) {
      console.error('Erreur lors de la création du reteune :', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création du reteune',
        severity: 'error',
      });
    } finally {
      setOpenDialog(false);
    }
  };

  // Confirmation dialog handlers
  const handleOpenDialog = (note) => {
    setSelectedNote(note);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
      Facture
      </Typography>

      {/* Search Field */}
      <TextField
        label="Rechercher par Code"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Delivery Notes Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Fournisseur</TableCell>
            <TableCell>Timbre</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.code}>
              <TableCell>{note.num}</TableCell>
              <TableCell>{note.spulierName || 'N/A'}</TableCell>
                <TableCell>{note.timbre ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/bon-dachat/${note.code}/${note.spulierId}/${note.codey}/${note.timbre}/${note.num}`)}
                  >
                    Voir
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog(note)}
                  >
                    Créer Retour
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {loading ? 'Chargement...' : 'Aucune donnée disponible'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer la création</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir créer un retour pour le bon {selectedNote?.codey} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleCreateReteune} 
            color="primary"
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BonAchatPage;