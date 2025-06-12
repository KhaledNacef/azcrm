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
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CreateDeliveryNoteModala = ({ onAddDeliveryNote, codey }) => {
  const [supplier, setSupplier] = useState(0);
  const [suppliern, setSuppliern] = useState("");
  const [timbre, setTimbre] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
  const [tva, setTva] = useState(0);
  const [prixU_HT, setPrixU_HT] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [code, setCode] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [rem, setRem] = useState(0);
  const [num, setNum] = useState("");
  const [location,setLocation]=useState('');

  const API_BASE_URL = "https://api.azcrm.deviceshopleader.com/api/v1";

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


    setProducts([...products, {
      designation: newProduct.designation,
      Unite: newProduct.Unite,
      tva: parseFloat(tva) || 0,
      prixU_HT: Number(prixU_HT) || 0,
      quantite: Number(quantite) || 1,
      rem:rem
    }]);

    setNewProduct(null);
    setPrixU_HT(0);
    setQuantite(1);
    setRem(0);
  };

  const handleSubmit = async () => {
    if (!supplier || products.length === 0) {
      setNum(0)
      setSnackbar({ open: true, message: "Veuillez remplir tous les champs obligatoires.", severity: "warning" });
      return;
    }

    const newNote = {
      code,
      num:num,
      spulierId: supplier,
      timbre,
      products,
      spulierName: suppliern,
      codey:codey || 10,
      location:location

    };

    try {
      await axios.post(`${API_BASE_URL}/bonachat/add`, newNote);
      setSnackbar({ open: true, message: "Bon d'achat créé avec succès!", severity: "success" });
      onAddDeliveryNote(newNote);
    } catch (error) {
      setSnackbar({ open: true, message: "Échec de la création du bon d'achat.", severity: "error" });
    }
  };


const handleDeleteProduct = (indexToDelete) => {
  const updatedProducts = products.filter((_, index) => index !== indexToDelete);
  setProducts(updatedProducts);
};


  return (
    <Box>
      <Typography variant="h6" mb={2}>Créer un Facture</Typography>
      <TextField label="Numéro de bon d'achat" type="text" value={num} onChange={(e) => setNum(e.target.value || 0)} fullWidth margin="normal" />

        <FormControl fullWidth margin="normal" sx={{mb:3 }}> 
        <InputLabel id="location-label">Localisation</InputLabel>
        <Select
          labelId="location-label"
          value={location}
          label="Localisation"
          onChange={(e) => setLocation(e.target.value)}
        >
          <MenuItem value="local">Local</MenuItem>
          <MenuItem value="etranger">Etranger</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Fournisseur" value={supplier} onChange={handleSupplierChange} select fullWidth margin="normal">
        {suppliers.map((sup) => (<MenuItem key={sup.id} value={sup.id}>{sup.fullname}</MenuItem>))}
      </TextField>

      <TextField label="Timbre" select value={timbre.toString()} onChange={(e) => setTimbre(e.target.value === "true")} fullWidth margin="normal">
        <MenuItem value="true">Oui</MenuItem>
        <MenuItem value="false">Non</MenuItem>
      </TextField>

        <Autocomplete
       value={newProduct}
       onChange={(event, newValue) => {
         setNewProduct(newValue);
       }}
       options={availableProducts}
       getOptionLabel={(option) => `${option.designation} `}
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

      <TextField label="TVA (%)" type="number" value={tva} onChange={(e) => setTva(Number(e.target.value) || 0)} fullWidth margin="normal" />
      <TextField label="Prix U HT" type="number" value={prixU_HT} onChange={(e) => setPrixU_HT(Number(e.target.value) || 0)} fullWidth margin="normal" />
      <TextField label="Quantité" type="number" value={quantite} onChange={(e) => setQuantite(Number(e.target.value) || 1)} fullWidth margin="normal" />
      <TextField label="Rem (%)" type="number" value={rem} onChange={(e) => setRem(Number(e.target.value) || 0)} fullWidth margin="normal" />

      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>Ajouter Produit</Button>

           {products.length > 0 && (
       <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2, border: '1px solid #ccc', borderRadius: 2 }}>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell>Produit</TableCell>
               <TableCell>Unité</TableCell>
               <TableCell>Prix U (TND)</TableCell>
               <TableCell>Quantité</TableCell>
                  <TableCell>Action</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {products.map((prod, index) => (
               <TableRow key={index}>
                 <TableCell>{prod.designation}</TableCell>
                 <TableCell>{prod.Unite}</TableCell>
                 <TableCell>{prod.prixU_HT}</TableCell>
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

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Enregistrer</Button>

      <Snackbar open={snackbar.open}   anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position it at the top-right
 autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateDeliveryNoteModala;
