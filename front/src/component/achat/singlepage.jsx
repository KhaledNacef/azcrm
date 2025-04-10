import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './cssba.css';
import logo from '../../assets/amounnet.png';  // Relative path

const SingleDeliveryNote = () => {
  const { code, supplierId, codey, timbre } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('fr'); // Default language is French
  const previousLocation = window.location.pathname;

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
      purchaseOrder: 'Bon D\'Achat',
      designation: 'Designation',
      unit: 'Unite',
      quantity: 'Quantité',
      unitPriceHT: 'Prix U (HT)',
      vat: 'TVA (%)',
      discount: 'Rem (%)',
      netHT: 'Prix Net (HT)',
      netTTC: 'Prix Net (TTC)',
      totalNetHT: 'Total Net (HT)',
      totalVAT: 'Total TVA',
      timbre: 'Timbre',
      totalNetTTC: 'Total Net (TTC)',
      signatureSupplier: 'Signature du Fournisseur',
      signatureCompany: 'Signature de Ma Société',
      print: 'Imprimer',
      back: 'Retour',
    },
    en: {
      companyName: 'Company Name',
      companyAddress: 'Company Address',
      companyPhone: 'Company Phone',
      companyTVA: 'Company TVA Code',
      supplierName: 'Supplier Name',
      supplierAddress: 'Supplier Address',
      supplierPhone: 'Supplier Phone',
      supplierTVA: 'Supplier TVA Code',
      purchaseOrder: 'Purchase Order',
      designation: 'Designation',
      unit: 'Unit',
      quantity: 'Quantity',
      unitPriceHT: 'Unit Price (HT)',
      vat: 'VAT (%)',
      discount: 'Discount (%)',
      netHT: 'Net Price (HT)',
      netTTC: 'Net Price (TTC)',
      totalNetHT: 'Total Net (HT)',
      totalVAT: 'Total VAT',
      timbre: 'Stamp',
      totalNetTTC: 'Total Net (TTC)',
      signatureSupplier: 'Supplier Signature',
      signatureCompany: 'Company Signature',
      print: 'Print',
      back: 'Back',
    },
    ar: {
      companyName: 'اسم الشركة',
      companyAddress: 'عنوان الشركة',
      companyPhone: 'هاتف الشركة',
      companyTVA: 'رمز TVA للشركة',
      supplierName: 'اسم المورد',
      supplierAddress: 'عنوان المورد',
      supplierPhone: 'هاتف المورد',
      supplierTVA: 'رمز TVA للمورد',
      purchaseOrder: 'أمر شراء',
      designation: 'التعيين',
      unit: 'وحدة',
      quantity: 'الكمية',
      unitPriceHT: 'السعر الوحدة (HT)',
      vat: 'TVA (%)',
      discount: 'الخصم (%)',
      netHT: 'السعر الصافي (HT)',
      netTTC: 'السعر الصافي (TTC)',
      totalNetHT: 'المجموع الصافي (HT)',
      totalVAT: 'المجموع TVA',
      timbre: 'طابع',
      totalNetTTC: 'المجموع الصافي (TTC)',
      signatureSupplier: 'توقيع المورد',
      signatureCompany: 'توقيع الشركة',
      print: 'طباعة',
      back: 'رجوع',
    },
  };

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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalNetHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    return acc + basePrice * prod.quantite;
  }, 0);

  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100 || 0);
  let totalNetTTC = totalNetHT + totalTVA;

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
    document.body.innerHTML = printContents;
    window.print();
    window.onafterprint = () => {
      document.body.innerHTML = originalContents;
      navigate(previousLocation);
    };
  };

  return (
    <Box sx={{ p: 3, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        {translations[language].back}
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        {translations[language].print}
      </Button>

      {/* Language Selector */}
      <FormControl fullWidth>
        <InputLabel>Language</InputLabel>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </FormControl>

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
            }
          `}
        </style>
        <Box sx={{
          width: 742,
          height: 152,
          mx: 'auto', // Center horizontally
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
              objectFit: 'cover' // or 'contain' based on your preference
            }}
          />
        </Box>

        {/* Company and Supplier Information with Labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Company Information (Left Column) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1"><strong>{translations[language].companyName}:</strong> Amounette Company</Typography>
            <Typography variant="body1"><strong>{translations[language].companyAddress}:</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{translations[language].companyPhone}:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{translations[language].companyTVA}:</strong> TVA123456789</Typography>
          </Box>

          {/* Supplier Information (Right Column) */}
          <Typography>{displayDate()}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>{translations[language].supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierTVA}:</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {translations[language].purchaseOrder} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translations[language].designation}</TableCell>
              <TableCell>{translations[language].unit}</TableCell>
              <TableCell>{translations[language].quantity}</TableCell>
              <TableCell>{translations[language].unitPriceHT}</TableCell>
              <TableCell>{translations[language].vat}</TableCell>
              <TableCell>{translations[language].discount}</TableCell>     
              <TableCell>{translations[language].netHT}</TableCell>
              <TableCell>{translations[language].netTTC}</TableCell>
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
            <TableRow>
              <TableCell colSpan={7} align="right">{translations[language].totalHT}</TableCell>
              <TableCell>{totalNetHT.toFixed(2)} TND</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7} align="right">{translations[language].totalVAT}</TableCell>
              <TableCell>{totalTVA.toFixed(2)} TND</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={7} align="right">{translations[language].totalTTC}</TableCell>
              <TableCell>{totalNetTTC.toFixed(2)} TND</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
