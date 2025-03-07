import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

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
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <HomeIcon /> },
    { label: 'Produit', path: '/produit', icon: <InventoryIcon /> },
    { label: 'Stock', path: '/stock', icon: <InventoryIcon /> },
    { label: 'Fournisseur', path: '/fournisseur', icon: <PeopleIcon /> },
    { label: 'Client', path: '/client', icon: <PersonIcon /> },
    { label: 'Bon de Sortie', path: '/bon-livraison', icon: <ExitToAppIcon /> },
    { label: 'Facture d’Achat', path: '/bon-dachat', icon: <ShoppingCartIcon /> },
    { label: 'Bon de Commande', path: '/bon-commande', icon: <ReceiptIcon /> },
    { label: 'Bon de Livraison', path: '/bon-commandefacture', icon: <LocalShippingIcon /> },
  ];

  return (
    <Box sx={{ width: 270, height: '100vh', bgcolor: 'white', boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: 'white', color: 'black' }}>
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3237/3237447.png "
          alt="User Profile"
          sx={{ width: 70, height: 70, mb: 1, border: '3px solid white' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>NACEF KHALED</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>{getCurrentDate()}</Typography>
      </Box>

      {/* Menu List */}
      <List sx={{ flexGrow: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            button
            component={Link}
            to={item.path}
            sx={{
              borderRadius: '8px',
              mb: 1,
              '&:hover': { bgcolor: '#1976d2', color: 'white' },
              transition: '0.3s'
              
            }}
          >
            <ListItemIcon sx={{ color: '#1976d2', minWidth: 40 , '&:hover': { color: 'white' }}}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ fontWeight: 'bold',color:"black" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SidebarMenu;
