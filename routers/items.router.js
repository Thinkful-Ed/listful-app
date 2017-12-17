'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/items');
const simDB = require('../db/simDB');
const items = simDB.initialize(data);

router.get('/', (req, res, next) => {
  const query = req.query;

  // find
  items.find(query, (err, list) => {
    if (err) {
      next(err); // error handler
      return;
    }
    res.json(list);
  });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  // find by id
  items.findById(id, (err, item) => {
    if (err) {
      next(err); // error handler
      return;
    }
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  });
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
  items.create(newItem, (err, item) => {
    if (err) {
      next(err); // error handler
      return;
    }
    if (item) {
      res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
    } else {
      next(); // 404 handler
    }
  });
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
  items.findByIdAndReplace(id, updateItem, (err, item) => {
    if (err) {
      next(err); // error handler
      return;
    }
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  });
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
  items.findByIdAndUpdate(id, replaceItem, (err, item) => {
    if (err) {
      next(err); // error handler
      return;
    }
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  items.findByIdAndRemove(id, (err, result) => {
    if (err) {
      next(err); // error handler
      return;
    }
    if (result) {
      res.sendStatus(204);
    } else {
      next(); // 404 handler
    }
  });
});

module.exports = router;
