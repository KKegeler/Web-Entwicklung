var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var port = process.argv[2];

server.listen(port);

app.use(express.static(__dirname + "/public"));

// wenn der Pfad / aufgerufen wird
app.get("/", function (req, res) {
	//so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + "/public/index.html");
});

// Portnummer in die Konsole schreiben
console.log("Der Server laeuft nun unter http://127.0.0.1:" + port + "/");
