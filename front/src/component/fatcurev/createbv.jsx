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
  const [clientn, setClientn] = useState("");
  const [codey, setCodey] = useState("");
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
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
      if (parseInt(quantite, 10) > selectedProduct.stock) {
        setSnackbarMessage("Quantité insuffisante en stock");
        setOpenSnackbar(true);
        return;
      }
      setProducts([...products, {
        designation: selectedProduct.designation,
        Unite: selectedProduct.Unite,
        prixU_HT: parseFloat(prixU_HT),
        quantite: parseInt(quantite, 10),
      }]);
      setNewProduct('');
      setPrixU_HT(0);
      setQuantite(1);
    }
  };

  const handleSubmit = async () => {
    if (!client || products.length === 0) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/bonlivraison/facturev`, {
        code, clientId: client, timbre, products, clientName: clientn, codey
      });
      setSnackbarMessage("Bon de Sortie créé avec succès");
      setOpenSnackbar(true);
      onAddDeliveryNote({ code, clientId: client, timbre, products, clientName: clientn, codey });
    } catch (error) {
      setSnackbarMessage("Échec de la création du Bon de Sortie");
      setOpenSnackbar(true);
      console.error("Erreur lors de la création du Bon de Sortie:", error);
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
          setClientn(selectedClient ? selectedClient.fullname : "");
        }}
        select fullWidth margin="normal"
      >
        {clients.map(cl => <MenuItem key={cl.id} value={cl.id}>{cl.fullname}</MenuItem>)}
      </TextField>

      <TextField label="Timbre" select value={timbre} onChange={(e) => setTimbre(e.target.value)} fullWidth margin="normal">
        <MenuItem value={true}>Oui</MenuItem>
        <MenuItem value={false}>Non</MenuItem>
      </TextField>

      <TextField label="Produit" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} select fullWidth margin="normal">
        {availableProducts.map(prod => <MenuItem key={prod.id} value={prod.designation}>{prod.designation}</MenuItem>)}
      </TextField>

      <TextField label="Prix U" type="number" value={prixU_HT} onChange={(e) => setPrixU_HT(e.target.value)} fullWidth margin="normal" />
      <TextField label="Quantité" type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} fullWidth margin="normal" />

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>Ajouter Produit</Button>

      {products.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Prix U</TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.Unite}</TableCell>
                <TableCell>{prod.prixU_HT}$</TableCell>
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
