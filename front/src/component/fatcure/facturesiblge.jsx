import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal, Select, MenuItem } from '@mui/material';
import './fdesign.css';
import CreateDeliveryNoteModala from '../achat/crate.jsx'; // Ensure correct file name
import logo from '../../assets/amounnet.png';  // Relative path
import n2words from 'n2words';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const totalNetTTCInWords = n2words(totalNetTTC.toFixed(3), { lang: language === 'ar' ? 'ar' : language }); // Arabic or French/English

  function displayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const handlePrint = async () => {
    const element = document.getElementById('printable-content');
    
    // Create a clone to modify for printing
    const printClone = element.cloneNode(true);
    
    // Apply smaller font sizes directly to all text elements
    const textElements = printClone.querySelectorAll('*');
    textElements.forEach(el => {
      const currentSize = window.getComputedStyle(el).fontSize;
      const newSize = `${parseFloat(currentSize) * 0.7}px`; // Reduce to 70% of original size
      el.style.fontSize = newSize;
      el.style.lineHeight = '1.2'; // Tighter line spacing
    });
    
    // Special handling for table cells
    const tableCells = printClone.querySelectorAll('.MuiTableCell-root');
    tableCells.forEach(cell => {
      cell.style.padding = '4px 6px'; // Reduce cell padding
    });
    
    document.body.appendChild(printClone);
    
    try {
      const canvas = await html2canvas(printClone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 210 * 3.78,
        windowHeight: 297 * 3.78
      });
  
      document.body.removeChild(printClone);
  
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
  
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              @page {
                size: A4;
                margin: 5mm;
              }
              body {
                margin: 0;
                padding: 0;
              }
              img {
                width: 100%;
                height: auto;
                page-break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL('image/png')}" />
          </body>
        </html>
      `);
      doc.close();
  
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          document.body.removeChild(iframe);
        }, 500);
      };
    } catch (error) {
      console.error('Print error:', error);
      document.body.removeChild(printClone);
    }
  };
  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-content');
    
    // Create a clone to modify for PDF
    const pdfClone = element.cloneNode(true);
    
    // Apply the same styling modifications as handlePrint
    const textElements = pdfClone.querySelectorAll('*');
    textElements.forEach(el => {
      const currentSize = window.getComputedStyle(el).fontSize;
      const newSize = `${parseFloat(currentSize) * 0.7}px`; // Same 70% reduction as print
      el.style.fontSize = newSize;
      el.style.lineHeight = '1.2'; // Consistent line spacing
    });
  
    // Match table cell padding from print function
    const tableCells = pdfClone.querySelectorAll('.MuiTableCell-root');
    tableCells.forEach(cell => {
      cell.style.padding = '4px 6px';
    });
  
    // Additional PDF-specific optimizations
    pdfClone.style.width = '210mm'; // Explicit A4 width
    pdfClone.style.margin = '0 auto'; // Center content
    document.body.appendChild(pdfClone);
  
    try {
      const canvas = await html2canvas(pdfClone, {
        scale: 3, // Higher scale for better PDF quality
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 210 * 3.78, // A4 width in pixels
        windowHeight: pdfClone.scrollHeight, // Dynamic height
        scrollX: 0,
        scrollY: 0,
        allowTaint: true
      });
  
      document.body.removeChild(pdfClone);
  
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
  
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 10; // 5mm margins
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      // Add first page
      pdf.addImage(imgData, 'PNG', 5, 5, pdfWidth, pdfHeight);
  
      // Handle multi-page documents
      let heightLeft = pdfHeight;
      let position = 5; // Start position
      const pageHeight = pdf.internal.pageSize.getHeight() - 10;
  
      if (heightLeft > pageHeight) {
        while (heightLeft > 0) {
          position = heightLeft - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 5, -position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      }
  
      pdf.save(`invoice-${num || 'document'}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      document.body.removeChild(pdfClone);
    }
  };
 
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, mr: 2 }}>
        Imprimer
      </Button>
      <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mb: 2, mr: 2 }}>
              PDF
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
      <div
      id="printable-content"
     sx={{
    p: 3,
    backgroundColor: '#fff',
    direction: language === 'ar' ? 'rtl' : 'ltr',
    border: '1px solid #ccc'

  
  }}
>
     

   

 {/* Company and Supplier Information with Labels */}
  <Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  mb: 2,
  gap: 2 ,
  direction: language === 'ar' ? 'rtl' : 'ltr' // Add space between the two boxes
}}>
{/* Supplier Information (Always on the Left) */}
<Box sx={{
  flex: 1,
  border: '1px solid',
  borderColor: 'grey.400',
  borderRadius: 2,
  p: 2,
  textAlign: language === 'ar' ? 'right' : 'left'
}}>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Nom du fournisseur' : language === 'en' ? 'Supplier Name' : 'اسم المورد'}:</strong> {supplier.fullname}
  </Typography>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Adresse du fournisseur' : language === 'en' ? 'Supplier Address' : 'عنوان المورد'}:</strong> {supplier?.address || 'Adresse inconnue'}
  </Typography>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Téléphone du fournisseur' : language === 'en' ? 'Supplier Phone' : 'هاتف المورد'}:</strong> {supplier?.tel || 'Numéro inconnu'}
  </Typography>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'matriculefisacl' : language === 'en' ? 'Tax Identification Number' : "الرقم الجبائي"}:</strong> {supplier?.matriculefisacl || 'Code TVA inconnu'}
  </Typography>
