const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 6410;

// Middleware
app.use(express.json());
app.use(cors());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Connect to MongoDB and then start the server
connectToMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });
