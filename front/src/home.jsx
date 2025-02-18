import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Back arrow icon
import { Outlet, useNavigate } from 'react-router-dom'; // For navigation
import SidebarMenu from './component/menu.jsx'; // Sidebar component

const Layout = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar on the left */}
      <SidebarMenu />

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Back arrow and header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Page Title</Typography>
        </Box>

        {/* Render nested routes */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
