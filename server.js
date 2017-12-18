'use strict';

const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
const util = require('util');

const { PORT } = require('./config');
const itemsRouter = require('./routers/items.router');

const app = express();

app.use(morgan('common'));
app.use(express.static('public')); // serve static files
app.use(cors());
app.use(express.json()); // parse JSON body

app.use('/v1/items', itemsRouter);

// 404 catch-all
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
// NOTE: we'll prevent stacktrace leak in later exercise
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
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

app.listenAsync(PORT)
  .then(server => {
    console.info(`Server listening on port ${server.address().port}`);
  })
  .catch(console.error);
