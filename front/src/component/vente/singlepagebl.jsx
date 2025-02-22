import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './cssbl.css';

const SingleDeliverysortie = () => {
  const { code, clientId } = useParams();
  const printRef = useRef();
  const navigate = useNavigate();

  const [client, setClient] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/clients/getclietn/${clientId}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchDeliveryNoteData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/bs/bs/stock/${code}`);
        const data = await response.json();
        setDeliveryNote(data);
      } catch (error) {
        console.error('Error fetching delivery note data:', error);
      }
    };

    fetchClientData();
    fetchDeliveryNoteData();
  }, [code, clientId]);

  const totalNettc = deliveryNote.reduce((acc, prod) => acc + (prod.prixU_HT || 0) * (prod.quantite || 0), 0) || 0;

  return (
    <Box padding={3} ref={printRef} id="print-content" className="a4-page">
      {/* Header with Logo */}
      <Box textAlign="center" mb={3}>
        <img src="/path/to/your/logo.png" alt="Company Logo" style={{ height: 80 }} />
      </Box>

      <Grid container spacing={3}>
        {/* Company Info - Left Side */}
        <Grid item xs={6}>
          <Typography variant="h6">Informations de la Société</Typography>
          <Typography>Nom: Ma Société</Typography>
          <Typography>Adresse: Adresse de Ma Société</Typography>
          <Typography>Téléphone: +987654321</Typography>
          <Typography>Code TVA: TVA123456789</Typography>
        </Grid>

        {/* Client Info - Right Side */}
        <Grid item xs={6}>
          <Typography variant="h6">Informations du Client</Typography>
          <Typography>Nom: {client.fullname}</Typography>
          <Typography>Adresse: {client.adress}</Typography>
          <Typography>Téléphone: {client.tel}</Typography>
          <Typography>Code TVA: {client.codeTVA}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h5" marginTop={3} textAlign="center">
        Détails du Bon de Livraison {code}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produit</TableCell>
            <TableCell>Unité</TableCell>
            <TableCell>Prix U</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Prix Net</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveryNote.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.designation}</TableCell>
              <TableCell>{product.Unite}</TableCell>
              <TableCell>{product.prixU_HT} TND</TableCell>
              <TableCell>{product.quantite}</TableCell>
              <TableCell>{(product.quantite * product.prixU_HT).toFixed(2)} TND</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6" marginTop={2} textAlign="right">
        Total Net: {totalNettc.toFixed(2)} TND
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">Signature du Fournisseur</Typography>
          <img
            src="/path/to/supplier/signature.png"
            alt="Signature du fournisseur"
            style={{ width: 150, marginTop: 10 }}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">Signature de Ma Société</Typography>
          <img
            src="/path/to/company/signature.png"
            alt="Signature de la société"
            style={{ width: 150, marginTop: 10 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliverysortie;
