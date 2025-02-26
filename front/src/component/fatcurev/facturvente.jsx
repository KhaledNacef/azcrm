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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Createbv from './createbv.jsx';
import axios from 'axios';

const Boncommandev = () => {
  const navigate = useNavigate();
  const [deliveryNotes, setDeliveryNotes] = useState([]); // State for storing delivery notes
  const [open, setOpen] = useState(false); // Modal state

  // Function to fetch delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/bonlivraison/facturev/get');
      console.log("API Response:", response.data); // ✅ Debugging log
      setDeliveryNotes(response.data); // ✅ Ensure it's always an array
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Bon De Sortie
      </Typography>

      {/* Button to create a new delivery note */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Créer un Bon De Livraison
      </Button>

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
  {deliveryNotes.length > 0 ? (
    deliveryNotes.map((note) => (
      <TableRow key={note.code}>
        <TableCell>{note.code}</TableCell>
        <TableCell>{note.clientId || "N/A"}</TableCell>
        <TableCell>{note.timbre ? "Oui" : "Non"}</TableCell>
        <TableCell>
          {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            onClick={() => navigate(`/bon-commandefacturee/${note.code}/${note.clientId}`)}
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
