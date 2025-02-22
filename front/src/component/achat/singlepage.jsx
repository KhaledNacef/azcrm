import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import './cssba.css';

const SingleDeliveryNote = () => {
  const { code, supplierId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [supplier, setSupplier] = useState({});
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/suplier/getidsuppliers/${supplierId}`);
        const productRes = await axios.get(`https://api.azcrm.deviceshopleader.com/api/bonachat/stock/getallstockdelv/${code}`);

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

  const totalNetHT = deliveryNote.reduce(
    (acc, prod) => acc + prod.prixU_HT * prod.quantite,
    0
  );
  const totalTVA = totalNetHT * (deliveryNote[0]?.tva / 100);
  const totalNetTTC = totalNetHT + totalTVA;

  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(content.outerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      deliveryNote.map((product) => ({
        "Produit": product.designation,
        "Unité": product.Unite,
        "TVA (%)": product.tva,
        "Prix U HT": product.prixU_HT,
        "Quantité": product.quantite
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Delivery Note');
    XLSX.writeFile(wb, 'Delivery_Note.xlsx');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retour
      </Button>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mb: 2, ml: 2 }}>
        Imprimer
      </Button>
      <Button variant="contained" color="secondary" onClick={handleExportExcel} sx={{ mb: 2, ml: 2 }}>
        Exporter en Excel
      </Button>

      {/* Content to print */}
      <Box ref={printRef} id="printContent" sx={{ border: '1px solid #ccc', p: 3, mt: 2, backgroundColor: '#fff', boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* Company Info (Left Side) */}
          <Box sx={{ textAlign: 'left', flex: 1 }}>
            <img
              src="https://pandp.tn/wp-content/uploads/2023/11/logo-pandp-shop-dark-bold1.png"
              alt="Logo de Ma Société"
              style={{ width: 120, marginBottom: 8 }}
            />
            <Typography variant="h6"><strong>Amounette Company</strong></Typography>
            <Typography variant="body2">Adresse: Adresse de Ma Société</Typography>
            <Typography variant="body2">Téléphone: +987654321</Typography>
            <Typography variant="body2">Email: khaledncf0@gmail.Com</Typography>
            <Typography variant="body2">Code TVA: 1564/645</Typography>
          </Box>

          {/* Supplier Info (Right Side) */}
          <Box sx={{ textAlign: 'right', flex: 1 }}>
            <Typography variant="h6"><strong>{supplier?.fullname}</strong></Typography>
            <Typography variant="body2">{supplier?.address}, {supplier?.ville}, {supplier?.pays}</Typography>
            <Typography variant="body2">Téléphone: {supplier?.tel}</Typography>
            <Typography variant="body2">Code TVA: {supplier?.codeTVA}</Typography>
          </Box>
        </Box>

        {/* Centered Title */}
        <Typography variant="h5" marginTop={3} sx={{ textAlign: 'center' }}>
          Détails du Bon de Livraison {code}
        </Typography>

        {/* Products Table */}
        <Table sx={{ marginTop: 2, width: '100%', borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>Produit</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>Unité</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>TVA (%)</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>Prix U HT</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryNote.map((product, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{product.designation}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{product.Unite}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{product.tva}%</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{product.prixU_HT} TND</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{product.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography><strong>Total HT:</strong> {totalNetHT.toFixed(2)} TND</Typography>
          <Typography><strong>TVA:</strong> {totalTVA.toFixed(2)} TND</Typography>
          <Typography><strong>Total TTC:</strong> {totalNetTTC.toFixed(2)} TND</Typography>
        </Box>
      </Box>
      
      {/* Signatures */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">Signature du Fournisseur</Typography>
          <img
            src="path/to/supplier/signature.png"
            alt="Signature du fournisseur"
            style={{ width: 150, marginTop: 10 }}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">Signature de Ma Société</Typography>
          <img
            src="path/to/company/signature.png"
            alt="Signature de la société"
            style={{ width: 150, marginTop: 10 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDeliveryNote;
