'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/items');
const simDB = require('../db/simDB');
let items;
simDB.initializeAsync(data)
  .then(data => items = data);

// Get All items (and search by query)
router.get('/items', (req, res, next) => {
  const query = req.query;
  items.findAsync(query)
    .then(list => {
      res.json(list);
    })
    .catch(next);
});

// Get a single item
router.get('/items/:id', (req, res, next) => {
  const id = req.params.id;

  items.findByIdAsync(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(next); 
});

// Post (insert) an item
router.post('/items/', (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  const newItem = { name, checked };

  items.createAsync(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(next); 
});

// Put (replace) an item
router.put('/items/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'checked'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!replaceItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  items.findByIdAndReplaceAsync(id, replaceItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(next);
});

// Patch (update) an item
router.patch('/items/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'checked'];
  
  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  items.findByIdAndUpdateAsync(id, replaceItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(next);
});

// Delete an item
router.delete('/items/:id', (req, res, next) => {
  const id = req.params.id;

  items.findByIdAndRemoveAsync(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
