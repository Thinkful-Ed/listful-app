'use strict';

const express = require('express');

const data = require('./db/items');

// Create an Express application
const app = express();

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Get All items (and search by query)
app.get('/api/items', (req, res) => {
  const query = req.query;
  const list = data.filter(item => Object.keys(query).every(key => item[key] === query[key]));
  res.json(list);
});

// Get a single item
app.get('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const item = data[id];
  res.json(item);
});

// Post (insert) an item
app.post('/api/items', (req, res) => {
  const { name, checked } = req.body;  
  const newItem = { name, checked };
  data.push(newItem);
  res.json(newItem);
});

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});