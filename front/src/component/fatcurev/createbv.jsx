import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Snackbar,
  Alert
} from '@mui/material';

const Createbv = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState('');
  const [client, setClient] = useState(0);
  const [codey, setCodey] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('TND');
  const [price, setPrice] = useState('');
  const [percentage, setPercentage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [exchangeRates, setExchangeRates] = useState({});

  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';
  const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/TND';

  useEffect(() => {
    const generateUniqueCode = () => `DN-${new Date().getTime()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setCode(generateUniqueCode());
    setCodey(generateUniqueCode());

    const fetchData = async () => {
      try {
        const [productRes, clientRes, exchangeRateRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stock/getall`),
          axios.get(`${API_BASE_URL}/clients/getclient`),
          axios.get(EXCHANGE_RATE_API_URL)
        ]);
        setAvailableProducts(productRes.data);
        setClients(clientRes.data);
        setExchangeRates(exchangeRateRes.data.rates);
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbarMessage('Failed to load data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };
    fetchData();
  }, []);

  // Automatically update price when product is selected
  useEffect(() => {
    if (newProduct) {
      const selectedProduct = availableProducts.find(p => p.designation === newProduct);
      if (selectedProduct) {
        const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
        const tvaMultiplier = 1 + (selectedProduct.TVA || 0) / 100;
        const priceWithTva = basePrice * tvaMultiplier;
        
        // Convert to selected currency if not TND
        if (selectedCurrency !== 'TND' && exchangeRates[selectedCurrency]) {
          const convertedPrice = priceWithTva * exchangeRates[selectedCurrency];
          setPrice(convertedPrice.toFixed(2));
        } else {
          setPrice(priceWithTva.toFixed(2));
        }
        
        setPercentage('');
      }
    }
  }, [newProduct, selectedCurrency, exchangeRates]);

  const handleAddProduct = () => {
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (!selectedProduct) return;

    if (parseInt(quantite, 10) > selectedProduct.quantite) {
      setSnackbarMessage('Insufficient stock quantity');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const finalPrice = parseFloat(price);
    if (isNaN(finalPrice)) {
      setSnackbarMessage('Please enter a valid price');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setProducts([...products, {
      designation: selectedProduct.designation,
      Unite: selectedProduct.Unite,
      prixU_HT: finalPrice,
      quantite: parseInt(quantite, 10),
      TVA: selectedProduct.TVA || 0
    }]);

    setNewProduct('');
    setQuantite(1);
    setPrice('');
    setPercentage('');
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(e.target.value);
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
      const tvaMultiplier = 1 + (selectedProduct.TVA || 0) / 100;
      const priceWithTva = basePrice * tvaMultiplier;

      const gain = ((newPrice - priceWithTva) / priceWithTva) * 100;
      setPercentage(gain.toFixed(2));
    }
  };

  const handlePercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value);
    setPercentage(e.target.value);
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
      const tvaMultiplier = 1 + (selectedProduct.TVA || 0) / 100;
      const priceWithTva = basePrice * tvaMultiplier;

      const newPrice = priceWithTva * (1 + newPercentage / 100);
      setPrice(newPrice.toFixed(2));
    }
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);

    // Convert existing price to new currency
    if (price && exchangeRates[newCurrency] && exchangeRates[selectedCurrency]) {
      const conversionRate = exchangeRates[newCurrency] / exchangeRates[selectedCurrency];
      setPrice((parseFloat(price) * conversionRate).toFixed(2));
    }
  };

  const handleSubmit = async () => {
    if (!client || products.length === 0) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/bonlivraison/facturev`, {
        code,
        clientId: client,
        products,
        clientName: clients.find((cl) => cl.id === client)?.fullname || "",
        codey,
        devise: selectedCurrency
      });

      setSnackbarMessage('Delivery note created successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      onAddDeliveryNote();
    } catch (error) {
      setSnackbarMessage('Failed to create delivery note');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Error creating delivery note:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Create Bon de Livraison</Typography>
      
      <TextField
        label="Code"
        value={code}
        fullWidth
        margin="normal"
        disabled
      />
      
      <TextField
        select
        label="Select Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        fullWidth
        margin="normal"
      >
        {clients.map(client => (
          <MenuItem key={client.id} value={client.id}>
            {client.fullname}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Select Product"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        fullWidth
        margin="normal"
      >
        {availableProducts
          .filter(product => product.quantite > 0)
          .map(product => (
            <MenuItem key={product.id} value={product.designation}>
              {`${product.designation} (Stock: ${product.quantite})`}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        label="Quantity"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
      />

      <TextField
        label={`Price (${selectedCurrency})`}
        type="number"
        value={price}
        onChange={handlePriceChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: selectedCurrency,
        }}
      />

      <TextField
        label="Percentage Gain"
        type="number"
        value={percentage}
        onChange={handlePercentageChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: '%',
        }}
      />

      <TextField
        select
        label="Currency"
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        fullWidth
        margin="normal"
      >
        {Object.keys(exchangeRates).map(currency => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </TextField>

      <Button 
        variant="contained" 
        onClick={handleAddProduct} 
        fullWidth
        sx={{ mt: 2, mb: 2 }}
      >
        Add Product
      </Button>

      {products.length > 0 && (
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Price ({selectedCurrency})</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>TVA (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.designation}</TableCell>
                  <TableCell>{product.Unite}</TableCell>
                  <TableCell>{product.prixU_HT}</TableCell>
                  <TableCell>{product.quantite}</TableCell>
                  <TableCell>{product.TVA || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit} 
        fullWidth
        sx={{ mt: 2 }}
      >
        Submit Delivery Note
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Createbv;