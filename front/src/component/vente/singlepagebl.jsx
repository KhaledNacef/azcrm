import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from 'xlsx';
import './cssbl.css';
import Grid from '@mui/material/Grid2';

const SingleDeliverysortie = () => {
  const { code, clientId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const previousLocation = window.location.pathname;

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

  const handleExportExcel = () => {
    const header = [
      ["Bon de Livraison", "", "", "", ""], // Title row
      ["Société: Ma Société", "Adresse: Adresse de Ma Société", "Téléphone: +987654321", "Code TVA: TVA123456789"],
      [], // Empty row for spacing
      ["Informations du Client", "", "", ""], // Client Info Header
      ["Nom", "Adresse", "Téléphone", "Code TVA"],
      [client.fullname, client.adress, client.tel, client.codeTVA], // Client Data row
      [], // Empty row for spacing
      ["Détails du Bon de Livraison", "", "", ""], // Delivery details title
      ["Produit", "Unité", "Prix U", "Quantité", "Prix Net"], // Column headers
    ];

    // Create data for the table rows
    const rows = deliveryNote.map((product) => [
      product.designation,
      product.Unite,
      `${product.prixU_HT} TND`,
      product.quantite,
      product.quantite * product.prixU_HT,
    ]);

    // Combine the header and rows data
    const data = [...header, ...rows];

    // Create a workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bon de Livraison");

    // Set the column widths
    const wscols = [
      { wpx: 250 }, // Produit column width
      { wpx: 150 }, // Unité column width
      { wpx: 100 }, // Prix U column width
      { wpx: 100 }, // Quantité column width
      { wpx: 100 }, // Prix Net column width
    ];
    ws['!cols'] = wscols;

    // Export the workbook to a file
    XLSX.writeFile(wb, "Bon_de_Livraison.xlsx");
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Bon de Livraison
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ padding: "8px 16px", fontSize: "16px", marginRight: 2 }}
        >
          Retour
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{ padding: "8px 16px", fontSize: "16px", marginRight: 2 }}
        >
          Imprimer
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExportExcel}
          sx={{ padding: "8px 16px", fontSize: "16px" }}
        >
          Exporter en Excel
        </Button>
      </Box>

      <div ref={printRef} id="print-content">
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
                <TableCell>{product.quantite * product.prixU_HT}</TableCell>
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
              src="path/to/supplier/signature.png"
              alt="Signature du fournisseur"
              style={{ width: 150, marginTop: 10 }}
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">Signature de Ma Société</Typography>
            <img
              src="path/to/company/signature.png"
              alt="Signature de la société"
              style={{ width: 150, marginTop: 10 }}
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default SingleDeliverysortie;
