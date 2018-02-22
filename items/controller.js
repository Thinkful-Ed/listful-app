'use strict';

const data = require('../db/items');
const simDB = require('../db/simDB');

// TEMP: Simple In-Memory Database
let items;
(async () => {
  items = await simDB.initializeAsync(data);
})();

// Get All items (and search by query)
const list = async (req, res, next) => {
  const query = req.query;

  try {
    const list = await items.findAsync(query);
    res.json(list);
  } catch (err) {
    next(err); 
  }
};

// Get a single item
const detail = async (req, res, next) => {
  const id = req.params.id;

  try {
    const item = await items.findByIdAsync(id);
    if (item) {
      res.json(item);
    } else {
      next(); 
    }
  } catch (err) {
    next(err); 
  }
};

// Post (insert) an item
const create = async (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err); 
  }
  const newItem = { name, checked };

  try {
    const item = await items.createAsync(newItem);
    if (item) {
      res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
    } else {
      next(); 
    }
  } catch (err) {
    next(err); 
  }
};

// Put (replace) an item
const update = async (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateItem = {};
  const updateableFields = ['name', 'checked'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateItem[field] = req.body[field];
    }
  });

  try {
    const item = await items.findByIdAndUpdateAsync(id, updateItem);
    if (item) {
      res.json(item);
    } else {
      next(); 
    }
  } catch (err) {
    next(err); 
  }
};

// Patch (update) an item
const replace = async (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'checked'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  try {
    const item = await items.findByIdAndReplaceAsync(id, replaceItem);
    if (item) {
      res.json(item);
    } else {
      next(); 
    }
  } catch (err) {
    next(err); 
  }
};

// Delete an item
const remove = async (req, res, next) => {
  const id = req.params.id;

  try {
    const count = await items.findByIdAndRemoveAsync(id);
    if (count) {
      res.status(204).end();
    } else {
      next(); 
    }
  } catch (err) {
    next(err); 
  }
};

module.exports = { list, detail, create, update, replace, remove };