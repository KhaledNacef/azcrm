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
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const StockPage = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity

  // Simulated product data
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/stock/getall');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        showSnackbar('Error fetching products.', 'error');
      }
    };

    fetchStock();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.designation.toLowerCase().includes(query) ||
        product.id.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Calculate Net Prices
  const calculateNetHT = (unitPrice, quantity) => unitPrice * quantity;
  const calculateNetTTC = (netHT, vat) => netHT + (netHT * vat) / 100;

  // Show Snackbar function
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Name or ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Product Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Produit</strong></TableCell>
              <TableCell><strong>Unité</strong></TableCell>
              <TableCell><strong>Quantité</strong></TableCell>
              <TableCell><strong>Prix U (HT)</strong></TableCell>
              <TableCell><strong>Dernier Prix</strong></TableCell>
              <TableCell><strong>Moyenne prix</strong></TableCell>
              <TableCell><strong>TVA (%)</strong></TableCell>
              <TableCell><strong>Prix Net (HT)</strong></TableCell>
              <TableCell><strong>Prix Net (TTC)</strong></TableCell>
            </TableRow>
          </TableHead>
          
<TableBody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => {
      // Use moyenneprix if greater than 0, otherwise fall back to prixU_HT for calculations
      const unitPriceForCalculations = product.moyenneprix > 0 ? product.moyenneprix : product.prixU_HT;
      const netHT = calculateNetHT(unitPriceForCalculations, product.quantite);
      const netTTC = calculateNetTTC(netHT, product.tva);

      return (
        <TableRow key={product.id}>
          <TableCell>{product.id}</TableCell>
          <TableCell>{product.designation}</TableCell>
          <TableCell>{product.Unite}</TableCell>
          <TableCell>{product.quantite}</TableCell>
          <TableCell>{product.prixU_HT.toFixed(2)} TND</TableCell> {/* Display prixU_HT */}
          <TableCell>{product.dernierprixU_HT.toFixed(2)} TND</TableCell>
          <TableCell>{product.moyenneprix > 0 ? product.moyenneprix.toFixed(2) : '-'}</TableCell> {/* Display moyenneprix */}
          <TableCell>{product.tva} %</TableCell>
          <TableCell>{netHT.toFixed(2)} TND</TableCell> {/* Net HT calculation */}
          <TableCell>{netTTC.toFixed(2)} TND</TableCell> {/* Net TTC calculation */}
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={9} align="center">
        No products found.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockPage;
