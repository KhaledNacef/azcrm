import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Button, Table, TableHead, TableRow, TableCell, 
  TableBody, CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogActions, List, ListItem, ListItemButton, ListItemText 
} from '@mui/material';
import './cssba.css';
import logo from '../../assets/amounnet.png';

// Translation dictionaries
const translations = {
  en: {
    companyName: "Company Name",
    companyAddress: "Company Address",
    companyPhone: "Company Phone",
    companyVAT: "Company VAT Code",
    supplierName: "Supplier Name",
    supplierAddress: "Supplier Address",
    supplierPhone: "Supplier Phone",
    supplierVAT: "Supplier VAT Code",
    purchaseOrder: "Purchase Order",
    designation: "Designation",
    unit: "Unit",
    quantity: "Quantity",
    unitPrice: "Unit Price (HT)",
    vat: "VAT (%)",
    discount: "Discount (%)",
    netHT: "Net Price (HT)",
    netTTC: "Net Price (TTC)",
    totalNetHT: "Total Net (HT)",
    totalVAT: "Total VAT",
    stamp: "Stamp",
    totalNetTTC: "Total Net (TTC)",
    supplierSignature: "Supplier Signature",
    companySignature: "Company Signature",
    back: "Back",
    print: "Print",
    selectLanguage: "Select Language",
    date: "Date"
  },
  fr: {
    companyName: "Nom de la société",
    companyAddress: "Adresse de la société",
    companyPhone: "Téléphone de la société",
    companyVAT: "Code TVA de la société",
    supplierName: "Nom du fournisseur",
    supplierAddress: "Adresse du fournisseur",
    supplierPhone: "Téléphone du fournisseur",
    supplierVAT: "Code TVA du fournisseur",
    purchaseOrder: "Bon D'Achat",
    designation: "Désignation",
    unit: "Unité",
    quantity: "Quantité",
    unitPrice: "Prix U (HT)",
    vat: "TVA (%)",
    discount: "Remise (%)",
    netHT: "Prix Net (HT)",
    netTTC: "Prix Net (TTC)",
    totalNetHT: "Total Net (HT)",
    totalVAT: "Total TVA",
    stamp: "Timbre",
    totalNetTTC: "Total Net (TTC)",
    supplierSignature: "Signature du Fournisseur",
    companySignature: "Signature de Ma Société",
    back: "Retour",
    print: "Imprimer",
    selectLanguage: "Sélectionnez la langue",
    date: "Date"
  },
  ar: {
    companyName: "اسم الشركة",
    companyAddress: "عنوان الشركة",
    companyPhone: "هاتف الشركة",
    companyVAT: "رمز ضريبة القيمة المضافة للشركة",
    supplierName: "اسم المورد",
    supplierAddress: "عنوان المورد",
    supplierPhone: "هاتف المورد",
    supplierVAT: "رمز ضريبة القيمة المضافة للمورد",
    purchaseOrder: "أمر الشراء",
    designation: "التسمية",
    unit: "الوحدة",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة (بدون ضريبة)",
    vat: "ضريبة القيمة المضافة (%)",
    discount: "الخصم (%)",
    netHT: "السعر الصافي (بدون ضريبة)",
    netTTC: "السعر الصافي (بضريبة)",
    totalNetHT: "المجموع الصافي (بدون ضريبة)",
    totalVAT: "إجمالي ضريبة القيمة المضافة",
    stamp: "الطابع",
    totalNetTTC: "المجموع الصافي (بضريبة)",
    supplierSignature: "توقيع المورد",
    companySignature: "توقيع الشركة",
    back: "رجوع",
    print: "طباعة",
    selectLanguage: "اختر اللغة",
    date: "التاريخ"
  }
};

const SingleDeliveryNote = () => {
  const { code, supplierId, codey, timbre } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // Default to French
  const previousLocation = window.location.pathname;

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

  const totalNetHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    return acc + basePrice * prod.quantite;
  }, 0);

  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100 || 0);
  let totalNetTTC = totalNetHT + totalTVA;

  if (timbre === 'true') {
    totalNetTTC += 1;
  }

  function displayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handlePrint = () => {
    setLanguageDialogOpen(true);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setLanguageDialogOpen(false);
    executePrint(language);
  };

  const executePrint = (language) => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;

    // Create a temporary div to hold our translated content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContents;

    // Get all text nodes and translate them
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.nodeValue.trim();
      if (text) {
        // Find the translation for this text if it exists
        for (const [key, value] of Object.entries(translations[language])) {
          if (value === text) {
            node.nodeValue = node.nodeValue.replace(text, translations[language][key]);
            break;
          }
        }
      }
    }

    document.body.innerHTML = tempDiv.innerHTML;

    // Trigger the print dialog
    window.print();

    // After printing is done, restore the original content and navigate back
    window.onafterprint = () => {
      document.body.innerHTML = originalContents;
      navigate(previousLocation);
    };
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const t = translations[selectedLanguage];

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        {t.back}
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        {t.print}
      </Button>

      {/* Language Selection Dialog */}
      <Dialog open={languageDialogOpen} onClose={() => setLanguageDialogOpen(false)}>
        <DialogTitle>{t.selectLanguage}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleLanguageSelect('en')}>
                <ListItemText primary="English" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleLanguageSelect('fr')}>
                <ListItemText primary="Français" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleLanguageSelect('ar')}>
                <ListItemText primary="العربية" />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLanguageDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

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
              .arabic-text {
                direction: rtl;
                text-align: right;
                font-family: 'Arial', sans-serif;
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1"><strong>{t.companyName}:</strong> Amounette Compnay</Typography>
            <Typography variant="body1"><strong>{t.companyAddress}:</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{t.companyPhone}:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{t.companyVAT}:</strong> TVA123456789</Typography>
          </Box>

          <Typography>{displayDate()}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>{t.supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{t.supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{t.supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{t.supplierVAT}:</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center" className={selectedLanguage === 'ar' ? 'arabic-text' : ''}>
          {t.purchaseOrder} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t.designation}</TableCell>
              <TableCell>{t.unit}</TableCell>
              <TableCell>{t.quantity}</TableCell>
              <TableCell>{t.unitPrice}</TableCell>
              <TableCell>{t.vat}</TableCell>
              <TableCell>{t.discount}</TableCell>     
              <TableCell>{t.netHT}</TableCell>
              <TableCell>{t.netTTC}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod, index) => {
              const basePrice = prod.prixU_HT;
              const netHT = basePrice * prod.quantite;
              const netTTC = netHT * (1 + prod.tva / 100);

              return (
                <TableRow key={index}>
                  <TableCell>{prod.designation}</TableCell>
                  <TableCell>{prod.Unite}</TableCell>
                  <TableCell>{prod.quantite}</TableCell>
                  <TableCell>{prod.prixU_HT}TND</TableCell>
                  <TableCell>{prod.tva}%</TableCell>
                  <TableCell>{prod.rem}%</TableCell>
                  <TableCell>{netHT.toFixed(2)}TND</TableCell>
                  <TableCell>{netTTC.toFixed(2)}TND</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1">
              <strong>{t.totalNetHT}:</strong> {totalNetHT.toFixed(2)}TND
            </Typography>
            <Typography variant="body1">
              <strong>{t.totalVAT}:</strong> {totalTVA.toFixed(2)}TND
            </Typography>
            {timbre === 'true' && (
              <Typography variant="body1">
                <strong>{t.stamp}:</strong> 1TND
              </Typography>
            )}
            <Typography variant="body1">
              <strong>{t.totalNetTTC}:</strong> {totalNetTTC.toFixed(2)}TND
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{t.supplierSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{t.companySignature}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;