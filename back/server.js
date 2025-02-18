const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database/index'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client/dist'));


const suplier = require('../back/database/router/suplierR'); 
const clientRoutes = require('../back/database/router/clientr'); 

const app = express();

app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json()); 


app.use('/api/suplier',suplier ); 
app.use('/api/clients', clientRoutes);  // Add the client routes

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});