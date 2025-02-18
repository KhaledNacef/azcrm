import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        '/api/user/register',
        { name, email, password },
        { withCredentials: true }
      );

      if (response.data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: 2, padding: '10px' }}
            >
              Register
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/login')}
                color="primary"
                sx={{ textDecoration: 'underline' }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Registration;
