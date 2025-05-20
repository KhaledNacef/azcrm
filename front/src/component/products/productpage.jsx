import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]); // Tous les produits
  const [filteredProducts, setFilteredProducts] = useState([]); // Produits filtrés
  const [searchQuery, setSearchQuery] = useState(''); // Recherche
  const [productName, setProductName] = useState(''); // Nom du nouveau produit
  const [productUnite, setProductUnite] = useState(''); // Unité du nouveau produit
  const [editProductId, setEditProductId] = useState(null); // Produit à éditer
  const [editProductName, setEditProductName] = useState(''); // Nom modifié
  const [editProductUnite, setEditProductUnite] = useState(''); // Unité modifiée
  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api/v1';
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  // État de la snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' ou 'error'

  // Récupérer les produits depuis le backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product/getallp`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    };

    fetchProducts();
  }, [isDataUpdated]);

  // Gérer la recherche
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.designation.toLowerCase().includes(query) ||
        product.id.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Ajouter un produit
  const handleAddProduct = async () => {
    if (productName && productUnite) {
      try {
        const newProduct = {
          designation: productName,
          Unite: productUnite,
        };

        const response = await axios.post(`${API_BASE_URL}/product/createproduct`, newProduct);
        setProducts([...products, response.data]);
        setFilteredProducts([...products, response.data]);
        setProductName('');
        setProductUnite('');
        setIsDataUpdated(true); // Indiquer que les données sont mises à jour

        // Afficher le message de succès dans la snackbar
        setSnackbarMessage('Produit ajouté avec succès !');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

      } catch (error) {
        console.error('Erreur lors de la création du produit :', error);

        // Afficher le message d\'erreur dans la snackbar
        setSnackbarMessage('Erreur lors de la création du produit.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  // Modifier un produit
  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.designation);
    setEditProductUnite(product.Unite);
  };

  const handleUpdateProduct = async () => {
    const updatedProduct = {
      designation: editProductName,
      Unite: editProductUnite,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/product/upprod/${editProductId}`, updatedProduct);
      const updatedProducts = products.map((product) =>
        product.id === editProductId
          ? { ...product, designation: editProductName, Unite: editProductUnite }
          : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditProductId(null);
      setEditProductName('');
      setEditProductUnite('');

      // Afficher le message de succès dans la snackbar
      setSnackbarMessage('Produit mis à jour avec succès !');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);

      // Afficher le message d\'erreur dans la snackbar
      setSnackbarMessage('Erreur lors de la mise à jour du produit.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/product/proddel/${productId}`);
      const remainingProducts = products.filter((product) => product.id !== productId);
      setProducts(remainingProducts);
      setFilteredProducts(remainingProducts);

      // Afficher le message de succès dans la snackbar
      setSnackbarMessage('Produit supprimé avec succès !');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);

      // Afficher le message d\'erreur dans la snackbar
      setSnackbarMessage('Erreur lors de la suppression du produit.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>

      {/* Section Ajouter un produit */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Nom du Produit"
          variant="outlined"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Unité"
          variant="outlined"
          fullWidth
          value={productUnite}
          onChange={(e) => setProductUnite(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Ajouter un Produit
        </Button>
      </Box>

      {/* Section Modifier un produit */}
      {editProductId && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Nom du Produit"
            variant="outlined"
            fullWidth
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Unité"
            variant="outlined"
            fullWidth
            value={editProductUnite}
            onChange={(e) => setEditProductUnite(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="secondary" onClick={handleUpdateProduct}>
            Mettre à Jour le Produit
          </Button>
        </Box>
      )}

      {/* Barre de Recherche */}
      <TextField
        label="Recherche par Nom ou ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Tableau des Produits */}
        <TableContainer 
              component={Paper}
              sx={{
                maxHeight: '600px', // Set your desired max height
                overflow: 'auto'
              }}
            >
              <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}><strong>ID</strong></TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}><strong>Nom</strong></TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}><strong>Unité</strong></TableCell>
              <TableCell sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.designation}</TableCell>
                  <TableCell>{product.Unite}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditProduct(product)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar pour les notifications */}
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position it at the top-right
>
  <Alert
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
    </Box>
  );
};

export default ProductPage;
