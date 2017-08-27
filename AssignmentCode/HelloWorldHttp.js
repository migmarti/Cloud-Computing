// Carga el modulo http para crear un servidor http.
var http = require('http');

// Configurar el servidor http para responder con "Hello World" a todos los requests.
// Escucha en el puerto 8080.
http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
}).listen(8080);

// Mostrar un mensaje para informar que el servidor ya fue levantado.
console.log("Server running at http://127.0.0.1:8080/");
