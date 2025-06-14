import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const Createrecettes = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api/v1";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/fiches/getallf`);
        setAvailableProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        showSnackbar("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!newProduct) {
      showSnackbar("Please select a product first", "warning");
      return;
    }

    const productToAdd = {
      name: newProduct.name,
      sellingPrice: newProduct.sellingPrice,
      quantite: Number(quantite) || 1,
      totalcost: newProduct.totalcost,
      profit: newProduct.profit,
      totalTCT: newProduct.profit * (Number(quantite) || 1),
      totalcosts: newProduct.totalcost * (Number(quantite) || 1),
    };

    setProducts([...products, productToAdd]);
    setNewProduct(null);
    setQuantite(1);
  };

  const handleSubmit = async () => {
    if (products.length === 0) {
      showSnackbar("Please add at least one product", "error");
      return;
    }

    try {
      // Prepare payload exactly as required
 

      console.log("Sending payload:", products); // For debugging

      const response = await axios.post(`${API_BASE_URL}/recette/mc`, products, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        showSnackbar("Recipe created successfully!", "success");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      "Failed to create recipe";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Recipe
      </Typography>

      <Autocomplete
        options={availableProducts}
        value={newProduct}
        onChange={(event, newValue) => setNewProduct(newValue)}
        getOptionLabel={(option) => `${option.name} (${option.sellingPrice} TND)`}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Product"
            fullWidth
            margin="normal"
          />
        )}
        loading={loading}
      />

      <TextField
        label="Quantity"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
      />

      <Button 
        onClick={handleAddProduct} 
        variant="contained" 
        sx={{ mt: 1, mb: 3 }}
        disabled={!newProduct}
      >
        Add Product
      </Button>

      {products.length > 0 && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Products
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Total TTC</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sellingPrice} TND</TableCell>
                  <TableCell>{product.quantite}</TableCell>
                  <TableCell>{product.totalcosts} TND</TableCell>
                  <TableCell>{product.totalTTC} TND</TableCell>
                  <TableCell>
                    <Button 
                      color="error"
                      onClick={() => handleDeleteProduct(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {products.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          size="large"
        >
          Save Recipe
        </Button>
      )}

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

export default Createrecettes;