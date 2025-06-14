import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './home.jsx';
import ProductPage from './component/products/productpage.jsx';
import FournisseurPage from './component/suplier/suplier.jsx';
import ClientPage from './component/client/client.jsx';
import BonAchatPage from './component/achat/ba.jsx';
import SingleDeliveryNote from './component/achat/singlepage.jsx';
import SingleDeliverysortie from './component/vente/singlepagebl.jsx';
import BonsortiePage from './component/vente/bl.jsx';
import StockPage from './component/stock/stock.jsx';
import Dashboard from './component/dashboard/dashboard.jsx';
import Boncommande from './component/fatcure/facturachat.jsx';
import Boncommandev from './component/fatcurev/facturvente.jsx';
import BCsingleACHAT from './component/fatcure/facturesiblge.jsx'
import Bvsinlge from './component/fatcurev/facturesinglevente.jsx';
import CompareProducts from './component/gestionBf.jsx';
import CompareProductsv from './component/gestionLF.jsx';
import Reteune from './component/ReteuneFolder/retenue.jsx';
import AllReteune from './component/ReteuneFolder/allReteune.jsx';
import Login from './component/loginandRegistration/login.jsx';
import Registration from './component/loginandRegistration/registration.jsx';
import StockHPage from './component/stock/stockHistory.jsx';
import StockTPage from './component/stock/stocktrace.jsx';
import StockTPageEtranger from './component/stock/stocktraceetranger.jsx'
import Fiche from './component/fiche/fiche.jsx';
import FicheTechnique from './component/fiche/singlepagef.jsx';
import Fichev from './component/fichev/recet.jsx';
import FicheTechniquev from './component/fichev/singlepagerv.jsx';
// Protect Route Component
const RequireAuth = () => {
  const isAuthenticated = localStorage.getItem('token'); 
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
    <Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Registration />} />

  {/* Protected routes */}
  <Route element={<RequireAuth />}>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="produit" element={<ProductPage />} />
      <Route path="stock" element={<StockPage />} />
      <Route path="fournisseur" element={<FournisseurPage />} />
      <Route path="client" element={<ClientPage />} />
      <Route path="bon-dachat" element={<BonAchatPage />} />
      <Route path="bon-dachat/:code/:supplierId/:codey/:timbre/:num" element={<SingleDeliveryNote />} />
      <Route path="REt0/:code/:supplierId/:codey/:timbre/:num" element={<Reteune />} />
      <Route path="RET1" element={<AllReteune />} />
      <Route path="bon-livraison" element={<BonsortiePage />} />
      <Route path="bon-livraison/:code/:clientId/:codey/:devise/:num/:datee/:timbre" element={<SingleDeliverysortie />} />
      <Route path="bon-commandefacture" element={<Boncommandev />} />
      <Route path="bon-commandefacturee/:code/:clientId/:codey/:devise/:num/:datee/:timbre" element={<Bvsinlge />} />
      <Route path="bon-commande" element={<Boncommande />} />
      <Route path="bon-commandea/:code/:supplierId/:codey/:timbre/:num" element={<BCsingleACHAT />} />
      <Route path="gestion/:codey" element={<CompareProducts />} />
      <Route path="gestionv/:codey" element={<CompareProductsv />} />
      <Route path="/stock/mouvement" element={<StockTPage />} />
       <Route path="/stocketranger/mouvement" element={<StockTPageEtranger />} />
      <Route path="/stock/achat-history" element={<StockHPage />} />
      <Route path="/fiches" element={<Fiche />} />
      <Route path="/fiche/:id" element={<FicheTechnique />} />
      <Route path="/fichesv" element={<Fichev />} />
      <Route path="/fichev/:id" element={<FicheTechniquev />} />

    </Route>
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

    </Router>
  );
};

export default App;
