const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database/config'); 


const suplier = require('../back/database/router/suplierR'); 
const clientRoutes = require('../back/database/router/clientr'); 

const app = express();

app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json()); 


app.use('/api/suplier',suplier ); 
app.use('/api/clients', clientRoutes);  // Add the client routes

db.authenticate() 
  .then(() => {
    console.log('Database connected...');
    return db.sync(); 
  })
  .then(() => {
    console.log('User table created (if not exists)');
    app.listen(8080, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
