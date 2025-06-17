// components/CreateChargeModal.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';

const CreateChargeModal = ({ open, onClose, onCreateCharge }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = () => {
    onCreateCharge(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Charge</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          mb: 2,
          mt: 2
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

        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Charge: {formData.totalcharge} TND
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChargeModal;