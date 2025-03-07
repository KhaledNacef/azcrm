import React, { useState, useEffect } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";
import { useParams } from 'react-router-dom';

const CompareProductsv = () => {
  const [bonCommande, setBonCommande] = useState([]);
  const [facture, setFacture] = useState([]);
  const [missingProducts, setMissingProducts] = useState([]);
  const { codey} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bonResponse = await axios.get(`https://api.azcrm.deviceshopleader.com/api/bonlivraison/facturev/${codey}`);
        const factureResponse = await axios.get(`https://api.azcrm.deviceshopleader.com/api/bs/bs/stock/${codey}`);

        setBonCommande(bonResponse.data);
        setFacture(factureResponse.data);
        compareProducts(bonResponse.data, factureResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const compareProducts = (bonCommandeData, factureData) => {
    const missing = bonCommandeData.map((product) => {
      const found = factureData.find((p) => p.id === product.id);
      return found
        ? { ...product, missingQuantity: Math.max(0, product.quantite - found.quantite) }
        : { ...product, missingQuantity: product.quantite };
    }).filter((p) => p.missingQuantity > 0);
    
    setMissingProducts(missing);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Comparaison des Produits
      </Typography>

      <Typography variant="h6">Bon de Livraison-{code}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bonCommande.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.designation}</TableCell>
                <TableCell>{product.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" style={{ marginTop: 20 }}>
        Facture--{codey}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Quantité</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facture.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.designation}</TableCell>
                <TableCell>{product.quantite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" style={{ marginTop: 20 }}>
        Produits Manquants
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Quantité Manquante</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {missingProducts.length > 0 ? (
              missingProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.designation}</TableCell>
                  <TableCell>{product.missingQuantity}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">Aucun produit manquant</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CompareProductsv;
