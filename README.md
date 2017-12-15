Listful App
============================

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