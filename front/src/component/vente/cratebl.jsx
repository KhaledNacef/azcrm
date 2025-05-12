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
import Autocomplete from "@mui/material/Autocomplete";

const CreateDeliveryNoteModal = ({ onAddDeliveryNote, codey }) => {
  const [client, setClient] = useState("");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
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
  const [rem, setRem] = useState(0);
  const [tvaa, setTvaa] = useState(0);
  const [timbre, setTimbre] = useState(false);

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api/v1";
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
        setExchangeRates(currencyRes.data.conversion_rates);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  // New effect to update price when product is selected
  useEffect(() => {
    if (newProduct) {
        const basePrice = newProduct.moyenneprix > 0 ? newProduct.moyenneprix : newProduct.prixU_HT;
        const tva = basePrice * (newProduct.tva / 100);
        const priceWithTva = basePrice + tva;
        const discount = newProduct.rem > 0 ? (priceWithTva * newProduct.rem) / 100 : 0;
        const finalPrice = priceWithTva - discount;
        setPrice(finalPrice.toFixed(3));
      
    }
  }, [newProduct, availableProducts]);
  

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
      const tva = basePrice * (selectedProduct.tva / 100);
      const priceWithTva = basePrice + tva;
      const gain = ((newPrice - priceWithTva) / priceWithTva) * 100;
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

  const handleAddProduct = () => {
    if (!newProduct) return;
  
    const selectedProduct = availableProducts.find((p) => p.designation === newProduct);
    if (!selectedProduct) return;
  
    const basePrice = selectedProduct.moyenneprix > 0 ? selectedProduct.moyenneprix : selectedProduct.prixU_HT;
    const tva = basePrice * (selectedProduct.tva / 100);
    const priceWithTva = basePrice + tva;
    const finalPrice = parseFloat(price) || priceWithTva;
  
    convertToCurrency(finalPrice).then((convertedPrice) => {
      const tvaValue = convertedPrice * (tvaa / 100);
      const priceWithTVA = convertedPrice + tvaValue;
      const discountedPrice = priceWithTVA * (1 - rem / 100);
      setProducts((prev) => [
        ...prev,
        {
          designation: selectedProduct.designation,
          Unite: selectedProduct.Unite,
          prixU_HT: convertedPrice,
          quantite: Number(quantite),
          tva: Number(tvaa),
          rem:rem,
          sellprice:discountedPrice
        },

      ]);
    });
  
    setNewProduct("");
    setQuantite(1);
    setPercentage(0);
    setRem(0);

  };
  
  const convertToCurrency = async (amount) => {
    try {
      const exchangeRate = exchangeRates[selectedCurrency];
      if (!exchangeRate) {
        throw new Error(`Rate for ${selectedCurrency} not found.`);
      }
      return (amount * exchangeRate).toFixed(3);
    } catch (error) {
      console.error("Erreur lors de la conversion de la devise:", error);
      return amount;
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
      timbre:timbre
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
        Créer Facture
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
      maxHeight: "200px",
    },
  }}
/>


      <TextField
        label="Prix Unitaire (avec TVA)"
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
        label="Quantité"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField 
      label="Rem (%)" 
      type="number" 
      value={rem} onChange={(e) => setRem(parseFloat(e.target.value) || 0)} 
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
        InputProps={{
          endAdornment: "%",
        }}
      />

      <TextField
        label="Devise"
        select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        fullWidth
        margin="normal"
      >
        {Object.keys(exchangeRates).map(currency => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
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
                <TableCell>Rem</TableCell>
                <TableCell>TVA</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod, index) => (
                <TableRow key={index}>
                  <TableCell>{prod.designation}</TableCell>
                  <TableCell>{prod.Unite}</TableCell>
                  <TableCell>{prod.prixU_HT}</TableCell>
                  <TableCell>{prod.quantite}</TableCell>
                  <TableCell>{prod.rem}</TableCell>
                  <TableCell>{prod.tva}</TableCell>


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