'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/items');
const simDB = require('../db/simDB');
const items = simDB.initialize(data);

router.get('/', (req, res, next) => {
  const query = req.query;
  items.findAsync(query)
    .then(list => {
      res.json(list);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  items.findByIdAsync(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next(); // 404 handler
      }
    })
    .catch(next);  // error handler
});

router.post('/', (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err); // error handler
  }
  const newItem = { name, checked };

  // create
  items.createAsync(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
      } else {
        next(); // 404 handler
      }
    })
    .catch(next);  // error handler
});

router.put('/:id', (req, res, next) => {
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
    return next(err); // error handler
  }

  // replace
  items.findByIdAndUpdateAsync(id, updateItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next(); // 404 handler
      }
    })
    .catch(next); // error handler
});

router.patch('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'checked'];
  
  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  // update
  items.findByIdAndReplaceAsync(id, replaceItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next(); // 404 handler
      }
    })
    .catch(next); // error handler
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  items.findByIdAndRemoveAsync(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next(); // 404 handler
      }
    })
    .catch(next); // error handler
});

module.exports = router;
