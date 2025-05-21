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
  Modal,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateDeliveryNoteModala from './crate.jsx'; // Ensure correct file name

const BonAchatPage = () => {
  const navigate = useNavigate();

  // States
  const [deliveryNotes, setDeliveryNotes] = useState([]);
    const [open, setOpen] = useState(false);
    const [todayInvoicesCount, setTodayInvoicesCount] = useState(0);
  
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
     countTodayInvoices(response.data);

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
  const addDeliveryNote = () => {
    handleClose();
    fetchDeliveryNotes();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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


  const countTodayInvoices = (notes) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
    const count = notes.filter(note => {
      const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
      return noteDate === todayString;
    }).length;
    
    setTodayInvoicesCount(count);
  };
 



  return (
    <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom> {/* gutterBottom adds spacing below */}
          Factures Achat
        </Typography>
        <Chip 
          label={`${todayInvoicesCount} Factures Achat aujourd'hui`}
          color="primary"
          variant="outlined"
          sx={{ 
            fontSize: '1rem', 
            padding: '8px 16px',
            m: 2,
             // Optional: adds margin below the chip if needed
          }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        Créer un Bon D'ACHAT
      </Button>
                   <TextField
        label="Rechercher par Code"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ m: 2 }}
      />

      {/* Search Field */}
    

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
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 500,
          }}
        >
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote}  />
        </Box>
      </Modal>
    </Box>
  );
};

export default BonAchatPage;