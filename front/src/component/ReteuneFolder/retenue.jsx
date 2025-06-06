import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Select, MenuItem } from '@mui/material';
import './cssba.css';
import logo from '../../assets/amounnet.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const Reteune = () => {
  const { code, supplierId, codey, timbre,num} = useParams();
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
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/suplier/getidsuppliers/${supplierId}`);
        const productRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/bonachat/stock/getallstockdelv/${code}`);
        setSupplier(supplierRes.data);
        setDeliveryNote(productRes.data);
      } catch (err) {
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code, supplierId]);

  const totalNetHT = deliveryNote.reduce((acc, prod) => acc + (prod.prixU_HT * prod.quantite), 0);
  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100 || 0);
  let totalNetTTC = totalNetHT + totalTVA;
  if (timbre === 'true') totalNetTTC += 1;
  const retention = totalNetTTC * 0.01;
  const netAmount = totalNetTTC - retention;

  const translations = {
    fr: {
      title: "Certificat de Retenue d'Impôt sur le Revenu ou d'Impôt sur les Sociétés",
      payer: "Payeur/Organisme Payeur",
      beneficiary: "Bénéficiaire",
      totalTTC: "Total TTC",
      retention: "Retenue à la source (1%)",
      netAmount: "Montant Net",
      statement: "Je soussigné, certifie l'exactitude des renseignements figurant sur le présent certificat et m'expose aux sanctions prévues par la loi en cas d'inexactitude. Fait à Tunis le",
      companyName: "AMOUNNET COMPANY EXPORT ET IMPORT",
      address: "RUE DU LAC TOBA BERGES DU LAC1053 TUNIS",
      phone: "+987654321",
      matricule: "Matricule Fiscal",
    },
    ar: {
      title: "شهادة اقتطاع ضريبة الدخل أو ضريبة الشركات",
      payer: "الدفاع/ الجهة الدافعة",
      beneficiary: "المستفيد",
      totalTTC: "المجموع شامل الضريبة",
      retention: "الاقتطاع في المنبع (1%)",
      netAmount: "المبلغ الصافي",
      statement: "أنا الموقع أدناه، أقر بصحة المعلومات الواردة في هذه الشهادة وأخضع نفسي للعقوبات المنصوص عليها قانونا في حالة وجود أي خطأ. حرر بتونس في",
      companyName: "شركة أموانت",
      address: "مدينة واحات",
      phone: "+987654321",
      matricule: "الرقم الجبائي",
    },
    en: {
      title: "Tax Withholding Certificate (Income Tax or Corporate Tax)",
      payer: "Payer/Paying Organization",
      beneficiary: "Beneficiary",
      totalTTC: "Total TTC",
      retention: "Withholding Tax (1%)",
      netAmount: "Net Amount",
      statement: "I, the undersigned, certify the accuracy of the information contained in this certificate and subject myself to legal penalties in case of any inaccuracy. Issued in Tunis on",
      companyName: "Amounette Company",
      address: "Cité Wahat",
      phone: "+987654321",
      matricule: "Tax ID",
    }
  };

  const displayDate = () => new Date().toLocaleDateString('fr-FR');


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
    pdfClone.style.fontSize = '50%'; // Reduce text size by 10%
    document.body.appendChild(pdfClone);
    
    try {
      const canvas = await html2canvas(pdfClone, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 210 * 3.78,
        windowHeight: 297 * 3.78
      });
  
      document.body.removeChild(pdfClone); // Remove the clone after capturing
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
  
      const imgProps = pdf.getImageProperties(imgData);
      const pageWidth = pdf.internal.pageSize.getWidth() - 10; // 5mm each side
      const pageHeight = (imgProps.height * pageWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 5, 5, pageWidth, pageHeight);
      pdf.save(`invoice-${id}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      document.body.removeChild(pdfClone);
    }
  };


  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Button variant="contained" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>Print</Button>
      <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mb: 2, mr: 2 }}>
                    PDF
                  </Button>
      <Select value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ mb: 2 }}>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="ar">عربي</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>

      <div
      id="printable-content" sx={{ border: 1, p: 3, mt: 2, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
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
        {/* Payer Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6"><strong>{translations[language].payer}</strong></Typography>
          <Typography>{translations[language].companyName}</Typography>
          <Typography>{translations[language].address}</Typography>
          <Typography>{translations[language].phone}</Typography>
          <Typography>{translations[language].matricule}: 1867411P/A/M/000</Typography>
        </Box>

        {/* Beneficiary Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6"><strong>{translations[language].beneficiary}</strong></Typography>
          <Typography>{supplier.fullname}</Typography>
          <Typography>{supplier.address}</Typography>
          <Typography>{supplier.tel}</Typography>
          <Typography>{translations[language].matricule}: {supplier.matriculefisacl}</Typography>
        </Box>

        <Typography variant="h6" textAlign="center" sx={{ mb: 4 }}>
          {translations[language].title} - {num}
        </Typography>

        {/* Totals Table */}
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>{translations[language].totalTTC}</TableCell>
              <TableCell>{translations[language].retention}</TableCell>
              <TableCell>{translations[language].netAmount}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{totalNetTTC.toFixed(2)} TND</TableCell>
              <TableCell>{retention.toFixed(2)} TND</TableCell>
              <TableCell>{netAmount.toFixed(2)} TND</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Certification Statement */}
        <Typography variant="body2" textAlign="center" sx={{ mt: 6, mb: 4 }}>
          {translations[language].statement} {displayDate()}
        </Typography>

        {/* Signatures */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
          <Box>
            <Typography>_________________________</Typography>
            <Typography>{translations[language].payer}</Typography>
          </Box>
          <Box>
            <Typography>_________________________</Typography>
            <Typography>{translations[language].beneficiary}</Typography>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default Reteune;