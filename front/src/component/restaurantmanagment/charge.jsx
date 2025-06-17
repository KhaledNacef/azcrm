import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Button, Snackbar, 
  Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChargeCafePage = () => {
  const navigate = useNavigate();
  const [charges, setCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api/v1';
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const [formData, setFormData] = useState({
    mantant_location: 0, 
    cnss: 0, 
    impots: 0, 
    salaire_total: 0, 
    electricity: 0,
    water: 0, 
    beinsport: 0, 
    wifi: 0, 
    faris_divers: 0, 
    totalcharge: 0
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [chargeToDelete, setChargeToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chargerest/chargeget`);
        setCharges(response.data);
        setFilteredCharges(response.data);
        const totalSum = response.data.reduce((acc, charge) => 
          acc + (parseFloat(charge.totalcharge) || 0, 0));
        setTotal(totalSum);
      } catch (error) {
        showSnackbar('Error fetching charges', 'error');
      }
    };
    fetchCharges();
  }, [isDataUpdated]);

  useEffect(() => {
    // Auto-calculate total whenever form data changes
    const calculatedTotal = Object.keys(formData).reduce((acc, key) => {
      if (key !== 'totalcharge') {
        acc += parseFloat(formData[key]) || 0;
      }
      return acc;
    }, 0);
    
    setFormData(prev => ({ 
      ...prev, 
      totalcharge: calculatedTotal.toFixed(2) 
    }));
  }, [formData]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleCreateCharge = async () => {
    try {
      await axios.post(`${API_BASE_URL}/chargerest/chargecreate`, formData);
      setIsDataUpdated(!isDataUpdated);
      resetForm();
      showSnackbar('Charge created successfully!', 'success');
    } catch (error) {
      console.error('Error creating charge:', error);
      showSnackbar('Error creating charge', 'error');
    }
  };

  const confirmDeleteCharge = (charge) => {
    setChargeToDelete(charge);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCharge = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/chargerest/chargedel/${chargeToDelete.id}`);
      setIsDataUpdated(!isDataUpdated);
      showSnackbar('Charge deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting charge:', error);
      showSnackbar('Error deleting charge', 'error');
    } finally {
      setOpenDeleteDialog(false);
      setChargeToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      mantant_location: 0, 
      cnss: 0, 
      impots: 0, 
      salaire_total: 0, 
      electricity: 0,
      water: 0, 
      beinsport: 0, 
      wifi: 0, 
      faris_divers: 0, 
      totalcharge: 0
    });
  };

  const showSnackbar = (msg, severity) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleViewCharge = (id) => {
    navigate(`/charges/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Charge Café Management</Typography>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>Total des Charges</Typography>
        <Typography variant="h5" color="primary">
          {parseFloat(total).toFixed(2)} TND
        </Typography>
      </Paper>

      <Box component={Paper} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Ajouter Nouvelle Charge</Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          mb: 2
        }}>
          {Object.keys(formData)
            .filter(key => key !== 'totalcharge')
            .map((key) => (
              <TextField
                key={key}
                label={key.replace('_', ' ')}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                type="number"
                variant="outlined"
                fullWidth
              />
          ))}
        </Box>

        <TextField
          label="Total Charge"
          name="totalcharge"
          value={formData.totalcharge}
          InputProps={{ readOnly: true }}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateCharge}
          fullWidth
        >
          Add Charge
        </Button>
      </Box>

      <TextField 
        label="Search Charges" 
        fullWidth 
        value={searchQuery} 
        onChange={handleSearch} 
        sx={{ mb: 3 }} 
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Total Charge</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
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
                    onClick={() => handleViewCharge(charge.id)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => confirmDeleteCharge(charge)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this charge?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteCharge} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChargeCafePage;