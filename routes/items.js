'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/items');
const simDB = require('../db/simDB');
let items;
simDB.initialize(data, (err, data) => items = data);

// Get All items (and search by query)
router.get('/items', (req, res, next) => {
  const query = req.query;

  items.find(query, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

// Get a single item
router.get('/items/:id', (req, res, next) => {
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
router.post('/items', (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  const newItem = { name, checked };

  items.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

// Put (replace) an item
router.put('/items/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateItem = {};
  const updateableFields = ['name', 'checked'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateItem[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  items.findByIdAndReplace(id, updateItem, (err, item) => {
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

  items.findByIdAndUpdate(id, replaceItem, (err, item) => {
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

// Delete an item
router.delete('/items/:id', (req, res, next) => {
  const id = req.params.id;

  items.findByIdAndRemove(id, (err, result) => {
    if (err) {
      return next(err);
    }
    if (result) {
      res.sendStatus(204);
    } else {
      next();
    }
  });
});

module.exports = router;
