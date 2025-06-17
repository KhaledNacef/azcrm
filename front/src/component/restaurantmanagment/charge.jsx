// ChargeCafePage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  Modal,

} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateChargeModal from './create.jsx';

const ChargeCafePage = () => {
  const navigate = useNavigate();
  const [charges, setCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api/v1';

  const fetchCharges = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chargerest/chargeget`);
      setCharges(response.data);
      setFilteredCharges(response.data);
      const totalSum = response.data.reduce((acc, charge) => 
        acc + (parseFloat(charge.totalcharge) || 0), 0);
      setTotal(totalSum);
    } catch (error) {
      showSnackbar('Error fetching charges', 'error');
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = charges.filter(charge => 
      Object.values(charge).some(val => 
        val && val.toString().toLowerCase().includes(query)
      )
    );
    setFilteredCharges(filtered);
  };

  const handleCreateCharge = async (formData) => {
    try {
      await axios.post(`${API_BASE_URL}/chargerest/chargecreate`, formData);
      fetchCharges();
      showSnackbar('Charge created successfully!', 'success');
    } catch (error) {
      console.error('Error creating charge:', error);
      showSnackbar('Error creating charge', 'error');
    }
  };

  const handleDeleteCharge = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/chargerest/chargedel/${id}`);
      fetchCharges();
      showSnackbar('Charge deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting charge:', error);
      showSnackbar('Error deleting charge', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Charge Café Management</Typography>
      
      <Box sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>Total des Charges</Typography>
        <Typography variant="h5" color="primary">
          {parseFloat(total).toFixed(2)} TND
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenCreateModal(true)}
        >
          Add New Charge
        </Button>
        
        <TextField 
          label="Search Charges" 
          value={searchQuery} 
          onChange={handleSearch} 
          sx={{ width: 300 }}
        />
      </Box>

       <TableContainer 
                   component={Paper}
                   sx={{
                     maxHeight: '850px', // Set your desired max height
                     overflow: 'auto'
                   }}
                 >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>ID</TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Total Charge</TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Date</TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCharges.map(charge => (
              <TableRow key={charge.id}>
                <TableCell>{charge.id}</TableCell>
                <TableCell>{charge.totalcharge} TND</TableCell>
                <TableCell>
                  {new Date(charge.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(`/charges/${charge.id}`)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDeleteCharge(charge.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
      width: 900, // increased width
      maxWidth: '95vw', // optional for responsive design
    }}
  >
          <CreateChargeModal onCreateCharge={handleCreateCharge} onClose={setOpenCreateModal(false)} open={openCreateModal} />
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChargeCafePage;