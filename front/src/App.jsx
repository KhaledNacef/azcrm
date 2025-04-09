import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Wrap all routes under the Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="/produit" element={<ProductPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/fournisseur" element={<FournisseurPage />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/bon-dachat" element={<BonAchatPage />} />
          <Route path="/bon-dachat/:code/:supplierId/:codey" element={<SingleDeliveryNote />} />
          <Route path="/bon-livraison" element={<BonsortiePage />} />
          <Route path="/bon-livraison/:code/:clientId/:codey/:devise" element={<SingleDeliverysortie />} />
          <Route path="/bon-commandefacture" element={<Boncommandev />} />
          <Route path="/bon-commandefacturee/:code/:clientId/:codey/:devise" element={<Bvsinlge />} />
          <Route path="/bon-commande" element={<Boncommande />} />
          <Route path="/bon-commandea/:code/:supplierId/:codey" element={<BCsingleACHAT />} />
          <Route path="/gestion/:codey" element={<CompareProducts />} />
          <Route path="/gestionv/:codey" element={<CompareProductsv />} />


        </Route>
      </Routes>
    </Router>
  );
};

export default App;
