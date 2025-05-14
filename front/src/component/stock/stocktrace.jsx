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

const StockTPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bs/bs/getST');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        showSnackbar('Error fetching products.', 'error');
      }
    };

    fetchStock();
  }, []);

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

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const totalTTC = filteredProducts.reduce((acc, product) => {

    return acc + product.prixU_HT;
  }, 0);

  const totalSellPrice = filteredProducts.reduce((acc, product) => {
    return acc + (product.sellprice*product.quantite || 0);
  }, 0);

  const totalProfit = filteredProducts.reduce((acc, product) => {
    const unitPrice = product.prixU_HT;
    const remise = product.rem > 0 ? (unitPrice * product.rem) / 100 : 0;
    const prixUNetHT = unitPrice - remise;
    const netHT = prixUNetHT * product.quantite;
    const netTTC = netHT + (netHT * product.tva) / 100;
  
    const totalSellPrice = (product.sellprice || 0) * product.quantite;
    const profit = totalSellPrice - netTTC;
  
    return acc + profit;
  }, 0);
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>

      <TextField
        label="Search by Name or ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Code Facture</strong></TableCell>
              <TableCell><strong>Produit</strong></TableCell>
              <TableCell><strong>Unité</strong></TableCell>
              <TableCell><strong>Quantité</strong></TableCell>
              <TableCell><strong>Prix d'achat (TTC)</strong></TableCell>
              <TableCell><strong>Prix De Vente (TTC)</strong></TableCell>
              <TableCell><strong>Total Prix De Vente (TTC)</strong></TableCell>
              <TableCell><strong>Gain Unitaire</strong></TableCell> 
              <TableCell><strong>Gain Total</strong></TableCell> 
          </TableRow>
          </TableHead>

          <TableBody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => {
      const unitPrice = product.prixU_HT;
      const hasRemise = product.rem > 0;
      const remise = hasRemise ? (unitPrice * product.rem) / 100 : 0;
      const prixUNetHT = unitPrice - remise;
      const netHT = prixUNetHT * product.quantite;
      const netTTC = netHT + (netHT * product.tva) / 100;

      const netTTCPerUnit = prixUNetHT + (prixUNetHT * product.tva) / 100;
      const sellPrice = product.sellprice || 0;
      const gainPerUnit = sellPrice - netTTCPerUnit;
      const totalGain = gainPerUnit * product.quantite;
      const totalprixvente=sellPrice*product.quantite

      return (
        <TableRow key={product.id}>
          <TableCell>{product.id}</TableCell>
          <TableCell>{product.codeClient}</TableCell>
          <TableCell>{product.designation}</TableCell>
          <TableCell>{product.Unite}</TableCell>
          <TableCell>{product.quantite}</TableCell>
          <TableCell>{unitPrice.toFixed(3)}{product.devise}</TableCell>
          <TableCell>{(sellPrice|| 0).toFixed(3)}{product.devise}</TableCell>
          <TableCell>{totalprixvente.toFixed(3)}{product.devise}</TableCell>
          <TableCell>{gainPerUnit.toFixed(3)}{product.devise}</TableCell> 
          <TableCell>{totalGain.toFixed(3)}{product.devise}</TableCell> 
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={13} align="center">
        No products found.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Total Prix d'achat : {totalTTC.toFixed(3)} TND</Typography>
        <Typography variant="h6">Total Prix De Vente : {totalSellPrice.toFixed(3)} TND</Typography>
        <Typography variant="h6">Total Gain : {totalProfit.toFixed(3)} TND</Typography>
      </Box>

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

export default StockTPage;
