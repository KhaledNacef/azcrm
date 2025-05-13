import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import './fvdesign.css';
import CreateDeliveryNoteModal from '../vente/cratebl.jsx';
import logo from '../../assets/amounnet.png';
import n2words from 'n2words';

const translations = {
  en: {
    timbre: 'Stamp',
    tva: "VAT",
    prixNetU: "Net Unit Price excl. VAT",
    totalNetHT: "Total Net excl. VAT",
    totalNetTTC: "Total Net incl. VAT",
    companyName: "Company Name",
    companyAddress: "Company Address",
    matriculefisacl:"tax identification number",
    companyPhone: "Company Phone",
    companyVAT: "Company VAT",
    clientName: "Client Name",
    clientAddress: "Client Address",
    clientPhone: "Client Phone",
    clientFax: "Fax",
    deliveryNote: "Facture",
    designation: "Designation",
    quantity: "Quantity",
    unit: "Unit",
    unitPrice: "Unit Price",
    netPrice: "Net Price",
    totalNet: "Total Net",
    clientSignature: "Client Signature",
    companySignature: "Company Signature",
    date: "Date",
    print: "Print",
    back: "Back",
    remise: "Discount",
    totaltva:'Total VAT',
    prixNetHT: 'Total Price(HT)',
    prixNetTTC: 'Net Price(TTC)',

  },
  fr: {
    timbre: 'Timbre',
    tva: "TVA",
    prixNetU: "Prix Net U HT",
    totalNetHT: "Total Net HT",
    totalNetTTC: "Total Net TTC",
    companyName: "Nom de la société",
    companyAddress: "Adresse de la société",
    companyPhone: "Téléphone de la société",
    companyVAT: "Code TVA de la société",
    clientName: "Nom du Client",
    clientAddress: "Adresse du Client",
    clientPhone: "Téléphone du Client",
    clientFax: "Fax",
    deliveryNote: "Facture",
    designation: "Designation",
    quantity: "Quantité",
    unit: "Unité",
    unitPrice: "Prix U",
    netPrice: "Prix Net",
    totalNet: "Total Net",
    clientSignature: "Signature du Client",
    companySignature: "Signature de la Société",
    date: "Date",
    print: "Imprimer",
    back: "Retour",
    matriculefisacl:'Matriculefisacl',
    remise: "Remise",
    totaltva:'Total TVA',
    prixNetHT: 'Total Prix (HT)',
    prixNetTTC: 'Prix Net(TTC)',



  },
  ar: {
    timbre: 'الطابع',
    companyName: "اسم الشركة",
    companyAddress: "عنوان الشركة",
    companyPhone: "هاتف الشركة",
    companyVAT: "الرقم الضريبي",
    clientName: "اسم العميل",
    clientAddress: "عنوان العميل",
    clientPhone: "هاتف العميل",
    clientFax: "فاكس",
    deliveryNote: "إذن صرف",
    designation: "الوصف",
    quantity: "الكمية",
    unit: "الوحدة",
    unitPrice: "سعر الوحدة",
    netPrice: "السعر الصافي",
    totalNet: "المجموع الصافي",
    clientSignature: "توقيع العميل",
    companySignature: "توقيع الشركة",
    date: "التاريخ",
    print: "طباعة",
    back: "رجوع",
    matriculefisacl:"الرقم الجبائي",
    remise: "خصم",
    tva: "الضريبة على القيمة المضافة",
    prixNetU: "السعر الصافي للوحدة دون ضريبة",
    totalNetHT: "المجموع الصافي دون ضريبة",
    totalNetTTC: "المجموع الصافي مع الضريبة",
    totaltva:'إجمالي ضريبة القيمة المضافة',
    prixNetHT: 'السعر(بدون ضريبة)',
    prixNetTTC: 'السعر الصافي(شاملة الضريبة)',

  }
};

