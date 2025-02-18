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

// Use Routes
app.use('/api/suplier', suplierRoutes); 
app.use('/api/clients', clientRoutes);  

// Connect to Database
db.sequelize.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection failed:', err));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
