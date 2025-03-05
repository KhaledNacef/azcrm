import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";

const CreateDeliveryNoteModala = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState("");
  const [codey, setCodey] = useState("");

  const [supplier, setSupplier] = useState(0);
  const [suppliern, setSuppliern] = useState("");
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [tva, setTva] = useState(0);
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api";

  // Generate unique code for the delivery note
  const generateUniqueCode = () => `DN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const generateUniqueCodey = () => `DN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;


  useEffect(() => {

    setCode(generateUniqueCode()); // Set generated code
    setCodey(generateUniqueCodey())

    const fetchData = async () => {
      try {
        const [productRes, supplierRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/product/getallp`),
          axios.get(`${API_BASE_URL}/suplier/getsuppliers`),
        ]);
        setAvailableProducts(productRes.data);
        setSuppliers(supplierRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    
    fetchData();
  }, []);

  // Handle supplier selection
  const handleSupplierChange = (e) => {
    const selectedSupplier = suppliers.find(sup => sup.id === e.target.value);
    setSupplier(e.target.value);
    setSuppliern(selectedSupplier ? selectedSupplier.fullname : "");
  };

  // Add product to the list
  const handleAddProduct = () => {
    if (!newProduct) {
      alert("Veuillez sélectionner un produit.");
      return;
    }

    const selectedProduct = availableProducts.find(p => p.designation === newProduct);

    if (!selectedProduct) {
      alert("Produit invalide sélectionné.");
      return;
    }

    setProducts([
      ...products,
      {
        designation: selectedProduct.designation,
        Unite: selectedProduct.Unite,
        tva: parseFloat(tva) || 0,
        prixU_HT: parseFloat(prixU_HT) || 0,
        quantite: parseInt(quantite, 10) || 1,
      },
    ]);

    // Reset fields
    setNewProduct("");
    setTva(0);
    setPrixU_HT(0);
    setQuantite(1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!supplier || products.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newNote = {
      code: code,
      spulierId: supplier, // Corrected key
      timbre: timbre,
      products: products,
      spulierName:suppliern,
      codey:codey
    };

    try {
      await axios.post(`${API_BASE_URL}/bonachat/add`, newNote);
      alert("Bon d'achat créé avec succès");
      onAddDeliveryNote(newNote);
    } catch (error) {
      console.error("Error creating delivery note:", error.response?.data || error);
      alert("Échec de la création du bon d'achat");
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Bon d'Achat</Typography>

      {/* Supplier Selection */}
    
      <TextField
        label="Fournisseur"
        value={supplier}
        onChange={handleSupplierChange}
        select
        fullWidth
        margin="normal"
      >
        {suppliers.map((sup) => (
          <MenuItem key={sup.id} value={sup.id}>{sup.fullname}</MenuItem>
        ))}
      </TextField>

      {/* Timbre Selection */}
      <TextField
        label="Timbre"
        select
        value={timbre.toString()} // Convert boolean to string for MUI
        onChange={(e) => setTimbre(e.target.value === "true")}
        fullWidth
        margin="normal"
      >
        <MenuItem value="true">Oui</MenuItem>
        <MenuItem value="false">Non</MenuItem>
      </TextField>

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
          <MenuItem key={prod.id} value={prod.designation}>
            {prod.designation}
          </MenuItem>
        ))}
      </TextField>

      {/* TVA, Price, and Quantity Input */}
      <TextField
        label="TVA (%)"
        type="number"
        value={tva}
        onChange={(e) => setTva(parseFloat(e.target.value) || 0)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Prix U HT"
        type="number"
        value={prixU_HT}
        onChange={(e) => setPrixU_HT(parseFloat(e.target.value) || 0)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantité"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(parseInt(e.target.value, 10) || 1)}
        fullWidth
        margin="normal"
      />

      {/* Add Product Button */}
      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>
        Ajouter Produit
      </Button>

      {/* Products Table */}
      {products.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>TVA (%)</TableCell>
              <TableCell>Prix U HT</TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.Unite}</TableCell>
                <TableCell>{prod.tva}</TableCell>
                <TableCell>{prod.prixU_HT}</TableCell>
                <TableCell>{prod.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Submit Button */}
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>
    </Box>
  );
};

export default CreateDeliveryNoteModala;
