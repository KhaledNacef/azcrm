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
              <TableCell><strong>Rem (%)</strong></TableCell>
              <TableCell><strong>Prix Net (HT)</strong></TableCell>
              <TableCell><strong>Prix Net (TTC)</strong></TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => {
      const unitPrice = product.moyenneprix > 0 ? product.moyenneprix : product.prixU_HT;

      // Check if remise exists
      const hasRemise = product.rem > 0;

      const remise = hasRemise ? (unitPrice * product.rem) / 100 : 0;
      const prixUNetHT = unitPrice - remise;
      const netHT = prixUNetHT * product.quantite;
      const netTTC = netHT + (netHT * product.tva) / 100;

      return (
        <TableRow key={product.id}>
          <TableCell>{product.id}</TableCell>
          <TableCell>{product.designation}</TableCell>
          <TableCell>{product.Unite}</TableCell>
          <TableCell>{product.quantite}</TableCell>
          <TableCell>{product.prixU_HT.toFixed(3)}</TableCell>
          <TableCell>{product.dernierprixU_HT.toFixed(3)}</TableCell>
          <TableCell>{product.moyenneprix > 0 ? product.moyenneprix.toFixed(3) : '-'}</TableCell>
          <TableCell>{product.tva} %</TableCell>
          <TableCell>{hasRemise ? `${product.rem} %` : '-'}</TableCell>
          <TableCell>{hasRemise ? prixUNetHT.toFixed(3) : '-'}</TableCell>
          <TableCell>{netTTC.toFixed(3)}</TableCell>

        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={11} align="center">
        No products found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
{/* Total TTC */}
<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
  <Typography variant="h6">
    Total TTC:{' '}
    {filteredProducts
      .reduce((acc, product) => {
        const unitPrice = product.moyenneprix > 0 ? product.moyenneprix : product.prixU_HT;
        const remise = product.rem > 0 ? (unitPrice * product.rem) / 100 : 0;
        const prixUNetHT = unitPrice - remise;
        const netHT = prixUNetHT * product.quantite;
        const netTTC = netHT + (netHT * product.tva) / 100;
        return acc + netTTC;
      }, 0)
      .toFixed(3)}{' '}
    TND
  </Typography>
</Box>

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