const Bvsinlge = () => {
  const { code, clientId, codey, devise,id,datee,timbre } = useParams();
  const printRef = useRef();
  const navigate = useNavigate();
  const [printLanguage, setPrintLanguage] = useState('fr');
  const [anchorEl, setAnchorEl] = useState(null);
  const [client, setClient] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/v1/clients/getclietn/${clientId}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchDeliveryNoteData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/v1/bonlivraison/facturev/${code}`);
        const data = await response.json();
        setDeliveryNote(data);
      } catch (error) {
        console.error('Error fetching delivery note data:', error);
      }
    };

    fetchClientData();
    fetchDeliveryNoteData();
  }, [code, clientId]);

const totalHT = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    return acc + basePrice * quantity;
  }, 0);
  

  const totalTVA = deliveryNote.reduce((acc, prod) => {
    const basePrice = prod.prixU_HT;
    const quantity = prod.quantite;
    const remise = prod.rem && prod.rem > 0 ? prod.rem : 0; // percentage
    const tva = prod.tva || 0;
  
    const priceAfterRemise = basePrice * (1 - remise / 100);
    const netHT = priceAfterRemise * quantity;
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
  const totalNetTTCInWords = n2words(totalNetTTC.toFixed(3), { lang: printLanguage === 'ar' ? 'ar' : printLanguage }); // Arabic or French/English


  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
  
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContents;
    const logoImg = tempDiv.querySelector('.print-logo');
  
    const triggerPrint = () => {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    };
  
    if (logoImg?.complete) {
      triggerPrint();
    } else {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        triggerPrint();
      };
    }
  };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addDeliveryNote = () => {
    handleClose();
  };

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const selectLanguage = (lang) => {
    setPrintLanguage(lang);
    handleLanguageMenuClose();
  };

  const isArabic = printLanguage === 'ar';
  const formattedDate = new Date(datee).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        Retour
      </Button>

    <Button onClick={handlePrint} variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}>
      Imprimer
    </Button>
  
        <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleLanguageMenuOpen}
        sx={{ mb: 2, mr: 2 }}
      >
        {printLanguage.toUpperCase()}
      </Button>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        Créer un Facture Vente
      </Button>
      <Button variant="outlined" onClick={() => navigate(`/gestionv/${codey}`)} sx={{ mb: 2 }}>
        Gestion De Stock
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => selectLanguage('fr')}>FR</MenuItem>
        <MenuItem onClick={() => selectLanguage('en')}>EN</MenuItem>
        <MenuItem onClick={() => selectLanguage('ar')}>AR</MenuItem>
      </Menu>

      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
   <style>
  {
    `
      @media print {
        body {
          font-size: 12px !important;
          direction: ${isArabic ? 'rtl' : 'ltr'};
        }
        .MuiButton-root {
          display: none !important;
        }
        .MuiTypography-root {
          font-size: 12px !important;
        }
        .MuiTableCell-root {
          font-size: 12px !important;
          text-align: ${isArabic ? 'right' : 'left'};
        }
        .print-logo {
          display: block !important;
          visibility: visible !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .logo-conatiner {
          display: block !important;
          visibility: visible !important;
          max-width: 742px !important;
          height: 152px !important;
          overflow: hidden;
        }
      }
    `
  }
</style>

        <Box className="logo-conatiner"
        sx={{ 
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
            className="print-logo"
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sx={{ textAlign: isArabic ? 'right' : 'left' }}>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyName}:</strong> AMOUNNET COMPANY EXPORT ET IMPORT
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyAddress}:</strong> RUE DU LAC TOBA BERGES DU LAC1053 TUNIS
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyPhone}:</strong> +987654321
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].companyVAT}:</strong> 1867411P/A/M/000
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: isArabic ? 'left' : 'right' }}>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientName}:</strong> {client?.fullname}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientAddress}:</strong> {client?.address}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientPhone}:</strong> {client?.tel}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].clientFax}:</strong> {client?.fax}
            </Typography>
            <Typography variant="body2">
              <strong>{translations[printLanguage].matriculefisacl}:</strong> {client?.matriculefisacl}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h4" mb={3} textAlign="center">
          {translations[printLanguage].deliveryNote}- {id}/{formattedDate}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
             <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].designation}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].quantity}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].unit}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].unitPrice} </TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].tva}%</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].remise}%</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].prixNetU}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].totalNetHT}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{translations[printLanguage].totalNetTTC}</TableCell>
            
            </TableRow>
          </TableHead>
 <TableBody>
            {deliveryNote.map((prod, index) =>{
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
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.designation}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.quantite}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.Unite}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.prixU_HT.toFixed(3)} </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.tva}%</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{prod.rem}%</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{priceAfterRemise.toFixed(3)}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{netHT.toFixed(3)} </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left' }}>{netTTC.toFixed(3)} </TableCell>
              </TableRow>
)})}
          </TableBody>
        </Table>

       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="body1">
                          <strong>{translations[printLanguage].prixNetHT}:</strong> {totalHT.toFixed(3)}TND
                        </Typography>
                        
                        <Typography variant="body1" >
                              <strong>{printLanguage === 'fr' ? 'Remise Totale' : printLanguage === 'en' ? 'Total Discount' : 'إجمالي الخصم'}:</strong> {totalRemise.toFixed(3)} {devise}
                        </Typography>
                        <Typography variant="body1" >
                              <strong>{printLanguage === 'fr' ? ' Totale Net HT ' : printLanguage === 'en' ? 'Total Net HT' : 'إجمالي الخصم'}:</strong> {totalnetht.toFixed(3)} {devise}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{translations[printLanguage].totaltva}:</strong> {totalTVA.toFixed(3)}{devise}
                        </Typography>
                        {timbre === 'true' && (
                          <Typography variant="body1">
                            <strong>{translations[printLanguage].timbre}:</strong> 1TND
                          </Typography>
                        )}
                        <Typography variant="body1">
                          <strong>{translations[printLanguage].prixNetTTC}:</strong> {totalNetTTC.toFixed(3)}{devise}
                        </Typography>
                      </Box>
                    </Box>
                     <Box sx={{ mt: 5, textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        {printLanguage === 'fr' && `Montant en lettres : ${totalNetTTCInWords.toUpperCase()} ${devise}`}
                        {printLanguage === 'en' && `Amount in words: ${totalNetTTCInWords.toUpperCase()} ${devise}`}
                        {printLanguage === 'ar' && `المبلغ بالحروف: ${totalNetTTCInWords.toUpperCase()} ${devise}`}
                      </Typography>
                    </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          flexDirection: isArabic ? 'row-reverse' : 'row'
        }}>
          <Box sx={{ textAlign: isArabic ? 'right' : 'left' }}>
            <Typography variant="body1">{translations[printLanguage].clientSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: isArabic ? 'left' : 'right' }}>
            <Typography variant="body1">{translations[printLanguage].companySignature}</Typography>
          </Box>
        </Box>
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
          <CreateDeliveryNoteModal onAddDeliveryNote={addDeliveryNote} codey={codey} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Bvsinlge;