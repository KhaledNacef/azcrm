import React, { useState } from 'react';
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
} from '@mui/material';

const CreateDeliveryNoteModal = ({ onAddDeliveryNote }) => {
  const [code, setCode] = useState('');
  const [supplier, setSupplier] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [prixUHT, setPrixUHT] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Hardcoded suppliers
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];

  // Hardcoded products
  const availableProducts = ['Product 1', 'Product 2', 'Product 3'];

  const handleAddProduct = () => {
    if (newProduct && !products.some((p) => p.name === newProduct)) {
      setProducts([
        ...products,
        {
          name: newProduct,
          prixUHT: parseFloat(prixUHT),
          quantity: parseInt(quantity, 10),
        },
      ]);
      setNewProduct('');
      setPrixUHT(0);
      setQuantity(1);
    }
  };

  const handleSubmit = () => {
    if (code && supplier && products.length > 0) {
      const newNote = {
        code,
        supplierName: supplier,
        products,
        createdAt: new Date().toISOString(),
      };
      onAddDeliveryNote(newNote);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Créer un Bon de sortie
      </Typography>
      <TextField
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Client"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        select
        fullWidth
        margin="normal"
      >
        {suppliers.map((sup, index) => (
          <MenuItem key={index} value={sup}>
            {sup}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Produit"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        select
        fullWidth
        margin="normal"
      >
        {availableProducts.map((prod, index) => (
          <MenuItem key={index} value={prod}>
            {prod}
          </MenuItem>
        ))}
      </TextField>
     
      <TextField
        label="Prix U"
        type="number"
        value={prixUHT}
        onChange={(e) => setPrixUHT(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantité"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleAddProduct} variant="outlined" sx={{ mb: 2 }}>
        Ajouter Produit
      </Button>

      {products.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Prix U HT</TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.prixUHT}</TableCell>
                <TableCell>{prod.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Enregistrer
      </Button>
    </Box>
  );
};

export default CreateDeliveryNoteModal;
