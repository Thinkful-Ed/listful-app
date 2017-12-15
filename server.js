'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const data = require('../db/items');
const simDB = require('../db/simDB');
const items = simDB.initialize(data);

const demoAuth = require('../middleware/demoAuth');
const demoCORS = require('../middleware/demoCORS');
const demoLogger = require('../middleware/demoLogger');

const { PORT } = require('./config');

const app = express();

// Log everything
// app.use(demoLogger);
app.use(morgan('common'));

app.use(express.static('public')); // serve static files

// app.use(demoCORS);
app.use(cors());

app.use(bodyParser.json()); // parse JSON body

// TEMP: just to test error handler
app.get('/throw', (req, res) => {
  throw new Error('Boom!!');
});

app.get('/items', (req, res) => {
  const query = req.query;
  const list = items.find(query);
  res.json(list);
});

app.get('/items/:id', (req, res, next) => {
  const id = req.params.id;

  const item = items.findById(id);
  if (item) {
    res.json(item);
  } else {
    next(); // fall-through to 404 handler
  }
});

app.post('/items', demoAuth, (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!req.body.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  const newObj = { name, checked };

  const newItem = items.create(newObj);
  res.json(newItem);
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