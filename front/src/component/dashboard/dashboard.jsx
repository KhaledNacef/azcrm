import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import moment from 'moment';

const Dashboard = () => {
  const [dateTime, setDateTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [totalBenefits, setTotalBenefits] = useState(12345);
  const [clientsCount, setClientsCount] = useState(0);
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]); // NOUVEL ÉTAT POUR LES PRODUITS EN STOCK BAS
  const [loading, setLoading] = useState(false);

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Récupérer les clients
  useEffect(() => {
    axios
      .get('https://api.azcrm.deviceshopleader.com/api/clients/getclient')
      .then((response) => {
        setClientsCount(response.data.length);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données des clients:', error);
      });
  }, []);

  // Récupérer les fournisseurs
  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/suplier/getsuppliers');
      setSuppliersCount(response.data.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des fournisseurs :", error);
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  // Récupérer les produits et stock bas
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/stock/getall');
        setProductsCount(response.data.length);

        // FILTRER LES PRODUITS AVEC QUANTITÉ ≤ 10
        const filteredProducts = response.data
          .filter(product => product.quantite <= 10)
          .sort((a, b) => a.quantite - b.quantite)
          .slice(0, 10);

        setLowStockProducts(filteredProducts);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchStock();
  }, []);

  // Simuler le rafraîchissement des données
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTotalBenefits(totalBenefits + Math.floor(Math.random() * 1000));
      setLoading(false);
    }, 1500);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tableau de bord</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color="textSecondary" mr={2}>
            Dernière mise à jour : {dateTime}
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading} color="primary">
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Nombre de clients */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">Clients</Typography>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{clientsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Nombre de fournisseurs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">Fournisseurs</Typography>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BusinessIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{suppliersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Nombre de produits */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">Produits</Typography>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <InventoryIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{productsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TABLEAU DES PRODUITS EN STOCK BAS */}
      <Box mt={5}>
        <Typography variant="h5" mb={2}>Produits en stock bas (quantité ≤ 10)</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom du produit</strong></TableCell>
                <TableCell><strong>Quantité</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.designation}</TableCell>
                    <TableCell>{product.quantite}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">Aucun produit en stock bas</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Dashboard;
