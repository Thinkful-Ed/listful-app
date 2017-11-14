'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());

const demoLogger = function (req, res, next) {
  const now = new Date();
  console.log(`${now.toLocaleString()} ${req.method} ${req.url}`);
  next();
};

const demoAuth = function (req, res, next) {
  if (req.query.token === 12345) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const redirects = {
  '/items': '/api/items',
  '/old-url-1': '/new-url-1',
  '/old-url-2': '/new-url-2',
  '/old-url-3': '/new-url-1',
  '/old-url-4': '/new-url-2'
};

/* Note:
 - `req.path` is the path without the querystring
 - `req.url` is the url including the querystring
 */
function demoRedirect(map) {
  return function demoRedirects(req, res, next) {
    if (map[req.path]) {
      res.redirect(301, map[req.url]);
    } else {
      next();
    }
  };
}

app.use(demoLogger);
app.use(demoRedirect(redirects));
app.use(cors());

app.get('/api/items', (req, res) => {
  res.send('Show a list of items');
});

app.post('/api/items', demoAuth, (req, res) => {
  res.send(`Create a specific item ${req.body.name}`);
});

app.get('/throw', (req, res) => {
  throw new Error('Boom!!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));
