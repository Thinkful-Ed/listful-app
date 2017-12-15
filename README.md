Listful App - RESTful
============================

remove `/boom` endpoint
update simDB to async with callbacks
Discuss error-first callbacks
update endpoints invoke simDB with callbacks with error and 404 handlers

update error and 404 handlers to be more sophisticated

REST: Add PUT, PATCH and DELETE endpoints

Update client to support PUT, PATCH and DELETE

Move endpoints to express router and export
require router and implement using `app.use`


curl -X GET http://localhost:8080/v1/items


curl -X GET http://localhost:8080/v1/items/1003



curl -X POST http://localhost:8080/v1/items -H 'Content-Type: application/json' -d '{
"name": "Peaches", "checked": false}'

curl -X GET http://localhost:8080/v1/items



curl -X PUT http://localhost:8080/v1/items/1005 -H 'Content-Type: application/json' -d '{
"name": "Watermelon"}'

curl -X GET http://localhost:8080/v1/items/1005




curl -X PATCH http://localhost:8080/v1/items/1007 -H 'Content-Type: application/json' -d '{
"name": "Oranges"}'

curl -X GET http://localhost:8080/v1/items/1007




curl -X DELETE http://localhost:8080/v1/items/1009

curl -X GET http://localhost:8080/v1/items/1009