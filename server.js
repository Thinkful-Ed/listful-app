'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const data = require('./db/items');
const app = express();

app.use(express.static('public')); // serve static files
app.use(bodyParser.json()); // parse JSON body

app.get('/items', (req, res) => {
  const query = req.query;
  const list = data.filter(item => Object.keys(query).every(key => item[key] === query[key]));
  res.json(list);
});

app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  const item = data[id];
  res.json(item);
});

app.post('/items', (req, res) => {
  const { name, checked } = req.body;  
  const newItem = { name, checked };
  data.unshift(newItem);
  res.json(newItem);
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', console.error);