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
import { devise } from '../../../../back/database/models/bs';

const Createbv = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState('');
  const [client, setClient] = useState(0);
  const [clientn, setClientn] = useState('');
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

  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';

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
  }, []);

  const handleAddProduct = () => {
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      if (parseInt(quantite, 10) > selectedProduct.quantite) {
        setSnackbarMessage('Quantité insuffisante en stock');
        setOpenSnackbar(true);
        return;
      }

      const finalPrice = parseFloat(price);
      if (isNaN(finalPrice)) {
        setSnackbarMessage('Veuillez entrer un prix valide');
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
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(e.target.value);
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct && selectedProduct.prixU_HT > 0) {
      const gain = ((newPrice - selectedProduct.prixU_HT) / selectedProduct.prixU_HT) * 100;
      setPercentage(gain.toFixed(2));
    }
  };

  const handlePercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value);
    setPercentage(e.target.value);
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      const newPrice = selectedProduct.prixU_HT * (1 + newPercentage / 100);
      setPrice(newPrice.toFixed(2));
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
        products,
        clientName: clientn,
        codey,
        devise:selectedCurrency
      });

      setSnackbarMessage('Bon de Sortie créé avec succès');
      setOpenSnackbar(true);
      onAddDeliveryNote({ code, clientId: client, products, clientName: clientn, codey });
    } catch (error) {
      setSnackbarMessage('Échec de la création du Bon de Sortie');
      setOpenSnackbar(true);
      console.error('Erreur lors de la création du Bon de Sortie:', error);
    }
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

      

      <TextField
        label="Produit"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        select
        fullWidth
        margin="normal"
      >
        {availableProducts
          .filter(prod => prod.quantite > 0)
          .map(prod => (
            <MenuItem key={prod.id} value={prod.designation}>
              {`${prod.designation} - Quantité restante: ${prod.quantite}`}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        label="Quantité"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth margin="normal"
      />

      <TextField
        label="Prix Unitaire"
        type="number"
        value={price}
        onChange={handlePriceChange}
        fullWidth margin="normal"
      />

      <TextField
        label="Pourcentage de gain"
        type="number"
        value={percentage}
        onChange={handlePercentageChange}
        fullWidth margin="normal"
      />

      <TextField
        label="Sélectionner la devise"
        select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        fullWidth margin="normal"
      >
        {['TND', 'EUR', 'USD', 'CAD', 'GBP'].map(currency => (
          <MenuItem key={currency} value={currency}>{currency}</MenuItem>
        ))}
      </TextField>

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>Ajouter Produit</Button>

      {products.length > 0 && (
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2, border: '1px solid #ccc', borderRadius: 2 }}>
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
        </Box>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Enregistrer</Button>

      <Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
    </Box>
  );
};

export default Createbv;
