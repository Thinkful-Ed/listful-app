'use strict';

const express = require('express');

// TEMP: Simple In-Memory Database
const data = require('./db/api/items');
const simDB = require('./db/simDB');
const items = simDB.initialize(data);

const logger = require('./middleware/logger');

const { PORT } = require('./config');

// Create an Express application
const app = express();

// Log all requests
app.use(logger);

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Get All items (and search by query)
app.get('/api/items', (req, res, next) => {
  const query = req.query;

  items.find(query, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

// Get a single item
app.get('/api/items/:id', (req, res, next) => {
  const id = req.params.id;

  items.findById(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next(); 
    }
  });
});

// Post (insert) an item
app.post('/api/items', (req, res, next) => {
  const { name, checked } = req.body;
  
  /***** Never trust users - validate input *****/
  if (!req.body.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  const newObj = { name, checked };
  
  items.create(newObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next(); 
    }
  });
});

// TEMP: just to test error handler
app.get('/throw', (req, res, next) => {
  throw new Error('Boom!!');
});

// Catch-all 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// NOTE: we'll prevent stacktrace leak in later exercise
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err 
  });
});

// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});