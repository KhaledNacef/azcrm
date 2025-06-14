import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  CircularProgress,
  Alert 
} from '@mui/material';

const FicheTechnique = () => {
  const { id } = useParams();
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        const response = await axios.get(
          `https://api.azcrm.deviceshopleader.com/api/v1/fiches/ficheid/${id}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (response.data) {
          setFiche(response.data);
        } else {
          setError('Fiche not found');
        }
      } catch (err) {
        console.error('Error fetching fiche:', err);
        setError(err.response?.data?.message || 'Failed to load fiche technique');
      } finally {
        setLoading(false);
      }
    };

    fetchFiche();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!fiche) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Fiche technique not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {fiche.name}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Typography variant="h6">Cout: {fiche.totalcost?.toFixed(2) || '0.00'} TND</Typography>
        <Typography variant="h6">Benifice: {fiche.profit?.toFixed(2) || '0.00'} TND</Typography>
        <Typography variant="h6">Prix d=De Vente: {fiche.sellingPrice?.toFixed(2) || '0.00'} TND</Typography>
      </Box>
      
      <Typography variant="h5" gutterBottom>
        Ingredients
      </Typography>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ingredient</TableCell>
            <TableCell>Cout (TND)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fiche.ingredients?.length > 0 ? (
            fiche.ingredients.map((ingredient, index) => (
              <TableRow key={index}>
                <TableCell>{ingredient.name || 'Unnamed ingredient'}</TableCell>
                <TableCell>{ingredient.cost?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>No ingredients found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FicheTechnique;