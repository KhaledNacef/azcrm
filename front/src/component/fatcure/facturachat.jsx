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
  Modal,
  Chip,
  Paper,
  TableContainer
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreatebcModala from './createa.jsx'; // Ensure correct file name
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';



const Boncommande = () => {
  const navigate = useNavigate();
  
  // State to hold the delivery notes
  const [deliveryNotes, setDeliveryNotes] = useState([]);
    const [open, setOpen] = useState(false);
    const [todayInvoicesCount, setTodayInvoicesCount] = useState(0);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
const[bslocation,setBslocation] =useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
    
  };

  
  const handleChange = async (event) => {
      const selectedLocation = event.target.value;
      setBslocation(selectedLocation);
    
      if (selectedLocation === 'local') {
        await fetchLocalNotes();
      } else if (selectedLocation === 'etranger') {
        await fetchForeignNotes();
      }
    };
     const fetchLocalNotes = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/boncommandall/factures/get');
        setDeliveryNotes(response.data);
        countTodayInvoices(response.data);
        applyFilters(searchQuery, startDate, endDate, response.data); // 👈 pass data here
      } catch (error) {
        console.error('Error fetching local delivery notes:', error);
      }
    };
    
    const fetchForeignNotes = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/boncommandall/factures/getE');
        setDeliveryNotes(response.data);
        countTodayInvoices(response.data);
        applyFilters(searchQuery, startDate, endDate, response.data); // 👈 pass data here
      } catch (error) {
        console.error('Error fetching foreign delivery notes:', error);
      }
    };

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
  const applyFilters = (search = searchQuery, start = startDate, end = endDate, data = deliveryNotes) => {
    let filtered = [...data];

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
          Bon De Livraison Achat
        </Typography>

        <Chip 
          label={`${todayInvoicesCount} Bon De Livraison Achat aujourd'hui`}
          color="primary"
          variant="outlined"
          sx={{ 
            fontSize: '1rem', 
            padding: '8px 16px',
            m: 2 // Optional: adds margin below the chip if needed
          }}
        />

          <Button variant="contained" color="primary"  sx={{ m: 2 }} onClick={handleOpen}>
        Créer un Bon De Livraison
      </Button>

       <FormControl fullWidth sx={{  mb: 3}}>
                        <InputLabel id="location-label">Localisation</InputLabel>
                        <Select
                          labelId="location-label"
                          id="location-select"
                          value={bslocation}
                          label="Localisation"
                          onChange={handleChange}
                        >
                          <MenuItem value="local">Local</MenuItem>
                          <MenuItem value="etranger">Étranger</MenuItem>
                        </Select>
                      </FormControl>

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

      {/* Button to open the modal for creating a new delivery note */}
    

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
            <TableCell  sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Code</TableCell>
            <TableCell  sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Fournisseur</TableCell>
            <TableCell  sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Timbre</TableCell>
            <TableCell  sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Date</TableCell>
            <TableCell  sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            { filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell>{note.num}</TableCell>
                          <TableCell>{note.spulierName || 'N/A'}</TableCell>
                          <TableCell>{note.timbre ? 'Oui' : 'Non'}</TableCell>
                          <TableCell>
                            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/bon-commandea/${note.code}/${note.spulierId}/${note.codey}/${note.timbre}/${note.num}`)}
                  >
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>Aucune donnée disponible</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
   </TableContainer>

      {/* Modal for creating a new delivery note */}
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
          <CreatebcModala onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Boncommande;
