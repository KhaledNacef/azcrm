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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateDeliveryNoteModala from './crate.jsx';

const BonAchatPage = () => {
  const navigate = useNavigate();

  // States
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [todayInvoicesCount, setTodayInvoicesCount] = useState(0);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bonachat/stock/getall');
      setDeliveryNotes(response.data);
      setFilteredNotes(response.data);
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

  // Handle date changes
  const handleStartDateChange = (date) => {
    setStartDate(date);
    applyFilters(searchQuery, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    applyFilters(searchQuery, startDate, date);
  };

  const resetDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
    applyFilters(searchQuery, null, null);
  };

  // Apply all filters
  const applyFilters = (search = searchQuery, start = startDate, end = endDate) => {
    let filtered = [...deliveryNotes];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(note =>
        note.num?.toLowerCase().includes(search.toLowerCase()) ||
        note.spulierName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply date filters
    if (start || end) {
      filtered = filtered.filter(note => {
        if (!note.createdAt) return false;
        
        const noteDate = new Date(note.createdAt);
        const startDateObj = start ? new Date(start) : null;
        const endDateObj = end ? new Date(end) : null;

        if (startDateObj) startDateObj.setHours(0, 0, 0, 0);
        if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

        const afterStart = !startDateObj || noteDate >= startDateObj;
        const beforeEnd = !endDateObj || noteDate <= endDateObj;

        return afterStart && beforeEnd;
      });
    }

    setFilteredNotes(filtered);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, startDate, endDate);
  };

  // Count today's invoices
  const countTodayInvoices = (notes) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const count = notes.filter(note => {
      if (!note.createdAt) return false;
      const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
      return noteDate === todayString;
    }).length;
    
    setTodayInvoicesCount(count);
  };

  // Handle reteune creation
  const handleCreateReteune = async () => {
    if (!selectedNote) return;

    try {
      const payload = {
        num: selectedNote.num,
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
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
        }}
      />
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ m: 2 }}>
        Créer un Bon D'ACHAT
      </Button>

      {/* Date Filters */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={handleStartDateChange}
            format="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Date de fin"
            value={endDate}
            onChange={handleEndDateChange}
            format="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} />}
          />
          {(startDate || endDate) && (
            <Button onClick={resetDateFilters} variant="outlined" sx={{ ml: 2 }}>
              Réinitialiser
            </Button>
          )}
        </Box>
      </LocalizationProvider>

      <TextField
        label="Rechercher par Code ou Fournisseur"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
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
              <TableRow key={note.id}>
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
            Êtes-vous sûr de vouloir créer un retour pour le bon {selectedNote?.num} ?
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

      {/* Modal for creating new delivery note */}
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
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default BonAchatPage;