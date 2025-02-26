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

const Createbv = ({ onAddDeliveryNote }) => {
    const [code,setCode]= useState('');
  const [client, setClient] = useState(0);
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientSelected, setClientSelected] = useState(false);
  const [timbreSelected, setTimbreSelected] = useState(false);

  const generateUniqueCode = () => {
    const timestamp = new Date().getTime(); // Current timestamp (milliseconds)
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random alphanumeric string
    return `DN-${timestamp}-${randomString}`; // Combine timestamp and random string
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, clientRes] = await Promise.all([
          axios.get(`https://api.azcrm.deviceshopleader.com/api/stock/getall`),
          axios.get(`${API_BASE_URL}/clients/getclient`),
        ]);
        setAvailableProducts(productRes.data);
        setClients(clientRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    const newCode = generateUniqueCode();
    setCode(newCode); // Set generated code
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
    if (!client || products.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newNote = {
      code:code,
      clientId:client,
      timbre,
      products,
    };

    try {
      await axios.post(`${API_BASE_URL}/bonlivraison/facturev`, newNote);
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
     
      {/* Client Selection - Only show if client is not selected */}
      <TextField
  label="Client"
  value={client}
  onChange={(e) => setClient(e.target.value)}
  select
  fullWidth
  margin="normal"
>
  {clients.map((cl) => (
    <MenuItem key={cl.id} value={cl.id}>{cl.fullname}</MenuItem>
  ))}
</TextField>

{/* Display selected client name */}
{client && (
  <Typography variant="body1" mb={2}>
    Client sélectionné: {clients.find((cl) => cl.id === client)?.fullname}
  </Typography>
)}


      {/* Display selected client name */}
      {client && clientSelected && (
        <Typography variant="body1" mb={2}>
          Client sélectionné: {clients.find((cl) => cl.id === client)?.fullname}
        </Typography>
      )}

      {/* Timbre Selection - Only show if timbre is not selected */}
      {!timbreSelected && (
        <TextField
          label="Timbre"
          select
          value={timbre}
          onChange={(e) => {
            setTimbre(e.target.value );
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

export default Createbv;
