'use strict';

// Simple In-Memory Database

const simDB = {

  create: function (newItem) {
    newItem.id = this.nextVal++;
    this.data.unshift(newItem);
    return newItem;
  },

  find: function (query = {}) {
    return this.data.filter(item => Object.keys(query).every(key => item[key] === query[key]));
  },

  findById: function (id) {
    return this.data.find(item => item.id === Number(id));
  },

  findByIdAndReplace: function (id, updateItem) {
    id = Number(id);
    
    const index = this.data.findIndex(item => item.id === Number(id));
    if (index !== -1) {
      updateItem.id = id;
      this.data.splice(index, 1, updateItem);
      return updateItem;
    }   
  },

  findByIdAndUpdate: function (id, updateItem) {
    id = Number(id);
    let item = this.findById(id);
    if (item) {
      Object.assign(item, updateItem);
    }
    return item;
  },

  findByIdAndRemove: function (id) {
    const index = this.data.findIndex(item => item.id === Number(id));
    if (index !== -1) {
      return this.data.splice(index, 1).length;
    } else {
      return 0;
    }
  },

  initialize: function(data) {
    this.nextVal = 1000;
    this.data = data.map(item => {
      item.id = this.nextVal++;
      return item;
    });
    return this;
  },

  destroy: function() {    
    this.nextVal = 1000;
    this.data = [];
    return this;
  }
};

module.exports = Object.create(simDB);
