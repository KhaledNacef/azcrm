import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Select, MenuItem } from '@mui/material';
import './cssba.css';
import logo from '../../assets/amounnet.png';  // Relative path

const SingleDeliveryNote = () => {
  const { code, supplierId, codey, timbre,num } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('fr');  // Default language is French
  const previousLocation = window.location.pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/suplier/getidsuppliers/${supplierId}`);
        const productRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/bonachat/stock/getallstockdelv/${code}`);

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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalNetHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    const remise = prod.rem && prod.rem > 0 ? prod.rem : 0; // percentage
    const priceAfterRemise = basePrice * (1 - remise / 100);
    return acc + priceAfterRemise * quantity;
  }, 0);
  

  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100 || 0);
  let totalNetTTC = totalNetHT + totalTVA;

  // If timbre is true, add the timbre cost to the total
  if (timbre === 'true') {
    totalNetTTC += 1;  // Add 1 TND for timbre
  }

  function displayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

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

  // Translations for French, Arabic, and English
  const translations = {
    fr: {
      companyName: 'Nom de la société',
      companyAddress: 'Adresse de la société',
      companyPhone: 'Téléphone de la société',
      companyTVA: 'Code TVA de la société',
      supplierName: 'Nom du fournisseur',
      supplierAddress: 'Adresse du fournisseur',
      supplierPhone: 'Téléphone du fournisseur',
      supplierTVA: 'Code TVA',
      bonDeAchat: 'Facture ',
      designation: 'Désignation',
      unite: 'Unité',
      quantite: 'Quantité',
      prixUHT: 'Prix U(HT)',
      tva: 'TVA(%)',
      rem: 'Rem(%)',
      prixNetHT: 'Prix Net(HT)',
      prixNetTTC: 'Prix Net(TTC)',
      timbre: 'Timbre',
      signatureFournisseur: 'Signature du Fournisseur',
      signatureSociete: 'Signature de Ma Société',
      matriculefisacl:'Matriculefisacl',
      totaltva:'Total TVA'

    },
    ar: {
      companyName: 'اسم الشركة',
      companyAddress: 'عنوان الشركة',
      companyPhone: 'هاتف الشركة',
      companyTVA: 'كود الضريبة على القيمة المضافة للشركة',
      supplierName: 'اسم المورد',
      supplierAddress: 'عنوان المورد',
      supplierPhone: 'هاتف المورد',
      supplierTVA: 'كود الضريبة على القيمة المضافة',
      bonDeAchat: 'سند شراء',
      designation: 'التسمية',
      unite: 'الوحدة',
      quantite: 'الكمية',
      prixUHT: 'السعر(بدون ضريبة)',
      tva: 'ضريبة القيمة المضافة(%)',
      rem: 'الخصم(%)',
      prixNetHT: 'السعر الصافي(بدون ضريبة)',
      prixNetTTC: 'السعر الصافي(شاملة الضريبة)',
      timbre: 'الطابع',
      signatureFournisseur: 'توقيع المورد',
      signatureSociete: 'توقيع الشركة',
      matriculefisacl:"الرقم الجبائي",
      totaltva:'إجمالي ضريبة القيمة المضافة'


    },
    en: {
      companyName: 'Company Name',
      companyAddress: 'Company Address',
      companyPhone: 'Company Phone',
      companyTVA: 'Company TVA Code',
      supplierName: 'Supplier Name',
      supplierAddress: 'Supplier Address',
      supplierPhone: 'Supplier Phone',
      supplierTVA: 'TVA Code',
      bonDeAchat: 'Purchase Order',
      designation: 'Designation',
      unite: 'Unit',
      quantite: 'Quantity',
      prixUHT: 'Price U(HT)',
      tva: 'VAT(%)',
      rem: 'Discount(%)',
      prixNetHT: 'Net Price(HT)',
      prixNetTTC: 'Net Price(TTC)',
      timbre: 'Stamp',
      signatureFournisseur: 'Supplier Signature',
      signatureSociete: 'Company Signature',
      matriculefisacl:"tax identification number",
      totaltva:'Total VAT'
    },
  };

  

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        Imprimer
      </Button>

      {/* Language selection */}
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="ar">عربي</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>

      {/* Printable content */}
      <Box
  ref={printRef}
  sx={{
    border: '1px solid #ccc',
    p: 3,
    mt: 2,
    backgroundColor: '#fff',
    direction: language === 'ar' ? 'rtl' : 'ltr',  // Apply RTL for Arabic
  }}
>
   <style>
  {`
    @media print {
      body {
        font-size: 12px !important;
        direction: ${language === 'ar' ? 'rtl' : 'ltr'} !important; /* Apply RTL for Arabic */
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
      

        {/* Company and Supplier Information with Labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
       

          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginLeft: language === 'ar' ? '0' : '1rem',  // Supplier info margin for Arabic
            marginRight: language === 'ar' ? '1rem' : '0', // Supplier info margin for other languages
            textAlign: language === 'ar' ? 'left' : 'right' // Align text correctly for Arabic
          }}>
            <Typography variant="body1"><strong>{translations[language].supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{translations[language].matriculefisacl}:</strong> {supplier?.matriculefisacl || 'Matriculefisacl inconnu'}</Typography>
          </Box>

          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginLeft: language === 'ar' ? '0' : '1rem',  // Company info goes to the left for Arabic, right for others
            marginRight: language === 'ar' ? '1rem' : '0', // Company info margin for Arabic
            textAlign: language === 'ar' ? 'right' : 'left' // Align text correctly for Arabic
          }}>
            <Typography variant="body1"><strong>{translations[language].companyName}:</strong> AMOUNNET COMPANY EXPORT ET IMPORT</Typography>
            <Typography variant="body1"><strong>{translations[language].companyAddress}:</strong> RUE DU LAC TOBA BERGES DU LAC1053 TUNIS</Typography>
            <Typography variant="body1"><strong>{translations[language].companyPhone}:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{translations[language].matriculefisacl}:</strong> 1867411P/A/M/000</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {translations[language].bonDeAchat} - {num}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translations[language].designation}</TableCell>
              <TableCell>{translations[language].unite}</TableCell>
              <TableCell>{translations[language].quantite}</TableCell>
              <TableCell>{translations[language].prixUHT}</TableCell>
              <TableCell>{translations[language].tva}</TableCell>
              <TableCell>{translations[language].rem}</TableCell>
              <TableCell>{translations[language].prixNetHT}</TableCell>
              <TableCell>{translations[language].prixNetTTC}</TableCell>
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
                  <TableCell>{prod.prixU_HT}</TableCell>
                  <TableCell>{prod.tva}%</TableCell>
                  <TableCell>{prod.rem}%</TableCell>
                  <TableCell>{netHT.toFixed(2)}</TableCell>
                  <TableCell>{netTTC.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Total Section - Moved to the Right Side */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1">
              <strong>{translations[language].prixNetHT}:</strong> {totalNetHT.toFixed(2)}TND
            </Typography>
            <Typography variant="body1">
              <strong>{translations[language].totaltva}:</strong> {totalTVA.toFixed(2)}TND
            </Typography>
            {timbre === 'true' && (
              <Typography variant="body1">
                <strong>{translations[language].timbre}:</strong> 1TND
              </Typography>
            )}
            <Typography variant="body1">
              <strong>{translations[language].prixNetTTC}:</strong> {totalNetTTC.toFixed(2)}TND
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">{translations[language].signatureFournisseur}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">{translations[language].signatureSociete}</Typography>
          </Box>
        </Box>
        {displayDate()}
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
