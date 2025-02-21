import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import './cssba.css';

const SingleDeliveryNote = () => {
  const { code, supplierId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/getidsuppliers/${supplierId}`)
        const product = await axios.get(`https://api.azcrm.deviceshopleader.com/api/stock/getallstockdelv/${code}`);

        setSupplier(supplierRes.data);
        setDeliveryNote(product.data);
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, supplierId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalNetHT = deliveryNote.products.reduce(
    (acc, prod) => acc + prod.prixU_HT * prod.quantity,
    0
  );
  const totalTVA = totalNetHT * (deliveryNote.products[0]?.TVA / 100);
  const totalNetTTC = totalNetHT + totalTVA;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        Imprimer
      </Button>
      <Box ref={printRef} sx={{ border: '1px solid #ccc', p: 3, mt: 2, backgroundColor: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <img
              src="https://pandp.tn/wp-content/uploads/2023/11/logo-pandp-shop-dark-bold1.png"
              alt="Logo de Ma Société"
              style={{ width: 100 }}
            />
            <Typography variant="h6">{deliveryNote.companyName}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{supplier?.fullname}</Typography>
            <Typography variant="body2">{supplier?.address}, {supplier?.ville}, {supplier?.pays}</Typography>
            <Typography variant="body2">Téléphone: {supplier?.tel}</Typography>
            <Typography variant="body2">Code TVA: {supplier?.codeTVA}</Typography>
          </Box>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Prix U HT</TableCell>
              <TableCell>TVA (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.prixU_HT.toFixed(2)} TND</TableCell>
                <TableCell>{product.TVA}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 3 }}>
          <Typography>Total HT: {totalNetHT.toFixed(2)} TND</Typography>
          <Typography>TVA: {totalTVA.toFixed(2)} TND</Typography>
          <Typography>Total TTC: {totalNetTTC.toFixed(2)} TND</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
