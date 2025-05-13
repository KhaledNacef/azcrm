import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Typography, Collapse } from '@mui/material';
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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
  const [openStock, setOpenStock] = useState(false); // State to handle stock submenu

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <HomeIcon /> },
    { label: 'Produit', path: '/produit', icon: <InventoryIcon /> },
    { label: 'Fournisseur', path: '/fournisseur', icon: <PeopleIcon /> },
    { label: 'Client', path: '/client', icon: <PersonIcon /> },
    { label: 'Bon de Livraison Achat', path: '/bon-commande', icon: <ReceiptIcon /> },
    { label: 'Facture d’Achat', path: '/bon-dachat', icon: <ShoppingCartIcon /> },
    { label: 'Bon de Livraison Vente', path: '/bon-commandefacture', icon: <LocalShippingIcon /> },
    { label: 'Facture Vente', path: '/bon-livraison', icon: <ExitToAppIcon /> },
    { label: 'Retenue', path: '/RET1', icon: <AttachMoneyIcon /> },
  ];

  const stockSubMenuItems = [
    { label: 'Mouvement de produit', path: '/stock/mouvement', icon: <InventoryIcon /> },
    { label: 'Produit Achat History', path: '/stock/achat-history', icon: <InventoryIcon /> },
  ];

  return (
    <Box sx={{ width: 270, height: '100vh', bgcolor: '#242c44', boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: '#242c44', color: 'white' }}>
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3237/3237447.png"
          alt="User Profile"
          sx={{ width: 70, height: 70, mb: 1, border: '3px solid white' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>NACEF KHALED</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>{getCurrentDate()}</Typography>
      </Box>

      {/* Menu List */}
      <List sx={{ flexGrow: 1, p: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.label}
              button
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '8px',
                mb: 1,
                bgcolor: isActive ? '#1976d2' : 'transparent',
                color: isActive ? 'white' : 'white',
                '&:hover': { bgcolor: '#1976d2', color: 'white' },
                transition: '0.3s',
                '&:hover .MuiListItemIcon-root': { color: 'white' },
                '&:hover .MuiListItemText-root': { color: 'white' },
                '& .MuiListItemIcon-root': { color: isActive ? 'white' : 'white' },
                '& .MuiListItemText-root': { fontWeight: 'bold' },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}

        {/* Stock Menu with Submenu */}
        <ListItem
          button
          onClick={() => setOpenStock(!openStock)} // Toggle submenu visibility
          sx={{
            borderRadius: '8px',
            mb: 1,
            bgcolor: location.pathname.includes('/stock') ? '#1976d2' : 'transparent',
            color: location.pathname.includes('/stock') ? 'white' : 'white',
            '&:hover': { bgcolor: '#1976d2', color: 'white' },
            transition: '0.3s',
            '& .MuiListItemIcon-root': { color: location.pathname.includes('/stock') ? 'white' : 'white' },
            '& .MuiListItemText-root': { fontWeight: 'bold' },
          }}
        >
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Stock" />
          {openStock ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        {/* Stock Submenu */}
        <Collapse in={openStock} timeout="auto" unmountOnExit>
          {stockSubMenuItems.map((subItem) => {
            const isActive = location.pathname === subItem.path;
            return (
              <ListItem
                key={subItem.label}
                button
                component={Link}
                to={subItem.path}
                sx={{
                  pl: 4, // Indentation for submenu
                  borderRadius: '8px',
                  mb: 1,
                  bgcolor: isActive ? '#1976d2' : 'transparent',
                  color: isActive ? 'white' : 'white',
                  '&:hover': { bgcolor: '#1976d2', color: 'white' },
                  transition: '0.3s',
                  '& .MuiListItemIcon-root': { color: isActive ? 'white' : 'white' },
                  '& .MuiListItemText-root': { fontWeight: 'bold' },
                }}
              >
                <ListItemIcon>{subItem.icon}</ListItemIcon>
                <ListItemText primary={subItem.label} />
              </ListItem>
            );
          })}
        </Collapse>

        {/* Logout Button */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            mt: 'auto',
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': { bgcolor: 'error.dark' },
            transition: '0.3s',
            '& .MuiListItemIcon-root': { color: 'white' },
            '& .MuiListItemText-root': { fontWeight: 'bold' },
          }}
        >
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarMenu;
