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
const StockPage = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [searchQuery, setSearchQuery] = useState(''); // Search input

  // Simulated product data
  useEffect(() => {
   
      const fetchstock = async () => {
        try {
          const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/stock/getall');
          setProducts(response.data);
          setFilteredProducts(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des fournisseurs :", error);
        }
      };
     
    

    fetchstock();
    }, [products]);

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
                const netHT = calculateNetHT(product.prixU_HT, product.quantite);
                const netTTC = calculateNetTTC(netHT, product.tva);
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.designation}</TableCell>
                    <TableCell>
                      <img
                        src={product.photo}
                        alt={product.designation}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>{product.Unite}</TableCell>
                    <TableCell>{product.quantite}</TableCell>
                    <TableCell>{product.prixU_HT.toFixed(2)} $</TableCell>
                    <TableCell>{product.tva} %</TableCell>
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
