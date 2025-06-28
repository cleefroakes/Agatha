const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const tutorRoutes = require('./routes/tutor');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// Serve static files (HTML, JS, CSS) from /public
app.use(express.static(path.join(__dirname, 'public')));

// ===== Routes =====
app.use('/api/tutor', tutorRoutes);

// Root route - loads index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== Error Handling =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== Server Setup =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
