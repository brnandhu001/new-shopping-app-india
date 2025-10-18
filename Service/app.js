const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const port = 3000;

// Connect to MongoDB Atlas
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
