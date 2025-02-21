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
} from '@mui/material';

const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';

const CreateDeliveryNoteModal = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState(0);
  const [client, setClient] = useState('');
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientSelected, setClientSelected] = useState(false);
  const [timbreSelected, setTimbreSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, clientRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/product/getallp`),
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
    if (newProduct && !products.some((p) => p.designation === newProduct)) {
      const selectedProduct = availableProducts.find(p => p.designation === newProduct);
      setProducts([
        ...products,
        {
          designation: selectedProduct.designation,
          Unite: selectedProduct.Unite,
          prixU_HT: parseFloat(prixU_HT),
          quantite: parseInt(quantite, 10),
        },
      ]);
      setNewProduct('');
      setPrixU_HT(0);
      setQuantite(1);
    }
  };

  const handleSubmit = async () => {
    if (!code || !client || products.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newNote = {
      code,
      clientId: client,
      timbre,
      products,
    };

    try {
      await axios.post(`${API_BASE_URL}/bs/bs/create`, newNote);
      alert("Bon de Sortie créé avec succès");
      onAddDeliveryNote(newNote);
    } catch (error) {
      console.error("Erreur lors de la création du Bon de Sortie:", error);
      alert("Échec de la création du Bon de Sortie");
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Bon de Sortie</Typography>

      {/* Code Selection */}
      <TextField
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
      />

      {/* Client Selection - Only show if client is not selected */}
      {!clientSelected && (
        <TextField
          label="Client"
          value={client}
          onChange={(e) => {
            setClient(e.target.value);
            setClientSelected(true);
          }}
          select
          fullWidth
          margin="normal"
        >
          {clients.map((cl) => (
            <MenuItem key={cl.id} value={cl.id}>{cl.name}</MenuItem>
          ))}
        </TextField>
      )}

      {/* Display selected client name */}
      {client && clientSelected && (
        <Typography variant="body1" mb={2}>
          Client sélectionné: {clients.find((cl) => cl.id === client)?.name}
        </Typography>
      )}

      {/* Timbre Selection - Only show if timbre is not selected */}
      {!timbreSelected && (
        <TextField
          label="Timbre"
          select
          value={timbre}
          onChange={(e) => {
            setTimbre(e.target.value === 'true');
            setTimbreSelected(true);
          }}
          fullWidth
          margin="normal"
        >
          <MenuItem value={true}>Oui</MenuItem>
          <MenuItem value={false}>Non</MenuItem>
        </TextField>
      )}

      {/* Product Selection */}
      <TextField
        label="Produit"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        select
        fullWidth
        margin="normal"
      >
        {availableProducts.map((prod) => (
          <MenuItem key={prod.id} value={prod.designation}>{prod.designation}</MenuItem>
        ))}
      </TextField>

      {/* Price and Quantity Inputs */}
      <TextField
        label="Prix U"
        type="number"
        value={prixU_HT}
        onChange={(e) => setPrixU_HT(e.target.value)}
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

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>
    </Box>
  );
};

export default CreateDeliveryNoteModal;
