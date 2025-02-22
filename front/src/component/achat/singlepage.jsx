import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import './cssba.css';

const SingleDeliveryNote = () => {
  const { code, supplierId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/suplier/getidsuppliers/${supplierId}`);
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

  const totalNetHT = deliveryNote.reduce((acc, prod) => acc + prod.prixU_HT * prod.quantite, 0);
  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100);
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

      {/* Printable Content */}
      <Box ref={printRef} className="print-container">
        <div className="header">
          <img
            src="https://pandp.tn/wp-content/uploads/2023/11/logo-pandp-shop-dark-bold1.png"
            alt="Logo de Ma Société"
            className="logo"
          />
        </div>

        <div className="info-section">
          <div className="supplier-info">
            <Typography variant="h6"><strong>{supplier?.fullname}</strong></Typography>
            <Typography variant="body2">{supplier?.address}, {supplier?.ville}, {supplier?.pays}</Typography>
            <Typography variant="body2">Téléphone: {supplier?.tel}</Typography>
            <Typography variant="body2">Code TVA: {supplier?.codeTVA}</Typography>
          </div>

          <div className="company-info">
            <Typography variant="h6"><strong>Amounette Company</strong></Typography>
            <Typography variant="body2">Adresse: Adresse de Ma Société</Typography>
            <Typography variant="body2">Téléphone: +987654321</Typography>
            <Typography variant="body2">Email: khaledncf0@gmail.com</Typography>
            <Typography variant="body2">Code TVA: 1564/645</Typography>
          </div>
        </div>

        <Typography variant="h5" className="title">
          Détails du Bon de Livraison {code}
        </Typography>

        <Table className="product-table">
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
            {deliveryNote.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.designation}</TableCell>
                <TableCell>{product.Unite}</TableCell>
                <TableCell>{product.tva}%</TableCell>
                <TableCell>{product.prixU_HT} TND</TableCell>
                <TableCell>{product.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="totals">
          <Typography><strong>Total HT:</strong> {totalNetHT.toFixed(2)} TND</Typography>
          <Typography><strong>TVA:</strong> {totalTVA.toFixed(2)} TND</Typography>
          <Typography><strong>Total TTC:</strong> {totalNetTTC.toFixed(2)} TND</Typography>
        </div>

        <div className="signatures">
          <div className="signature-box">
            <Typography variant="body1">Signature du Fournisseur</Typography>
            <img src="path/to/supplier/signature.png" alt="Signature du fournisseur" className="signature" />
          </div>
          <div className="signature-box">
            <Typography variant="body1">Signature de Ma Société</Typography>
            <img src="path/to/company/signature.png" alt="Signature de la société" className="signature" />
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
