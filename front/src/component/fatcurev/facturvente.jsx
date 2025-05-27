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
  Modal,
  TextField,
  TableContainer,
  Paper,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Createbv from './createbv.jsx';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';



const Boncommandev = () => {
  const navigate = useNavigate();
 const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [todayInvoicesCount, setTodayInvoicesCount] = useState(0);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Function to fetch delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bonlivraison/facturev/get');
      console.log('API Response:', response.data); // ✅ Debugging log
      setDeliveryNotes(response.data); // ✅ Ensure it's always an array
      setFilteredNotes(response.data);
      countTodayInvoices(response.data);

    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  // Fetch delivery notes on component mount
  useEffect(() => {
    fetchDeliveryNotes();
  }, []); // ✅ Runs only once

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


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Function to refresh data after adding a note
  const addDeliveryNote = () => {
    handleClose();
    fetchDeliveryNotes(); // ✅ Refresh table after adding
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
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCode = (id, dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    return `${id}/${year}`; // Only ID and year
  };

  const applyFilters = (search = searchQuery, start = startDate, end = endDate) => {
    let filtered = [...deliveryNotes];

    // Apply search filter
   if (search) {
      filtered = filtered.filter(note => {
        const formattedCode = formatCode(note.id, note.createdAt);
        return (
          formattedCode.toLowerCase().includes(search.toLowerCase()) ||
          (note.clientName && note.clientName.toLowerCase().includes(search.toLowerCase()))
        );
      });
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

 
  return (
    <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom> {/* gutterBottom adds spacing below */}
        Bon De Livraison Vente
      </Typography>
      <Chip 
        label={`${todayInvoicesCount} Bon De Livraison Vente aujourd'hui`}
        color="primary"
        variant="outlined"
        sx={{ 
          fontSize: '1rem', 
          padding: '8px 16px',
          m: 2 // Optional: adds margin below the chip if needed
        }}
      />
      {/* Search bar */}
     

      {/* Button to create a new delivery note */}
      <Button variant="contained" color="primary" sx={{ m: 2 }} onClick={handleOpen}>
        Créer un Bon De Livraison
      </Button>

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
               label="Rechercher par Code ou Client"
               variant="outlined"
               fullWidth
               value={searchQuery}
               onChange={handleSearchChange}
               sx={{ mb: 3 }}
             />

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
                  <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Client</TableCell>
                  <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Timbre</TableCell>
                  <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Date</TableCell>
                  <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.code}>
                <TableCell>{formatCode(note.id, note.createdAt)}</TableCell>
                <TableCell>{note.clientName || 'N/A'}</TableCell>
                <TableCell>{note.timbre ? 'Oui' : 'Non'}</TableCell>                
                <TableCell>{formatDate(note.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/bon-commandefacturee/${note.code}/${note.clientId}/${note.codey}/${note.devise}/${note.id}/${note.createdAt}/${note.timbre}`)}
                  >
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Aucune donnée disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
      

      {/* Modal for creating a delivery note */}
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
          <Createbv onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Boncommandev;
