import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const SidebarMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <HomeIcon /> },
    { label: 'Produit', path: '/produit', icon: <InventoryIcon /> },
    { label: 'Stock', path: '/stock', icon: <InventoryIcon /> },
    { label: 'Fournisseur', path: '/fournisseur', icon: <PeopleIcon /> },
    { label: 'Client', path: '/client', icon: <PersonIcon /> },
    { label: 'Bon de Commande', path: '/bon-commande', icon: <ReceiptIcon /> },
    { label: 'Facture d'Achat', path: '/bon-dachat', icon: <ShoppingCartIcon /> },
    { label: 'Bon de Livraison', path: '/bon-commandefacture', icon: <LocalShippingIcon /> },
    { label: 'Bon de Sortie', path: '/bon-livraison', icon: <ExitToAppIcon /> },
    { label: 'Retenue', path: '/RET1', icon: <AttachMoneyIcon /> },
  ];

  return (
    <Box sx={{ 
      width: 270, 
      height: '100vh', 
      bgcolor: '#242c44', 
      boxShadow: 3, 
      display: 'flex', 
      flexDirection: 'column',
      color: 'white'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3, 
        bgcolor: '#1a2035', 
        color: 'white',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3237/3237447.png"
          alt="User Profile"
          sx={{ 
            width: 70, 
            height: 70, 
            mb: 1, 
            border: '3px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: '#3f51b5'
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>NACEF KHALED</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, color: 'rgba(255, 255, 255, 0.7)' }}>{getCurrentDate()}</Typography>
      </Box>

      {/* Menu List */}
      <List sx={{ 
        flexGrow: 1, 
        p: 2,
        '& .MuiListItemIcon-root': {
          color: 'inherit'
        }
      }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem
              key={item.label}
              button
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '6px',
                mb: 1,
                bgcolor: isActive ? 'rgba(25, 118, 210, 0.8)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                '&:hover': { 
                  bgcolor: isActive ? 'rgba(25, 118, 210, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                },
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '4px solid #1976d2' : '4px solid transparent',
                '& .MuiListItemText-primary': {
                  fontWeight: isActive ? '600' : '500'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1.25rem'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem'
                  }
                }} 
              />
            </ListItem>
          );
        })}

        {/* Logout Button */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: '6px',
            mt: 'auto',
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            color: 'rgba(244, 67, 54, 0.7)',
            '&:hover': { 
              bgcolor: 'rgba(244, 67, 54, 0.2)',
              color: 'rgb(244, 67, 54)'
            },
            transition: 'all 0.2s ease',
            '& .MuiListItemText-primary': {
              fontWeight: '500'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarMenu;