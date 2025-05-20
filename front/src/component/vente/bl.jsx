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
  Modal
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateDeliveryNoteModal from './cratebl.jsx';

const BonsortiePage = () => {
  const navigate = useNavigate();
    const [open, setOpen] = useState(false);
  
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bs/bs/get');
      setDeliveryNotes(response.data);
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  useEffect(() => {
    fetchDeliveryNotes();
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filter notes by checking if searchQuery matches id or id/date format
  const filteredNotes = deliveryNotes.filter((note) => {
    const formattedDate = formatDate(note.createdAt);
    const idDateCombo = `${note.id}/${formattedDate}`;
    return idDateCombo.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const addDeliveryNote = () => {
    handleClose();
    fetchDeliveryNotes(); // ✅ Refresh table after adding
  };


  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Facture
      </Typography>
<Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        Créer un Facture Vente
      </Button>
      <TextField
        label="Rechercher par ID/Date (ex: 1/01/01/2025)"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

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
              <TableRow key={note.id}>
                <TableCell>{note.id}/{formatDate(note.createdAt)}</TableCell>
                <TableCell>{note.clientName || 'N/A'}</TableCell>
                <TableCell>{note.timbre}</TableCell>
                <TableCell>{formatDate(note.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `/bon-livraison/${note.code}/${note.clientId}/${note.codey}/${note.devise}/${note.id}/${note.createdAt}/${note.timbre}`
                      )
                    }
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
          <CreateDeliveryNoteModal onAddDeliveryNote={addDeliveryNote}  />
        </Box>
      </Modal>
    </Box>
  );
};

export default BonsortiePage;
