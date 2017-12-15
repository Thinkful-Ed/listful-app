'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const demoAuth = require('../middleware/demoAuth');
const demoCORS = require('../middleware/demoCORS');
const demoLogger = require('../middleware/demoLogger');

const data = require('./db/items');
const { PORT } = require('./config');

const app = express();

// Log everything
app.use(demoLogger);
app.use(morgan('common'));
app.use(express.static('public')); // serve static files
app.use(demoCORS);
app.use(cors());
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

app.post('/items', demoAuth, (req, res) => {
  const { name, checked } = req.body;
  const newItem = { name, checked };
  data.unshift(newItem);
  res.json(newItem);
});

app.get('/throw', (req, res) => {
  throw new Error('Boom!!');
});

//* Catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function (req, res) {
  res.status(404).json({ code: 404, message: 'Not Found' });
});

//* Catch-all endpoint for errors (see dummy "/throw" endpoint above)
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});