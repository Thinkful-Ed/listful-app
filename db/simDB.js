'use strict';

// Simple In-Memory Database (full async-callback version)

const { promisify } = require('util');

const simDB = {

  create: function (newItem, callback) {
    setImmediate(() => {
      try {
        newItem.id = this.nextVal++;
        this.data.unshift(newItem); // unshift for nice display (not performance)
        callback(null, newItem);
      } catch (err) {
        callback(err);
      }
    });
  },

  find: function (query = {}, callback) {
    setImmediate(() => {
      try {
        let list = this.data.filter(item => Object.keys(query).every(key => item[key] === query[key]));
        callback(null, list);
      } catch (err) {
        callback(err);
      }
    });
  },

  findById: function (id, callback) {
    setImmediate(() => {
      try {
        id = Number(id);
        let item = this.data.find(item => item.id === id);
        callback(null, item);
      } catch (err) {
        callback(err);
      }
    });
  },

  findByIdAndReplace: function (id, replaceItem, callback) {
    setImmediate(() => {
      try {
        id = Number(id);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
          callback(null, null);
        }
        replaceItem.id = id;
        this.data.splice(index, 1, replaceItem);
        callback(null, replaceItem);
      } catch (err) {
        callback(err);
      }
    });
  },

  findByIdAndUpdate: function (id, updateItem, callback) {
    setImmediate(() => {
      try {
        id = Number(id);
        let item = this.data.find(item => item.id === id);
        if (!item) {
          callback(null, null);
        }
        Object.assign(item, updateItem);
        callback(null, item);
      } catch (err) {
        callback(err);
      }
    });
  },

  findByIdAndRemove: function (id, callback) {
    setImmediate(() => {
      try {
        id = Number(id);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
          callback(null, null);
        } else {
          const len = this.data.splice(index, 1).length;
          callback(null, len);
        }
      } catch (err) {
        callback(err);
      }
    });
  },

  initialize: function (data, callback) {
    setImmediate(() => {
      try {
        this.nextVal = 1000;
        this.data = data.map(item => {
          item.id = this.nextVal++;
          return item;
        });
        callback(null, this);
      } catch (err) {
        callback(err);
      }
    });
  },

  // NOTE destroy will be used with testing 
  destroy: function(callback) {
    setImmediate(() => {
      try {
        this.nextVal = 1000;
        this.data = [];
        callback(null, this);
      } catch (err) {
        callback(err);
      }
    });
  }

};

simDB.createAsync = promisify(simDB.create);
simDB.findAsync = promisify(simDB.find);
simDB.findByIdAsync = promisify(simDB.findById);
simDB.findByIdAndReplaceAsync = promisify(simDB.findByIdAndReplace);
simDB.findByIdAndUpdateAsync = promisify(simDB.findByIdAndUpdate);
simDB.findByIdAndRemoveAsync = promisify(simDB.findByIdAndRemove);
simDB.initializeAsync = promisify(simDB.initialize);
simDB.destroyAsync = promisify(simDB.destroy);

module.exports = Object.create(simDB);
