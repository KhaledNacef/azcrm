import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import './fvdesign.css';
import CreateDeliveryNoteModal from '../vente/cratebl.jsx';
import logo from '../../assets/amounnet.png';

const Bvsinlge = () => {
  const { code, clientId, codey, devise } = useParams();
  const printRef = useRef();
  const navigate = useNavigate();

  const [client, setClient] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  
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
    const fetchClientData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/clients/getclietn/${clientId}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetchDeliveryNoteData = async () => {
      try {
        const response = await fetch(`https://api.azcrm.deviceshopleader.com/api/bonlivraison/facturev/${code}`);
        const data = await response.json();
        setDeliveryNote(data);
      } catch (error) {
        console.error('Error fetching delivery note data:', error);
      }
    };

    fetchClientData();
    fetchDeliveryNoteData();
  }, [code, clientId]);

  const totalNettc = deliveryNote.reduce((acc, prod) => acc + (prod.prixU_HT || 0) * (prod.quantite || 0), 0) || 0;

  const handlePrint = () => {
    window.print();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const addDeliveryNote = () => handleClose();
  const handleLanguageChange = (event) => setLanguage(event.target.value);

  const isArabic = language === 'ar';

  return (
    <Box sx={{ p: 3 }} dir={isArabic ? 'rtl' : 'ltr'}>
      <Box sx={{ mb: 2 }}>
        <Select value={language} onChange={handleLanguageChange} displayEmpty>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </Box>

      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, mr: 2 }}>
        {isArabic ? 'رجوع' : language === 'fr' ? 'Retour' : 'Back'}
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, mr: 2 }}>
        {isArabic ? 'طباعة' : language === 'fr' ? 'Imprimer' : 'Print'}
      </Button>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mr: 2 }}>
        {isArabic ? 'إنشاء مذكرة تسليم' : language === 'fr' ? 'Créer un Bon de Livraison' : 'Create Delivery Note'}
      </Button>
      <Button variant="outlined" onClick={() => navigate(`/gestionv/${codey}`)} sx={{ mb: 2 }}>
        {isArabic ? 'إدارة المخزون' : language === 'fr' ? 'Gestion De Stock' : 'Stock Management'}
      </Button>

      {/* Printable Section */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
        }}
      >
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

        <Box
          sx={{
            width: 742,
            height: 152,
            mx: 'auto',
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={logo}
            alt="Company Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
            flexDirection: isArabic ? 'row-reverse' : 'row',
          }}
        >
          {/* Company Info */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              <strong>{isArabic ? 'اسم الشركة:' : language === 'fr' ? 'Nom de la société:' : 'Company Name:'}</strong> Amounette Company
            </Typography>
            <Typography>
              <strong>{isArabic ? 'عنوان الشركة:' : language === 'fr' ? 'Adresse de la société:' : 'Company Address:'}</strong> cité wahat
            </Typography>
            <Typography>
              <strong>{isArabic ? 'هاتف الشركة:' : language === 'fr' ? 'Téléphone de la société:' : 'Company Phone:'}</strong> +987654321
            </Typography>
          </Box>

          {/* Client Info */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              <strong>{isArabic ? 'اسم المورد:' : language === 'fr' ? 'Nom du fournisseur:' : 'Supplier Name:'}</strong> {client.name || ''}
            </Typography>
            <Typography>
              <strong>{isArabic ? 'العنوان:' : language === 'fr' ? 'Adresse:' : 'Address:'}</strong> {client.adresse || ''}
            </Typography>
            <Typography>
              <strong>{isArabic ? 'الهاتف:' : language === 'fr' ? 'Téléphone:' : 'Phone:'}</strong> {client.tel || ''}
            </Typography>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{isArabic ? 'المنتج' : language === 'fr' ? 'Produit' : 'Product'}</TableCell>
              <TableCell>{isArabic ? 'الكمية' : language === 'fr' ? 'Quantité' : 'Quantity'}</TableCell>
              <TableCell>{isArabic ? 'السعر للوحدة' : language === 'fr' ? 'Prix unitaire' : 'Unit Price'}</TableCell>
              <TableCell>{isArabic ? 'الإجمالي' : language === 'fr' ? 'Total' : 'Total'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.designation}</TableCell>
                <TableCell>{product.quantite}</TableCell>
                <TableCell>{product.prixU_HT}</TableCell>
                <TableCell>{(product.prixU_HT * product.quantite).toFixed(2)} {devise}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <strong>{isArabic ? 'المجموع:' : language === 'fr' ? 'Total:' : 'Total:'}</strong>
              </TableCell>
              <TableCell>
                <strong>{totalNettc.toFixed(2)} {devise}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
  <Box sx={{ textAlign: 'center', minHeight: 80 }}>
    <Typography variant="body2">{translations[language].signatureFournisseur}</Typography>
  </Box>
  <Box sx={{ textAlign: 'center', minHeight: 80 }}>
    <Typography variant="body2">{translations[language].signatureSociete}</Typography>
  </Box>
</Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box>
          <CreateDeliveryNoteModal addDeliveryNote={addDeliveryNote} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Bvsinlge;
