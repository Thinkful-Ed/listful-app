'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const {PORT} = require('./config');
const itemsRouter = require('./routers/itemsRouter');

const app = express();

app.use(morgan('common'));
app.use(express.static('public')); // serve static files
app.use(cors());
app.use(bodyParser.json()); // parse JSON body

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

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});