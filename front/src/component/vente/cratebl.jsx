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
  const [timbre, setTimbre] = useState(false);
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
  const [exchangeRates, setExchangeRates] = useState({ TND: 1 });

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api";
  const CURRENCY_API_URL = "https://v6.exchangerate-api.com/v6/9179a4fac368332ee3e66b7b/latest/TND";

  useEffect(() => {
    setCode(generateUniqueCode());

    const fetchData = async () => {
      try {
        const [productRes, clientRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stock/getall`),
          axios.get(`${API_BASE_URL}/clients/getclient`),
        ]);
        setAvailableProducts(productRes.data);
        setClients(clientRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const res = await axios.get(CURRENCY_API_URL);
        setExchangeRates(res.data.conversion_rates);
      } catch (error) {
        console.error("Erreur lors de la récupération des taux de change:", error);
      }
    };

    fetchData();
    fetchExchangeRates();
  }, []);

  const generateUniqueCode = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DN-${timestamp}-${randomString}`;
  };

  const convertPrice = (priceInTND) => {
    return exchangeRates[selectedCurrency]
      ? (priceInTND * exchangeRates[selectedCurrency]).toFixed(2)
      : priceInTND;
  };

  const handleAddProduct = () => {
    if (!newProduct) return;

    const selectedProduct = availableProducts.find((p) => p.designation === newProduct);
    if (!selectedProduct) return;


    
    const tva = selectedProduct.prixU_HT * (selectedProduct.tva / 100); // assuming tva is a percentage

    // Convert price from TND to selected currency
    const convertedPrice = convertPrice(tva);


    setProducts((prev) => [
      ...prev,
      {
        designation: selectedProduct.designation,
        Unite: selectedProduct.Unite,
        prixU_HT: convertedPrice,
        quantite: parseInt(quantite, 10),
      },
    ]);

    setNewProduct("");
    setQuantite(1);
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
      timbre,
      products,
      clientName: clients.find((cl) => cl.id === client)?.fullname || "",
      codey,
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

      {/* Client Selection */}
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

      {/* Timbre Selection */}
      <TextField
        label="Timbre"
        select
        value={timbre.toString()}
        onChange={(e) => setTimbre(JSON.parse(e.target.value))}
        fullWidth
        margin="normal"
      >
        <MenuItem value="true">Oui</MenuItem>
        <MenuItem value="false">Non</MenuItem>
      </TextField>

      {/* Product Selection */}
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

      {/* Quantity Input */}
      <TextField
        label="Quantité"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Currency Selection */}
      <TextField
        label="Sélectionner la devise"
        select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        fullWidth
        margin="normal"
      >
        {Object.keys(exchangeRates).map((currency) => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </TextField>

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>
        Ajouter Produit
      </Button>

      {/* List of Added Products */}
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

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>
    </Box>
  );
};

export default CreateDeliveryNoteModal;
