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

const FicheTechniquev = () => {
  const { id } = useParams();
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const chargerFiche = async () => {
      try {
        const response = await axios.get(`https://api.azcrm.deviceshopleader.com/api/v1/recette/mi/${id}`);
        
        // Vérifier si la réponse contient des données
        if (!response.data) {
          throw new Error('Aucune donnée reçue');
        }
        
        setFiche(response.data);
      } catch (erreur) {
        console.error('Erreur lors du chargement:', erreur);
        setError(erreur.message || 'Échec du chargement de la fiche technique');
      } finally {
        setLoading(false);
      }
    };

    chargerFiche();
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
    return <Typography sx={{ p: 3 }}>Fiche technique introuvable</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fiche Technique #{fiche.id}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Typography variant="h6">
          Coût Total: {fiche.totalcosts?.toFixed(2) || '0.00'} TND
        </Typography>
        <Typography variant="h6">
          Profit Total: {fiche.totalprofit?.toFixed(2) || '0.00'} TND
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Détails des Recettes
      </Typography>
      
      {fiche.recieps?.length > 0 ? (  // Note: Utilisez le bon nom de propriété (recettes/recipes)
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Désignation</TableCell>
              <TableCell>Coût (TND)</TableCell>
              <TableCell>Prix de Vente (TND)</TableCell>
              <TableCell>Quantité Vendue</TableCell>
              <TableCell>Profit (TND)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fiche.recieps.map((recette, index) => (  // Adaptez selon le nom réel
              <TableRow key={index}>
                <TableCell>{recette.name}</TableCell>
                <TableCell>{recette.totalcost?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{recette.sellingPrice?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{recette.quantite || 0}</TableCell>
                <TableCell>{recette.profit?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Aucune recette trouvée dans cette fiche technique
        </Typography>
      )}
    </Box>
  );
};

export default FicheTechniquev;