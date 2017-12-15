'use strict';

// Simple In-Memory Database (full async-callback version)

const simDB = {

  create: function (newItem, callback) {
    setImmediate(() => {
      try {
        newItem.id = this.nextVal++;
        this.data.unshift(newItem);
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
        let item = this.data.find(item => item.id === Number(id));
        callback(null, item);
      } catch (err) {
        callback(err);
      }
    });
  },

  findByIdAndReplace: function (id, updateItem, callback) {
    setImmediate(() => {
      try {
        id = Number(id);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
          callback(null, null);
        }
        updateItem.id = id;
        this.data.splice(index, 1, updateItem);
        callback(null, updateItem);
      } catch (err) {
        callback(err);
      }
    });
  },

  findByIdAndUpdate: function (id, updateItem, callback) {
    setImmediate(() => {
      try {
        id = Number(id);
        let item = this.findById(id);
        if (!item) {
          callback(null, null);
        }
        Object.assign(item, updateItem);
        callback(null, updateItem);
      } catch (err) {
        callback(err);
      }
    });
  },

  findByIdAndRemove: function (id, callback) {
    setImmediate(() => {
      try {
        const index = this.data.findIndex(item => item.id === Number(id));

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

  // NOTE destroy will be used with Mocha/Chai
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

module.exports = Object.create(simDB);
