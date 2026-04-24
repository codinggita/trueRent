const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/fraud', require('./routes/fraudRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'TrueRent API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
