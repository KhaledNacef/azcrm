import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Select, MenuItem } from '@mui/material';
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
  const [language, setLanguage] = useState('fr');  // Default language is French
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalNetHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    return acc + basePrice * prod.quantite;
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
      bonDeAchat: 'Bon D\'Achat',
      designation: 'Désignation',
      unite: 'Unité',
      quantite: 'Quantité',
      prixUHT: 'Prix U (HT)',
      tva: 'TVA (%)',
      rem: 'Rem (%)',
      prixNetHT: 'Prix Net (HT)',
      prixNetTTC: 'Prix Net (TTC)',
      timbre: 'Timbre',
      signatureFournisseur: 'Signature du Fournisseur',
      signatureSociete: 'Signature de Ma Société',
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
      prixUHT: 'السعر (بدون ضريبة)',
      tva: 'ضريبة القيمة المضافة (%)',
      rem: 'الخصم (%)',
      prixNetHT: 'السعر الصافي (بدون ضريبة)',
      prixNetTTC: 'السعر الصافي (شاملة الضريبة)',
      timbre: 'الطابع',
      signatureFournisseur: 'توقيع المورد',
      signatureSociete: 'توقيع الشركة',
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
      prixUHT: 'Price U (HT)',
      tva: 'VAT (%)',
      rem: 'Discount (%)',
      prixNetHT: 'Net Price (HT)',
      prixNetTTC: 'Net Price (TTC)',
      timbre: 'Stamp',
      signatureFournisseur: 'Supplier Signature',
      signatureSociete: 'Company Signature',
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
          direction: language === 'ar' ? 'rtl' : 'ltr',  // Set the direction based on language
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

        {/* Company and Supplier Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ width: '45%' }}>
            <Typography variant="h6">
              {translations[language].companyName}: {supplier.societe}
            </Typography>
            <Typography>{translations[language].companyAddress}: {supplier.adresse}</Typography>
            <Typography>{translations[language].companyPhone}: {supplier.tel}</Typography>
            <Typography>{translations[language].companyTVA}: {supplier.code_tva}</Typography>
          </Box>
          <Box sx={{ width: '45%' }}>
            <Typography variant="h6">
              {translations[language].supplierName}: {supplier.nom}
            </Typography>
            <Typography>{translations[language].supplierAddress}: {supplier.adresse}</Typography>
            <Typography>{translations[language].supplierPhone}: {supplier.tel}</Typography>
            <Typography>{translations[language].supplierTVA}: {supplier.code_tva}</Typography>
          </Box>
        </Box>

        {/* Delivery Note */}
        <Typography variant="h5" sx={{ mt: 3, textAlign: 'center' }}>
          {translations[language].bonDeAchat}
        </Typography>

        <Table sx={{ mt: 2 }}>
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
            {deliveryNote.map((prod, index) => (
              <TableRow key={index}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.unite}</TableCell>
                <TableCell>{prod.quantite}</TableCell>
                <TableCell>{prod.prixU_HT}</TableCell>
                <TableCell>{prod.tva}</TableCell>
                <TableCell>{prod.rem}</TableCell>
                <TableCell>{prod.prixNet_HT}</TableCell>
                <TableCell>{prod.prixNet_TTC}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2">
              {translations[language].timbre}: {timbre === 'true' ? '1 TND' : '0 TND'}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
          {translations[language].prixNetTTC}: {totalNetTTC} TND
        </Typography>
          </Box>
          <Box>
            <Typography variant="body2">{translations[language].signatureFournisseur}</Typography>
            <Typography variant="body2">{translations[language].signatureSociete}</Typography>
          </Box>
        </Box>

        {/* Total Price */}
       
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
