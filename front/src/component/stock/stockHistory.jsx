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
import PaidIcon from '@mui/icons-material/Paid';
import Grid from '@mui/material/Grid2';

const StockHPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bonachat/stock/getallSH');
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>
<Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
  {/* Total Prix d'achat */}
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" color="textSecondary">Total Prix d'achat</Typography>
          <Avatar sx={{ bgcolor: 'warning.main' }}>
            <PaidIcon />
          </Avatar>
        </Box>
        <Typography variant="h5">
          Total TTC:{' '}
          {filteredProducts
            .reduce((acc, product) => {
              const unitPrice = product.prixU_HT;
              const remise = product.rem > 0 ? (unitPrice * product.rem) / 100 : 0;
              const prixUNetHT = unitPrice - remise;
              const netHT = prixUNetHT * product.quantite;
              const netTTC = netHT + (netHT * product.tva) / 100;
              return acc + netTTC;
            }, 0)
            .toFixed(3)}
        </Typography>      </CardContent>
    </Card>
  </Grid>

 
</Grid>
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
              <TableCell><strong>Prix U (HT)</strong></TableCell>
              <TableCell><strong>TVA (%)</strong></TableCell>
              <TableCell><strong>Rem (%)</strong></TableCell>
              <TableCell><strong>Prix Net U (HT)</strong></TableCell>
              <TableCell><strong>Prix Net (TTC)</strong></TableCell>
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

                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.codesuplier}</TableCell>
                    <TableCell>{product.designation}</TableCell>
                    <TableCell>{product.Unite}</TableCell>
                    <TableCell>{product.quantite}</TableCell>
                    <TableCell>{unitPrice.toFixed(3)}</TableCell>
                    <TableCell>{product.tva} %</TableCell>
                    <TableCell>{hasRemise ? `${product.rem} %` : '-'}</TableCell>
                    <TableCell>{hasRemise ? prixUNetHT.toFixed(3) : '-'}</TableCell>
                    <TableCell>{netTTC.toFixed(3)}</TableCell>
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

export default StockHPage;
