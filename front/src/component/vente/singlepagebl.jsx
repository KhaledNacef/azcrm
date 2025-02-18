import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './cssbl.css';
import * as XLSX from 'xlsx';

const mockFournisseurs = [
  { id: 1, fullname: 'FournisseurFournisseur AFournisseur A A', pays: 'France', ville: 'Paris', tel: '0123456789', fax: '0123456789', codePostal: '75001', address: '10 Rue de Paris', codeTVA: 'FR123456789' },
  { id: 2, fullname: 'Fournisseur B', pays: 'Tunisie', ville: 'Tunis', tel: '9876543210', fax: '9876543210', codePostal: '1001', address: 'Avenue Habib Bourguiba', codeTVA: 'TN987654321' },
  { id: 3, fullname: 'Fournisseur C', pays: 'Allemagne', ville: 'Berlin', tel: '1230987654', fax: '1230987654', codePostal: '10115', address: 'Alexanderplatz', codeTVA: 'DE987654321' },
];

const SingleDeliverysortie = () => {
  const { code, supplierName } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const previousLocation = window.location.pathname;

  // Find the supplier based on the supplierName (id)
  const supplier = mockFournisseurs.find(fournisseur => fournisseur.id === parseInt(supplierName));

  // Mock delivery note data
  const deliveryNote = {
    code,
    supplierName: supplier?.fullname || 'Fournisseur Inconnu',
    supplierInfo: `${supplier?.address || 'Adresse inconnue'}, ${supplier?.ville || 'Ville inconnue'}, ${supplier?.pays || 'Pays inconnu'}, Téléphone: ${supplier?.tel || 'Numéro inconnu'}, codeTVA: ${supplier?.codeTVA || 'codeTVA inconnu'}`,
    companyName: 'Ma Société',
    companyInfo: 'Adresse de Ma Société, Téléphone: +987654321',
    products: [
      { name: 'ProduitProduit 1Produit 1Produit 1Produit 1 1', quantity: 10, prixU_HT: 100, unite: "M²" },
      { name: 'Produit Produit 1Produit 1Produit 1Produit 1Produit 1Produit 2', quantity: 5, unite: "cm", prixU_HT: 19 },
    ],
  };

  const totalNettc = deliveryNote.products.reduce(
    (acc, prod) => acc + prod.prixU_HT * prod.quantity,
    0
  );
  
  
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
    const companyInfo = [
      ['Nom de la société', 'Ma Société'],
      ['Adresse de la société', 'Adresse de Ma Société'],
      ['Téléphone de la société', '+987654321'],
      ['Code TVA de la société', 'TVA123456789'],
    ];
  
    const clientInfo = [
      ['Nom du Client', supplier?.fullname || 'Fournisseur Inconnu'],
      ['Adresse du Client', supplier?.address || 'Adresse inconnue'],
      ['Téléphone du Client', supplier?.tel || 'Numéro inconnu'],
      ['Code TVA', supplier?.codeTVA || 'Code TVA inconnu'],
    ];
  
    const deliveryNoteDetails = [['Bon de Livraison', deliveryNote.code]];
  
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
      ...companyInfo.map((row, i) => [
        row[0], row[1], '', '', clientInfo[i]?.[0] || '', clientInfo[i]?.[1] || '',
      ]),
      [],
      ...deliveryNoteDetails,
      [],
      tableHeaders,
      ...productRows,
      [],
      ...totalNet,
    ];
  
    // Create worksheet and add data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Define borders for all cells
    const borderStyle = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
  
    // Apply borders to every cell in the worksheet
    Object.keys(worksheet).forEach((cellKey) => {
      if (!cellKey.startsWith('!')) { // Skip metadata keys like '!cols'
        worksheet[cellKey].s = { border: borderStyle };
      }
    });
  
    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 20 }, // Company field labels
      { wch: 30 }, // Company field values
      { wch: 5 },  // Spacer
      { wch: 5 },  // Spacer
      { wch: 20 }, // Client field labels
      { wch: 30 }, // Client field values
    ];
  
    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bon de Livraison');
  
    // Export the workbook as a file
    XLSX.writeFile(workbook, `Bon_de_Livraison_${deliveryNote.code}.xlsx`);
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        Imprimer
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleExportToExcel}
        sx={{ mb: 2, ml: 2 }}
      >
        Télécharger en Excel
      </Button>

      {/* Printable content */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
        }}
      >
        {/* Add style for print */}
        <style>
          {`
            @media print {
              body {
                font-size: 12px !important;
              }
              .MuiTypography-root {
                font-size: 12px !important;
              }
              .MuiButton-root {
                display: none !important;
              }
              .MuiTableCell-root {
                font-size: 12px !important;
              }
            }
          `}
        </style>
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
            <Typography variant="h6">{deliveryNote.supplierName}</Typography>
          </Box>
        </Box>

        {/* Company and Supplier Information with Labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Company Information (Left Column) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
  <Typography variant="body1"><strong>Nom de la société:</strong> Amounette Compnay</Typography>
  <Typography variant="body1"><strong>Adresse de la société:</strong> cité wahat</Typography>
  <Typography variant="body1"><strong>Téléphone de la société:</strong> +987654321</Typography>
  <Typography variant="body1"><strong>Code TVA de la société:</strong> TVA123456789</Typography>
</Box>

          {/* Supplier Information (Right Column) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>Nom du Client:</strong> {deliveryNote.supplierName}</Typography>
            <Typography variant="body1"><strong>Adresse du Client:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>Téléphone du Client:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>Code TVA:</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          Bon de Sortie - {deliveryNote.code}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Designaiton</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Unite</TableCell>
              <TableCell>Prix U </TableCell>
              <TableCell>Prix Net </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.products.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.quantity}</TableCell>
                <TableCell>{prod.unite}</TableCell>
                <TableCell>{prod.prixU_HT}$</TableCell>
                <TableCell>{(prod.prixU_HT * prod.quantity).toFixed(2)}$</TableCell>
              
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Section - Moved to the Right Side */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
         
          
            <Typography variant="body1">
              <strong>Total Net :</strong> {totalNettc.toFixed(2)}$
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">Signature du Client</Typography>
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
      </Box>
    </Box>
  );
};

export default SingleDeliverysortie;
