import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './cssbl.css';
import * as XLSX from 'xlsx';

const SingleDeliverysortie = () => {
  const { code, clientId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const previousLocation = window.location.pathname;

  const [client, setClient] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState(null);

  useEffect(() => {
    // Fetch client data
    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/clients/${clientName}`);
        const data = await response.json();
        setClient(data); // Set client data
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    // Fetch delivery note data
    const fetchDeliveryNoteData = async () => {
      try {
        const response = await fetch(`/api/delivery-notes/${code}`);
        const data = await response.json();
        setDeliveryNote(data); // Set delivery note data
      } catch (error) {
        console.error('Error fetching delivery note data:', error);
      }
    };

    fetchClientData();
    fetchDeliveryNoteData();
  }, [code, clientId]);

  const totalNettc = deliveryNote?.products.reduce(
    (acc, prod) => acc + prod.prixU_HT * prod.quantity,
    0
  ) || 0;

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;

    // Replace the body content with printable content
    document.body.innerHTML = printContents;

    // Trigger the print dialog
    window.print();

    // After printing is done, restore the original content and navigate back
    window.onafterprint = () => {
      document.body.innerHTML = originalContents; // Restore original page content
      navigate(previousLocation); // Navigate back to the previous page
    };
  };

  const handleExportToExcel = () => {
    if (!deliveryNote) return;

    const companyInfo = [
      ['Nom de la société', 'Ma Société'],
      ['Adresse de la société', 'Adresse de Ma Société'],
      ['Téléphone de la société', '+987654321'],
      ['Code TVA de la société', 'TVA123456789'],
    ];

    const clientInfo = [
      ['Nom du Client', client?.fullname || 'Client Inconnu'],
      ['Adresse du Client', client?.adresse || 'Adresse inconnue'],
      ['Téléphone du Client', client?.tel || 'Numéro inconnu'],
      ['Code TVA', client?.codeTVA || 'Code TVA inconnu'],
    ];

    const deliveryNoteDetails = [['Bon de Sortie', deliveryNote.code]];

    const tableHeaders = ['Produit', 'Quantité', 'Unité', 'Prix U HT ($)', 'Prix Net ($)'];
    const productRows = deliveryNote.products.map((product) => [
      product.name,
      product.quantity,
      product.unite,
      product.prixU_HT.toFixed(2),
      (product.prixU_HT * product.quantity).toFixed(2),
    ]);

    const totalNet = [['Total Net ($)', `${totalNettc.toFixed(2)}`]];

    // Build the worksheet data
    const worksheetData = [
      [], // Empty row
      ['Informations de la société', '', '', '', '', 'Informations du client'],
      ...companyInfo,
      [],
      ...clientInfo,
      [],
      ...deliveryNoteDetails,
      [],
      [tableHeaders[0], tableHeaders[1], tableHeaders[2], tableHeaders[3], tableHeaders[4]],
      ...productRows,
      [],
      ...totalNet,
    ];

    // Create a new worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bon de Livraison');

    // Export the data to Excel
    XLSX.writeFile(wb, 'bon_de_livraison.xlsx');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Détails du Bon de Livraison
      </Typography>

      {deliveryNote && client ? (
        <div ref={printRef}>
          <Typography variant="h5">Informations du Client</Typography>
          <Typography>Nom: {client.fullname}</Typography>
          <Typography>Adresse: {client.adresse}</Typography>
          <Typography>Téléphone: {client.tel}</Typography>
          <Typography>Code TVA: {client.codeTVA}</Typography>

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
              {deliveryNote.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unite}</TableCell>
                  <TableCell>{product.prixU_HT.toFixed(2)}</TableCell>
                  <TableCell>{(product.prixU_HT * product.quantity).toFixed(2)}</TableCell>
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

          <Button variant="contained" color="secondary" onClick={handleExportToExcel} sx={{ marginTop: 2, marginLeft: 2 }}>
            Exporter en Excel
          </Button>
        </div>
      ) : (
        <Typography variant="body1">Chargement des données...</Typography>
      )}
    </Box>
  );
};

export default SingleDeliverysortie;
