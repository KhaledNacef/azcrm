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

const ProductPage = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [productName, setProductName] = useState(''); // New product name
  const [productPrice, setProductPrice] = useState(''); // New product price
  const [editProductId, setEditProductId] = useState(null); // Product to edit
  const [editProductName, setEditProductName] = useState(''); // Edited name
  const [editProductPrice, setEditProductPrice] = useState(''); // Edited price

  // Simulated product data
  useEffect(() => {
    const fetchProducts = async () => {
      // Replace with your API call
      const mockProducts = [
        { id: 1, name: 'Product A', price: 50 },
        { id: 2, name: 'Product B', price: 75 },
        { id: 3, name: 'Product C', price: 100 },
        { id: 4, name: 'Product D', price: 200 },
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    };

    fetchProducts();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.id.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Handle add product
  const handleAddProduct = () => {
    if (productName && productPrice) {
      const newProduct = {
        id: products.length + 1,
        name: productName,
        price: parseFloat(productPrice),
      };
      setProducts([...products, newProduct]);
      setFilteredProducts([...products, newProduct]);
      setProductName('');
      setProductPrice('');
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
  };

  const handleUpdateProduct = () => {
    const updatedProducts = products.map((product) =>
      product.id === editProductId
        ? { ...product, name: editProductName, price: parseFloat(editProductPrice) }
        : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setEditProductId(null);
    setEditProductName('');
    setEditProductPrice('');
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    const remainingProducts = products.filter((product) => product.id !== productId);
    setProducts(remainingProducts);
    setFilteredProducts(remainingProducts);
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
          label="Product Price ($)"
          variant="outlined"
          fullWidth
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
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
            label="Product Price ($)"
            variant="outlined"
            fullWidth
            value={editProductPrice}
            onChange={(e) => setEditProductPrice(e.target.value)}
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
              <TableCell><strong>Price ($)</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
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
