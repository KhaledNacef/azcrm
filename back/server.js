const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database/index'); 

const app = express(); // ✅ Define the app first

// Middleware
app.use(morgan('dev')); 

const corsOptions = {
    origin: 'https://azcrm.deviceshopleader.com', // Autorise le front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: false, // Si tu utilises des cookies ou l'authentification
};

app.use(cors(corsOptions));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(express.static(__dirname + '/../client/dist'));

// Import Routes
const suplierRoutes = require('./database/router/suplierR'); 
const clientRoutes = require('./database/router/clientr'); 
const product=require('./database/router/productr')
const deliverynote=require('./database/router/BlR')
const bss=require('./database/router/venter')
const factureachat=require('./database/router/facturear')
const facturev=require('./database/router/facturevr')
const factureachatproduct=require('./database/router/factureapr')
const factureventeproduct=require('./database/router/facturevpr')

const stock=require('./database/router/stockR')
// Use Routes
app.use('/api/suplier', suplierRoutes); 
app.use('/api/clients', clientRoutes);  
app.use('/api/product', product); 
app.use('/api/bonachat',deliverynote)
app.use('/api/bs',bss)
app.use('/api/stock',stock)                                                                                         
app.use('/api/boncommandall',factureachat)
app.use('/api/bonlivraisonproducts',factureventeproduct)
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
