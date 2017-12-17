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

const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('sanity check and setup', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('1 + 1 should equal 2', function () {
    expect(1 + 1).to.equal(2);
  });

  it('NODE_ENV should be "test"', function () {
    expect(process.env.NODE_ENV).to.equal('test');
  });

});

describe('Basic Express setup', function () {

  let server; // define server at higher scope so it is available to chai.request()

  before(async function () {
    server = await app.listenAsync();  // set server instance
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

  describe('404 handler', function () {

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
});