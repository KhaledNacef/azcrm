import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  ArrowUpward as ArrowUpwardIcon, 
  ArrowDownward as ArrowDownwardIcon,
  Refresh as RefreshIcon,
  ShoppingCart as OrderIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { Chart } from 'react-google-charts';
import moment from 'moment';
import Grid from '@mui/material/Grid2';

const Dashboard = () => {
  const [dateTime, setDateTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [totalBenefits, setTotalBenefits] = useState(12345);
  const [clientsCount, setClientsCount] = useState(120);
  const [suppliersCount, setSuppliersCount] = useState(35);
  const [productsCount, setProductsCount] = useState(245);
  const [loading, setLoading] = useState(false);
  
  // Recent orders data (sample)
  const recentOrders = [
    { id: 'ORD-001', client: 'ABC Company', amount: 1200, date: '2023-10-15' },
    { id: 'ORD-002', client: 'XYZ Corp', amount: 850, date: '2023-10-14' },
    { id: 'ORD-003', client: 'Global Enterprises', amount: 2100, date: '2023-10-13' },
  ];

  // Update date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate data refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate updated data
      setTotalBenefits(totalBenefits + Math.floor(Math.random() * 1000));
      setClientsCount(clientsCount + Math.floor(Math.random() * 5));
      setSuppliersCount(suppliersCount + Math.floor(Math.random() * 2));
      setProductsCount(productsCount + Math.floor(Math.random() * 10));
      setLoading(false);
    }, 1500);
  };

  // Enhanced chart data
  const revenueData = [
    ['Month', 'Revenue', 'Expenses', 'Profit'],
    ['Jan', 10000, 4000, 6000],
    ['Feb', 11700, 4600, 7100],
    ['Mar', 6600, 11200, -4600],
    ['Apr', 10300, 5400, 4900],
    ['May', 14800, 5200, 9600],
    ['Jun', 12000, 6000, 6000],
  ];

  const revenueChartOptions = {
    title: 'Financial Overview',
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: { title: 'Month' },
    vAxis: { title: 'Amount ($)' },
    colors: ['#4285F4', '#DB4437', '#0F9D58'],
  };

  // Product categories data
  const productCategoriesData = [
    ['Category', 'Count'],
    ['Electronics', 85],
    ['Furniture', 45],
    ['Office Supplies', 65],
    ['Other', 50],
  ];

  const productCategoriesOptions = {
    title: 'Product Categories',
    pieHole: 0.4,
    colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'],
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color="textSecondary" mr={2}>
            Last updated: {dateTime}
          </Typography>
          <IconButton 
            onClick={handleRefresh} 
            disabled={loading}
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Benefits
                </Typography>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ArrowUpwardIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">${totalBenefits.toLocaleString()}</Typography>
              <Typography variant="body2" color="success.main">
                +5.3% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">
                  Clients
                </Typography>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{clientsCount}</Typography>
              <Typography variant="body2" color="info.main">
                +2.7% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">
                  Suppliers
                </Typography>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BusinessIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{suppliersCount}</Typography>
              <Typography variant="body2" color="warning.main">
                +1.2% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" color="textSecondary">
                  Products
                </Typography>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <InventoryIcon />
                </Avatar>
              </Box>
              <Typography variant="h4">{productsCount}</Typography>
              <Typography variant="body2" color="error.main">
                +4.1% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Chart
              chartType="ComboChart"
              width="100%"
              height="400px"
              data={revenueData}
              options={revenueChartOptions}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <Chart
              chartType="PieChart"
              width="100%"
              height="100%"
              data={productCategoriesData}
              options={productCategoriesOptions}
            />
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <OrderIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {order.id} - {order.client}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" color="textSecondary">
                            {moment(order.date).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            component="span" 
                            color="primary"
                            sx={{ float: 'right' }}
                          >
                            ${order.amount.toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Stock Alert */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alert
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'error.light', width: 32, height: 32 }}>
                    <ArrowDownwardIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle2">Printer Paper A4</Typography>}
                  secondary="Only 5 units left in stock"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'error.light', width: 32, height: 32 }}>
                    <ArrowDownwardIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle2">HP Ink Cartridge #304</Typography>}
                  secondary="Only 2 units left in stock"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'warning.light', width: 32, height: 32 }}>
                    <ArrowDownwardIcon fontSize="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle2">Office Chairs - Executive</Typography>}
                  secondary="Only 8 units left in stock"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;