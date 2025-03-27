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
  Alert,
} from "@mui/material";

const CreateDeliveryNoteModala = ({ onAddDeliveryNote, codey }) => {
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
  const [code, setCode] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api";

  const generateUniqueCode = () => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DN-${timestamp}-${randomString}`;
  };

  useEffect(() => {
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
        setSnackbar({ open: true, message: "Erreur de chargement des données.", severity: "error" });
      }
    };
    fetchData();
  }, []);

  const handleSupplierChange = (e) => {
    const selectedSupplier = suppliers.find((sup) => sup.id === e.target.value);
    setSupplier(e.target.value);
    setSuppliern(selectedSupplier ? selectedSupplier.fullname : "");
  };

  const handleAddProduct = () => {
    if (!newProduct) {
      setSnackbar({ open: true, message: "Veuillez sélectionner un produit.", severity: "warning" });
      return;
    }

    const selectedProduct = availableProducts.find((p) => p.designation === newProduct);

    if (!selectedProduct) {
      setSnackbar({ open: true, message: "Produit invalide sélectionné.", severity: "error" });
      return;
    }

    setProducts([...products, {
      designation: selectedProduct.designation,
      Unite: selectedProduct.Unite,
      tva: parseFloat(tva) || 0,
      prixU_HT: parseFloat(prixU_HT) || 0,
      quantite: parseInt(quantite, 10) || 1,
    }]);

    setNewProduct("");
    setTva(0);
    setPrixU_HT(0);
    setQuantite(1);
  };

  const handleSubmit = async () => {
    if (!supplier || products.length === 0) {
      setSnackbar({ open: true, message: "Veuillez remplir tous les champs obligatoires.", severity: "warning" });
      return;
    }

    const newNote = {
      code,
      spulierId: supplier,
      timbre,
      products,
      spulierName: suppliern,
      codey,
    };

    try {
      await axios.post(`${API_BASE_URL}/bonachat/add`, newNote);
      setSnackbar({ open: true, message: "Bon d'achat créé avec succès!", severity: "success" });
      onAddDeliveryNote(newNote);
    } catch (error) {
      setSnackbar({ open: true, message: "Échec de la création du bon d'achat.", severity: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Bon d'Achat</Typography>
      <TextField label="Fournisseur" value={supplier} onChange={handleSupplierChange} select fullWidth margin="normal">
        {suppliers.map((sup) => (<MenuItem key={sup.id} value={sup.id}>{sup.fullname}</MenuItem>))}
      </TextField>

      <TextField label="Timbre" select value={timbre.toString()} onChange={(e) => setTimbre(e.target.value === "true")} fullWidth margin="normal">
        <MenuItem value="true">Oui</MenuItem>
        <MenuItem value="false">Non</MenuItem>
      </TextField>

      <TextField label="Produit" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} select fullWidth margin="normal">
        {availableProducts.map((prod) => (<MenuItem key={prod.id} value={prod.designation}>{prod.designation}</MenuItem>))}
      </TextField>

      <TextField label="TVA (%)" type="number" value={tva} onChange={(e) => setTva(parseFloat(e.target.value) || 0)} fullWidth margin="normal" />
      <TextField label="Prix U HT" type="number" value={prixU_HT} onChange={(e) => setPrixU_HT(parseFloat(e.target.value) || 0)} fullWidth margin="normal" />
      <TextField label="Quantité" type="number" value={quantite} onChange={(e) => setQuantite(parseInt(e.target.value, 10) || 1)} fullWidth margin="normal" />

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>Ajouter Produit</Button>

      {products.length > 0 && (
        <Table>
          <TableHead>
            <TableRow><TableCell>Produit</TableCell><TableCell>Unité</TableCell><TableCell>TVA (%)</TableCell><TableCell>Prix U HT</TableCell><TableCell>Quantité</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, index) => (
              <TableRow key={index}><TableCell>{prod.designation}</TableCell><TableCell>{prod.Unite}</TableCell><TableCell>{prod.tva}</TableCell><TableCell>{prod.prixU_HT}</TableCell><TableCell>{prod.quantite}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Enregistrer</Button>

      <Snackbar open={snackbar.open}   anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position it at the top-right
 autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateDeliveryNoteModala;
