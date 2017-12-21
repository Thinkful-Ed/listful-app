Listful App - Middleware
============================


W3D2A Express Middleware
------------------------

### Starter: Starting from a simple API with just 2 endpoints
- app.get('/api/items', (req, res)...
- app.post('/api/items', (req, res)...

### Logger: Create a logger middleware and add it inline to both endpints.
Logger logs the request and then allows the request to continue on.
Discussion:
- Middleware accepts a `request` and `response` object, and a `next` callback
- If `next()` isn't called then the request will hang.
- Notice the repetitive code, let's fix that.

### Move the logger to `app.use(function(){...})`
Discussion:
- Now it is DRY.
- Order matters. Move app.use before, between, and after endpoints.
- Add mount point as a filter `app.use('/api', function(){...})`
- Show how it matches `/api` and logs the remainder
 
### Our demoLogger is nice, but let's replace it with Morgan
Discussion:
- Our demologger gives you an understanding of how Morgan works.

### Auth: Add `auth` middleware to the post endpoint
Auth inspects the request and allows or prevents the request from continuing
Discussion:
- Notice how the middleware must either call `next()` or send a response.
- If it sends a response the cycle is cut short and the rest of the stack is skipped

### Extract inline function and call reference
Discussion:
- Just a bit cleaner and easier to reuse.

### Redirect: Add Redirect middleware
Discussion:
- Request is inspected, if it matches an old URL, then redirect otherwise let continue
- Very common practice in the wild. This is an oversimplistic solution.


### Add Error middleware
Express has a built-in error. 
Discussion:
- Error Handling middleware uses the `(err, req, res, next)` signature
- Use it to override built-in handler and provide a better message to the user

W3D2P Modules
-----------------

### Modularize the middleware
The `server.js` is getting long. Modularize the code:
- Move each function into a separate file
- Add `use strict;` and `module.exports = ...` 
- On `server.js` require each module
Discussion:
- `module.exports` gets exported.
- Can be and JS value, string, number, array, function or object
- Consistently exporting an Object is easiest, most flexible
- Be careful of using `exports`
  - `module.export === exports` at start
  - `exports.foo = 123` is OK
  - `exports = {foo: 123}` is BAD



middleware drills
demoLogger - app.use
demoCORS   - app.use
demoAuth   - inline middleware

add simple in-memory db - sync version
require db and update endpoints

create basic 404 catch-all
create basic error catch-all

update endpoints to use simDB
add try/catch to handle 404's and errors

modularize: move middleware to folder and export

Note: client remains the same