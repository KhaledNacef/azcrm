import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal, Select, MenuItem } from '@mui/material';
import './fdesign.css';
import CreateDeliveryNoteModala from '../achat/crate.jsx';
import logo from '../../assets/amounnet.png';

const BCsingleACHAT = () => {
  const { code, supplierId, codey, timbre } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousLocation = window.location.pathname;
  const [open, setOpen] = useState(false);
  const [printLanguage, setPrintLanguage] = useState('fr');

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

  const timbreAmount = timbre === 'true' ? 1 : 0;
  const totalWithTimbre = totalNetTTC + timbreAmount;

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

  // Translation dictionary
  const translations = {
    fr: {
      companyName: "Nom de la société",
      companyAddress: "Adresse de la société",
      companyPhone: "Téléphone de la société",
      companyVAT: "Code TVA de la société",
      supplierName: "Nom du fournisseur",
      supplierAddress: "Adresse du fournisseur",
      supplierPhone: "Téléphone du fournisseur",
      supplierVAT: "Code TVA",
      title: "Bon De Commande",
      designation: "Designation",
      unit: "Unite",
      quantity: "Quantité",
      unitPrice: "Prix U (HT)",
      vat: "TVA (%)",
      discount: "Rem (%)",
      netPriceHT: "Prix Net (HT)",
      netPriceTTC: "Prix Net (TTC)",
      totalNetHT: "Total Net (HT)",
      totalVAT: "Total TVA",
      stamp: "Timbre",
      totalNetTTC: "Total Net (TTC)",
      supplierSignature: "Signature du Fournisseur",
      companySignature: "Signature de Ma Société",
      unknownAddress: "Adresse inconnue",
      unknownPhone: "Numéro inconnu",
      unknownVAT: "codeTVA inconnu"
    },
    en: {
      companyName: "Company Name",
      companyAddress: "Company Address",
      companyPhone: "Company Phone",
      companyVAT: "Company VAT Code",
      supplierName: "Supplier Name",
      supplierAddress: "Supplier Address",
      supplierPhone: "Supplier Phone",
      supplierVAT: "VAT Code",
      title: "Purchase Order",
      designation: "Designation",
      unit: "Unit",
      quantity: "Quantity",
      unitPrice: "Unit Price (HT)",
      vat: "VAT (%)",
      discount: "Disc. (%)",
      netPriceHT: "Net Price (HT)",
      netPriceTTC: "Net Price (TTC)",
      totalNetHT: "Total Net (HT)",
      totalVAT: "Total VAT",
      stamp: "Stamp",
      totalNetTTC: "Total Net (TTC)",
      supplierSignature: "Supplier Signature",
      companySignature: "Company Signature",
      unknownAddress: "Unknown address",
      unknownPhone: "Unknown number",
      unknownVAT: "Unknown VAT code"
    },
    ar: {
      companyName: "اسم الشركة",
      companyAddress: "عنوان الشركة",
      companyPhone: "هاتف الشركة",
      companyVAT: "رقم الضريبة للشركة",
      supplierName: "اسم المورد",
      supplierAddress: "عنوان المورد",
      supplierPhone: "هاتف المورد",
      supplierVAT: "رقم الضريبة",
      title: "أمر الشراء",
      designation: "الصنف",
      unit: "الوحدة",
      quantity: "الكمية",
      unitPrice: "سعر الوحدة (بدون ضريبة)",
      vat: "الضريبة (%)",
      discount: "الخصم (%)",
      netPriceHT: "السعر الصافي (بدون ضريبة)",
      netPriceTTC: "السعر الصافي (بضريبة)",
      totalNetHT: "المجموع الصافي (بدون ضريبة)",
      totalVAT: "مجموع الضريبة",
      stamp: "الطابع",
      totalNetTTC: "المجموع الصافي (بضريبة)",
      supplierSignature: "توقيع المورد",
      companySignature: "توقيع الشركة",
      unknownAddress: "عنوان غير معروف",
      unknownPhone: "رقم غير معروف",
      unknownVAT: "رقم ضريبة غير معروف"
    }
  };

  const t = translations[printLanguage];

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, mr: 2 }}>
        Imprimer
      </Button>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        Créer un Bon D'ACHAT
      </Button>
      <Button variant="outlined" onClick={() => navigate(`/gestion/${codey}`)} sx={{ mb: 2 }}>
        Gestion De Stock
      </Button>
      
      <Select
        value={printLanguage}
        onChange={(e) => setPrintLanguage(e.target.value)}
        sx={{ mb: 2, minWidth: 120 }}
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
          direction: printLanguage === 'ar' ? 'rtl' : 'ltr',
          textAlign: printLanguage === 'ar' ? 'right' : 'left'
        }}
      >
        <style>
          {`
            @media print {
              body {
                font-size: 12px !important;
                direction: ${printLanguage === 'ar' ? 'rtl' : 'ltr'};
                text-align: ${printLanguage === 'ar' ? 'right' : 'left'};
              }
              .MuiTypography-root {
                font-size: 12px !important;
              }
              .MuiButton-root {
                display: none !important;
              }
              .MuiTableCell-root {
                font-size: 12px !important;
                text-align: ${printLanguage === 'ar' ? 'right' : 'left'};
              }
              .table-header {
                direction: ${printLanguage === 'ar' ? 'rtl' : 'ltr'};
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
        
        {/* Company and Supplier Information */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          flexDirection: printLanguage === 'ar' ? 'row-reverse' : 'row'
        }}>
          {/* Company Information */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            textAlign: printLanguage === 'ar' ? 'right' : 'left',
            marginRight: printLanguage === 'ar' ? '30%' : 0,
            marginLeft: printLanguage === 'ar' ? 0 : '30%'
          }}>
            <Typography variant="body1"><strong>{t.companyName}:</strong> Amounette Company</Typography>
            <Typography variant="body1"><strong>{t.companyAddress}:</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{t.companyPhone}:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{t.companyVAT}:</strong> TVA123456789</Typography>
          </Box>
          
          {/* Date */}
          <Typography sx={{ alignSelf: 'flex-start' }}>{displayDate()}</Typography>
          
          {/* Supplier Information */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            textAlign: printLanguage === 'ar' ? 'right' : 'left'
          }}>
            <Typography variant="body1"><strong>{t.supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{t.supplierAddress}:</strong> {supplier?.address || t.unknownAddress}</Typography>
            <Typography variant="body1"><strong>{t.supplierPhone}:</strong> {supplier?.tel || t.unknownPhone}</Typography>
            <Typography variant="body1"><strong>{t.supplierVAT}:</strong> {supplier?.codeTVA || t.unknownVAT}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {t.title} - {codey}
        </Typography>

        <Table sx={{ direction: printLanguage === 'ar' ? 'rtl' : 'ltr' }}>
          <TableHead className="table-header">
            <TableRow>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.designation}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.unit}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.quantity}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.unitPrice}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.vat}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.discount}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.netPriceHT}</TableCell>
              <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{t.netPriceTTC}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod, index) => {
              const basePrice = prod.prixU_HT;
              const netHT = basePrice * prod.quantite;
              const netTTC = netHT * (1 + prod.tva / 100);

              return (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{prod.designation}</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{prod.Unite}</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{prod.quantite}</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{prod.prixU_HT}TND</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{prod.tva}%</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{prod.rem}%</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{netHT.toFixed(2)}TND</TableCell>
                  <TableCell sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>{netTTC.toFixed(2)}TND</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Total Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 3,
          direction: printLanguage === 'ar' ? 'rtl' : 'ltr'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end'
          }}>
            <Typography variant="body1">
              <strong>{t.totalNetHT}:</strong> {totalNetHT.toFixed(2)} TND
            </Typography>
            <Typography variant="body1">
              <strong>{t.totalVAT}:</strong> {totalTVA.toFixed(2)} TND
            </Typography>

            {timbre === 'true' && (
              <Typography variant="body1">
                <strong>{t.stamp}:</strong> 1 TND
              </Typography>
            )}

            <Typography variant="body1">
              <strong>{t.totalNetTTC}:</strong> {totalWithTimbre.toFixed(2)} TND
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          direction: printLanguage === 'ar' ? 'rtl' : 'ltr'
        }}>
          <Box sx={{ textAlign: printLanguage === 'ar' ? 'right' : 'left' }}>
            <Typography variant="body1">{t.supplierSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: printLanguage === 'ar' ? 'left' : 'right' }}>
            <Typography variant="body1">{t.companySignature}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Modal for Creating Delivery Note */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 500,
          }}
        >
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote} codey={codey} />
        </Box>
      </Modal>
    </Box>
  );
};

export default BCsingleACHAT;