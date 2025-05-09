import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import './fvdesign.css';
import CreateDeliveryNoteModal from '../vente/cratebl.jsx';
import logo from '../../assets/amounnet.png';

const translations = {
  en: {
    companyName: "Company Name",
    companyAddress: "Company Address",
    companyPhone: "Company Phone",
    companyVAT: "Company VAT",
    clientName: "Client Name",
    clientAddress: "Client Address",
    clientPhone: "Client Phone",
    clientFax: "Fax",
    deliveryNote: "Delivery Note",
    designation: "Designation",
    quantity: "Quantity",
    unit: "Unit",
    unitPrice: "Unit Price",
    netPrice: "Net Price",
    totalNet: "Total Net",
    clientSignature: "Client Signature",
    companySignature: "Company Signature",
    date: "Date",
    matriculefisacl: "tax identification number",
    remise: "Discount",
  },
  fr: {
    companyName: "Nom de la société",
    companyAddress: "Adresse de la société",
    companyPhone: "Téléphone de la société",
    companyVAT: "Code TVA de la société",
    clientName: "Nom du Client",
    clientAddress: "Adresse du Client",
    clientPhone: "Téléphone du Client",
    clientFax: "Fax",
    deliveryNote: "Bon De Livraison",
    designation: "Designation",
    quantity: "Quantité",
    unit: "Unité",
    unitPrice: "Prix U",
    netPrice: "Prix Net",
    totalNet: "Total Net",
    clientSignature: "Signature du Client",
    companySignature: "Signature de la Société",
    date: "Date",
    matriculefisacl: 'Matriculefisacl',
    remise: "Remise"
  },
  ar: {
    companyName: "اسم الشركة",
    companyAddress: "عنوان الشركة",
    companyPhone: "هاتف الشركة",
    companyVAT: "الرقم الضريبي",
    clientName: "اسم العميل",
    clientAddress: "عنوان العميل",
    clientPhone: "هاتف العميل",
    clientFax: "فاكس",
    deliveryNote: "إذن تسليم",
    designation: "الوصف",
    quantity: "الكمية",
    unit: "الوحدة",
    unitPrice: "سعر الوحدة",
    netPrice: "السعر الصافي",
    totalNet: "المجموع الصافي",
    clientSignature: "توقيع العميل",
    companySignature: "توقيع الشركة",
    date: "التاريخ",
    matriculefisacl: "الرقم الجبائي",
    remise: "خصم",
  }
};

const Bvsinlge = () => {
  const { code, clientId, codey, devise, id, datee } = useParams();
  const printRef = useRef();
  const navigate = useNavigate();
  const [printLanguage, setPrintLanguage] = useState('fr');
  const [anchorEl, setAnchorEl] = useState(null);
  const [client, setClient] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/v1/clients/getclietn/${clientId}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchDeliveryNoteData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/v1/bonlivraison/facturev/${code}`);
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
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContents = printRef.current.innerHTML;
    
    // Get all style tags from the current document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          ${styles}
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .print-content {
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-content">${printContents}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
  };

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const selectLanguage = (lang) => {
    setPrintLanguage(lang);
    handleLanguageMenuClose();
  };

  const isArabic = printLanguage === 'ar';
  const formattedDate = new Date(datee).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, mr: 2 }}>
        Imprimer
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleLanguageMenuOpen}
        sx={{ mb: 2, mr: 2 }}
      >
        {printLanguage.toUpperCase()}
      </Button>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        Créer un Bon Sortie
      </Button>
      <Button variant="outlined" onClick={() => navigate(`/gestionv/${codey}`)} sx={{ mb: 2 }}>
        Gestion De Stock
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => selectLanguage('fr')}>FR</MenuItem>
        <MenuItem onClick={() => selectLanguage('en')}>EN</MenuItem>
        <MenuItem onClick={() => selectLanguage('ar')}>AR</MenuItem>
      </Menu>

      {/* This is the content that will be printed */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
          direction: isArabic ? 'rtl' : 'ltr',
          '@media print': {
            border: 'none',
            p: 0,
            mt: 0
          }
        }}
      >
        <Box sx={{ 
          width: '100%',
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          '@media print': {
            mb: 2
          }
        }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ 
              maxWidth: '200px',
              height: 'auto',
              '@media print': {
                maxWidth: '150px'
              }
            }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sx={{ textAlign: isArabic ? 'right' : 'left' }}>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyName}:</strong> AMOUNNET COMPANY EXPORT ET IMPORT
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyAddress}:</strong> RUE DU LAC TOBA BERGES DU LAC1053 TUNIS
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyPhone}:</strong> +987654321
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyVAT}:</strong> 1867411P/A/M/000
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: isArabic ? 'left' : 'right' }}>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientName}:</strong> {client?.fullname}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientAddress}:</strong> {client?.address}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientPhone}:</strong> {client?.tel}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientFax}:</strong> {client?.fax}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].matriculefisacl}:</strong> {client?.matriculefisacl}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h4" mb={3} textAlign="center" sx={{ '@media print': { fontSize: '18px' } }}>
          {translations[printLanguage].deliveryNote}- {id}/{formattedDate}
        </Typography>

        <Table sx={{ '@media print': { border: '1px solid #ddd' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                {translations[printLanguage].designation}
              </TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                {translations[printLanguage].quantity}
              </TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                {translations[printLanguage].unit}
              </TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                {translations[printLanguage].unitPrice} ({devise})
              </TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                {translations[printLanguage].remise}%
              </TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                {translations[printLanguage].netPrice}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                  {prod.designation}
                </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                  {prod.quantite}
                </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                  {prod.Unite}
                </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                  {prod.prixU_HT} ({devise})
                </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                  {prod.rem}%
                </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', '@media print': { padding: '8px' } }}>
                  {(prod.prixU_HT * prod.quantite).toFixed(2)} ({devise})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1">
              <strong>{translations[printLanguage].totalNet}:</strong> {totalNettc.toFixed(2)} {devise}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          flexDirection: isArabic ? 'row-reverse' : 'row'
        }}>
          <Box sx={{ textAlign: isArabic ? 'right' : 'left' }}>
            <Typography variant="body1">{translations[printLanguage].clientSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: isArabic ? 'left' : 'right' }}>
            <Typography variant="body1">{translations[printLanguage].companySignature}</Typography>
          </Box>
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 500,
          }}
        >
          <CreateDeliveryNoteModal onAddDeliveryNote={addDeliveryNote} codey={codey} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Bvsinlge;