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
  const [clientn, setClientn] = useState('');
  const [codey, setCodey] = useState('');
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('TND');
  const [exchangeRates, setExchangeRates] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';
  const CURRENCY_API_URL = 'https://v6.exchangerate-api.com/v6/9179a4fac368332ee3e66b7b/latest/TND'; // Base TND

  useEffect(() => {
    const generateUniqueCode = () => `DN-${new Date().getTime()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setCode(generateUniqueCode());
    setCodey(generateUniqueCode());

    const fetchData = async () => {
      try {
        const [productRes, clientRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stock/getall`),
          axios.get(`${API_BASE_URL}/clients/getclient`),
        ]);
        setAvailableProducts(productRes.data);
        setClients(clientRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    fetchData();

    const fetchExchangeRates = async () => {
      try {
        const res = await axios.get(CURRENCY_API_URL);
        setExchangeRates(res.data.conversion_rates); // { USD: 0.32, EUR: 0.28, TND: 1, ... }
      } catch (error) {
        console.error('Erreur lors de la récupération des taux de change:', error);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAddProduct = () => {
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      if (parseInt(quantite, 10) > selectedProduct.stock) {
        setSnackbarMessage('Quantité insuffisante en stock');
        setOpenSnackbar(true);
        return;
      }
      const tva = selectedProduct.prixU_HT * (selectedProduct.tva / 100); // assuming tva is a percentage

      // Convert price from TND to selected currency
      const convertedPrice = convertPrice(tva);

      setProducts([...products, {
        designation: selectedProduct.designation,
        Unite: selectedProduct.Unite,
        prixU_HT: convertedPrice, // Converted price
        quantite: parseInt(quantite, 10),
      }]);

      setNewProduct('');
      setQuantite(1);
    }
  };

  const handleSubmit = async () => {
    if (!client || products.length === 0) {
      setSnackbarMessage('Veuillez remplir tous les champs obligatoires.');
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/bonlivraison/facturev`, {
        code,
        clientId: client,
        timbre,
        products: products.map(prod => ({
          ...prod,
          prixU_HT: prod.prixU_HT, // Submit converted price
        })),
        clientName: clientn,
        codey
      });

      setSnackbarMessage('Bon de Sortie créé avec succès');
      setOpenSnackbar(true);
      onAddDeliveryNote({ code, clientId: client, timbre, products, clientName: clientn, codey });
    } catch (error) {
      setSnackbarMessage('Échec de la création du Bon de Sortie');
      setOpenSnackbar(true);
      console.error('Erreur lors de la création du Bon de Sortie:', error);
    }
  };

  const convertPrice = (priceInTND) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInTND * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInTND; // Default to TND if rates are unavailable
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Bon De Livraison</Typography>

      <TextField
        label="Client"
        value={client}
        onChange={(e) => {
          const selectedClientId = parseInt(e.target.value, 10);
          const selectedClient = clients.find(cl => cl.id === selectedClientId);
          setClient(selectedClientId);
          setClientn(selectedClient ? selectedClient.fullname : '');
        }}
        select fullWidth margin="normal"
      >
        {clients.map(cl => <MenuItem key={cl.id} value={cl.id}>{cl.fullname}</MenuItem>)}
      </TextField>

      <TextField label="Timbre" select value={timbre} onChange={(e) => setTimbre(e.target.value)} fullWidth margin="normal">
        <MenuItem value={true}>Oui</MenuItem>
        <MenuItem value={false}>Non</MenuItem>
      </TextField>

      <TextField 
  label="Produit"
  value={newProduct}
  onChange={(e) => setNewProduct(e.target.value)}
  select
  fullWidth
  margin="normal"
>
  {availableProducts
    .filter(prod => prod.quantite > 0) // Only show products with stock greater than 0
    .map(prod => (
      <MenuItem key={prod.id} value={prod.designation}>
        {`${prod.designation} - Quantité restante: ${prod.quantite}`}
      </MenuItem>
  ))}
</TextField>

      <TextField label="Quantité" type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} fullWidth margin="normal" />

      <TextField
        label="Sélectionner la devise"
        select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        fullWidth margin="normal"
      >
        {Object.keys(exchangeRates).map(currency => (
          <MenuItem key={currency} value={currency}>{currency}</MenuItem>
        ))}
      </TextField>

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>Ajouter Produit</Button>

      {products.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Prix U ({selectedCurrency})</TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.Unite}</TableCell>
                <TableCell>{prod.prixU_HT}</TableCell>
                <TableCell>{prod.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Enregistrer</Button>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
    </Box>
  );
};

export default Createbv;
