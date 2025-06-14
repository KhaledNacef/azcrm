import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';

const FicheTechnique = () => {
  const { id } = useParams();
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        const response = await axios.get(`/https://api.azcrm.deviceshopleader.com/api/v1/fiches/ficheid/${id}`);
        setFiche(response.data);
      } catch (error) {
        console.error('Error fetching fiche:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiche();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!fiche) return <Typography>Fiche technique not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {fiche.name}
      </Typography>
      
      
  <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Typography variant="h6">
           Cost: {fiche.totalcost} TND
        </Typography>
        <Typography variant="h6">
           Profit: {fiche.profit} TND
        </Typography>
          <Typography variant="h6">
           prix de vente: {fiche.sellingPrice} TND
        </Typography>
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
        
          {fiche.ingredients.map((ingredient, index) => (
                      <TableRow key={index}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{ingredient.cost}</TableCell>
                      </TableRow>
                    ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FicheTechnique;