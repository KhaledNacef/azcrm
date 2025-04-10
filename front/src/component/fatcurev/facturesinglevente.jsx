import React, { useState, useEffect, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Modal, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './fvdesign.css';
import CreateDeliveryNoteModal from '../vente/cratebl.jsx';
import logo from '../../assets/amounnet.png';

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          {/* Client Info */}
          <Box sx={{ textAlign: isArabic ? 'left' : 'right', ml: isArabic ? 0 : 'auto' }}>
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
          </Box>

          {/* Company Info */}
          <Box sx={{ textAlign: isArabic ? 'right' : 'left' }}>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyName}:</strong> {client?.companyname}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyAddress}:</strong> {client?.address}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyPhone}:</strong> {client?.tel}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyVAT}:</strong> {client?.codeTVA}
            </Typography>
          </Box>
        </Box>

        {/* Delivery Note Section */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: isArabic ? 'right' : 'left' }}>
              {translations[printLanguage].deliveryNote}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="body2">{translations[printLanguage].designation}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">{translations[printLanguage].quantity}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">{translations[printLanguage].unit}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">{translations[printLanguage].unitPrice}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">{translations[printLanguage].netPrice}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">{translations[printLanguage].totalNet}</Typography>
              </Grid>
            </Grid>
            {deliveryNote?.map((prod, idx) => (
              <Grid container spacing={2} key={idx}>
                <Grid item xs={2}>
                  <Typography variant="body2">{prod?.designation}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{prod?.quantite}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{prod?.unite}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{prod?.prixU_HT}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{prod?.prixHT}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{prod?.prixTotal}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={6} className="signature-left">
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientSignature}</strong>
            </Typography>
            <Box sx={{ height: 100, borderTop: '1px solid #000' }} />
          </Grid>
          <Grid item xs={6} className="signature-right">
            <Typography variant="body2">
              <strong>{translations[printLanguage].companySignature}</strong>
            </Typography>
            <Box sx={{ height: 100, borderTop: '1px solid #000' }} />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2, textAlign: isArabic ? 'right' : 'left' }}>
          <strong>{translations[printLanguage].date}:</strong> {displayDate()}
        </Typography>
      </Box>

      {/* Modal for creating Delivery Note */}
      <Modal open={open} onClose={handleClose}>
        <CreateDeliveryNoteModal addDeliveryNote={addDeliveryNote} handleClose={handleClose} />
      </Modal>
    </Box>
  );
};

export default Bvsinlge;
