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

// Enhanced translation dictionaries
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
    date: "Date",
    currency: "TND"
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
    date: "Date",
    currency: "TND"
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
    date: "التاريخ",
    currency: "دينار"
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
  const [printLanguage, setPrintLanguage] = useState(null);
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
    setPrintLanguage(language);
    setLanguageDialogOpen(false);
    
    // Use setTimeout to ensure state is updated before printing
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${translations[language].purchaseOrder}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .logo {
                width: 742px;
                height: 152px;
                margin: 0 auto 20px;
                display: block;
              }
              .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
              }
              .info-column {
                flex: 1;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .total-section {
                text-align: right;
                margin-top: 20px;
              }
              .signature-section {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
              }
              ${language === 'ar' ? `
                body {
                  direction: rtl;
                  font-family: 'Arial Arabic', Arial, sans-serif;
                }
                .info-column {
                  text-align: right;
                }
                table {
                  direction: rtl;
                }
                th, td {
                  text-align: right;
                }
              ` : ''}
            </style>
          </head>
          <body ${language === 'ar' ? 'dir="rtl"' : ''}>
            <div class="header">
              <img src="${logo}" alt="Logo" class="logo" />
            </div>
            
            <div class="info-section">
              <div class="info-column">
                <p><strong>${translations[language].companyName}:</strong> Amounette Company</p>
                <p><strong>${translations[language].companyAddress}:</strong> cité wahat</p>
                <p><strong>${translations[language].companyPhone}:</strong> +987654321</p>
                <p><strong>${translations[language].companyVAT}:</strong> TVA123456789</p>
              </div>
              
              <div class="info-column" style="${language === 'ar' ? 'text-align: left;' : 'text-align: right;'}">
                <p>${displayDate()}</p>
                <p><strong>${translations[language].supplierName}:</strong> ${supplier.fullname || ''}</p>
                <p><strong>${translations[language].supplierAddress}:</strong> ${supplier?.address || ''}</p>
                <p><strong>${translations[language].supplierPhone}:</strong> ${supplier?.tel || ''}</p>
                <p><strong>${translations[language].supplierVAT}:</strong> ${supplier?.codeTVA || ''}</p>
              </div>
            </div>
            
            <h2 style="text-align: center">${translations[language].purchaseOrder} - ${codey}</h2>
            
            <table>
              <thead>
                <tr>
                  <th>${translations[language].designation}</th>
                  <th>${translations[language].unit}</th>
                  <th>${translations[language].quantity}</th>
                  <th>${translations[language].unitPrice}</th>
                  <th>${translations[language].vat}</th>
                  <th>${translations[language].discount}</th>
                  <th>${translations[language].netHT}</th>
                  <th>${translations[language].netTTC}</th>
                </tr>
              </thead>
              <tbody>
                ${deliveryNote.map(prod => `
                  <tr>
                    <td>${prod.designation}</td>
                    <td>${prod.Unite}</td>
                    <td>${prod.quantite}</td>
                    <td>${prod.prixU_HT} ${translations[language].currency}</td>
                    <td>${prod.tva}%</td>
                    <td>${prod.rem}%</td>
                    <td>${(prod.prixU_HT * prod.quantite).toFixed(2)} ${translations[language].currency}</td>
                    <td>${(prod.prixU_HT * prod.quantite * (1 + prod.tva / 100)).toFixed(2)} ${translations[language].currency}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <p><strong>${translations[language].totalNetHT}:</strong> ${totalNetHT.toFixed(2)} ${translations[language].currency}</p>
              <p><strong>${translations[language].totalVAT}:</strong> ${totalTVA.toFixed(2)} ${translations[language].currency}</p>
              ${timbre === 'true' ? `<p><strong>${translations[language].stamp}:</strong> 1 ${translations[language].currency}</p>` : ''}
              <p><strong>${translations[language].totalNetTTC}:</strong> ${totalNetTTC.toFixed(2)} ${translations[language].currency}</p>
            </div>
            
            <div class="signature-section">
              <div>
                <p>${translations[language].supplierSignature}</p>
              </div>
              <div>
                <p>${translations[language].companySignature}</p>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 200);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }, 100);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const t = translations.fr; // Default to French for the preview

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
          <Button onClick={() => setLanguageDialogOpen(false)}>{t.back}</Button>
        </DialogActions>
      </Dialog>

      {/* Preview content (always in French) */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
        }}
      >
        {/* ... (keep your existing preview content as is) ... */}
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;