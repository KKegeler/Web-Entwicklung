//Express einbinden
let express = require("express");
let app = express(); //express server Objekt Instanz
//Server erstellen
let server = require("http").createServer(app);
//Filesystem einbinden(Standardmäßig mit installiert)
let fs = require("fs");

//Mitgegebenes Argument einlesen
let port = process.argv[2];
let portnumber;

//falls Port als Argument mitgegeben, Port setzen
if (typeof port !== "undefined") {
	server.listen(port);
	portnumber = port;
}
//falls Kein Argument mitgegeben, Port auf 8080 setzen
else {
	server.listen(8080);
	portnumber = 8080;
}
//Liefert statische Dateien aus Ordner public/generated
app.use(express.static(__dirname + "/public/generated"));

//Wenn /tracklist aufgerufen wird alle Dateien im Ordner durchgehen und die Tracknamen zurueckliefern
app.get("/tracklist", function (req, res) {
	let names = [];
	let ids = [];
	let files = fs.readdirSync("./Daten");
	files.forEach(function (file) {
		let jsonDatei = require("./Daten/" + file);
		let name = jsonDatei.features[0].properties.name;
		let to = file.indexOf(".");
		let id = file.slice(0, to);
		names.push(name);
		ids.push(id);
	});

	let obj = { names, ids };
	res.json(obj);
	res.end();
});

//Wenn auf ein Track geklickt wird, die entsprechenden Koordinaten zurückliefern
app.get("/tracklist/:id", function (req, res) {
	let jsonFile = require("./Daten/" + req.params.id + ".json");
	let coordinates = [];
	for (let i = 0; i < jsonFile.features[0].geometry.coordinates.length; i++) {
		let coordPunkt = [jsonFile.features[0].geometry.coordinates[i][1], jsonFile.features[0].geometry.coordinates[i][0], jsonFile.features[0].geometry.coordinates[i][2]];
		coordinates.push(coordPunkt);
	}
	res.json(coordinates);
});

//Portnummer in die Konsole schreiben
console.log("Der Server laeuft nun unter http://127.0.0.1:" + portnumber + "/");
