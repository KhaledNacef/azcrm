import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
  const [open, setOpen] = useState(false);
  const [printLanguage, setPrintLanguage] = useState('fr'); // Default to French

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

  // Translation dictionary with RTL support
  const translations = {
    fr: {
      dir: 'ltr',
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
      totalHT: "Total Net (HT)",
      totalVAT: "Total TVA",
      stamp: "Timbre",
      totalTTC: "Total Net (TTC)",
      supplierSignature: "Signature du Fournisseur",
      companySignature: "Signature de Ma Société",
      date: displayDate()
    },
    en: {
      dir: 'ltr',
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
      totalHT: "Total Net (HT)",
      totalVAT: "Total VAT",
      stamp: "Stamp",
      totalTTC: "Total Net (TTC)",
      supplierSignature: "Supplier Signature",
      companySignature: "Company Signature",
      date: displayDate()
    },
    ar: {
      dir: 'rtl',
      companyName: "اسم الشركة",
      companyAddress: "عنوان الشركة",
      companyPhone: "هاتف الشركة",
      companyVAT: "رمز ضريبة القيمة المضافة للشركة",
      supplierName: "اسم المورد",
      supplierAddress: "عنوان المورد",
      supplierPhone: "هاتف المورد",
      supplierVAT: "رمز ضريبة القيمة المضافة",
      title: "أمر الشراء",
      designation: "التعيين",
      unit: "الوحدة",
      quantity: "الكمية",
      unitPrice: "سعر الوحدة (HT)",
      vat: "ضريبة القيمة المضافة (%)",
      discount: "الخصم (%)",
      netPriceHT: "السعر الصافي (HT)",
      netPriceTTC: "السعر الصافي (TTC)",
      totalHT: "المجموع الصافي (HT)",
      totalVAT: "إجمالي ضريبة القيمة المضافة",
      stamp: "الطابع",
      totalTTC: "المجموع الصافي (TTC)",
      supplierSignature: "توقيع المورد",
      companySignature: "توقيع الشركة",
      date: displayDate()
    }
  };

  const t = translations[printLanguage];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContents = `
      <html dir="${t.dir}">
        <head>
          <title>${t.title} - ${codey}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              direction: ${t.dir};
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              width: 742px;
              height: 152px;
              margin: 0 auto 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }
            .logo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .info-container {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-section {
              flex: 1;
            }
            .info-section.rtl {
              text-align: right;
            }
            .title {
              text-align: center;
              margin-bottom: 20px;
              font-size: 24px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: ${t.dir === 'rtl' ? 'right' : 'left'};
            }
            th {
              background-color: #f2f2f2;
            }
            .totals {
              text-align: ${t.dir === 'rtl' ? 'left' : 'right'};
              margin-top: 20px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
            }
            .signature {
              text-align: center;
              width: 45%;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <img src="${window.location.origin}${logo}" alt="Company Logo" />
            </div>
          </div>

          <div class="info-container">
            <div class="info-section ${t.dir === 'rtl' ? 'rtl' : ''}">
              <p><strong>${t.companyName}:</strong> Amounette Company</p>
              <p><strong>${t.companyAddress}:</strong> cité wahat</p>
              <p><strong>${t.companyPhone}:</strong> +987654321</p>
              <p><strong>${t.companyVAT}:</strong> TVA123456789</p>
            </div>

            <div class="info-section ${t.dir === 'rtl' ? 'rtl' : ''}" style="margin-left: 30%;">
              <p><strong>${t.supplierName}:</strong> ${supplier.fullname || 'N/A'}</p>
              <p><strong>${t.supplierAddress}:</strong> ${supplier?.address || 'N/A'}</p>
              <p><strong>${t.supplierPhone}:</strong> ${supplier?.tel || 'N/A'}</p>
              <p><strong>${t.supplierVAT}:</strong> ${supplier?.codeTVA || 'N/A'}</p>
            </div>
            <p>${t.date}</p>
          </div>

          <h1 class="title">${t.title} - ${codey}</h1>

          <table>
            <thead>
              <tr>
                <th>${t.designation}</th>
                <th>${t.unit}</th>
                <th>${t.quantity}</th>
                <th>${t.unitPrice}</th>
                <th>${t.vat}</th>
                <th>${t.discount}</th>
                <th>${t.netPriceHT}</th>
                <th>${t.netPriceTTC}</th>
              </tr>
            </thead>
            <tbody>
              ${deliveryNote.map((prod, index) => {
                const basePrice = prod.prixU_HT;
                const netHT = basePrice * prod.quantite;
                const netTTC = netHT * (1 + prod.tva / 100);
                return `
                  <tr key="${index}">
                    <td>${prod.designation}</td>
                    <td>${prod.Unite}</td>
                    <td>${prod.quantite}</td>
                    <td>${prod.prixU_HT}TND</td>
                    <td>${prod.tva}%</td>
                    <td>${prod.rem}%</td>
                    <td>${netHT.toFixed(2)}TND</td>
                    <td>${netTTC.toFixed(2)}TND</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>${t.totalHT}:</strong> ${totalNetHT.toFixed(2)} TND</p>
            <p><strong>${t.totalVAT}:</strong> ${totalTVA.toFixed(2)} TND</p>
            ${timbre === 'true' ? `<p><strong>${t.stamp}:</strong> 1 TND</p>` : ''}
            <p><strong>${t.totalTTC}:</strong> ${totalWithTimbre.toFixed(2)} TND</p>
          </div>

          <div class="signatures">
            <div class="signature">
              <p>${t.supplierSignature}</p>
            </div>
            <div class="signature">
              <p>${t.companySignature}</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContents);
    printWindow.document.close();
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

      <FormControl sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel>Langue d'impression</InputLabel>
        <Select
          value={printLanguage}
          onChange={(e) => setPrintLanguage(e.target.value)}
          label="Langue d'impression"
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </FormControl>

      {/* Preview of printable content */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
          direction: t.dir
        }}
      >
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>
            <Typography variant="body1"><strong>{t.companyName}:</strong> Amounette Company</Typography>
            <Typography variant="body1"><strong>{t.companyAddress}:</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>{t.companyPhone}:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>{t.companyVAT}:</strong> TVA123456789</Typography>
          </Box>

          <Typography>{t.date}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%', textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>
            <Typography variant="body1"><strong>{t.supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>{t.supplierAddress}:</strong> {supplier?.address || 'N/A'}</Typography>
            <Typography variant="body1"><strong>{t.supplierPhone}:</strong> {supplier?.tel || 'N/A'}</Typography>
            <Typography variant="body1"><strong>{t.supplierVAT}:</strong> {supplier?.codeTVA || 'N/A'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          {t.title} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.designation}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.unit}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.quantity}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.unitPrice}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.vat}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.discount}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.netPriceHT}</TableCell>
              <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.netPriceTTC}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod, index) => {
              const basePrice = prod.prixU_HT;
              const netHT = basePrice * prod.quantite;
              const netTTC = netHT * (1 + prod.tva / 100);

              return (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{prod.designation}</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{prod.Unite}</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{prod.quantite}</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{prod.prixU_HT}TND</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{prod.tva}%</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{prod.rem}%</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{netHT.toFixed(2)}TND</TableCell>
                  <TableCell sx={{ textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{netTTC.toFixed(2)}TND</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1">
              <strong>{t.totalHT}:</strong> {totalNetHT.toFixed(2)} TND
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
              <strong>{t.totalTTC}:</strong> {totalWithTimbre.toFixed(2)} TND
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{t.supplierSignature}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">{t.companySignature}</Typography>
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
          <CreateDeliveryNoteModala onAddDeliveryNote={addDeliveryNote} codey={codey} />
        </Box>
      </Modal>
    </Box>
  );
};

export default BCsingleACHAT;