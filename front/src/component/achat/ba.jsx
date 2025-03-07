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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BonAchatPage = () => {
  const navigate = useNavigate();

  // State to hold the delivery notes
  const [deliveryNotes, setDeliveryNotes] = useState([]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch delivery notes from the backend
  const fetchDeliveryNotes = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/bonachat/stock/getall'); // Adjust URL as needed
      setDeliveryNotes(response.data); // Assuming API returns an array of delivery notes
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  // Filtered delivery notes based on search query
  const filteredNotes = deliveryNotes.filter(note =>
    note.codey.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        BON D'ACHAT
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search by Code"
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
            <TableCell>Fournisseur</TableCell>
            <TableCell>Timbre</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredNotes  > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.code}>
                <TableCell>{note.codey}</TableCell>
                <TableCell>{note.spulierName || "N/A"}</TableCell>
                <TableCell>{note.timbre ? "Oui" : "Non"}</TableCell>
                <TableCell>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/bon-dachat/${note.code}/${note.spulierId}/${note.codey}`)}
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
    </Box>
  );
};

export default BonAchatPage;
