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
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const Createrecettes = ({ onAddDeliveryNote, codey }) => {
  
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedCurrency, setSelectedCurrency] = useState("TND");

  const [rem, setRem] = useState(0);

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api/v1";

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [productRes, ] = await Promise.all([
          axios.get(`${API_BASE_URL}/fiches/getallf`),
        
        ]);
        setAvailableProducts(productRes.data);
    
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  // New effect to update price when product is selected
 
  

 const handleAddProduct = async () => {
  
  
    try {
      
  
      setProducts((prev) => [
        ...prev,
        {
          name: newProduct.name,
          sellingPrice: newProduct.sellingPrice,
          quantite: Number(quantite),
          totalcost: newProduct.totalcost,
          profit: newProduct.profit,
          totalTTC: newProduct.profit*quantite,
          totalcosts: newProduct.totalcost*quantite,
        },
      ]);
  
      // Réinitialisation
      setNewProduct(null);
      setQuantite(1);
      setPercentage(0);
      setRem(0);
      setPrice("");
    } catch (err) {
      console.error("Erreur lors de la conversion de la devise :", err);
    }
  };
  
 
  const handleSubmit = async () => {
    if (!client || products.length === 0) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const newNote = {
   
      products,
    
    };

    try {
      await axios.post(`${API_BASE_URL}/recette/mc`, newNote);
      setSnackbarMessage("Bon de Sortie créé avec succès");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onAddDeliveryNote(newNote);
    } catch (error) {
      console.error("Erreur lors de la création du Bon de Sortie:", error);
      setSnackbarMessage("Échec de la création du Bon de Sortie");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  


  const handleDeleteProduct = (indexToDelete) => {
  const updatedProducts = products.filter((_, index) => index !== indexToDelete);
  setProducts(updatedProducts);
};

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Créer Une Recette
      </Typography>
     

      <Autocomplete
  value={newProduct}
  onChange={(event, newValue) => {
    setNewProduct(newValue);
  }}
  getOptionLabel={(option) => `${option.name} (${option.sellingPrice} en stock)`}
  openOnFocus
  renderInput={(params) => (
    <TextField
      {...params}
      label="Produit"
      fullWidth
      margin="normal"
    />
  )}
  ListboxProps={{
    style: {
      maxHeight: "300px",
    },
  }}
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

      {products.length > 0 && (
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell>Prix U ({selectedCurrency})</TableCell>
                <TableCell>Quantité</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod, index) => (
                <TableRow key={index}>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.sellingPrice}</TableCell>
                  <TableCell>{prod.quantite}</TableCell>
                  <TableCell>
                       <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteProduct(index)}
                        >
                  Supprimer
                       </Button>
                 </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>

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