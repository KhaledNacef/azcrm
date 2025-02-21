const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database/index'); 

const app = express(); // ✅ Define the app first

// Middleware
app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(express.static(__dirname + '/../client/dist'));

// Import Routes
const suplierRoutes = require('./database/router/suplierR'); 
const clientRoutes = require('./database/router/clientr'); 
const product=require('./database/router/productr')
const deliverynote=require('./database/router/BlR')
const bss=require('./database/router/venter')
const stock=require('./database/router/stockR')
// Use Routes
app.use('/api/suplier', suplierRoutes); 
app.use('/api/clients', clientRoutes);  
app.use('/api/product', product); 
app.use('/api/bl',deliverynote)
app.use('/api/bs',bss)
app.use('/api/stock',stock)
// Connect to Database

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
