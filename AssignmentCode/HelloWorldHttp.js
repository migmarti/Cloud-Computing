// Carga el modulo http para crear un servidor http.
var http = require('http');

// Configurar el servidor http para responder con "Hello World" a todos los requests
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

// Escuchar en el puerto 8000 con el IP 127.0.0.1 (Local)
server.listen(8000);

// Mostrar un mensaje para informar que el servidor ya fue levantado.
console.log("Server running at http://127.0.0.1:8000/");