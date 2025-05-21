import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Select, MenuItem } from '@mui/material';
import './cssba.css';
import n2words from 'n2words';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const SingleDeliveryNote = () => {
  const { code, supplierId, codey, timbre,num } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('fr');  // Default language is French

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
const formatAmountInWords = (amount, language, currency = 'TND') => {
  // Format the number with 3 decimal places
  const formattedAmount = amount.toFixed(3);
  
  // Convert to words based on language
  let amountInWords = n2words(formattedAmount, { 
    lang: language === 'ar' ? 'ar' : language 
  });

  // Language-specific formatting
  if (language === 'fr') {
    // French: replace "virgule" with "et"
    amountInWords = amountInWords.replace('virgule', 'et');
  } else if (language === 'ar') {
    // Arabic: ensure "و" is used for decimals
    amountInWords = amountInWords.replace(/،/g, ' و');
  }

  // Add currency
  const currencies = {
    fr: `${amountInWords} dinars`, 
    ar: `${amountInWords} دينارا`,
    en: `${amountInWords} dinars`
  };

  return currencies[language] || `${amountInWords} ${currency}`;
};

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
   <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mb: 2, mr: 2 }}>
              PDF
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
{/* Supplier info (Always on the left) */}
<Box sx={{
  flex: 1,
  border: '1px solid',
  borderColor: 'grey.400',
  borderRadius: 2,
  p: 2,
  textAlign: language === 'ar' ? 'right' : 'left'
}}>
  <Typography variant="body2"><strong>{translations[language].supplierName}:</strong> {supplier.fullname}</Typography>
  <Typography variant="body2"><strong>{translations[language].supplierAddress}:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
  <Typography variant="body2"><strong>{translations[language].supplierPhone}:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
  <Typography variant="body2"><strong>{translations[language].matriculefisacl}:</strong> {supplier?.matriculefisacl || 'Matriculefisacl inconnu'}</Typography>
</Box>

{/* Company info (Always on the right) */}
<Box sx={{
 flex: 1,
 border: '1px solid',
 borderColor: 'grey.400',
 borderRadius: 2,
 p: 2,
  textAlign: language === 'ar' ? 'right' : 'left'
}}>
  <Typography variant="body2"><strong>{translations[language].companyName}:</strong> AMOUNNET COMPANY EXPORT ET IMPORT</Typography>
  <Typography variant="body2"><strong>{translations[language].companyAddress}:</strong> RUE DU LAC TOBA BERGES DU LAC1053 TUNIS</Typography>
  <Typography variant="body2"><strong>{translations[language].companyPhone}:</strong> +987654321</Typography>
  <Typography variant="body2"><strong>{translations[language].matriculefisacl}:</strong> 1867411P/A/M/000</Typography>
</Box>

</Box>

        <Typography variant="h5" mb={3} textAlign="center">
          {translations[language].bonDeAchat} - {num}
        </Typography>

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
        } }} >{translations[language].designation}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].unite}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].quantite}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].prixUHT}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].tva}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].rem}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].prixNetHT}</TableCell>
              <TableCell sx={{ textAlign:language === 'ar' ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        } }} >{translations[language].prixNetTTC}</TableCell>
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
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.prixU_HT.toFixed(3)}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.tva}%</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{prod.rem}%</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{netHT.toFixed(3)}</TableCell>
        <TableCell sx={{ borderRight: '1px solid #ccc' }} >{netTTC.toFixed(3)}</TableCell>
      </TableRow>
    );
  })}
</TableBody>
        </Table>

        {/* Total Section - Moved to the Right Side */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 , direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        
                  <Box sx={{
                           
                           border: '1px solid',
                           borderColor: 'grey.400', 
                          borderRadius: 2,
                          p: 2, display: 'flex', flexDirection: 'column', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>


            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
              <strong>{translations[language].prixNetHT}:</strong> {totalHT.toFixed(3)}TND
            </Typography>
            
            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2" >
                  <strong>{language === 'fr' ? 'Remise Totale' : language === 'en' ? 'Total Discount' : 'إجمالي الخصم'}:</strong> {totalRemise.toFixed(3)} TND
            </Typography>
            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2" >
                  <strong>{language === 'fr' ? ' Totale Net HT ' : language === 'en' ? 'Total Net HT' : 'إجمالي الخصم'}:</strong> {totalnetht.toFixed(3)} TND
            </Typography>
            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
              <strong>{translations[language].totaltva}:</strong> {totalTVA.toFixed(3)}TND
            </Typography>
            {timbre === 'true' && (
              <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
                <strong>{translations[language].timbre}:</strong> 1TND
              </Typography>
            )}
            <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
              <strong>{translations[language].prixNetTTC}:</strong> {totalNetTTC.toFixed(3)}TND
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
    {formatAmountInWords(totalNetTTC,language)}
    
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
    </Box>
  );
};

export default SingleDeliveryNote;
