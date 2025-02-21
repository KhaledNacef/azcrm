import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './cssbl.css';
import * as XLSX from 'xlsx';
import Grid from '@mui/material/Grid2';

const SingleDeliverysortie = () => {
  const { code, clientName } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const previousLocation = window.location.pathname;

  const [client, setClient] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/clients/getcli/${clientName}`);
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
  }, [code, clientName]);

  const totalNettc = deliveryNote?.reduce(
    (acc, prod) => acc + (prod.prixU_HT || 0) * (prod.quantite || 0),
    0
  ) || 0;

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.onafterprint = () => {
      document.body.innerHTML = originalContents;
      navigate(previousLocation);
    };
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Bon de Livraison
      </Typography>

      {deliveryNote && client ? (
        <div ref={printRef}>
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
              <Typography>Adresse: {client.adresse}</Typography>
              <Typography>Téléphone: {client.tel}</Typography>
              <Typography>Code TVA: {client.codeTVA}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h5" marginTop={3}>
            Détails du Bon de Livraison (Code: {deliveryNote.code})
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Unité</TableCell>
                <TableCell>Prix U </TableCell>
                <TableCell>Prix Net</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryNote.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.designation}</TableCell>
                  <TableCell>{product.quantite}</TableCell>
                  <TableCell>{product.Unite}</TableCell>
                  <TableCell>{product.prixU_HT.toFixed(2)}$</TableCell>
                  <TableCell>{(product.prixU_HT * product.quantite).toFixed(2)}$</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="h6" marginTop={2}>
            Total Net: {totalNettc.toFixed(2)} $
          </Typography>

          <Button variant="contained" color="primary" onClick={handlePrint} sx={{ marginTop: 2 }}>
            Imprimer
          </Button>
        </div>
      ) : (
        <Typography variant="body1">Chargement des données...</Typography>
      )}
    </Box>
  );
};

export default SingleDeliverysortie;
