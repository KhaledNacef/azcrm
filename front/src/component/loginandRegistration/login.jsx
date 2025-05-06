import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import Grid from '@mui/material/Grid2'; // Grid v2

import axios from 'axios';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  // Handle the login request
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Send the login request to the server
      const response = await axios.post(
        'https://api.azcrm.deviceshopleader.com/api/v1/luser/login',
        { email, password },
        { withCredentials: true } // Ensure cookies (HttpOnly token) are included in the request
      );

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      // Handle login failure
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
     <Paper
  elevation={0}
  sx={{
    padding: { xs: 3, sm: 4 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  }}
>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error" align="center" gutterBottom>{error}</Typography>}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ padding: '10px' }}
              >
                Login
              </Button>
            </Grid>
            <Grid size={12}>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Don't have an account? 
                  <Button onClick={() => navigate('/register')} color="primary" sx={{ textDecoration: 'underline' }}>
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
