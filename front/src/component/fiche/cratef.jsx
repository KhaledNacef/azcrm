import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Snackbar,
  Alert,
  Paper,
  TableContainer,
} from '@mui/material';

const FicheTechniqueForm = () => {
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientCost, setIngredientCost] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_URL = 'https://api.azcrm.deviceshopleader.com/api/v1/fiches';

  // Fetch all fiches on component mount
 

  const addIngredient = () => {
    if (!ingredientName || !ingredientCost) {
      showSnackbar('Please enter ingredient name and cost', 'warning');
      return;
    }

    const newIngredient = {
      name: ingredientName,
      cost: parseFloat(ingredientCost),
    };

    setIngredients([...ingredients, newIngredient]);
    setIngredientName('');
    setIngredientCost(0);
    
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async () => {

    if (!name || !sellingPrice || ingredients.length === 0) {
      showSnackbar('Please fill all required fields', 'warning');
      return;
    }
    const payload={
    name:name,
    sellingPrice:parseFloat(sellingPrice),
    ingredients:ingredients
};
    try {
      
      await axios.post(`${API_URL}/createf`, payload );

      showSnackbar('Fiche technique created successfully!', 'success');
      resetForm();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create fiche technique';
      showSnackbar(message, 'error');
    } finally {
      ;
    }
  };

 

  const resetForm = () => {
    setName('');
    setSellingPrice('');
    setIngredients([]);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fiche Technique Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Fiche Creation Form */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Create New Fiche
          </Typography>

          <TextField
            label="Fiche Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Selling Price (TND)"
            type="number"
            value={sellingPrice}
            onChange={(e) => {
              setSellingPrice(e.target.value);
            }}
            fullWidth
            margin="normal"
            required
          />

          <Typography variant="subtitle1" mt={2}>
            Ingredients
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              label="Ingredient Name"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Cost (TND)"
              type="number"
              value={ingredientCost}
              onChange={(e) => setIngredientCost(e.target.value)}
              fullWidth
            />
         
            <Button variant="contained" onClick={addIngredient}>
              Add
            </Button>
          </Box>

          {ingredients.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ingredient</TableCell>
                    <TableCell>Cost (TND)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ingredients.map((ing, index) => (
                    <TableRow key={index}>
                      <TableCell>{ing.name}</TableCell>
                      <TableCell>{ing.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeIngredient(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

         
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
               Create Fiche
            </Button>
            <Button
              variant="outlined"
              onClick={resetForm}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {/* Existing Fiches List */}
      
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FicheTechniqueForm;