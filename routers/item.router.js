'use strict';

const express = require('express');
const Joi = require('joi');

const data = require('../db/items');
const simDB = require('../db/simDB');
const items = simDB.initialize(data);

const router = express.Router();

// Listening for: GET /items
router.get('/', (req, res) => {
  const query = req.query; // ?name=buy%20milk ==> {name: "Buy Milk"}
  const list = items.find(query);
  res.json(list);
});

// Listening for: GET /items/42
router.get('/:id', (req, res, next) => {
  let id = req.params.id; // "42" is a string
  id = parseInt(id);
  const item = items.findById(id);
  if (!item) {
    const err = new Error('Item not found');
    err.status = 404;
    next(err);
  }
  res.json(item);
});

// Listening for: POST /items with a body {"name": "Do Something"}
router.post('/', (req, res, next) => {
  const name = req.body.name;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    next(err);
  }
  const newObj = { name };
  newObj.checked = false; // default to false
  const newItem = items.create(newObj);
  res.status(201).json(newItem);
});

// Listening for: PUT /items/42 with a body {"name": "Change Item"}
router.put('/:id', (req, res, next) => {
  if (parseInt(req.params.id) !== parseInt(req.body.id)) {
    const err = new Error(`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
    err.status = 400;
    return next(err);
  }
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    checked: Joi.boolean().required(),
    id: Joi.alternatives()
      .try(Joi.string(), Joi.number())
      .required()
  });
  const { error: validationError } = Joi.validate(req.body, schema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }

  let id = req.params.id; // "35"
  id = parseInt(id);

  const updateObj = {};
  const updateableFields = ['name', 'checked'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  if (!items.findById(id)) {
    const err = new Error('Item not found');
    err.status = 404;
    next(err);
  }
  const item = items.findByIdAndUpdate(id, updateObj);
  res.json(item); 
});

// Listening for: DELETE /items/42
router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  id = parseInt(id);

  const count = items.findByIdAndRemove(id);
  if (count) {
    res.status(204).end();
  } else {
    next();
  }
});



module.exports = router;