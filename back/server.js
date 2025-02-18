const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database/config'); 


const UserRouter = require('../back/database/router/user'); 
const blrouter = require('../back/database/router/BlR'); 
const clientRoutes = require('../back/database/router/clientr'); 

const app = express();

app.use(morgan('dev')); 
app.use(cors()); 
app.use(express.json()); 

app.use('/api/user',UserRouter ); 
app.use('/api/bl',blrouter ); 
app.use('/api/bs',blrouter ); 
app.use('/api/stk',blrouter ); 
app.use('/api/suplier',blrouter ); 
app.use('/api/clients', clientRoutes);  // Add the client routes
app.use('/api/products',blrouter ); 

db.authenticate() 
  .then(() => {
    console.log('Database connected...');
    return db.sync(); 
  })
  .then(() => {
    console.log('User table created (if not exists)');
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
