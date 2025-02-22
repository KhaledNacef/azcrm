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
import CreateDeliveryNoteModal from './cratebl.jsx';
import axios from 'axios';

const BonsortiePage = () => {
  const navigate = useNavigate();
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [open, setOpen] = useState(false); // Modal state
  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';
  // Fetch all Bs (delivery notes) from the server
  useEffect(() => {
    const fetchDeliveryNotes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bs/bs/get`); // Make sure to update the endpoint if needed
        setDeliveryNotes(response.data.Bss); // Assuming the response structure has `Bss`
      } catch (error) {
        console.error('Error fetching delivery notes:', error);
      }
    };

    fetchDeliveryNotes();
  }, [deliveryNotes]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Bon De Sortie
      </Typography>

      {/* Button to create a new delivery note */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Créer un Bon De Sortie
      </Button>

      {/* Delivery Notes Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveryNotes.map((note) => (
            <TableRow key={note.code}>
              <TableCell>{note.code}</TableCell>
              <TableCell>{note.clientId}</TableCell>
              <TableCell>{note.timbre}</TableCell>
              <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/bon-livraison/${note.code}/${note.clientId}`)}
                >
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
          <CreateDeliveryNoteModal onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default BonsortiePage;
