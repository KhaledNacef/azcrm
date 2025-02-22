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
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get(`https://api.azcrm.deviceshopleader.com/api/bs/bs/get`); // Make sure to update the endpoint if needed
      setDeliveryNotes(response.data.Bss); // Assuming the response structure has `Bss`
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };
  // Fetch all Bs (delivery notes) from the server
  useEffect(() => {
    

    fetchDeliveryNotes();
  }, [deliveryNotes]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
    fetchDeliveryNotes();

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
            {deliveryNotes && Array.isArray(deliveryNotes) && deliveryNotes.length > 0 ? (
          deliveryNotes.map((note) => (
            <TableRow key={note.code}>
              <TableCell>{note.code}</TableCell>
              <TableCell>{note.clientId || "N/A"}</TableCell>
              <TableCell>{note.timbre || "N/A"}</TableCell>
              <TableCell>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/bon-livraison/${note.code}/${note.clientId}`)}
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
