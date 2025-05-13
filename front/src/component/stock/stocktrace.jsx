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
  
  const [exchangeRates, setExchangeRates] = useState({}); // Add state for exchange rates
  
  const CURRENCY_API_URL = "https://v6.exchangerate-api.com/v6/9179a4fac368332ee3e66b7b/latest/TND"; // Your API URL

  useEffect(() => {
    // Fetch exchange rates
    const fetchExchangeRates = async () => {
      try {
        const res = await axios.get(CURRENCY_API_URL);
        setExchangeRates(res.data.conversion_rates); // Store rates in state
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      }
    };

    fetchExchangeRates();

    // Fetch stock data
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bs/bs/getST');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
    const unitPrice = product.prixU_HT;
    const remise = product.rem > 0 ? (unitPrice * product.rem) / 100 : 0;
    const prixUNetHT = unitPrice - remise;
    const netHT = prixUNetHT * product.quantite;
    const netTTC = netHT + (netHT * product.tva) / 100;
    return acc + netTTC;
  }, 0);

  const totalSellPrice = filteredProducts.reduce((acc, product) => {
    return acc + (product.sellprice || 0);
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
              <TableCell><strong>Prix d'achat TTC</strong></TableCell>
              <TableCell><strong>TVA (%)</strong></TableCell>
              <TableCell><strong>Rem (%)</strong></TableCell>
              <TableCell><strong>Prix Net U (HT)</strong></TableCell>
              <TableCell><strong>Total Net (HT)</strong></TableCell>
              <TableCell><strong>Total Net (TTC)</strong></TableCell>
              <TableCell><strong>Prix De Vente TTC</strong></TableCell>
              <TableCell><strong>Gain Unitaire</strong></TableCell> 
              <TableCell><strong>Gain Total (TND)</strong></TableCell> {/* New Cell */}
          </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const unitPrice = product.prixU_HT;
                const remise = product.rem > 0 ? (unitPrice * product.rem) / 100 : 0;
                const prixUNetHT = unitPrice - remise;
                const netHT = prixUNetHT * product.quantite;
                const netTTC = netHT + (netHT * product.tva) / 100;

                const netTTCPerUnit = prixUNetHT + (prixUNetHT * product.tva) / 100;
                const sellPrice = product.sellprice || 0;
                const gainPerUnit = sellPrice - netTTCPerUnit;
                const totalGain = gainPerUnit * product.quantite;

                // Convert the product's price to TND if not already in TND
                const devise = product.devise || 'TND';
                const rateToTND = devise === 'TND' ? 1 : (exchangeRates['TND'] / exchangeRates[devise]) || 1;
                const totalGainInTND = totalGain * rateToTND;

                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.codeClient}</TableCell>
                    <TableCell>{product.designation}</TableCell>
                    <TableCell>{product.Unite}</TableCell>
                    <TableCell>{product.quantite}</TableCell>
                    <TableCell>{unitPrice.toFixed(3)} {product.devise || ' TND'}</TableCell>
                    <TableCell>{product.tva} %</TableCell>
                    <TableCell>{remise > 0 ? `${product.rem} %` : '-'}</TableCell>
                    <TableCell>{prixUNetHT.toFixed(3)} {product.devise || ' TND'}</TableCell>
                    <TableCell>{netHT.toFixed(3)} {product.devise || ' TND'}</TableCell>
                    <TableCell>{netTTC.toFixed(3)} {product.devise || ' TND'}</TableCell>
                    <TableCell>{(sellPrice || 0).toFixed(3)} {product.devise || ' TND'}</TableCell>
                    <TableCell>{gainPerUnit.toFixed(3)} {product.devise || ' TND'}</TableCell>
                    <TableCell>{totalGainInTND.toFixed(3)} TND</TableCell> {/* Display Gain in TND */}
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
        <Typography variant="h6">Total TTC : {totalTTC.toFixed(3)} TND</Typography>
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
