import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Modal } from '@mui/material';
import './fdesign.css';
import CreateDeliveryNoteModala from '../achat/crate.jsx'; // Ensure correct file name
import logo from '../../assets/amounnet.png';  // Relative path

const BCsingleACHAT = () => {
  const { code, supplierId, codey, timbre } = useParams();  // 'timbre' from URL params
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousLocation = window.location.pathname;

  const [open, setOpen] = useState(false);

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

  const timbreAmount = timbre === 'true' ? 1 : 0;  // If timbre is true, add 1 TND
  const totalWithTimbre = totalNetTTC + timbreAmount;  // Add timbre to total net TTC

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

    // Replace the body content with printable content
    document.body.innerHTML = printContents;

    // Trigger the print dialog
    window.print();

    // After printing is done, restore the original content and navigate back
    window.onafterprint = () => {
      document.body.innerHTML = originalContents; // Restore original page content
      navigate(previousLocation); // Navigate back to the previous page
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

      {/* Printable content */}
      <Box
        ref={printRef}
        sx={{
          border: '1px solid #ccc',
          p: 3,
          mt: 2,
          backgroundColor: '#fff',
        }}
      >
        {/* Add style for print */}
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
          <Box sx={{ width: 794, height: 152, mb: 3, overflow: 'hidden' }}>
                 <img
                   src={logo}
                   alt="Company Logo"
                   style={{ 
                     width: '100%',
                     height: '100%',
                     objectFit: 'cover' // This will ensure the image fills the container
                   }}
                 />
               </Box>
        {/* Company and Supplier Information with Labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Company Information (Left Column) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1"><strong>Nom de la société:</strong> Amounette Compnay</Typography>
            <Typography variant="body1"><strong>Adresse de la société:</strong> cité wahat</Typography>
            <Typography variant="body1"><strong>Téléphone de la société:</strong> +987654321</Typography>
            <Typography variant="body1"><strong>Code TVA de la société:</strong> TVA123456789</Typography>
          </Box>

          {/* Supplier Information (Right Column) */}
          <Typography>{displayDate()}</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginLeft: '30%' }}>
            <Typography variant="body1"><strong>Nom du fournisseur:</strong> {supplier.fullname}</Typography>
            <Typography variant="body1"><strong>Adresse du fournisseur:</strong> {supplier?.address || 'Adresse inconnue'}</Typography>
            <Typography variant="body1"><strong>Téléphone du fournisseur:</strong> {supplier?.tel || 'Numéro inconnu'}</Typography>
            <Typography variant="body1"><strong>Code TVA:</strong> {supplier?.codeTVA || 'codeTVA inconnu'}</Typography>
          </Box>
        </Box>

        <Typography variant="h4" mb={3} textAlign="center">
          Bon De Commande - {codey}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Designation</TableCell>
              <TableCell>Unite</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Prix U (HT)</TableCell>
              <TableCell>TVA (%)</TableCell>
              <TableCell>Rem (%)</TableCell>
              <TableCell>Prix Net (HT)</TableCell>
              <TableCell>Prix Net (TTC)</TableCell>
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
                  <TableCell>{prod.prixU_HT}TND</TableCell>
                  <TableCell>{prod.tva}%</TableCell>
                  <TableCell>{prod.rem}%</TableCell>
                  <TableCell>{netHT.toFixed(2)}TND</TableCell>
                  <TableCell>{netTTC.toFixed(2)}TND</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Total Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
    <Typography variant="body1">
      <strong>Total Net (HT):</strong> {totalNetHT.toFixed(2)} TND
    </Typography>
    <Typography variant="body1">
      <strong>Total TVA:</strong> {totalTVA.toFixed(2)} TND
    </Typography>

    {/* Show Timbre only if it's true */}
    {timbre === 'true' && (
      <Typography variant="body1">
        <strong>Timbre:</strong> 1 TND
      </Typography>
    )}

    <Typography variant="body1">
      <strong>Total Net (TTC):</strong> {totalWithTimbre.toFixed(2)} TND
    </Typography>
  </Box>
</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">Signature du Fournisseur</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">Signature de Ma Société</Typography>
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
