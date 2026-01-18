const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require("cors");
const { auth } = require("./middleware/authMiddleware");

const app = express();
const port = 3000;

// Database
connectDB();

// Body Parser
app.use(express.json());

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


// 🔓 PUBLIC ROUTES (No login required)
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/cart", auth, require("./routes/cartRoutes"));


// 🔐 PROTECTED ROUTES (Require JWT)
app.use("/api/products", auth, require("./routes/productRoutes"));


// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// Local Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


//export for serverless deployment
module.exports = app;

