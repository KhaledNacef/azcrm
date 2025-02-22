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
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/getidsuppliers/${supplierId}`);
        const productRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/bonachat/stock/getallstockdelv/${code}`);

        setSupplier(supplierRes.data);
        setDeliveryNote(productRes.data);
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

  const totalNetHT = deliveryNote.reduce(
    (acc, prod) => acc + prod.prixU_HT * prod.quantite,
    0
  );
  const totalTVA = totalNetHT * (deliveryNote[0]?.TVA / 100);
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
          {/* Company Info (Left Side) */}
          <Box sx={{ textAlign: 'left' }}>
            <img
              src="https://pandp.tn/wp-content/uploads/2023/11/logo-pandp-shop-dark-bold1.png"
              alt="Logo de Ma Société"
              style={{ width: 120, marginBottom: 8 }}
            />
            <Typography variant="h6"><strong>Amounette Company</strong></Typography>
            <Typography variant="body2">Adresse: Adresse de Ma Société</Typography>
            <Typography variant="body2">Téléphone: +987654321</Typography>
            <Typography variant="body2">Email: khaledncf0@gmail.Com</Typography>
            <Typography variant="body2">Code TVA: 1564/645</Typography>
          </Box>

          {/* Supplier Info (Right Side) */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6"><strong>{supplier?.fullname}</strong></Typography>
            <Typography variant="body2">{supplier?.address}, {supplier?.ville}, {supplier?.pays}</Typography>
            <Typography variant="body2">Téléphone: {supplier?.tel}</Typography>
            <Typography variant="body2">Code TVA: {supplier?.codeTVA}</Typography>
          </Box>
        </Box>

        {/* Products Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Produit</strong></TableCell>
              <TableCell><strong>Quantité</strong></TableCell>
              <TableCell><strong>Prix U HT</strong></TableCell>
              <TableCell><strong>TVA (%)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.designation}</TableCell>
                <TableCell>{product.quantite}</TableCell>
                <TableCell>{product.prixU_HT.toFixed(2)} TND</TableCell>
                <TableCell>{product.TVA}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography><strong>Total HT:</strong> {totalNetHT.toFixed(2)} TND</Typography>
          <Typography><strong>TVA:</strong> {totalTVA.toFixed(2)} TND</Typography>
          <Typography><strong>Total TTC:</strong> {totalNetTTC.toFixed(2)} TND</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
