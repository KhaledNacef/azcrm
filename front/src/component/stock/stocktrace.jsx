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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
const StockTPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [exchangeRates, setExchangeRates] = useState({});
const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    const fetchStockAndRates = async () => {
      try {
        const [stockResponse, rateResponse] = await Promise.all([
          axios.get('https://api.azcrm.deviceshopleader.com/api/v1/bs/bs/getST'),
          axios.get('https://v6.exchangerate-api.com/v6/9179a4fac368332ee3e66b7b/latest/TND')
        ]);
        setProducts(stockResponse.data);
        setFilteredProducts(stockResponse.data);
        setExchangeRates(rateResponse.data.conversion_rates);
      } catch (error) {
        console.error("Erreur :", error);
        showSnackbar('Erreur lors de la récupération des produits ou des taux.', 'error');
      }
    };
  
    fetchStockAndRates();
  }, []);

  useEffect(() => {
     applyFilters();
   }, [searchQuery, startDate, endDate, products]);
 
   const handleSearch = (event) => {
     setSearchQuery(event.target.value.toLowerCase());
   };
 
   const applyFilters = () => {
     let filtered = [...products];
 
     // Apply search filter
     if (searchQuery) {
       filtered = filtered.filter(
         (product) =>
           product.designation.toLowerCase().includes(searchQuery) ||
           product.codeClient.toString().includes(searchQuery)
       );
     }
 
     // Apply date range filter
     if (startDate || endDate) {
       filtered = filtered.filter((product) => {
         const productDate = new Date(product.createdAt);
         const matchesStart = !startDate || productDate >= new Date(startDate);
         const matchesEnd = !endDate || productDate <= new Date(endDate);
         return matchesStart && matchesEnd;
       });
     }
 
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

  const convertToTND = (amount, currency) => {
    if (!amount || !currency) return 0;
    if (currency === 'TND') return amount;
  
    const rate = exchangeRates[currency];
    if (!rate) return 0;
  
    return amount / rate; // since base is TND
  };

  const totalTTC = filteredProducts.reduce((acc, product) => {
    const totalacaht=product.prixU_HT*product.quantite
    convertToTND(totalacaht,product.devise)
    return acc + totalacaht;
  }, 0);

  const totalSellPrice = filteredProducts.reduce((acc, product) => {
    return acc + convertToTND((product.sellprice*product.quantite || 0),product.devise)
    ;
  }, 0);

  const totalProfit = totalSellPrice-totalTTC
  

  const totalTVAFromSellPrice = filteredProducts.reduce((acc, product) => {
    if (!product.tva || product.tva <= 0) return acc;
  
    const sellpriceTTC = product.sellprice || 0;
    const quantite = product.quantite || 0;
  
    const totalTTC = sellpriceTTC * quantite;
    const ht = totalTTC / (1 + product.tva / 100);
    const productTVA = totalTTC - ht;
  
    return acc +convertToTND(productTVA,product.devise)
    
  }, 0);
 
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const resetDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>

  <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          {(startDate || endDate) && (
            <button onClick={resetDateFilters} style={{ marginLeft: '10px' }}>
              Reset Dates
            </button>
          )}
        </Box>
      </LocalizationProvider>

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
              <TableCell><strong>Date</strong></TableCell>
              
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
      const sellPrice = convertToTND((product.sellprice || 0),product.devise);
      const gainPerUnit = sellPrice - unitPrice;
      const totalGain = gainPerUnit * product.quantite;
      const totalprixvente=sellPrice*product.quantite
      const createdAtDate = new Date(product.createdAt).toLocaleDateString();

      return (
        <TableRow key={product.id}>
          <TableCell>{product.id}</TableCell>
          <TableCell>{product.codeClient}</TableCell>
          <TableCell>{product.designation}</TableCell>
          <TableCell>{product.Unite}</TableCell>
          <TableCell>{product.quantite}</TableCell>
          <TableCell>{unitPrice.toFixed(3)} TND</TableCell>
          <TableCell>{(sellPrice|| 0).toFixed(3)} {product.devise}</TableCell>
          <TableCell>{totalprixvente.toFixed(3)} {product.devise}</TableCell>
          <TableCell>{gainPerUnit.toFixed(3)} {product.devise}</TableCell> 
          <TableCell>{totalGain.toFixed(3)} {product.devise}</TableCell> 
          <TableCell>{createdAtDate}</TableCell>
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