</Box>

{/* Company Information (Always on the Right) */}
<Box sx={{
 flex: 1,
 border: '1px solid',
 borderColor: 'grey.400',
 borderRadius: 2,
 p: 2,
  textAlign: language === 'ar' ? 'right' : 'left'
}}>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Nom de la Client' : language === 'en' ? 'Company Name' : 'اسم الشركة'}:</strong> AMOUNNET COMPANY EXPORT ET IMPORT
  </Typography>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Adresse de la Client' : language === 'en' ? 'Company Address' : 'عنوان الشركة'}:</strong> RUE DU LAC TOBA BERGES DU LAC1053 TUNIS
  </Typography>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Téléphone de la Client' : language === 'en' ? 'Company Phone' : 'هاتف الشركة'}:</strong> +987654321
  </Typography>
  <Typography variant="body2">
    <strong>{language === 'fr' ? 'Matriculefisacl' : language === 'en' ? 'Tax Identification Number' : "الرقم الجبائي"}:</strong> 1867411P/A/M/000
  </Typography>
</Box>

</Box>


        <Typography variant="h5" mb={3} textAlign="center">
          {language === 'fr' ? 'Bon De Livraison' : language === 'en' ? 'Order Form' : 'نموذج الطلب'} - {num}
        </Typography>

        {/* Table */}
        <Table sx={{
  border: '1px solid #ccc',
  borderRadius: 2,
  mt: 2,
  overflowX: 'auto',
  '@media print': {
    '& .MuiTableCell-root': {
      fontSize: '0.65rem !important',
      padding: '4px 6px !important',
      lineHeight: '1.2 !important'
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontSize: '0.7rem !important',
      fontWeight: 'bold !important'
    }
  }
}}>         
          <TableHead>
           <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Designation' : language === 'en' ? 'Designation' : 'التسمية'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Unite' : language === 'en' ? 'Unit' : 'وحدة'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Quantité' : language === 'en' ? 'Quantity' : 'الكمية'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Prix U (HT)' : language === 'en' ? 'Unit Price(HT)' : 'سعر الوحدة(بدون TVA)'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'TVA (%)' : language === 'en' ? 'VAT(%)' : 'ضريبة القيمة المضافة(%)'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Rem (%)' : language === 'en' ? 'Discount(%)' : 'خصم(%)'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Total NET HT' : language === 'en' ? 'Total NET HT' : 'إجمالي قبل الضريبة'}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{language === 'fr' ? 'Total TTC' : language === 'en' ? 'Total TTC' : 'إجمالي  الضريبة'}</TableCell>

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
  <TableRow
                   key={index}
                   sx={{
                     backgroundColor: 'white',
                     '@media print': {
                       '& .MuiTableCell-root': {
                         fontSize: '0.65rem !important'
                       }
                     }
                   }}
                 >       
         <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.designation}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.Unite}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.quantite}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.prixU_HT}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.tva}%</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.rem}%</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{netHT.toFixed(3)}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{netTTC.toFixed(3)}</TableCell>
      </TableRow>
    );
  })}
</TableBody>
        </Table>

        {/* Totals Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 , direction: language === 'ar' ? 'rtl' : 'ltr' }}>

          <Box sx={{
                   
                   border: '1px solid',
                   borderColor: 'grey.400', 
                  borderRadius: 2,
                  p: 2, display: 'flex', flexDirection: 'column', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>

            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body1"><strong>{language === 'fr' ? 'Total HT' : language === 'en' ? 'Total HT' : 'الإجمالي قبل الضريبة'}:</strong> {totalHT.toFixed(3)} TND</Typography>
            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body1" >
                  <strong>{language === 'fr' ? 'Remise Totale' : language === 'en' ? 'Total Discount' : 'إجمالي الخصم'}:</strong> {totalRemise.toFixed(3)} TND
           </Typography>

              <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body1" >
                  <strong>{language === 'fr' ? ' Totale Net HT ' : language === 'en' ? 'Total Net HT' : 'إجمالي الخصم'}:</strong> {totalnetht.toFixed(3)} TND
            </Typography>

            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body1"><strong>{language === 'fr' ? 'Total TVA' : language === 'en' ? 'Total VAT' : 'إجمالي ضريبة القيمة المضافة'}:</strong> {totalTVA.toFixed(3)} TND</Typography>
            

            {timbre === 'true' && (
            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body1">
              <strong>{language === 'fr' ? 'Timbre' : language === 'en' ? 'Stamp' : 'طابع'}:</strong> 1 TND
              </Typography>          
              )}

            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body1"><strong>{language === 'fr' ? 'Total TTC' : language === 'en' ? 'Total TTC' : 'الإجمالي شامل'}:</strong> {totalNetTTC.toFixed(3)} TND</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
    {language === 'fr' && `Montant en lettres : ${totalNetTTCInWords.toUpperCase()} DINARS`}
    {language === 'en' && `Amount in words: ${totalNetTTCInWords.toUpperCase()} DINARS`}
    {language === 'ar' && `المبلغ بالحروف: ${totalNetTTCInWords.toUpperCase()} دينار`}
  </Typography>
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

      </div>

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
