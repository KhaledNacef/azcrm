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
  Card, 
  CardContent, 
  Avatar,
} from '@mui/material';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Grid from '@mui/material/Grid2';
import ReceiptIcon from '@mui/icons-material/Receipt';

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
    const totalacaht=product.prixU_HT*product.quantite
    return acc + totalacaht;
  }, 0);

  const totalSellPrice = filteredProducts.reduce((acc, product) => {
    return acc + (product.sellprice*product.quantite || 0);
  }, 0);

  const totalProfit = totalSellPrice-totalTTC
  

  const totalTVAFromSellPrice = filteredProducts.reduce((acc, product) => {
    if (!product.tva || product.tva <= 0) return acc;
  
    const sellpriceTTC = product.sellprice || 0;
    const quantite = product.quantite || 0;
  
    const totalTTC = sellpriceTTC * quantite;
    const ht = totalTTC / (1 + product.tva / 100);
    const productTVA = totalTTC - ht;
  
    return acc + productTVA;
  }, 0);

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
        <Typography variant="h5">{totalTTC.toFixed(3)} TND</Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Total Prix de Vente */}
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" color="textSecondary">Total Prix de Vente</Typography>
          <Avatar sx={{ bgcolor: 'success.main' }}>
            <MonetizationOnIcon />
          </Avatar>
        </Box>
        <Typography variant="h5">{totalSellPrice.toFixed(3)} TND</Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Total Gain */}
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" color="textSecondary">Total Gain</Typography>
          <Avatar sx={{ bgcolor: 'info.main' }}>
            <TrendingUpIcon />
          </Avatar>
        </Box>
        <Typography variant="h5">{totalProfit.toFixed(3)} TND</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
  <Card elevation={3}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1" color="textSecondary">Total TVA </Typography>
        <Avatar sx={{ bgcolor: 'info.main' }}>
          <ReceiptIcon />
        </Avatar>
      </Box>
      <Typography variant="h5">
        {totalTVAFromSellPrice.toFixed(3)}
      </Typography>
    </CardContent>
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
      const sellPrice = product.sellprice || 0;
      const gainPerUnit = sellPrice - unitPrice;
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
