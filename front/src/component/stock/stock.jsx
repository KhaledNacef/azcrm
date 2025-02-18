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

const StockPage = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [searchQuery, setSearchQuery] = useState(''); // Search input

  // Simulated product data
  useEffect(() => {
    const fetchProducts = async () => {
      // Replace with your API call
      const mockProducts = [
        {
          id: 1,
          name: 'Product A',
          unit: 'Piece',
          quantity: 10,
          unitPrice: 50,
          vat: 19,
          photo: 'https://via.placeholder.com/100',
        },
        {
          id: 2,
          name: 'Product B',
          unit: 'Box',
          quantity: 5,
          unitPrice: 75,
          vat: 10,
          photo: 'https://via.placeholder.com/100',
        },
        {
          id: 3,
          name: 'Product C',
          unit: 'Kg',
          quantity: 20,
          unitPrice: 100,
          vat: 5,
          photo: 'https://via.placeholder.com/100',
        },
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

  // Calculate Net Prices
  const calculateNetHT = (unitPrice, quantity) => unitPrice * quantity;
  const calculateNetTTC = (netHT, vat) => netHT + (netHT * vat) / 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tous Les Produits
      </Typography>

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
              <TableCell><strong>Produit</strong></TableCell>
              <TableCell><strong>Photo</strong></TableCell>
              <TableCell><strong>Unité</strong></TableCell>
              <TableCell><strong>Quantité</strong></TableCell>
              <TableCell><strong>Prix U (HT)</strong></TableCell>
              <TableCell><strong>TVA (%)</strong></TableCell>
              <TableCell><strong>Prix Net (HT)</strong></TableCell>
              <TableCell><strong>Prix Net (TTC)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const netHT = calculateNetHT(product.unitPrice, product.quantity);
                const netTTC = calculateNetTTC(netHT, product.vat);
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <img
                        src={product.photo}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unitPrice.toFixed(2)} $</TableCell>
                    <TableCell>{product.vat} %</TableCell>
                    <TableCell>{netHT.toFixed(2)} $</TableCell>
                    <TableCell>{netTTC.toFixed(2)} $</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
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

export default StockPage;
