import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
} from '@mui/material';

const ChargeSummaryPage = () => {
  const [charges, setCharges] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api/v1';

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chargerest/chargegetid/${id}`);
        setCharges(response.data);

      
      } catch (error) {
        console.error('Error fetching charges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, []);

  if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Récapitulatif des Charges Café</Typography>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>Total des Charges</Typography>
        <Typography variant="h5" color="primary">
          {parseFloat(charges.totalcharge).toFixed(2)} TND
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>CNSS</TableCell>
              <TableCell>Impôts</TableCell>
              <TableCell>Salaire</TableCell>
              <TableCell>Électricité</TableCell>
              <TableCell>Eau</TableCell>
              <TableCell>Bein Sport</TableCell>
              <TableCell>WiFi</TableCell>
              <TableCell>Faris Divers</TableCell>
              <TableCell><strong>Total</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow key={charges.id}>
                <TableCell>{charges.id}</TableCell>
                <TableCell>{new Date(charges.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{charges.mantant_location}</TableCell>
                <TableCell>{charges.cnss}</TableCell>
                <TableCell>{charges.impots}</TableCell>
                <TableCell>{charges.salaire_total}</TableCell>
                <TableCell>{charges.electricity}</TableCell>
                <TableCell>{charges.water}</TableCell>
                <TableCell>{charges.beinsport}</TableCell>
                <TableCell>{charges.wifi}</TableCell>
                <TableCell>{charges.faris_divers}</TableCell>
                <TableCell><strong>{parseFloat(charges.totalcharge).toFixed(2)}</strong></TableCell>
              </TableRow>
            
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ChargeSummaryPage;
