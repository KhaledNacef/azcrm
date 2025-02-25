import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Function to format the current date
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
    { label: 'dashboard', path: '/dashboard', icon: <HomeIcon /> },
    { label: 'Produit', path: '/produit', icon: <HomeIcon /> },
    { label: 'Stock', path: '/stock', icon: <InventoryIcon /> },
    { label: 'Fournisseur', path: '/fournisseur', icon: <PeopleIcon /> },
    { label: 'Client', path: '/client', icon: <PersonIcon /> },
    { label: 'Bon de Sortie', path: '/bon-livraison', icon: <ExitToAppIcon /> },
    { label: 'Bon d’Achat', path: '/bon-dachat', icon: <ShoppingCartIcon /> },
    { label: 'Bon de Commande', path: '/bon-commande', icon: <ShoppingCartIcon /> },
    { label: 'Bon de Livraison', path: '/bon-commandefacture', icon: <ExitToAppIcon /> }
  ];

  return (
    <Box sx={{ width: 250, height: '100vh', bgcolor: 'background.paper', boxShadow: 2 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
        <Avatar
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRms6VOlo3lDt5HuHvAZL1w-2fkilkxuCBsIw&s" // Replace with user's profile photo URL
          alt="User Profile"
          sx={{ width: 64, height: 64, mb: 1 }}
        />
        <Typography variant="h6">John Doe</Typography> {/* Replace with dynamic username */}
        <Typography variant="body2" color="textSecondary">
          {getCurrentDate()}
        </Typography>
      </Box>

      {/* Menu List */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} button component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SidebarMenu;
