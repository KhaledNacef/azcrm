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
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Createbv from './createbv.jsx';
import axios from 'axios';

const Boncommandev = () => {
  const navigate = useNavigate();
  const [deliveryNotes, setDeliveryNotes] = useState([]); // State for storing delivery notes
  const [open, setOpen] = useState(false); // Modal state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [todayInvoicesCount, setTodayInvoicesCount] = useState(0);

  // Function to fetch delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bonlivraison/facturev/get');
      console.log('API Response:', response.data); // ✅ Debugging log
      setDeliveryNotes(response.data); // ✅ Ensure it's always an array
      countTodayInvoices(response.data);

    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  // Fetch delivery notes on component mount
  useEffect(() => {
    fetchDeliveryNotes();
  }, []); // ✅ Runs only once

  // Modal handlers
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

  const filteredNotes = deliveryNotes.filter((note) => {
    const formattedCode = formatCode(note.id, note.createdAt);
    return formattedCode.toLowerCase().includes(searchQuery.toLowerCase());
  });
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
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={handleOpen}>
        Créer un Bon De Livraison
      </Button>

       <TextField
        label="Rechercher par Code"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Delivery Notes Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Timbre</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.code}>
                <TableCell>{formatCode(note.id, note.createdAt)}</TableCell>
                <TableCell>{note.clientName || 'N/A'}</TableCell>
                <TableCell>{note.timbre}</TableCell>                
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
            width: 500,
          }}
        >
          <Createbv onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Boncommandev;
