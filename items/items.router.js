'use strict';

const express = require('express');
const itemsCtrl = require('./items.controller');

// Create an router instance (aka "mini-app")
const router = express.Router();

router.route('/')
  .get(itemsCtrl.list) // GET/READ ALL ITEMS
  .post(itemsCtrl.create); // POST/CREATE ITEM

router.route('/:id')
  .get(itemsCtrl.detail) // GET/READ SINGLE ITEMS
  .put(itemsCtrl.replace) // PUT/REPLACE A SINGLE ITEM
  .patch(itemsCtrl.update) // PATCH/UPDATE A SINGLE ITEM
  .delete(itemsCtrl.remove); // DELETE/REMOVE A SINGLE ITEM

module.exports = router;
