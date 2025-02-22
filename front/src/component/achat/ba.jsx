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
import CreateDeliveryNoteModala from './crate.jsx'; // Ensure correct file name
import axios from 'axios';

const BonAchatPage = () => {
  const navigate = useNavigate();
  
  // State to hold the delivery notes
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  
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
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/bonachat/stock/getall'); // Adjust URL as needed
      setDeliveryNotes(response.data); // Assuming API returns an array of delivery notes
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  // Add the new delivery note to the state
 
  useEffect(() => {
    fetchDeliveryNotes();
  }, [deliveryNotes]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        FACTURE BON D'ACHAT
      </Typography>

      {/* Button to open the modal for creating a new delivery note */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Créer une FACTURE BON D'ACHAT
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
        {deliveryNotes && Array.isArray(deliveryNotes) && deliveryNotes.length > 0 ? (
  deliveryNotes.map((note) => (
    <TableRow key={note.code}>
      <TableCell>{note.code}</TableCell>
      <TableCell>{note.spulierId || "N/A"}</TableCell>
        <TableCell>{note.timbre ? "Oui" : "Non"}</TableCell>
      <TableCell>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}</TableCell>
      <TableCell>
        <Button
          variant="outlined"
          onClick={() => navigate(`/bon-dachat/${note.code}/${note.spulierId}`)}
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
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote}  />
        </Box>
      </Modal>
    </Box>
  );
};

export default BonAchatPage;
