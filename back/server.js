const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const db = require('./database/index');

// Initialize Express
const app = express();

// ========================
// 🛡️ Security Middleware
// ========================

// 1. Helmet (HTTP headers)
app.use(cors({
  origin: 'https://azcrm.deviceshopleader.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true, // Add this
  legacyHeaders: false,  // Optional
  handler: (req, res) => {
    res.status(429).json({ error: 'Trop de requêtes. Réessaye plus tard.' });
  }
}));

// 4. Data sanitization
app.use(xss()); // XSS protection
app.use(hpp()); // HTTP param pollution

// 5. Body parsing with limits
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ========================
// 🏽 Other Middleware
// ========================
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../client/dist', {
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
  }
}));

// ========================
// 🚦 Routes (Sequelize)
// ========================
const suplierRoutes = require('./database/router/suplierR');
const clientRoutes = require('./database/router/clientr');
const product = require('./database/router/productr');
const deliverynote = require('./database/router/BlR');
const bss = require('./database/router/venter');
const factureachat = require('./database/router/facturear');
const facturev = require('./database/router/facturevr');
const factureachatproduct = require('./database/router/factureapr');
const factureventeproduct = require('./database/router/facturevpr');
const reteune = require('./database/router/reteuner');
const stock = require('./database/router/stockR');
const user=require('./database/router/user')
const chargeCafe=require('./database/router/chargecaferouter')

app.use('/api/v1/suplier', suplierRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/product', product);
app.use('/api/v1/bonachat', deliverynote);
app.use('/api/v1/bs', bss);
app.use('/api/v1/stock', stock);
app.use('/api/v1/boncommandall', factureachat);
app.use('/api/v1/bonlivraison', facturev);
app.use('/api/v1/boncommandallproducts', factureachatproduct);
app.use('/api/v1/bonlivraisonproducts', factureventeproduct);
app.use('/api/v1/reteune', reteune);
app.use('/api/v1/luser', user);
app.use('/api/v1/fiches', require('./database/router/ficherouter'));
app.use('/api/v1/recette', require('./database/router/fichsell'));
app.use('/api/v1/chargerest', chargeCafe);

// ========================
// ⚠️ Error Handling
// ========================
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ========================
// 🚀 Start Server
// ========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});