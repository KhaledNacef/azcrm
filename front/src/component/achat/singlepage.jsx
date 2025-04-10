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
  const [language, setLanguage] = useState('fr');
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

  const translations = {
    fr: {
      companyName: "Amounette Company",
      companyAddress: "cité wahat",
      companyPhone: "+987654321",
      companyTVA: "TVA123456789",
      supplierName: "Nom du fournisseur",
      supplierAddress: "Adresse du fournisseur",
      supplierPhone: "Téléphone du fournisseur",
      supplierTVA: "Code TVA",
      totalNetHT: "Total Net (HT)",
      totalTVA: "Total TVA",
      timbre: "Timbre",
      totalNetTTC: "Total Net (TTC)",
      supplierSignature: "Signature du Fournisseur",
      companySignature: "Signature de Ma Société",
      print: "Imprimer",
      back: "Retour",
      title: "Bon D'Achat"
    },
    en: {
      companyName: "Amounette Company",
      companyAddress: "Cité Wahat",
      companyPhone: "+987654321",
      companyTVA: "TVA123456789",
      supplierName: "Supplier Name",
      supplierAddress: "Supplier Address",
      supplierPhone: "Supplier Phone",
      supplierTVA: "VAT Code",
      totalNetHT: "Total Net (HT)",
      totalTVA: "Total VAT",
      timbre: "Stamp",
      totalNetTTC: "Total Net (TTC)",
      supplierSignature: "Supplier Signature",
      companySignature: "My Company Signature",
      print: "Print",
      back: "Back",
      title: "Purchase Order"
    },
    ar: {
      companyName: "شركة أمونيت",
      companyAddress: "الواحات",
      companyPhone: "+987654321",
      companyTVA: "TVA123456789",
      supplierName: "اسم المورد",
      supplierAddress: "عنوان المورد",
      supplierPhone: "هاتف المورد",
      supplierTVA: "كود الضريبة",
      totalNetHT: "المجموع الصافي (HT)",
      totalTVA: "إجمالي الضريبة",
      timbre: "طابع",
      totalNetTTC: "المجموع الصافي (TTC)",
      supplierSignature: "توقيع المورد",
      companySignature: "توقيع الشركة",
      print: "طباعة",
      back: "عودة",
      title: "طلب شراء"
    }
  };

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

  const displayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalNetHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    return acc + basePrice * prod.quantite;
  }, 0);

  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100 || 0);
  let totalNetTTC = totalNetHT + totalTVA;

  if (timbre === 'true') {
    totalNetTTC += 1;
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        {translations[language].back}
      </Button>
      <FormControl sx={{ mb: 2, ml: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          label="Language"
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        {translations[language].print}
      </Button>

      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
          direction: language === 'ar' ? 'rtl' : 'ltr', // Apply RTL for Arabic
          textAlign: language === 'ar' ? 'right' : 'left', // Right-align for Arabic
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1"><strong>{translations[language].companyName}:</strong> {translations[language].companyName}</Typography>
            <Typography variant="body1"><strong>{translations[language].companyAddress}:</strong> {translations[language].companyAddress}</Typography>
            <Typography variant="body1"><strong>{translations[language].companyPhone}:</strong> {translations[language].companyPhone}</Typography>
            <Typography variant="body1"><strong>{translations[language].companyTVA}:</strong> {translations[language].companyTVA}</Typography>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>{translations[language].supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{translations[language].supplierTVA}:</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>
        <Typography variant="h4" mb={3} textAlign="center">
          {translations[language].title} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translations[language].designation}</TableCell>
              <TableCell>{translations[language].unit}</TableCell>
              <TableCell>{translations[language].quantity}</TableCell>
              <TableCell>{translations[language].priceU}</TableCell>
              <TableCell>{translations[language].tva}</TableCell>
              <TableCell>{translations[language].discount}</TableCell>
              <TableCell>{translations[language].netPrice}</TableCell>
              <TableCell>{translations[language].totalPrice}</TableCell>
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
              <strong>{translations[language].totalNetHT}:</strong> {totalNetHT.toFixed(2)}TND
            </Typography>
            <Typography variant="body1">
              <strong>{translations[language].totalTVA}:</strong> {totalTVA.toFixed(2)}TND
            </Typography>
            {timbre === 'true' && (
              <Typography variant="body1">
                <strong>{translations[language].timbre}:</strong> 1TND
              </Typography>
            )}
            <Typography variant="body1">
              <strong>{translations[language].totalNetTTC}:</strong> {totalNetTTC.toFixed(2)}TND
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{translations[language].supplierSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{translations[language].companySignature}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
