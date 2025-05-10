import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal, Select, MenuItem } from '@mui/material';
import './fdesign.css';
import CreateDeliveryNoteModala from '../achat/crate.jsx'; // Ensure correct file name
import logo from '../../assets/amounnet.png';  // Relative path

const BCsingleACHAT = () => {
  const { code, supplierId, codey, timbre,num} = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('fr');  // Default language is French
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
  };
  const translations = {
    en: {
      signatureFournisseur: 'Supplier Signature',
      signatureSociete: 'Company Signature',
    },
    fr: {
      signatureFournisseur: 'Signature du Fournisseur',
      signatureSociete: 'Signature de la Société',
    },
    ar: {
      signatureFournisseur: 'توقيع المورد',
      signatureSociete: 'توقيع الشركة',
    },
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/suplier/getidsuppliers/${supplierId}`);
        const productRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/boncommandallproducts/factureap/${code}`);

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
  const totalRemise = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    const remise = prod.rem && prod.rem > 0 ? prod.rem : 0; // percentage
    const remiseAmount = basePrice * (remise / 100) * quantity;
    return acc + remiseAmount;
  }, 0);
  
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
      navigate(window.location.pathname);  // Navigate back after printing
    };
  };
 
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

      {/* Language Selector */}
      <Box sx={{ mb: 2 }}>
        <Select value={language} onChange={(e) => setLanguage(e.target.value)} displayEmpty>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </Box>

      {/* Printable content */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
          direction: language === 'ar' ? 'rtl' : 'ltr',  // Set RTL for Arabic
        }}
      >
       <style>
  {`
    @media print {
      body {
        font-size: 12px !important;
        direction: ${language === 'ar' ? 'rtl' : 'ltr'} !important;
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
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>

{/* Supplier Information (Always on the Left) */}
<Box sx={{
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginRight: '1rem',
  textAlign: language === 'ar' ? 'right' : 'left'
}}>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Nom du fournisseur' : language === 'en' ? 'Supplier Name' : 'اسم المورد'}:</strong> {supplier.fullname}
  </Typography>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Adresse du fournisseur' : language === 'en' ? 'Supplier Address' : 'عنوان المورد'}:</strong> {supplier?.address || 'Adresse inconnue'}
  </Typography>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Téléphone du fournisseur' : language === 'en' ? 'Supplier Phone' : 'هاتف المورد'}:</strong> {supplier?.tel || 'Numéro inconnu'}
  </Typography>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'matriculefisacl' : language === 'en' ? 'Tax Identification Number' : "الرقم الجبائي"}:</strong> {supplier?.matriculefisacl || 'Code TVA inconnu'}
  </Typography>
</Box>

{/* Company Information (Always on the Right) */}
<Box sx={{
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginLeft: '1rem',
  textAlign: language === 'ar' ? 'left' : 'right'
}}>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Nom de la Client' : language === 'en' ? 'Company Name' : 'اسم الشركة'}:</strong> AMOUNNET COMPANY EXPORT ET IMPORT
  </Typography>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Adresse de la Client' : language === 'en' ? 'Company Address' : 'عنوان الشركة'}:</strong> RUE DU LAC TOBA BERGES DU LAC1053 TUNIS
  </Typography>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Téléphone de la Client' : language === 'en' ? 'Company Phone' : 'هاتف الشركة'}:</strong> +987654321
  </Typography>
  <Typography variant="body1">
    <strong>{language === 'fr' ? 'Matriculefisacl' : language === 'en' ? 'Tax Identification Number' : "الرقم الجبائي"}:</strong> 1867411P/A/M/000
  </Typography>
</Box>

</Box>


        <Typography variant="h4" mb={3} textAlign="center">
          {language === 'fr' ? 'Bon De Livraison' : language === 'en' ? 'Order Form' : 'نموذج الطلب'} - {num}
        </Typography>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{language === 'fr' ? 'Designation' : language === 'en' ? 'Designation' : 'التسمية'}</TableCell>
              <TableCell>{language === 'fr' ? 'Unite' : language === 'en' ? 'Unit' : 'وحدة'}</TableCell>
              <TableCell>{language === 'fr' ? 'Quantité' : language === 'en' ? 'Quantity' : 'الكمية'}</TableCell>
              <TableCell>{language === 'fr' ? 'Prix U (HT)' : language === 'en' ? 'Unit Price(HT)' : 'سعر الوحدة(بدون TVA)'}</TableCell>
              <TableCell>{language === 'fr' ? 'TVA (%)' : language === 'en' ? 'VAT(%)' : 'ضريبة القيمة المضافة(%)'}</TableCell>
              <TableCell>{language === 'fr' ? 'Rem (%)' : language === 'en' ? 'Discount(%)' : 'خصم(%)'}</TableCell>
              <TableCell>{language === 'fr' ? 'Total HT' : language === 'en' ? 'Total HT' : 'إجمالي قبل الضريبة'}</TableCell>
              <TableCell>{language === 'fr' ? 'Total TTC' : language === 'en' ? 'Total TTC' : 'إجمالي  الضريبة'}</TableCell>

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

        {/* Totals Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Typography variant="body1"><strong>{language === 'fr' ? 'Total HT' : language === 'en' ? 'Total HT' : 'الإجمالي قبل الضريبة'}:</strong> {totalNetHT.toFixed(2)} TND</Typography>
            <Typography variant="body1"><strong>{language === 'fr' ? 'Total TVA' : language === 'en' ? 'Total VAT' : 'إجمالي ضريبة القيمة المضافة'}:</strong> {totalTVA.toFixed(2)} TND</Typography>
            <Typography variant="body1" >
                  <strong>{language === 'fr' ? 'Remise Totale' : language === 'en' ? 'Total Discount' : 'إجمالي الخصم'}:</strong> {totalRemise.toFixed(2)} TND
           </Typography>

            {timbre === 'true' && (
            <Typography variant="body1">
              <strong>{language === 'fr' ? 'Timbre' : language === 'en' ? 'Stamp' : 'طابع'}:</strong> 1 TND
              </Typography>          
              )}

            <Typography variant="body1"><strong>{language === 'fr' ? 'Total TTC' : language === 'en' ? 'Total TTC' : 'الإجمالي شامل'}:</strong> {totalNetTTC.toFixed(2)} TND</Typography>
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
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote} codey={codey}  />
        </Box>
      </Modal>
    </Box>
  );
};

export default BCsingleACHAT;
