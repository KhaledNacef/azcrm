import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Avatar,
  Typography
} from '@mui/material';
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
  const [openStockSubmenu, setOpenStockSubmenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ width: 270, height: '100vh', bgcolor: '#242c44', boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, color: 'white' }}>
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3237/3237447.png"
          alt="User Profile"
          sx={{ width: 70, height: 70, mb: 1, border: '3px solid white' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>NACEF KHALED</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>{getCurrentDate()}</Typography>
      </Box>

      <List sx={{ flexGrow: 1, p: 2 }}>
        {/* Dashboard */}
        <ListItem
          button
          component={Link}
          to="/dashboard"
          sx={getItemStyles(isActive('/dashboard'))}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Produit */}
        <ListItem
          button
          component={Link}
          to="/produit"
          sx={getItemStyles(isActive('/produit'))}
        >
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Produit" />
        </ListItem>

        {/* Stock Parent */}
        <ListItem
          button
          component={Link}
          to="/stock"
          onClick={() => setOpenStockSubmenu(!openStockSubmenu)}
          sx={getItemStyles(isActive('/stock'))}
        >
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Stock" />
          {openStockSubmenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        {/* Stock Submenus */}
        <Collapse in={openStockSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/stock/mouvement"
              sx={getSubItemStyles(isActive('/stock/mouvement'))}
            >
              <ListItemText inset primary="Mouvement de Produit Local" />
            </ListItem>
             <ListItem
              button
              component={Link}
              to="/stocketranger/mouvement"
              sx={getSubItemStyles(isActive('/stocketranger/mouvement'))}
            >
              <ListItemText inset primary="Produits exportés" />
              
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/stock/achat-history"
              sx={getSubItemStyles(isActive('/stock/achat-history'))}
            >
              <ListItemText inset primary="Historique d’achat de produits" />
              
            </ListItem>
             
          </List>
        </Collapse>

        {/* Other Menu Items */}
        {[
          { label: 'Fournisseur', path: '/fournisseur', icon: <PeopleIcon /> },
          { label: 'Client', path: '/client', icon: <PersonIcon /> },
          { label: 'Bon de Livraison Achat', path: '/bon-commande', icon: <ReceiptIcon /> },
          { label: 'Facture d’Achat', path: '/bon-dachat', icon: <ShoppingCartIcon /> },
          { label: 'Bon de Livraison Vente', path: '/bon-commandefacture', icon: <LocalShippingIcon /> },
          { label: 'Facture Vente', path: '/bon-livraison', icon: <ExitToAppIcon /> },
          { label: 'Retenue', path: '/RET1', icon: <AttachMoneyIcon /> },
        ].map((item) => (
          <ListItem
            key={item.label}
            button
            component={Link}
            to={item.path}
            sx={getItemStyles(isActive(item.path))}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}

        {/* Logout */}
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

const getItemStyles = (isActive) => ({
  borderRadius: '8px',
  mb: 1,
  bgcolor: isActive ? '#1976d2' : 'transparent',
  color: 'white',
  '&:hover': { bgcolor: '#1976d2', color: 'white' },
  transition: '0.3s',
  '& .MuiListItemIcon-root': { color: 'white' },
  '& .MuiListItemText-root': { fontWeight: 'bold' },
});

const getSubItemStyles = (isActive) => ({
  pl: 4,
  borderRadius: '8px',
  mb: 1,
  bgcolor: isActive ? '#1565c0' : 'transparent',
  color: 'white',
  '&:hover': { bgcolor: '#1565c0', color: 'white' },
  transition: '0.3s',
  '& .MuiListItemText-root': { fontWeight: 'bold' },
});

export default SidebarMenu;
