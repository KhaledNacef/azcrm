import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Alert,
} from "@mui/material";

const CreateDeliveryNoteModal = ({ onAddDeliveryNote, codey }) => {
  const [client, setClient] = useState("");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedCurrency, setSelectedCurrency] = useState("TND");
  const [percentage, setPercentage] = useState(0);
  const [price, setPrice] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api";
  const CURRENCY_API_URL = "https://v6.exchangerate-api.com/v6/9179a4fac368332ee3e66b7b/latest/TND";

  useEffect(() => {
    setCode(generateUniqueCode());

    const fetchData = async () => {
      try {
        const [productRes, clientRes, currencyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stock/getall`),
          axios.get(`${API_BASE_URL}/clients/getclient`),
          axios.get(CURRENCY_API_URL),
        ]);
        setAvailableProducts(productRes.data);
        setClients(clientRes.data);
        setExchangeRates(currencyRes.data.conversion_rates); // Store exchange rates
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const generateUniqueCode = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DN-${timestamp}-${randomString}`;
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(e.target.value);
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
      const gain = ((newPrice - basePrice) / basePrice) * 100;
      setPercentage(gain.toFixed(2));
    }
  };

  const handlePercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value);
    setPercentage(e.target.value);
    const selectedProduct = availableProducts.find(p => p.designation === newProduct);
    if (selectedProduct) {
      const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
      const newPrice = basePrice * (1 + newPercentage / 100);
      setPrice(newPrice.toFixed(2));
    }
  };

  const handleAddProduct = () => {
    if (!newProduct) return;
  
    const selectedProduct = availableProducts.find((p) => p.designation === newProduct);
    if (!selectedProduct) return;
  
    const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
    const tva = basePrice * (selectedProduct.tva / 100);
    const totalprice = basePrice + tva;
    const finalTotalPrice = totalprice + totalprice * (percentage / 100);
  
    convertToCurrency(finalTotalPrice).then((convertedPrice) => {
      setProducts((prev) => [
        ...prev,
        {
          designation: selectedProduct.designation,
          Unite: selectedProduct.Unite,
          prixU_HT: convertedPrice,  // Set the converted price
          quantite: parseInt(quantite, 10),
        },
      ]);
  
      // Reset currency to TND after adding the first product
      if (products.length === 0) {
        setSelectedCurrency("TND");
      }
    });
  
    setNewProduct("");
    setQuantite(1);
    setPrice("");
    setPercentage(0);
  };
  
  const convertToCurrency = async (amount) => {
    try {
      const exchangeRate = exchangeRates[selectedCurrency];
      if (!exchangeRate) {
        throw new Error(`Rate for ${selectedCurrency} not found.`);
      }
      return (amount * exchangeRate).toFixed(2);
    } catch (error) {
      console.error("Erreur lors de la conversion de la devise:", error);
      return amount; // Return original amount if conversion fails
    }
  };

  const handleSubmit = async () => {
    if (!client || products.length === 0) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const newNote = {
      code,
      clientId: client,
      products,
      clientName: clients.find((cl) => cl.id === client)?.fullname || "",
      codey,
      devise: selectedCurrency,
    };

    try {
      await axios.post(`${API_BASE_URL}/bs/create`, newNote);
      setSnackbarMessage("Bon de Sortie créé avec succès");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onAddDeliveryNote(newNote);
    } catch (error) {
      console.error("Erreur lors de la création du Bon de Sortie:", error);
      setSnackbarMessage("Échec de la création du Bon de Sortie");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Créer un Bon de Sortie
      </Typography>

      <TextField
        label="Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        select
        fullWidth
        margin="normal"
      >
        {clients.map((cl) => (
          <MenuItem key={cl.id} value={cl.id}>
            {cl.fullname}
          </MenuItem>
        ))}
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
        label="Prix Unitaire"
        type="number"
        value={price}
        onChange={handlePriceChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Quantité"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Pourcentage de gain"
        type="number"
        value={percentage}
        onChange={handlePercentageChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Sélectionner la devise"
        select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        fullWidth
        margin="normal"
      >
        {['TND', 'EUR', 'USD', 'CAD', 'GBP'].map(currency => (
          <MenuItem key={currency} value={currency}>{currency}</MenuItem>
        ))}
      </TextField>

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>
        Ajouter Produit
      </Button>

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

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateDeliveryNoteModal;
