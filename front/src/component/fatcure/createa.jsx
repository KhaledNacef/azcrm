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
  Snackbar,
  Alert
} from "@mui/material";

const CreatebcModala = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState("");
  const [codey, setCodey] = useState("");

  const [supplier, setSupplier] = useState(0);
  const [suppliern, setSuppliern] = useState("");
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [tva, setTva] = useState(0);
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [rem, setRem] = useState(0);
  const [num, setNum] = useState("");

  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api/v1";

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" or "error"

  const generateUniqueCode = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DN-${timestamp}-${randomString}`;
  };
  const generateUniqueCodey = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DN-${timestamp}-${randomString}`;
  };
 
  useEffect(() => {
    setCodey(generateUniqueCodey())
    setCode(generateUniqueCode());

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

  const handleAddProduct = () => {
    if (!newProduct) {
      setSnackbarMessage("Veuillez sélectionner un produit.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const selectedProduct = availableProducts.find((p) => p.designation === newProduct);
    if (!selectedProduct) {
      setSnackbarMessage("Produit invalide sélectionné.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setProducts([
      ...products,
      {
        designation: selectedProduct.designation,
        Unite: selectedProduct.Unite,
        tva: Number(tva),
        prixU_HT: Number(prixU_HT),
        quantite: Number(quantite),
        rem:rem
      },
    ]);

    setNewProduct("");
    setTva(0);
    setPrixU_HT(0);
    setQuantite(1);
    setRem(0);
    setNum(0)
    setSnackbarMessage("Produit ajouté avec succès.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    if (!supplier || products.length === 0) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const newNote = {
      code,
      num:num,
      spulierId: supplier, // Fixed key name
      timbre,
      products,
      spulierName:suppliern,
      codey:codey
    };

    try {
      await axios.post(`${API_BASE_URL}/boncommandall/factures`, newNote);
      setSnackbarMessage("Bon d'achat créé avec succès");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onAddDeliveryNote(newNote);
    } catch (error) {
      console.error("Error creating delivery note:", error.response?.data || error);
      setSnackbarMessage("Échec de la création du bon d'achat");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Bon De Commande</Typography>

     <TextField label="Numéro de bon d'achat"  type="text" value={num} onChange={(e) => setNum(e.target.value || 0)} fullWidth margin="normal" />
      

      {/* Supplier selection */}
      <TextField
        label="Fournisseur"
        value={supplier}
        onChange={(e) => {
          const selectedSupplier = suppliers.find((sup) => sup.id === e.target.value);
          setSupplier(e.target.value);
          setSuppliern(selectedSupplier?.fullname || "");
        }}
        select
        fullWidth
        margin="normal"
      >
        {suppliers.map((sup) => (
          <MenuItem key={sup.id} value={sup.id}>{sup.fullname}</MenuItem>
        ))}
      </TextField>

      {/* Timbre selection */}
       <TextField label="Timbre" select value={timbre.toString()} onChange={(e) => setTimbre(e.target.value === "true")} fullWidth margin="normal">
              <MenuItem value="true">Oui</MenuItem>
              <MenuItem value="false">Non</MenuItem>
            </TextField>

      {/* Product selection */}
      <TextField
        label="Produit"
        value={newProduct || ""}
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

      {/* TVA, Price, and Quantity input */}
      <TextField
        label="TVA (%)"
        type="number"
        value={tva}
        onChange={(e) => setTva(Number(e.target.value))}
        fullWidth
        margin="normal"
      />
       <TextField
        label="Rem (%)"
        type="number"
        value={rem}
        onChange={(e) => setRem(Number(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Prix U HT"
        type="number"
        value={prixU_HT}
        onChange={(e) => setPrixU_HT(Number(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantité"
        type="number"
        value={quantite}
        onChange={(e) => setQuantite(Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      {/* Add Product Button */}
      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>
        Ajouter Produit
      </Button>

      {/* Products Table */}
           {products.length > 0 && (
       <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2, border: '1px solid #ccc', borderRadius: 2 }}>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell>Produit</TableCell>
               <TableCell>Unité</TableCell>
               <TableCell>Prix U (TND)</TableCell>
               <TableCell>Quantité</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {products.map((prod, index) => (
               <TableRow key={index}>
                 <TableCell>{prod.designation}</TableCell>
                 <TableCell>{prod.Unite}</TableCell>
                 <TableCell>{prod.prixU_HT}</TableCell>
                 <TableCell>{prod.quantite}</TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </Box>
     )}

      {/* Submit Button */}
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position it at the top-right
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}   sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatebcModala;
