import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal, Select, MenuItem } from '@mui/material';
import './fdesign.css';
import CreateDeliveryNoteModala from '../achat/crate.jsx';
import logo from '../../assets/amounnet.png';

// Translation dictionary
const translations = {
  fr: {
    companyName: "Nom de la société",
    address: "Adresse",
    phone: "Téléphone",
    vatCode: "Code TVA",
    supplierName: "Nom du fournisseur",
    supplierAddress: "Adresse du fournisseur",
    supplierPhone: "Téléphone du fournisseur",
    orderTitle: "Bon De Commande",
    designation: "Designation",
    unit: "Unité",
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
    back: "Retour",
    print: "Imprimer",
    createOrder: "Créer un Bon D'ACHAT",
    stockManagement: "Gestion De Stock",
    language: "Langue"
  },
  en: {
    companyName: "Company Name",
    address: "Address",
    phone: "Phone",
    vatCode: "VAT Code",
    supplierName: "Supplier Name",
    supplierAddress: "Supplier Address",
    supplierPhone: "Supplier Phone",
    orderTitle: "Purchase Order",
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
    back: "Back",
    print: "Print",
    createOrder: "Create Purchase Order",
    stockManagement: "Stock Management",
    language: "Language"
  },
  ar: {
    companyName: "اسم الشركة",
    address: "العنوان",
    phone: "الهاتف",
    vatCode: "رمز الضريبة",
    supplierName: "اسم المورد",
    supplierAddress: "عنوان المورد",
    supplierPhone: "هاتف المورد",
    orderTitle: "أمر الشراء",
    designation: "التسمية",
    unit: "الوحدة",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة (HT)",
    vat: "الضريبة (%)",
    discount: "الخصم (%)",
    netPriceHT: "السعر الصافي (HT)",
    netPriceTTC: "السعر الصافي (TTC)",
    totalHT: "الإجمالي الصافي (HT)",
    totalVAT: "إجمالي الضريبة",
    stamp: "الطابع",
    totalTTC: "الإجمالي الصافي (TTC)",
    supplierSignature: "توقيع المورد",
    companySignature: "توقيع الشركة",
    back: "رجوع",
    print: "طباعة",
    createOrder: "إنشاء أمر شراء",
    stockManagement: "إدارة المخزون",
    language: "اللغة"
  }
};

const BCsingleACHAT = () => {
  const { code, supplierId, codey, timbre } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLang, setSelectedLang] = useState('fr');
  const previousLocation = window.location.pathname;
  const [open, setOpen] = useState(false);

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

  const totalNetHT = deliveryNote.reduce((acc, prod) => acc + (prod.prixU_HT * prod.quantite), 0);
  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100 || 0);
  const totalNetTTC = totalNetHT + totalTVA;
  const timbreAmount = timbre === 'true' ? 1 : 0;
  const totalWithTimbre = totalNetTTC + timbreAmount;

  const displayDate = () => new Date().toLocaleDateString(selectedLang === 'ar' ? 'ar-TN' : selectedLang);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          sx={{ width: 120 }}
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {translations[selectedLang].back}
        </Button>
        <Button variant="contained" onClick={handlePrint}>
          {translations[selectedLang].print}
        </Button>
        <Button variant="contained" onClick={() => setOpen(true)}>
          {translations[selectedLang].createOrder}
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/gestion/${codey}`)}>
          {translations[selectedLang].stockManagement}
        </Button>
      </Box>

      <Box ref={printRef} sx={{ direction: selectedLang === 'ar' ? 'rtl' : 'ltr' }}>
        <style>{`
          @media print {
            body { font-family: ${selectedLang === 'ar' ? 'Arial, sans-serif' : 'inherit'} !important; }
            .MuiTypography-root { font-size: 12px !important; }
            .no-print { display: none !important; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 4px; border: 1px solid #ddd; }
            .total-section { margin-top: 20px; }
          }
        `}</style>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src={logo} alt="Logo" style={{ width: 200 }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography><strong>{translations[selectedLang].companyName}:</strong> Amounette Company</Typography>
            <Typography><strong>{translations[selectedLang].address}:</strong> cité wahat</Typography>
            <Typography><strong>{translations[selectedLang].phone}:</strong> +987654321</Typography>
            <Typography><strong>{translations[selectedLang].vatCode}:</strong> TVA123456789</Typography>
          </Box>
          <Box>
            <Typography>{displayDate()}</Typography>
            <Typography><strong>{translations[selectedLang].supplierName}:</strong> {supplier.fullname}</Typography>
            <Typography><strong>{translations[selectedLang].supplierAddress}:</strong> {supplier.address}</Typography>
            <Typography><strong>{translations[selectedLang].supplierPhone}:</strong> {supplier.tel}</Typography>
            <Typography><strong>{translations[selectedLang].vatCode}:</strong> {supplier.codeTVA}</Typography>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
          {translations[selectedLang].orderTitle} - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translations[selectedLang].designation}</TableCell>
              <TableCell>{translations[selectedLang].unit}</TableCell>
              <TableCell>{translations[selectedLang].quantity}</TableCell>
              <TableCell>{translations[selectedLang].unitPrice}</TableCell>
              <TableCell>{translations[selectedLang].vat}</TableCell>
              <TableCell>{translations[selectedLang].discount}</TableCell>
              <TableCell>{translations[selectedLang].netPriceHT}</TableCell>
              <TableCell>{translations[selectedLang].netPriceTTC}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((prod, i) => (
              <TableRow key={i}>
                <TableCell>{prod.designation}</TableCell>
                <TableCell>{prod.Unite}</TableCell>
                <TableCell>{prod.quantite}</TableCell>
                <TableCell>{prod.prixU_HT}TND</TableCell>
                <TableCell>{prod.tva}%</TableCell>
                <TableCell>{prod.rem}%</TableCell>
                <TableCell>{(prod.prixU_HT * prod.quantite).toFixed(2)}TND</TableCell>
                <TableCell>{(prod.prixU_HT * prod.quantite * (1 + prod.tva / 100)).toFixed(2)}TND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography><strong>{translations[selectedLang].totalHT}:</strong> {totalNetHT.toFixed(2)}TND</Typography>
          <Typography><strong>{translations[selectedLang].totalVAT}:</strong> {totalTVA.toFixed(2)}TND</Typography>
          {timbre === 'true' && <Typography><strong>{translations[selectedLang].stamp}:</strong> 1TND</Typography>}
          <Typography><strong>{translations[selectedLang].totalTTC}:</strong> {totalWithTimbre.toFixed(2)}TND</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Typography>{translations[selectedLang].supplierSignature}</Typography>
          <Typography>{translations[selectedLang].companySignature}</Typography>
        </Box>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4 }}>
          <CreateDeliveryNoteModala onClose={() => setOpen(false)} codey={codey} />
        </Box>
      </Modal>
    </Box>
  );
};

export default BCsingleACHAT;