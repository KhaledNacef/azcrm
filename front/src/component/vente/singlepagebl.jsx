import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './cssbl.css';
import logo from '../../assets/amounnet.png';

// Translation dictionaries
const translations = {
  en: {
    companyName: "Company Name",
    companyAddress: "Company Address",
    matriculefisacl:"tax identification number",
    companyPhone: "Company Phone",
    companyVAT: "Company VAT",
    clientName: "Client Name",
    clientAddress: "Client Address",
    clientPhone: "Client Phone",
    clientFax: "Fax",
    deliveryNote: "Facture",
    designation: "Designation",
    quantity: "Quantity",
    unit: "Unit",
    unitPrice: "Unit Price",
    netPrice: "Net Price",
    totalNet: "Total Net",
    clientSignature: "Client Signature",
    companySignature: "Company Signature",
    date: "Date",
    print: "Print",
    back: "Back",
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
    deliveryNote: "Facture",
    designation: "Designation",
    quantity: "Quantité",
    unit: "Unité",
    unitPrice: "Prix U",
    netPrice: "Prix Net",
    totalNet: "Total Net",
    clientSignature: "Signature du Client",
    companySignature: "Signature de la Société",
    date: "Date",
    print: "Imprimer",
    back: "Retour",
    matriculefisacl:'Matriculefisacl',
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
    deliveryNote: "إذن صرف",
    designation: "الوصف",
    quantity: "الكمية",
    unit: "الوحدة",
    unitPrice: "سعر الوحدة",
    netPrice: "السعر الصافي",
    totalNet: "المجموع الصافي",
    clientSignature: "توقيع العميل",
    companySignature: "توقيع الشركة",
    date: "التاريخ",
    print: "طباعة",
    back: "رجوع",
    matriculefisacl:"الرقم الجبائي",
    remise: "خصم",

  }
};

const SingleDeliverysortie = () => {
  const { code, clientId, codey, devise,id,datee } = useParams();
  const printRef = useRef();
  const navigate = useNavigate();
  const [printLanguage, setPrintLanguage] = useState('fr');
  const [anchorEl, setAnchorEl] = useState(null);
  const [client, setClient] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);

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
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/v1/bs/bs/stock/${code}`);
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
        {translations[printLanguage].back}
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, mr: 2 }}>
        {translations[printLanguage].print}
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleLanguageMenuOpen}
        sx={{ mb: 2, mr: 2 }}
      >
        {printLanguage.toUpperCase()}
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
          mb: 2,
          flexDirection: isArabic ? 'row' : 'row'
        }}>
          <Box sx={{ 
            textAlign: 'left',
            order: isArabic ? 2 : 1,
            flex: 1
          }}>
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
          </Box>

          <Box sx={{ 
            textAlign: 'right',
            order: isArabic ? 1 : 2,
            flex: 1
          }}>
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
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {translations[printLanguage].deliveryNote} - {id}/{formattedDate}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].designation}</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].quantity}</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].unit}</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].unitPrice} ({devise})</TableCell>
              <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].remise}%</TableCell>
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
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.rem}%</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{(prod.prixU_HT * prod.quantite).toFixed(2)} {devise}</TableCell>
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
    </Box>
  );
};

export default SingleDeliverysortie;