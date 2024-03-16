// Task 2 - First API

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

// Load routes from routes/index.js
const routes = require('./routes');

app.use(express.json());

app.use('/', routes);

// Start server listening on specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
