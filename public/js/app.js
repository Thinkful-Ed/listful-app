/* global $ Api Render Store */
'use strict';

const api = new Api('/v1/items');
const store = new Store();
const render = new Render(store, api);

$(() => {

  api.search()
    .then(response => {
      store.data = response;
      render.shoppingList();
    })
    .catch(console.error);

  $('#js-shopping-list-form').submit(event => {
    event.preventDefault();

    const inputForm = $(event.currentTarget);
    const newItemInput = inputForm.find('.js-shopping-list-input');

    api.create({ name: newItemInput.val() })
      .then(response => {
        newItemInput.val('');
        store.data.unshift(response);
        render.shoppingList();
      })
      .catch(console.error);
  });

  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    event.preventDefault();
    const id = $(event.currentTarget).closest('.js-item-id-element').attr('data-item-id');
    const item = store.findById(id);

    api.update(id, { checked: !item.checked })
      .then(response => {
        item.checked = response.checked;
        render.shoppingList();
      })
      .catch(console.error);
  });

  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    event.preventDefault();
    const id = $(event.currentTarget).closest('.js-item-id-element').attr('data-item-id');

    api.remove(id)
      .then(() => {
        store.findByIdAndRemove(id);
        render.shoppingList();
      })
      .catch(console.error);
  });

  $('.js-shopping-list').on('change', '.js-shopping-item', event => {
    event.preventDefault();
    const id = $(event.currentTarget).closest('.js-item-id-element').attr('data-item-id');
    const itemUpdate = { name: $(event.currentTarget).val() };

    api.update(id, itemUpdate)
      .then(() => {
        store.findByIdAndUpdate(id, itemUpdate);
        render.shoppingList();
      })
      .catch(console.error);

  });

});
