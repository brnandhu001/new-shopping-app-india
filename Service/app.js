const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require("cors");




const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Body parser
app.use(express.json());

// allow frontend access
app.use(cors({
  origin: "http://localhost:5173",  // your React URL
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/products", require("./routes/productRoutes"));


// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

// 500 Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
