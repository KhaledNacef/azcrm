import React, { useState,useEffect } from 'react';
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
import CreateDeliveryNoteModala from './crate.jsx'
import axios from 'axios';


const BonAchatPage = () => {
  const navigate = useNavigate();

  // Hardcoded delivery notes
  const [deliveryNotes, setDeliveryNotes] = useState([]);

  const [open, setOpen] = useState(false); // Modal state

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    
    handleClose();
  };
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/bl/stock/getall'); // Adjust URL based on your backend
      setDeliveryNotes(response.data); // Assuming API returns { deliveryNotes: [...] }
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  
  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        FACTURE BON D'ACHAT
      </Typography>

      {/* Button to create a new delivery note */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Créer une FACTURE BON D'ACHAT
      </Button>

      {/* Delivery Notes Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Fournisseur</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveryNotes.map((note) => (
            <TableRow key={note.code}>
              <TableCell>{note.code}</TableCell>
              <TableCell>{note.spulierId}</TableCell>
              <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/bon-dachat/${note.code}/${note.spulierId}`)}
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
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default BonAchatPage;
