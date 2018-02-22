'use strict';

/**
 * DISCLAIMER:
 * The examples shown below are superficial tests which only check the API responses.
 * They do not verify the responses against the data in the database. We will learn
 * how to crosscheck the API responses against the database in a later exercise.
 */
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');

const data = require('../db/items');
const simDB = require('../db/simDB');

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Items routes', function () {

  let server; // define server at higher scope so it is available to chai.request()

  before(async function () {
    server = await app.listenAsync();  // set server instance
  });

  beforeEach(async function () {
    await simDB.initializeAsync(data);
  });

  afterEach(async function () {
    await simDB.destroyAsync();
  });

  after(async function () {
    await server.closeAsync();
  });

  describe('Express static', function () {

    it('GET request "/" should return the index page', async function () {
      const res = await chai.request(server).get('/');

      expect(res).to.exist;
      expect(res).to.have.status(200);
      expect(res).to.be.html;

    });

  });

  describe('Error handler', function () {

    it('should respond with 404 when given a bad path', async function () {
      const spy = chai.spy();
      try {
        await chai.request(server).get('/bad/path');
        spy();
        expect(spy).to.not.have.been.called();
      } catch (err) {
        expect(err.response).to.have.status(404);
      }

    });

  });

  describe('GET /v1/items', function () {

    it('should return the default of 10 items ', async function () {
      const res = await chai.request(server).get('/v1/items');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(10);

    });

    it('should return a list with the correct right fields', async function () {
      const res = await chai.request(server).get('/v1/items');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(10);
      res.body.forEach(function (item) {
        expect(item).to.be.a('object');
        expect(item).to.include.keys('id', 'name', 'checked');
      });

    });

    it('should return correct search results for a valid query', async function () {
      const res = await chai.request(server).get('/v1/items?name=Apples');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(1);
      expect(res.body[0]).to.be.an('object');
      expect(res.body[0].id).to.equal(1000);
      expect(res.body[0].name).to.equal('Apples');
      expect(res.body[0].checked).to.be.false;

    });

    it('should return an empty array for an incorrect query', async function () {
      const res = await chai.request(server).get('/v1/items?name=FooBars');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(0);

    });

  });

  describe('GET /v1/items/:id', function () {

    it('should return correct items', async function () {
      const res = await chai.request(server).get('/v1/items/1000');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body).to.include.keys('id', 'name', 'checked');
      expect(res.body.id).to.equal(1000);
      expect(res.body.name).to.equal('Apples');
      expect(res.body.checked).to.be.false;

    });

    it('should respond with a 404 for an invalid id', async function () {
      const spy = chai.spy();
      try {
        await chai.request(server).get('/v1/items/9999');
        spy();
        expect(spy).to.not.have.been.called();
      } catch (err) {
        expect(err.response).to.have.status(404);
      }
    });

  });

  describe('POST /v1/items', function () {

    it('should create and return a new item when provided valid data', async function () {
      const newItem = {
        'name': 'Zucchini',
        'checked': false
      };
      const res = await chai.request(server).post('/v1/items').send(newItem);

      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('id', 'name', 'checked');
      expect(res.body.id).to.equal(1010);
      expect(res.body.name).to.equal(newItem.name);
      expect(res.body.checked).to.equal(newItem.checked);
      expect(res).to.have.header('location');

    });

    it('should return an error when missing "name" field', async function () {
      const newItem = {
        'checked': false
      };
      const spy = chai.spy();
      try {
        await chai.request(server).post('/v1/items').send(newItem);
        spy();
        expect(spy).to.not.have.been.called();
      } catch (err) {
        const res = err.response;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `name` in request body');
      }
    });

  });

  describe('PUT /v1/items/:id', function () {

    it('should replace entire item', async function () {
      const item = {
        'name': 'Raisins'
      };
      const res = await chai.request(server).put('/v1/items/1005').send(item);

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('id', 'name');
      expect(res.body).to.not.include.keys('checked');
      expect(res.body.id).to.equal(1005);
      expect(res.body.name).to.equal(item.name);

    });

    it('should respond with a 404 for an invalid id', async function () {
      const item = {
        'name': 'Raisins'
      };
      const spy = chai.spy();
      try {
        await chai.request(server).put('/v1/items/9999').send(item);
        spy();
        expect(spy).to.not.have.been.called();
      } catch (err) {
        expect(err.response).to.have.status(404);
      }
    });

  });

  describe('PATCH /v1/items/:id', function () {

    it('should update item with requested fields', async function () {
      const item = {
        checked: true
      };
      const res = await chai.request(server).patch('/v1/items/1004').send(item);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('id', 'name', 'checked');
      expect(res.body.id).to.equal(1004);
      expect(res.body.name).to.equal('Eggplant');
      expect(res.body.checked).to.equal(true);

    });

    it('should respond with a 404 for an invalid id', async function () {
      const item = {
        'name': 'Raisins'
      };
      const spy = chai.spy();
      try {
        await chai.request(server).patch('/v1/items/9999').send(item);
        spy();
        expect(spy).to.not.have.been.called();
      } catch (err) {
        expect(err.response).to.have.status(404);
      }
    });

  });


  describe('DELETE  /v1/items/:id', function () {

    it('should delete an item by id', async function () {
      const res = await chai.request(server).delete('/v1/items/1005');
      expect(res).to.have.status(204);
    });

    it('should respond with a 404 for an invalid id', async function () {
      const spy = chai.spy();
      try {
        await chai.request(server).delete('/v1/items/9999');
        spy();
        expect(spy).to.not.have.been.called();
      } catch (err) {
        expect(err.response).to.have.status(404);
      }
    });

  });

});
