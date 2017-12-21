'use strict';

class Store {
  // Setting all the store properties to null is not strictly necessary
  //  but it does provide a nice way of documenting the fields
  constructor() {
    this.data = null;
  }

  findById(id) {
    return this.data.find(item => item.id === Number(id));
  }

  findByIdAndRemove(id) {
    this.data = this.data.filter(item => item.id !== Number(id));
  }

  findByIdAndUpdate(id, update) {
    let item = this.findById(Number(id));
    if (item) {
      Object.assign(item, update);
    }
    return item;
  }

}
