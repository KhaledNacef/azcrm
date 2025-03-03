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
  CircularProgress
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
  const [loading, setLoading] = useState(false);

  // Fetch Clients
  useEffect(() => {
    axios
      .get('https://api.azcrm.deviceshopleader.com/api/clients/getclient')
      .then((response) => {
        setClientsCount(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching clients data:', error);
      });
  }, []);

  // Fetch Suppliers
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

  // Fetch Products
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://api.azcrm.deviceshopleader.com/api/stock/getall');
        setProductsCount(response.data.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchStock();
  }, []);

  // Simulate Data Refresh
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
        <Typography variant="h4">Dashboard</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color="textSecondary" mr={2}>
            Last updated: {dateTime}
          </Typography>
          <IconButton onClick={handleRefresh} disabled={loading} color="primary">
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Clients Count */}
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

        {/* Suppliers Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">Suppliers</Typography>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BusinessIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{suppliersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Products Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">Products</Typography>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <InventoryIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{productsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
