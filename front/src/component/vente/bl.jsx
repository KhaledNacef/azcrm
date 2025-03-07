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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BonsortiePage = () => {
  const navigate = useNavigate();
  const [deliveryNotes, setDeliveryNotes] = useState([]); // State for storing delivery notes

  // Function to fetch delivery notes
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/bs/bs/get');
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



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Bon De Sortie
      </Typography>

      {/* Button to create a new delivery note */}
    

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
        <TableCell>{note.codey}</TableCell>
        <TableCell>{note.clientName || "N/A"}</TableCell>
        <TableCell>{note.timbre ? "Oui" : "Non"}</TableCell>
        <TableCell>
          {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}
        </TableCell>
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
      <TableCell colSpan={5} align="center">
        Aucune donnée disponible
      </TableCell>
    </TableRow>
  )}
</TableBody>
      </Table>

      {/* Modal for creating a delivery note */}

    </Box>
  );
};

export default BonsortiePage;
