
/**
 * make sure to update json package type to module 
 * like "type":"module" to use import rather than require method
 */
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
app.use(bodyParser.json());



// Serve uploaded files in the "database" folder
app.use('/uploads', express.static(path.join(__dirname, 'database')));

// Routes
app.use('/api/songs', songRoutes);
// Example Node.js/Express route for deleting a song




// Start Server
app.listen(PORT, () => {
  console.log(`Server running on  port ${PORT}`);
});
