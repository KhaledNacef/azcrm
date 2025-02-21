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

const CreateDeliveryNoteModala = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState('');
  const [supplier, setSupplier] = useState('');
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [tva, setTva] = useState(0);
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, supplierRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/product/getallp`),
          axios.get(`${API_BASE_URL}/clients/getclient`),
        ]);
        setAvailableProducts(productRes.data);
        setSuppliers(supplierRes.data);
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
          Unite: selectedProduct.unite,
          tva: parseFloat(tva),
          prixU_HT: parseFloat(prixU_HT),
          quantite: parseInt(quantite, 10),
        },
      ]);
      setNewProduct('');
      setTva(0);
      setPrixU_HT(0);
      setQuantite(1);
    }
  };

  const handleSubmit = async () => {
    if (!code || !supplier || products.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newNote = {
      code,
      spulierId: supplier,
      timbre,
      products,
    };

    try {
      await axios.post(`${API_BASE_URL}/bs/bs/create`, newNote);
      alert("Bon d'achat créé avec succès");
      onAddDeliveryNote(newNote);
    } catch (error) {
      console.error("Erreur lors de la création du bon d'achat:", error);
      alert("Échec de la création du bon d'achat");
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Bon d'Achat</Typography>
      <TextField label="Code" value={code} onChange={(e) => setCode(e.target.value)} fullWidth margin="normal" />
      <TextField
        label="Fournisseur"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        select fullWidth margin="normal"
      >
        {suppliers.map((sup) => (
          <MenuItem key={sup.id} value={sup.id}>{sup.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Timbre"
        select
        value={timbre}
        onChange={(e) => setTimbre(e.target.value === 'true')}
        fullWidth
        margin="normal"
      >
        <MenuItem value={true}>Oui</MenuItem>
        <MenuItem value={false}>Non</MenuItem>
      </TextField>
      <TextField
        label="Produit"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        select fullWidth margin="normal"
      >
        {availableProducts.map((prod) => (
          <MenuItem key={prod.id} value={prod.designation}>{prod.designation}</MenuItem>
        ))}
      </TextField>
      <TextField label="TVA (%)" type="number" value={tva} onChange={(e) => setTva(e.target.value)} fullWidth margin="normal" />
      <TextField label="Prix U" type="number" value={prixU_HT} onChange={(e) => setPrixU_HT(e.target.value)} fullWidth margin="normal" />
      <TextField label="Quantité" type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} fullWidth margin="normal" />
      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>Ajouter Produit</Button>

      {products.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>TVA (%)</TableCell>
              <TableCell>Prix U </TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.Unite}</TableCell>
                <TableCell>{prod.tva}</TableCell>
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

export default CreateDeliveryNoteModala;
