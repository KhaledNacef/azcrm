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
  Snackbar
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
  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('TND');

  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';
  const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/TND'; // Example API URL

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
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
      const tvaMultiplier = 1 + (selectedProduct.TVA || 0) / 100;
      const priceWithTva = basePrice * tvaMultiplier;
      setPrice(priceWithTva.toFixed(2));
      setPercentage('');
    }
  }, [newProduct]);

  const handleAddProduct = () => {
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      if (parseInt(quantite, 10) > selectedProduct.quantite) {
        setSnackbarMessage('Insufficient stock quantity');
        setOpenSnackbar(true);
        return;
      }

      const finalPrice = parseFloat(price);
      if (isNaN(finalPrice)) {
        setSnackbarMessage('Please enter a valid price');
        setOpenSnackbar(true);
        return;
      }

      setProducts([...products, {
        designation: selectedProduct.designation,
        Unite: selectedProduct.Unite,
        prixU_HT: finalPrice,
        quantite: parseInt(quantite, 10),
      }]);

      setNewProduct('');
      setQuantite(1);
      setPrice('');
      setPercentage('');
      setBaseCurrency('TND')
    }
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

    if (newCurrency !== baseCurrency) {
      const exchangeRate = exchangeRates[newCurrency];
      if (exchangeRate) {
        const selectedProduct = availableProducts.find(p => p.designation === newProduct);
        if (selectedProduct) {
          const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
          const tvaMultiplier = 1 + (selectedProduct.TVA || 0) / 100;
          const priceWithTva = basePrice * tvaMultiplier;
          const convertedPrice = priceWithTva * exchangeRate;
          setPrice(convertedPrice.toFixed(2));
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!client || products.length === 0) {
      setSnackbarMessage('Please fill in all required fields.');
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
      setOpenSnackbar(true);
      onAddDeliveryNote();
    } catch (error) {
      setSnackbarMessage('Failed to create delivery note');
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
        onChange={(e) => setCode(e.target.value)}
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
        {availableProducts.map(product => (
          <MenuItem key={product.id} value={product.designation}>
            {product.designation}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Quantity"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        value={price}
        onChange={handlePriceChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Percentage"
        value={percentage}
        onChange={handlePercentageChange}
        fullWidth
        margin="normal"
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
      <Button variant="contained" onClick={handleAddProduct} fullWidth>
        Add Product
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.designation}</TableCell>
              <TableCell>{product.quantite}</TableCell>
              <TableCell>{product.prixU_HT}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Submit Delivery Note
      </Button>

      <Snackbar
        open={openSnackbar}
        message={snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
};

export default Createbv;
