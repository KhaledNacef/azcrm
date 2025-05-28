import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import './fvdesign.css';
import CreateDeliveryNoteModal from '../vente/cratebl.jsx';
import logo from '../../assets/amounnet.png';
import n2words from 'n2words';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


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
    deliveryNote: "Delivery Note", // changed from "Facture"
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
    totaltva: "Total VAT",
    prixNetHT: "Total Price(HT)",
    prixNetTTC: "Net Price(TTC)",
  },
  fr: {
    timbre: "Timbre",
    tva: "T.V.A",
    prixNetU: "P Net U HT",
    totalNetHT: "Tot Net HT",
    totalNetTTC: "Tot Net TTC",
    companyName: "Nom de la société",
    companyAddress: "Adresse de la société",
    companyPhone: "Téléphone de la société",
    companyVAT: "Code TVA de la société",
    clientName: "Nom du Client",
    clientAddress: "Adresse du Client",
    clientPhone: "Téléphone du Client",
    clientFax: "Fax",
    deliveryNote: "Bon de livraison", // changed from "Facture"
    designation: "Designation",
    quantity: "Qte",
    unit: "Unité",
    unitPrice: "P U (HT)",
    netPrice: "P Net",
    totalNet: "Tot Net",
    clientSignature: "Signature du Client",
    companySignature: "Signature de la Société",
    date: "Date",
    print: "Imprimer",
    back: "Retour",
    matriculefisacl: "Matriculefisacl",
    remise: "Rem",
    totaltva: "Tot T.V.A",
    prixNetHT: "Tot Prix (HT)",
    prixNetTTC: "Tot Prix Net(TTC)",
  },
  ar: {
    timbre: "الطابع",
    companyName: "اسم الشركة",
    companyAddress: "عنوان الشركة",
    companyPhone: "هاتف الشركة",
    companyVAT: "الرقم الضريبي",
    clientName: "اسم العميل",
    clientAddress: "عنوان العميل",
    clientPhone: "هاتف العميل",
    clientFax: "فاكس",
    deliveryNote: "إذن صرف", // kept as-is for Arabic
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
    matriculefisacl: "الرقم الجبائي",
    remise: "خصم",
    tva: "الضريبة على القيمة المضافة",
    prixNetU: "السعر الصافي للوحدة دون ضريبة",
    totalNetHT: "المجموع الصافي دون ضريبة",
    totalNetTTC: "المجموع الصافي مع الضريبة",
    totaltva: "إجمالي ضريبة القيمة المضافة",
    prixNetHT: "السعر(بدون ضريبة)",
    prixNetTTC: "السعر الصافي(شاملة الضريبة)",
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
const formatAmountInWords = (amount, language, currency = 'TND') => {
  // Format the number with 3 decimal places
  const formattedAmount = amount.toFixed(3);
  const [wholePart, decimalPart] = formattedAmount.split('.');
  
  // Convert whole and decimal parts to words
  const wholeWords = n2words(wholePart, { 
    lang: language === 'ar' ? 'ar' : language 
  });
  const decimalWords = n2words(decimalPart, {
    lang: language === 'ar' ? 'ar' : language 
  });

  // Language-specific formatting
  let amountInWords;
  if (language === 'fr') {
    // French: "dinar" before virgule, "millimes" after
    amountInWords = `${wholeWords} dinar et ${decimalWords} millimes`;
  } else if (language === 'ar') {
    // Arabic: "دينار" before فاصلة, "مليم" after
    amountInWords = `${wholeWords} دينار و ${decimalWords} مليم`;
  } else {
    // English/default: "dinar" before point, "millimes" after
    amountInWords = `${wholeWords} dinar and ${decimalWords} millimes`;
  }

  return amountInWords;
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
 const formatCode = (id, dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    return `${id}/${year}`; // Only ID and year
  };


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
  
      pdf.save(`invoice-${id || 'document'}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      document.body.removeChild(pdfClone);
    }
  };
  
  function displayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const hasTVA = deliveryNote.some((prod) => prod.tva && prod.tva > 0);
  const hasRemise = deliveryNote.some((prod) => prod.rem && prod.rem > 0);
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        Retour
      </Button>

    <Button onClick={handlePrint} variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}>
      Imprimer
    </Button>
  <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mb: 2, mr: 2 }}>
          PDF
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

      <div
      id="printable-content"
     sx={{
    p: 3,
    backgroundColor: '#fff',
    direction: isArabic ? 'rtl' : 'ltr',
  
  }}
>

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
              objectFit: 'contain'

            }}
            className="print-logo"
          />
        </Box>

          <Box sx={{ 
         display: 'flex', 
         justifyContent: 'space-between', 
         mb: 2,
         flexDirection: isArabic ? 'row' : 'row',
         gap: 2 // Add space between the two boxes
       }}>
         <Box sx={{ 
           textAlign: isArabic ? 'right' : 'left',
           order: isArabic ? 2 : 1,
           flex: 1,
           border: '1px solid',
           borderColor: 'grey.400',
           borderRadius: 2,
           p: 2
         }}>
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
         </Box>
       
         <Box sx={{ 
           textAlign: isArabic ? 'right' : 'left',
           order: isArabic ? 1 : 2,
           flex: 1,
           border: '1px solid',
           borderColor: 'grey.400',
           borderRadius: 2,
           p: 2
         }}>
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
         </Box>
       </Box>

        <Typography variant="h5" mb={3} textAlign="center">
        {translations[printLanguage].deliveryNote}- {formatCode(id,datee)}
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
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].designation}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].quantity}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].unit}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].unitPrice} </TableCell>
                          {hasTVA &&<TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].tva}%</TableCell>}
                          {hasRemise &&<TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].remise}%</TableCell>}
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].prixNetU}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].totalNetHT}</TableCell>
                          <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc','@media print': {
          fontSize: '0.7rem !important',  // Slightly larger for headers
          fontWeight: 'bold !important'
        }  }}>{translations[printLanguage].totalNetTTC}</TableCell>
            
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
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{prod.designation}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{prod.quantite}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{prod.Unite}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{prod.prixU_HT.toFixed(3)} </TableCell>
                {hasTVA && <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{prod.tva}%</TableCell>}
                {hasRemise &&<TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{prod.rem}%</TableCell>}
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{priceAfterRemise.toFixed(3)}</TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{netHT.toFixed(3)} </TableCell>
                <TableCell sx={{ textAlign: isArabic ? 'right' : 'left', borderRight: '1px solid #ccc'  }}>{netTTC.toFixed(3)} </TableCell>
              </TableRow>
)})}
          </TableBody>
        </Table>

       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                     <Box sx={{ display: 'flex', 
                                      flexDirection: 'column',
                                       alignItems: 'flex-end',
                                       border: '1px solid',
                                       borderColor: 'grey.400', 
                                      borderRadius: 2,
                                      p: 2 }}>
                        <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
                          <strong>{translations[printLanguage].prixNetHT}:</strong> {totalHT.toFixed(3)}TND
                        </Typography>
                        {hasRemise && 
                        <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2" >
                              <strong>{printLanguage === 'fr' ? 'Remise Totale' : printLanguage === 'en' ? 'Total Discount' : 'إجمالي الخصم'}:</strong> {totalRemise.toFixed(3)} {devise}
                        </Typography>}
                        <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2" >
                              <strong>{printLanguage === 'fr' ? ' Totale Net HT ' : printLanguage === 'en' ? 'Total Net HT' : 'إجمالي الخصم'}:</strong> {totalnetht.toFixed(3)} {devise}
                        </Typography>
                        {hasTVA &&
                        <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
                          <strong>{translations[printLanguage].totaltva}:</strong> {totalTVA.toFixed(3)}{devise}
                        </Typography>}
                        {timbre === 'true' && (
                          <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
                            <strong>{translations[printLanguage].timbre}:</strong> 1TND
                          </Typography>
                        )}
                        <Typography sx={{borderBottom:'1px solid #ccc'}} variant="body2">
                          <strong>{translations[printLanguage].prixNetTTC}:</strong> {totalNetTTC.toFixed(3)}{devise}
                        </Typography>
                      </Box>
                    </Box>
                     <Box sx={{ mt: 5, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                               {formatAmountInWords(totalNetTTC,printLanguage)}

                      </Typography>
                    </Box>
                       <Box sx={{ mt: 5, textAlign: 'center' }}>
                                        {displayDate()}
                            
                            </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          flexDirection: isArabic ? 'row-reverse' : 'row'
        }}>
          <Box sx={{ textAlign: isArabic ? 'right' : 'left' }}>
            <Typography variant="body2">{translations[printLanguage].clientSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: isArabic ? 'left' : 'right' }}>
            <Typography variant="body2">{translations[printLanguage].companySignature}</Typography>
          </Box>
        </Box>
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
          <CreateDeliveryNoteModal onAddDeliveryNote={addDeliveryNote} codey={codey} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Bvsinlge;