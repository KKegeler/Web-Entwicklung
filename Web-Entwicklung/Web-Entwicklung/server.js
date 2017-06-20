//Express einbinden
var express = require("express");
var app = express(); //express server Objekt Instanz
//Server erstellen
var server = require("http").createServer(app);
//Socket.io einbinden und auf Verbindungen warten
var io = require("socket.io").listen(server);
var fs = require("fs");

//Mitgegebenes Argument einlesen
var port = process.argv[2];
var portnummer;

//falls Port als Argument mitgegeben, Port setzen
if (typeof port !== "undefined") {
	server.listen(port);
	portnummer = port;
}
//falls Kein Argument mitgegeben, Port auf 8080 setzen
else {
	server.listen(8080);
	portnummer = 8080;
}
//Liefert statische Dateien aus Ordner public
app.use(express.static(__dirname + "/public/generated"));

//Wenn der Pfad / aufgerufen wird
app.get("/", function (req, res) {
	//So wird die Datei index.html ausgegeben
	res.sendfile(__dirname + "/public/generated/index.html");
});

//Wenn /tracklist aufgerufen wird alle Dateien im Ordner durchgehen und die Tracknamen zurückliefern
app.get("/tracklist", function (req, res) {
	var names = [];
	var files = fs.readdirSync("./Daten");
	files.forEach(function (file) {
		var jsonDatei = require("./Daten/" + file);
		var name = jsonDatei.features[0].properties.name;
		names.push(name);
	});
	res.json(names);
	res.end();
});

//Portnummer in die Konsole schreiben
console.log("Der Server laeuft nun unter http://127.0.0.1:" + portnummer + "/");
