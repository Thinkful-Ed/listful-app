'use strict';

const data = require('../db/items');
const simDB = require('../db/simDB');


let items;
(async () => {
  items = await simDB.initializeAsync(data);
})();

const list = async (req, res, next) => {
  const query = req.query;

  try {
    const list = await items.findAsync(query);
    res.json(list);
    // res.send('asdfasdf');
  } catch (err) {
    next(err); // error handler
  }

};

const detail = async (req, res, next) => {
  const id = req.params.id;

  try {
    const item = await items.findByIdAsync(id);
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  } catch (err) {
    next(err); // error handler
  }
};

const create = async (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err); // error handler
  }
  const newItem = { name, checked };

  // create
  try {
    const item = await items.createAsync(newItem);
    if (item) {
      res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
    } else {
      next(); // 404 handler
    }
  } catch (err) {
    next(err); // error handler
  }
};

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

  // update
  try {
    const item = await items.findByIdAndUpdateAsync(id, updateItem);
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  } catch (err) {
    next(err); // error handler
  }
};

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

  // replace
  try {
    const item = await items.findByIdAndReplaceAsync(id, replaceItem);
    if (item) {
      res.json(item);
    } else {
      next(); // 404 handler
    }
  } catch (err) {
    next(err); // error handler
  }

};

const remove = async (req, res, next) => {
  const id = req.params.id;

  try {
    const count = await items.findByIdAndRemoveAsync(id);
    if (count) {
      res.status(204).end();
    } else {
      next(); // 404 handler
    }
  } catch (err) {
    next(err); // error handler
  }
};

module.exports = { list, detail, create, update, replace, remove };