import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './fvdesign.css';
import CreateDeliveryNoteModal from '../vente/cratebl.jsx';
import logo from '../../assets/amounnet.png';
import * as XLSX from 'xlsx';

// Translation dictionaries
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
    date: "Date"
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
    date: "Date"
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
    date: "التاريخ"
  }
};

const Bvsinlge = () => {
  const { code, clientId, codey, devise } = useParams();
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
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/clients/getclietn/${clientId}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchDeliveryNoteData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/bonlivraison/facturev/${code}`);
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
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    window.onafterprint = () => {
      document.body.innerHTML = originalContents;
      window.location.reload();
    };
  };

  function displayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
  };

  const handleExportToExcel = () => {
    const companyInfo = [
      ['Nom de la société', 'Ma Société'],
      ['Adresse de la société', 'Adresse de Ma Société'],
      ['Téléphone de la société', '+987654321'],
      ['Code TVA de la société', 'TVA123456789'],
    ];
  
    const clientInfo = [
      ['Nom du Client', client?.fullname || 'Fournisseur Inconnu'],
      ['Adresse du Client', client?.address || 'Adresse inconnue'],
      ['Téléphone du Client', client?.tel || 'Numéro inconnu'],
      ['Fax', client?.fax || 'Code TVA inconnu'],
    ];
  
    const deliveryNoteDetails = [['Bon de Livraison', deliveryNote[0].code]];
  
    const tableHeaders = ['Produit', 'Quantité', 'Unité', 'Prix U HT ($)', 'Prix Net ($)'];
    const productRows = deliveryNote.map((product) => [
      product.designation,
      product.quantite,
      product.unite,
      product.prixU_HT.toFixed(2),
      (product.prixU_HT * product.quantite).toFixed(2),
    ]);
  
    const totalNet = [['Total Net ($)', `${totalNettc.toFixed(2)}`]];
  
    const worksheetData = [
      [],
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
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const borderStyle = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
  
    Object.keys(worksheet).forEach((cellKey) => {
      if (!cellKey.startsWith('!')) {
        worksheet[cellKey].s = { border: borderStyle };
      }
    });
  
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 5 },
      { wch: 5 },
      { wch: 20 },
      { wch: 30 },
    ];
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bon de Livraison');
    XLSX.writeFile(workbook, `Bon_de_Livraison_${deliveryNote[0].code}.xlsx`);
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

      {/* Printable content */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        <style>
          {`
            @media print {
              body {
                font-size: 12px !important;
                direction: ${isArabic ? 'rtl' : 'ltr'};
              }
              .MuiButton-root {
                display: none !important;
              }
              .MuiTypography-root {
                font-size: 12px !important;
              }
              .MuiTableCell-root {
                font-size: 12px !important;
                text-align: ${isArabic ? 'right' : 'left'};
              }
              .company-info {
                margin-right: ${isArabic ? '0' : 'auto'};
                margin-left: ${isArabic ? 'auto' : '0'};
                text-align: ${isArabic ? 'right' : 'left'};
              }
              .client-info {
                margin-left: ${isArabic ? '0' : 'auto'};
                margin-right: ${isArabic ? 'auto' : '0'};
                text-align: ${isArabic ? 'left' : 'right'};
              }
              .signature-left {
                text-align: ${isArabic ? 'right' : 'left'};
              }
              .signature-right {
                text-align: ${isArabic ? 'left' : 'right'};
              }
            }
          `}
        </style>
        <Box sx={{ 
          width: 742,
          height: 152,
          mx: 'auto',
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
        
        {/* Company and Client Information */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: isArabic ? 'row-reverse' : 'row'
        }}>
          {/* Company Information */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            textAlign: isArabic ? 'right' : 'left',
            mr: isArabic ? 0 : 'auto',
            ml: isArabic ? 'auto' : 0
          }}>
            <Typography variant="body1"><strong>{translations[printLanguage].companyName}:</strong> Amounette Company</Typography>
            <Typography variant="body1"><strong>{translations[printLanguage].companyAddress}:</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{translations[printLanguage].companyPhone}:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{translations[printLanguage].companyVAT}:</strong> TVA123456789</Typography>
          </Box>
          
          {/* Date */}
          <Typography sx={{ alignSelf: 'flex-start' }}>
            <strong>{translations[printLanguage].date}:</strong> {displayDate()}
          </Typography>
          
          {/* Client Information */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            textAlign: isArabic ? 'left' : 'right',
            ml: isArabic ? 0 : 'auto',
            mr: isArabic ? 'auto' : 0
          }}>
            <Typography variant="body1"><strong>{translations[printLanguage].clientName}:</strong> {client.fullname}</Typography>
            <Typography variant="body1"><strong>{translations[printLanguage].clientAddress}:</strong> {client?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{translations[printLanguage].clientPhone}:</strong> {client?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{translations[printLanguage].clientFax}:</strong> {client?.fax || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {translations[printLanguage].deliveryNote}- {codey}-{devise}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].designation}</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].quantity}</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].unit}</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].unitPrice} ({devise})</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].netPrice}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.designation}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.quantite}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.Unite}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.prixU_HT} ({devise})</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{(prod.prixU_HT * prod.quantite).toFixed(2)} ({devise})</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1">
              <strong>{translations[printLanguage].totalNet}:</strong> {totalNettc.toFixed(2)}$
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