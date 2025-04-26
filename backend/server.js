const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const healthProgramRoutes = require('./routes/healthProgramRoutes');
const bodyParser = require('body-parser');

dotenv.config(); 

const app = express();
app.use(bodyParser.json());

// Connect database
connectDB();

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/programs', healthProgramRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
