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

    // Add language-specific styles based on the selected language
    const languageStyle = `
      <style>
        body {
          font-size: 12px !important;
          ${language === 'ar' ? 'direction: rtl; text-align: right;' : ''}
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
        ${language === 'ar' ? `
          .MuiTypography-root {
            font-family: 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
          }
          .MuiTable-root {
            direction: rtl;
          }
        ` : ''}
      </style>
    `;

    // Replace the body content with printable content
    document.body.innerHTML = languageStyle + printContents;

    // Trigger the print dialog
    window.print();

    // After printing is done, restore the original content and navigate back
    window.onafterprint = () => {
      document.body.innerHTML = originalContents; // Restore original page content
      navigate(previousLocation); // Navigate back to the previous page
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        Imprimer
      </Button>

      {/* Language selection dropdown */}
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ar">العربية</MenuItem>
      </Select>

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
        <Box sx={{ width: 742, height: 152, mx: 'auto', mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1"><strong>{language === 'ar' ? 'اسم الشركة:' : language === 'fr' ? 'Nom de la société:' : 'Company Name:'}</strong> Amounette Compnay</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'عنوان الشركة:' : language === 'fr' ? 'Adresse de la société:' : 'Company Address:'}</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'هاتف الشركة:' : language === 'fr' ? 'Téléphone de la société:' : 'Company Phone:'}</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'رمز TVA الشركة:' : language === 'fr' ? 'Code TVA de la société:' : 'Company VAT Code:'}</strong> TVA123456789</Typography>
          </Box>

          <Typography>{displayDate()}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>{language === 'ar' ? 'اسم المورد:' : language === 'fr' ? 'Nom du fournisseur:' : 'Supplier Name:'}</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'عنوان المورد:' : language === 'fr' ? 'Adresse du fournisseur:' : 'Supplier Address:'}</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'هاتف المورد:' : language === 'fr' ? 'Téléphone du fournisseur:' : 'Supplier Phone:'}</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'رمز TVA:' : language === 'fr' ? 'Code TVA:' : 'VAT Code:'}</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {language === 'ar' ? 'إشعار الشراء' : language === 'fr' ? 'Bon D\'Achat' : 'Purchase Receipt'} - {codey}
        </Typography>

        <Table sx={{ width: '60%', margin: '0 auto' }}>
          <TableHead>
            <TableRow>
              <TableCell>{language === 'ar' ? 'التسمية' : language === 'fr' ? 'Designation' : 'Designation'}</TableCell>
              <TableCell>{language === 'ar' ? 'الوحدة' : language === 'fr' ? 'Unite' : 'Unit'}</TableCell>
              <TableCell>{language === 'ar' ? 'الكمية' : language === 'fr' ? 'Quantité' : 'Quantity'}</TableCell>
              <TableCell>{language === 'ar' ? 'سعر الوحدة (HT)' : language === 'fr' ? 'Prix Unité (HT)' : 'Unit Price (HT)'}</TableCell>
              <TableCell>{language === 'ar' ? 'الإجمالي' : language === 'fr' ? 'Total' : 'Total'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.Unite}</TableCell>
                <TableCell>{prod.quantite}</TableCell>
                <TableCell>{prod.prixU_HT}</TableCell>
                <TableCell>{prod.prixU_HT * prod.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginBottom: '10px' }}>
          <Typography variant="body1"><strong>{language === 'ar' ? 'الإجمالي الصافي (HT):' : language === 'fr' ? 'Total Net (HT):' : 'Total Net (HT):'}</strong> {totalNetHT}</Typography>
          <Typography variant="body1"><strong>{language === 'ar' ? 'الإجمالي TVA:' : language === 'fr' ? 'Total TVA:' : 'Total TVA:'}</strong> {totalTVA}</Typography>
        </Box>
        <Typography variant="h6" textAlign="right">
          <strong>{language === 'ar' ? 'الإجمالي الصافي (TTC):' : language === 'fr' ? 'Total Net (TTC):' : 'Total Net (TTC):'}</strong> {totalNetTTC}
        </Typography>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
