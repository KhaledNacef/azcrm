import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal } from '@mui/material';
import './fdesign.css';
import CreateDeliveryNoteModala from '../achat/crate.jsx'; // Ensure correct file name
import logo from '../../assets/amounnet.png';  // Relative path

const BCsingleACHAT = () => {
  const { code, supplierId, codey, timbre } = useParams();  // 'timbre' from URL params
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousLocation = window.location.pathname;

  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('fr');  // Default language is French

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/suplier/getidsuppliers/${supplierId}`);
        const productRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/boncommandallproducts/factureap/${code}`);

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
  const totalNetTTC = totalNetHT + totalTVA;

  const timbreAmount = timbre === 'true' ? 1 : 0;  // If timbre is true, add 1 TND
  const totalWithTimbre = totalNetTTC + timbreAmount;  // Add timbre to total net TTC

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

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  // Translations for different languages
  const translations = {
    fr: {
      companyName: "Amounette Compnay",
      companyAddress: "cité wahat",
      companyPhone: "+987654321",
      companyTVA: "TVA123456789",
      supplierName: "Nom du fournisseur",
      supplierAddress: "Adresse du fournisseur",
      supplierPhone: "Téléphone du fournisseur",
      supplierTVA: "Code TVA",
      signatureSupplier: "Signature du Fournisseur",
      signatureCompany: "Signature de Ma Société",
      return: "Retour",
      print: "Imprimer",
      createDeliveryNote: "Créer un Bon D'ACHAT",
      stockManagement: "Gestion De Stock",
      invoiceTitle: "Bon De Commande",
      totalNetHT: "Total Net (HT)",
      totalTVA: "Total TVA",
      timbre: "Timbre",
      totalNetTTC: "Total Net (TTC)",
    },
    en: {
      companyName: "Amounette Company",
      companyAddress: "Cité Wahat",
      companyPhone: "+987654321",
      companyTVA: "TVA123456789",
      supplierName: "Supplier Name",
      supplierAddress: "Supplier Address",
      supplierPhone: "Supplier Phone",
      supplierTVA: "TVA Code",
      signatureSupplier: "Supplier's Signature",
      signatureCompany: "Company's Signature",
      return: "Back",
      print: "Print",
      createDeliveryNote: "Create Purchase Order",
      stockManagement: "Stock Management",
      invoiceTitle: "Invoice",
      totalNetHT: "Total Net (HT)",
      totalTVA: "Total VAT",
      timbre: "Stamp",
      totalNetTTC: "Total Net (TTC)",
    },
    ar: {
      companyName: "شركة أمونيت",
      companyAddress: "حي واحات",
      companyPhone: "+987654321",
      companyTVA: "TVA123456789",
      supplierName: "اسم المورد",
      supplierAddress: "عنوان المورد",
      supplierPhone: "هاتف المورد",
      supplierTVA: "كود TVA",
      signatureSupplier: "توقيع المورد",
      signatureCompany: "توقيع الشركة",
      return: "رجوع",
      print: "طباعة",
      createDeliveryNote: "إنشاء أمر شراء",
      stockManagement: "إدارة المخزون",
      invoiceTitle: "فاتورة",
      totalNetHT: "الإجمالي الصافي (HT)",
      totalTVA: "الإجمالي TVA",
      timbre: "طابع",
      totalNetTTC: "الإجمالي الصافي (TTC)",
    }
  };

  const currentLang = translations[language];

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        {currentLang.return}
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, mr: 2 }}>
        {currentLang.print}
      </Button>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        {currentLang.createDeliveryNote}
      </Button>
      <Button variant="outlined" onClick={() => navigate(`/gestion/${codey}`)} sx={{ mb: 2 }}>
        {currentLang.stockManagement}
      </Button>

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
        {/* Add style for print */}
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
            <Typography variant="body1"><strong>{currentLang.companyName}:</strong> {currentLang.companyName}</Typography>
            <Typography variant="body1"><strong>{currentLang.companyAddress}:</strong> {currentLang.companyAddress}</Typography>
            <Typography variant="body1"><strong>{currentLang.companyPhone}:</strong> {currentLang.companyPhone}</Typography>
            <Typography variant="body1"><strong>{currentLang.companyTVA}:</strong> {currentLang.companyTVA}</Typography>
          </Box>

          {/* Supplier Information (Right Column) */}
          <Typography>{displayDate()}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>{currentLang.supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{currentLang.supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>{currentLang.supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>{currentLang.supplierTVA}:</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {currentLang.invoiceTitle} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{currentLang.designation}</TableCell>
              <TableCell>{currentLang.unite}</TableCell>
              <TableCell>{currentLang.quantity}</TableCell>
              <TableCell>{currentLang.unitPriceHT}</TableCell>
              <TableCell>{currentLang.tva}</TableCell>
              <TableCell>{currentLang.rem}</TableCell>
              <TableCell>{currentLang.netHT}</TableCell>
              <TableCell>{currentLang.netTTC}</TableCell>
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
                  <TableCell>{prod.remise}%</TableCell>
                  <TableCell>{netHT}TND</TableCell>
                  <TableCell>{netTTC}TND</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Totals and Final Calculation */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="h6">{currentLang.totalNetHT}: {totalNetHT} TND</Typography>
          <Typography variant="h6">{currentLang.totalTVA}: {totalTVA} TND</Typography>
          <Typography variant="h6">{currentLang.totalNetTTC}: {totalNetTTC} TND</Typography>
          {timbreAmount > 0 && <Typography variant="h6">{currentLang.timbre}: {timbreAmount} TND</Typography>}
          <Typography variant="h6">{currentLang.totalNetTTC}: {totalWithTimbre} TND</Typography>
        </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">{currentLang.signatureFournisseur}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">{currentLang.signatureSociete}</Typography>
                  </Box>
                </Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <CreateDeliveryNoteModala />
      </Modal>
    </Box>
  );
};

export default BCsingleACHAT;
