
const express = require('express');
// import express from 'express'
const cors = require('cors');
const bodyParser = require('body-parser');
const songRoutes = require('./routes/songs');
const path = require('path');
const fs= require('fs')

const app = express();
const PORT = 5000;
// Middleware
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use(bodyParser.json());
// Serve uploaded files in the "database" folder
app.use('/uploads', express.static(path.join(__dirname, 'database')));
.98// Routes
app.use('/api/songs', songRoutes);

app.listen(PORT, () => {
  console.log(`Server running on  port ${PORT}`);
});
