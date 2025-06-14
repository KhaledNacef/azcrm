import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';

const FicheTechniquev = () => {
  const { id } = useParams();
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        const response = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/recette/mi/${id}`);
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
        {fiche.id}
      </Typography>
      
   <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
           <Typography variant="h6">
              Total Cout: {fiche.totalcosts.toFixed(2)} TND
           </Typography>
           <Typography variant="h6">
             Total Profit: {fiche.totalprofit.toFixed(2)} TND
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
              <TableCell>profit (TND)</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
           {fiche.recieps.map((reciep, index) => (
                     <TableRow key={index}>
                       <TableCell>{reciep.name}</TableCell>
                       <TableCell>{reciep.totalcost.toFixed(2)}</TableCell>
                       <TableCell>{reciep.sellingPrice.toFixed(2)}</TableCell>
                       <TableCell>{reciep.profit.toFixed(2)}</TableCell>

                       
                     </TableRow>
                   ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FicheTechniquev;