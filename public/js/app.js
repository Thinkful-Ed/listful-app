/* global $ Api Render Store */
'use strict';

const api = new Api('/v1/items');
const store = new Store();
const render = new Render(store, api);

$(() => {

  (async function () {
    try {
      const response = await api.search();
      store.data = response;
      render.shoppingList();
    } catch (err) {
      console.error(err);
    }
  })();

  $('#js-shopping-list-form').submit(async event => {
    event.preventDefault();

    const inputForm = $(event.currentTarget);
    const newItemInput = inputForm.find('input[name=shopping-list-input]');

    try {
      const response = await api.create({ name: newItemInput.val() });
      newItemInput.val('');
      store.data.unshift(response);
      render.shoppingList();
    } catch (err) {
      console.log('catching err', err)
      console.error(err);
    }
  });

  $('.js-shopping-list').on('click', '.js-item-toggle', async event => {
    event.preventDefault();
    const id = $(event.currentTarget).closest('.js-item-id-element').attr('data-item-id');
    const item = store.findById(id);

    try {
      const response = await api.update(id, { checked: !item.checked });
      item.checked = response.checked;
      render.shoppingList();
    } catch (err) {
      console.error(err);
    }
  });

  $('.js-shopping-list').on('click', '.js-item-delete', async event => {
    event.preventDefault();
    const id = $(event.currentTarget).closest('.js-item-id-element').attr('data-item-id');
    try {
      await api.remove(id);
      store.findByIdAndRemove(id);
      render.shoppingList();
    } catch (err) {
      console.error(err);
    }
  });

  $('.js-shopping-list').on('change', '.js-shopping-item', async event => {
    event.preventDefault();
    const id = $(event.currentTarget).closest('.js-item-id-element').attr('data-item-id');
    const itemUpdate = { name: $(event.currentTarget).val() };

    try {
      await api.update(id, itemUpdate);
      store.findByIdAndUpdate(id, itemUpdate);
      render.shoppingList();
    } catch (err) {
      console.error(err);
    }
  });

});
