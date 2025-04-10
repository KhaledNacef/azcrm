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
            <Typography variant="body1"><strong>{language === 'ar' ? 'اسم الشركة:' : 'Nom de la société:'}</strong> Amounette Compnay</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'عنوان الشركة:' : 'Adresse de la société:'}</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'هاتف الشركة:' : 'Téléphone de la société:'}</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'رمز TVA الشركة:' : 'Code TVA de la société:'}</strong> TVA123456789</Typography>
          </Box>

          <Typography>{displayDate()}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>{language === 'ar' ? 'اسم المورد:' : 'Nom du fournisseur:'}</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'عنوان المورد:' : 'Adresse du fournisseur:'}</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'هاتف المورد:' : 'Téléphone du fournisseur:'}</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{language === 'ar' ? 'رمز TVA:' : 'Code TVA:'}</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {language === 'ar' ? 'إشعار الشراء' : 'Bon D\'Achat'} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{language === 'ar' ? 'التسمية' : 'Designation'}</TableCell>
              <TableCell>{language === 'ar' ? 'الوحدة' : 'Unite'}</TableCell>
              <TableCell>{language === 'ar' ? 'الكمية' : 'Quantité'}</TableCell>
              <TableCell>{language === 'ar' ? 'سعر الوحدة (HT)' : 'Prix U (HT)'}</TableCell>
              <TableCell>{language === 'ar' ? 'ضريبة القيمة المضافة (%)' : 'TVA (%)'}</TableCell>
              <TableCell>{language === 'ar' ? 'الخصم (%)' : 'Rem (%)'}</TableCell>
              <TableCell>{language === 'ar' ? 'السعر الإجمالي (HT)' : 'Prix Net (HT)'}</TableCell>
              <TableCell>{language === 'ar' ? 'السعر الإجمالي (TTC)' : 'Prix Net (TTC)'}</TableCell>
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
              <strong>{language === 'ar' ? 'الإجمالي الصافي (HT):' : 'Total Net (HT):'}</strong> {totalNetHT.toFixed(2)}TND
            </Typography>
            <Typography variant="body1">
              <strong>{language === 'ar' ? 'ضريبة القيمة المضافة:' : 'Total TVA:'}</strong> {totalTVA.toFixed(2)}TND
            </Typography>
            {timbre === 'true' && (
              <Typography variant="body1">
                <strong>{language === 'ar' ? 'طابع:' : 'Timbre:'}</strong> 1TND
              </Typography>
            )}
            <Typography variant="body1">
              <strong>{language === 'ar' ? 'الإجمالي الصافي (TTC):' : 'Total Net (TTC):'}</strong> {totalNetTTC.toFixed(2)}TND
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{language === 'ar' ? 'توقيع المورد' : 'Signature du Fournisseur'}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{language === 'ar' ? 'توقيع شركتي' : 'Signature de Ma Société'}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
