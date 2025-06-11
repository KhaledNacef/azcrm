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
import Autocomplete from "@mui/material/Autocomplete";

const Createbv = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState('');
  const [client, setClient] = useState(0);
  const [codey, setCodey] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
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
  const [rem, setRem] = useState(0);
  const [tvaa, setTvaa] = useState(0);
  const [timbre, setTimbre] = useState(false);
  const [location,setLocation]=useState('');

  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api/v1';
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
      const basePrice = newProduct.moyenneprix > 0 ? newProduct.moyenneprix : newProduct.prixU_HT;
      const tvaMultiplier = 1 + (newProduct.tva || 0) / 100;
      const priceWithTva = basePrice * tvaMultiplier;
  
      const discount = newProduct.rem > 0 ? (priceWithTva * newProduct.rem) / 100 : 0;
      const finalPrice = priceWithTva - discount;
  
      if (selectedCurrency !== 'TND' && exchangeRates[selectedCurrency]) {
        const convertedPrice = finalPrice * exchangeRates[selectedCurrency];
        setPrice(convertedPrice.toFixed(3));
      } else {
        setPrice(finalPrice.toFixed(3));
      }
  
    }
  }, [newProduct, selectedCurrency, exchangeRates]);
  
  const handleAddProduct = () => {
   
    if (!newProduct) return;

    if (parseFloat(quantite, 10) > newProduct.quantite) {
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
      designation: newProduct.designation,
      Unite: newProduct.Unite,
      prixU_HT: finalPrice,
      quantite: Number(quantite),
      rem:rem,
      tva:tvaa
    }]);

    setNewProduct(null);
    setQuantite(1);
    setPrice('');
    setPercentage('');
    setRem(0);

  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(e.target.value);
    if (newProduct) {
      const basePrice = newProduct.moyenneprix > 0 ? newProduct.moyenneprix : newProduct.prixU_HT;
      const tvaMultiplier = 1 + (newProduct.tva || 0) / 100;
      const priceWithTva = basePrice * tvaMultiplier;
      const discount = newProduct.rem > 0 ? (priceWithTva * newProduct.rem) / 100 : 0;
      const discountedPrice = priceWithTva - discount;
      const gain = ((newPrice - discountedPrice) / discountedPrice) * 100;
      setPercentage(gain.toFixed(3));
    }
  };

  const handlePercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value);
    setPercentage(e.target.value);
  
    if (newProduct) {
      const basePrice = newProduct.moyenneprix > 0 ? newProduct.moyenneprix : newProduct.prixU_HT;
      const tvaMultiplier = 1 + (newProduct.tva || 0) / 100;
      const priceWithTva = basePrice * tvaMultiplier;
  
      const discount = newProduct.rem > 0 ? (priceWithTva * newProduct.rem) / 100 : 0;
      const discountedPrice = priceWithTva - discount;
  
      const newPrice = discountedPrice * (1 + newPercentage / 100);
      setPrice(newPrice.toFixed(3));
    }
  };
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);

    // Convert existing price to new currency
    if (price && exchangeRates[newCurrency] && exchangeRates[selectedCurrency]) {
      const conversionRate = exchangeRates[newCurrency] / exchangeRates[selectedCurrency];
      setPrice((parseFloat(price) * conversionRate).toFixed(3));
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
        devise: selectedCurrency,
        timbre:timbre,
      location:location
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
const handleDeleteProduct = (indexToDelete) => {
  const updatedProducts = products.filter((_, index) => index !== indexToDelete);
  setProducts(updatedProducts);
};

  return (
    <Box>
      <Typography variant="h6">Créer Bon de Livraison</Typography>
      
      <TextField
        label="Code"
        value={code}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
              label="Localisation"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
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
         <TextField label="Timbre" select value={timbre.toString()} onChange={(e) => setTimbre(e.target.value === "true")} fullWidth margin="normal">
                    <MenuItem value="true">Oui</MenuItem>
                    <MenuItem value="false">Non</MenuItem>
                  </TextField>
      <Autocomplete
  value={newProduct}
  onChange={(event, newValue) => {
    setNewProduct(newValue);
  }}
  options={availableProducts.filter((prod) => prod.quantite > 0)}
  getOptionLabel={(option) => `${option.designation} (${option.quantite} en stock)`}
  openOnFocus
  renderInput={(params) => (
    <TextField
      {...params}
      label="Produit"
      fullWidth
      margin="normal"
    />
  )}
  ListboxProps={{
    style: {
      maxHeight: "300px",
    },
  }}
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
              label="TVA (%)"
              type="number"
              value={tvaa}
              onChange={(e) => setTvaa(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
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
      label="Rem (%)"
       type="number"
        value={rem} onChange={(e) => setRem(e.target.value || 0)} 
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
                <TableCell>tva</TableCell>
            <TableCell>Action</TableCell>
                

              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.designation}</TableCell>
                  <TableCell>{product.Unite}</TableCell>
                  <TableCell>{product.prixU_HT}</TableCell>
                  <TableCell>{product.quantite}</TableCell>
                  <TableCell>{product.tva}</TableCell>
                            <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteProduct(index)}
                          >
                            Supprimer
                          </Button>
                        </TableCell>

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