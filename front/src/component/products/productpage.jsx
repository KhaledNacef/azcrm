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
} from '@mui/material';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [productName, setProductName] = useState(''); // New product name
  const [productUnite, setProductUnite] = useState(''); // New product unite
  const [editProductId, setEditProductId] = useState(null); // Product to edit
  const [editProductName, setEditProductName] = useState(''); // Edited name
  const [editProductUnite, setEditProductUnite] = useState(''); // Edited unite
  const API_BASE_URL = 'https://api.azcrm.deviceshopleader.com/api';

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product/getallp`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input
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

  // Handle add product
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
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }
  };

  // Handle edit product
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
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/product/proddel/${productId}`);
      const remainingProducts = products.filter((product) => product.id !== productId);
      setProducts(remainingProducts);
      setFilteredProducts(remainingProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>

      {/* Add Product Section */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Unite"
          variant="outlined"
          fullWidth
          value={productUnite}
          onChange={(e) => setProductUnite(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      {/* Edit Product Section */}
      {editProductId && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Unite"
            variant="outlined"
            fullWidth
            value={editProductUnite}
            onChange={(e) => setEditProductUnite(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="secondary" onClick={handleUpdateProduct}>
            Update Product
          </Button>
        </Box>
      )}

      {/* Search Bar */}
      <TextField
        label="Search by Name or ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Product Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Unite</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
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
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductPage;
