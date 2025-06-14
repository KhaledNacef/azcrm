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

  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  TableContainer, 
  Paper,
  
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateDeliveryNoteModala from './cratef.jsx';

const Fiche = () => {
  const navigate = useNavigate();

  const [fiche, setFiche] = useState([]);
  const [open, setOpen] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch delivery notes

useEffect(() => {
      const fetchfiche = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/fiches/getallf');
      setFiche(response.data);
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
  
  fetchfiche();
  }, []);


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
  const applyFilters = (search = searchQuery, start = startDate, end = endDate, data = fiche) => {
    let filtered = [...data];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(note =>
        note.name?.toLowerCase().includes(search.toLowerCase()) ||
        note.id?.toLowerCase()
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



  const addDeliveryNote = () => {
    handleClose();
    fetchfiche();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Confirmation dialog handlers


  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
       FICHE TECHNIQUES
      </Typography>

    
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ m: 2 }}>
        Créer une Fiche technique
      </Button>
   

      {/* Date Filters */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3,mt:3 }}>
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
        label="Rechercher par nom"
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
     <TableContainer 
             component={Paper}
             sx={{
               maxHeight: '850px', // Set your desired max height
               overflow: 'auto'
             }}
           >
             <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Code</TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>designation</TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>total cout</TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>prix de vente</TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>profit</TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Date</TableCell>

            <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.id}>
               <TableCell>{note.id}</TableCell>
                <TableCell>{note.name}</TableCell>
                <TableCell>{note.totalcost }</TableCell>
                <TableCell>{note.sellingPrice }</TableCell>
                <TableCell>{note.profit }</TableCell>

                <TableCell>
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/fiche/${note.id}`)}
                  >
                    Voir
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
   </TableContainer>

      {/* Confirmation Dialog */}
     

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
      width: 800, // increased width
      maxWidth: '95vw', // optional for responsive design
    }}
  >
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Fiche;