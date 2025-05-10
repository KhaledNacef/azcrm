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

  const totalHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    return acc + basePrice * quantity;
  }, 0);
  

  const totalTVA = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    const tva = prod.tva || 0;
  
    const netHT = basePrice * quantity;
    const tvaAmount = netHT * (tva / 100);
  
    return acc + tvaAmount;
  }, 0);  
  
  let totalRemise = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    const remise = prod.rem && prod.rem > 0 ? prod.rem : 0; // percentage
    const remiseAmount = basePrice * (remise / 100) * quantity;
    return acc + remiseAmount;
  }, 0);
  let totalnetht=totalHT-totalRemise
  let totalNetTTC = totalnetht + totalTVA;

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
      companyName: 'Nom de la Client',
      companyAddress: 'Adresse de la Client',
      companyPhone: 'Téléphone de la Client',
      companyTVA: 'Code TVA de la Client',
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
      prixNetHT: 'Total NET Prix (HT)',
      prixNetTTC: 'Prix Net(TTC)',
      timbre: 'Timbre',
      signatureFournisseur: 'Signature du Fournisseur',
      signatureSociete: 'Signature de Client',
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
      companyName: 'Client Name',
      companyAddress: 'Client Address',
      companyPhone: 'Client Phone',
      companyTVA: 'Client TVA Code',
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
      prixNetHT: 'Total NET Price(HT)',
      prixNetTTC: 'Net Price(TTC)',
      timbre: 'Stamp',
      signatureFournisseur: 'Supplier Signature',
      signatureSociete: 'Client Signature',
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

{/* Supplier info (Always on the left) */}
<Box sx={{
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginRight: '1rem', // Space between supplier and company
  textAlign: 'left'     // Always left-aligned
}}>
  <Typography variant="body1"><strong>{translations[language].supplierName}:</strong> {supplier.fullname}</Typography>
  <Typography variant="body1"><strong>{translations[language].supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
  <Typography variant="body1"><strong>{translations[language].supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
  <Typography variant="body1"><strong>{translations[language].matriculefisacl}:</strong> {supplier?.matriculefisacl || 'Matriculefisacl inconnu'}</Typography>
</Box>

{/* Company info (Always on the right) */}
<Box sx={{
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginLeft: '1rem', // Space between company and supplier
  textAlign: 'right'  // Always right-aligned
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
    const quantity = prod.quantite;
    const remise = prod.rem && prod.rem > 0 ? prod.rem : 0;

    // Apply remise to unit price
    const priceAfterRemise = basePrice * (1 - remise / 100);

    // Net HT with remise
    const netHT = priceAfterRemise * quantity;

    // Net TTC with TVA applied on discounted netHT
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
              <strong>{translations[language].prixNetHT}:</strong> {totalHT.toFixed(2)}TND
            </Typography>
            
            <Typography variant="body1" >
                  <strong>{language === 'fr' ? 'Remise Totale' : language === 'en' ? 'Total Discount' : 'إجمالي الخصم'}:</strong> {totalRemise.toFixed(2)} TND
            </Typography>
            <Typography variant="body1" >
                  <strong>{language === 'fr' ? ' Totale Net HT ' : language === 'en' ? 'Total Net HT' : 'إجمالي الخصم'}:</strong> {totalnetht.toFixed(2)} TND
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
