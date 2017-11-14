'use strict';

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

module.exports = {demoRedirect};