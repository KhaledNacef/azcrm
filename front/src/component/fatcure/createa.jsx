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
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api";

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
    setCodey(generateUniqueCodey());
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

  const handleSubmit = async () => {
    if (!supplier || products.length === 0) {
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    for (const product of products) {
      if (product.quantite <= 0) {
        setSnackbarMessage("La quantité doit être supérieure à zéro.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    }

    const newNote = {
      code,
      spulierId: supplier,
      timbre,
      products,
      spulierName: suppliern,
      codey: codey,
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
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Enregistrer
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatebcModala;
