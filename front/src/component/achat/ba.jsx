import React, { useState } from 'react';
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
import CreateDeliveryNoteModal from './crate.jsx'

const BonAchatPage = () => {
  const navigate = useNavigate();

  // Hardcoded delivery notes
  const [deliveryNotes, setDeliveryNotes] = useState([
    { code: 'DN001', supplierName: 1, createdAt: '2025-01-20' },
    { code: 'DN002', supplierName: 2, createdAt: '2025-01-21' },
  ]);

  const [open, setOpen] = useState(false); // Modal state

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = (newNote) => {
    setDeliveryNotes([...deliveryNotes, newNote]);
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Bon d'Achat
      </Typography>

      {/* Button to create a new delivery note */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Créer un Bon d'Achat
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
              <TableCell>{note.supplierName}</TableCell>
              <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/bon-dachat/${note.code}/${note.supplierName}`)}
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

export default BonAchatPage;
