'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const util = require('util');
const { PORT } = require('./config');

const itemRouter = require('./routers/item.router');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json()); // parse JSON body
app.use(cors());

// GET /items   ==>> /35
app.use('/api/items', itemRouter);

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});


// Promisify .listen() and .close()
app.listenAsync = function (port) {
  return new Promise((resolve, reject) => {
    this.listen(port, function () {
      this.closeAsync = util.promisify(this.close);
      resolve(this);
    }).on('error', reject);
  });
};

/** NOTE:
 * if (require.main === module) ...
 * Block only executes if `server.js` is executed using `npm start` or `node server.js`
 * Block does not execute when required like `require('./server');`
 * Prevents error: "Trying to open unclosed connection." when running mocha tests
 */
if (require.main === module) {
  app.listenAsync(PORT)
    .then(server => {
      console.info(`Server listening on port ${server.address().port}`);
    })
    .catch(console.error);
}

module.exports = app; // this if for testing