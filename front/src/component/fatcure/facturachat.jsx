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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreatebcModala from './createa.jsx'; // Ensure correct file name
import axios from 'axios';

const Boncommande = () => {
  const navigate = useNavigate();
  
  // State to hold the delivery notes
  const [deliveryNotes, setDeliveryNotes] = useState([]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
    fetchDeliveryNotes();
  };

  // Fetch delivery notes from the backend
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/boncommandall/factures/get'); // Adjust URL as needed
      setDeliveryNotes(response.data); // Assuming API returns an array of delivery notes
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  // Filtered delivery notes based on search query
  const filteredDeliveryNotes = deliveryNotes.filter((note) =>
    note.codey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        BON DE COMMANDE
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

      {/* Button to open the modal for creating a new delivery note */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Créer un Bon De Commande
      </Button>

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
          {filteredDeliveryNotes && Array.isArray(filteredDeliveryNotes) && filteredDeliveryNotes.length > 0 ? (
            filteredDeliveryNotes.map((note) => (
              <TableRow key={note.id || note.code}> {/* Use a unique identifier */}
                <TableCell>{note.codey}</TableCell>
                <TableCell>{note.spulierName || "N/A"}</TableCell>
                <TableCell>{note.timbre ? "Oui" : "Non"}</TableCell>
                <TableCell>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/bon-commandea/${note.code}/${note.spulierId}/${note.codey}/${note.timbre}`)}
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
            width: 500,
          }}
        >
          <CreatebcModala onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Boncommande;
