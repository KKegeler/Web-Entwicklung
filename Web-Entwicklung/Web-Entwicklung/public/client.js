var map;
var polyline;
var eintraegeProSeite;
var list = document.getElementById("list");
//npm modul google-maps einbinden (Wrapper für Google Maps API)
var GoogleMapsLoader = require("google-maps");
var previous = document.getElementById("previousPage");
var next = document.getElementById("nextPage");
var current = document.getElementById("currentPage");
var pages = document.getElementById("Pages");
var url = document.URL;
//API-Key setzen
GoogleMapsLoader.KEY = "AIzaSyAqOM-iRIWZHE6f5x0wUF7fAFvCPuyKAFY";

//Google Maps API laden
GoogleMapsLoader.load(function (google) {
	//Map-Options setzen
	var mapOptions = {
		//Längengrad und Breitengrad von Trier angeben
		center: new google.maps.LatLng(49.751185, 6.636405),
		//Zoom setzen
		zoom: 13
	};
	//Map erstellen und in div Element einfügen
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	polyline = new google.maps.Polyline({ strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 });
});

//Hilfsfunktion zum Element erstellen
function createNode(element) {
	return document.createElement(element);
}
//Hilffunktion zum anhängen an ein element;
function append(parent, el) {
	return parent.appendChild(el);
}
//Client stellt beim Webseite starten anfrage an den Server für die Trackliste
fetch(url + "tracklist").then(response => {
	if (response.ok) {
		return response.json();
	}
	else {
		return null;
	}
}).then(result => {
	fuelleListe(result);
}).catch(error => {
	console.error(error.message);
});

//Paginierungsfunktion
function paginate() {
	//benötigte Werte holen
	let currentPage = parseInt(current.textContent);
	let children = list.childNodes;
	let seiten = Math.floor(children.length / eintraegeProSeite) + 1;

	if (seiten === 67) {
		seiten = 65;
	}

	pages.innerHTML = seiten;

	//Nicht benötigte Einträge unsichtbar machen
	for (let v = 1; v < children.length; v++) {
		let id = children[v].getAttribute("id");
		let elem = document.getElementById(id);
		if (v > eintraegeProSeite) {
			elem.style.display = "none";
			//elemente ausblenden
		}
		else {
			elem.style.display = "block";
		}
	}

	//OnClick Listener von previous
	previous.onclick = function () {
		currentPage = parseInt(current.textContent);
		if (currentPage === 1) {
			current.innerHTML = currentPage;
		}
		else {
			let neuePage = currentPage - 1;
			current.innerHTML = neuePage;
			togglePages(neuePage);
		}
	};

	//OnClick Listener von Next
	next.onclick = function () {
		let pagesValue = parseInt(pages.textContent);
		currentPage = parseInt(current.textContent);
		if (currentPage === pagesValue) {
			console.log("Next OnClick if");
			current.innerText = currentPage;
		}
		else {
			console.log("Next OnClick else");
			let neuecurrentPage = currentPage + 1;
			current.innerText = neuecurrentPage;
			togglePages(neuecurrentPage);
		}
	};
}

//Wenn umgeschaltet wird,sichtbarkeiten umschalten
function togglePages(currentPage) {
	let vorherigeSeite = currentPage - 1;
	let von = (eintraegeProSeite * vorherigeSeite) + 1;
	let bis = currentPage * eintraegeProSeite;
	let childs = list.childNodes;

	for (let i = 1; i < childs.length; i++) {
		let Id = childs[i].getAttribute("id");
		document.getElementById(Id).style.display = "none";
	}

	for (let i = von; i <= bis; i++) {
		let id = childs[i].getAttribute("id");
		document.getElementById(id).style.display = "block";
	}
}

//Die Einträge pro Seite berechnen,wird am Anfang aufgerufen und bei jedem Reseize
function eintraegeProSeiteBerechnen() {
	let browserhöhe = window.innerHeight;
	console.log(browserhöhe);
	let neueeintraege = Math.round((browserhöhe - 18) / 32);
		//Math.round(((browserhöhe / 10) / 2) - 2);
	eintraegeProSeite = neueeintraege;
	paginate();
}

var latestId = null;
//Client bekommt Trackliste und erstellt die Liste
function fuelleListe(obj) {
	for (var i = 0; i < obj.names.length; i++) {
		let li = createNode("li");
		li.innerHTML = obj.names[i];
		li.setAttribute("ID", "" + obj.ids[i]);
		append(list, li);
	}
	eintraegeProSeiteBerechnen();

	//OnClick wird an die Liste angehangen,client stellt wieder anfrage nach dem speziellen track
	list.onclick = function (event) {
		var geklickteId = event.target.getAttribute("id");
		latestId = geklickteId;
		fetch(url + "tracklist/" + geklickteId).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return null;
			}
		}).then(result => {
			makeCoordinaten(result);
			drawHeightProfile(result);
		}).catch(error => {
			console.error(error.message);
		});
	};
}
//Client bekommt Koordinaten des Tracks zurück und setzt den Pfad der Polyline und die Grenzen
function makeCoordinaten(coords) {
	var path = [];
	var koordinaten = coords;
	GoogleMapsLoader.load(function (google) {
		var bounds = new google.maps.LatLngBounds();
		for (let j = 0; j < koordinaten.length; j++) {
			path.push(new google.maps.LatLng(koordinaten[j][0], koordinaten[j][1]));
			bounds.extend(new google.maps.LatLng(koordinaten[j][0], koordinaten[j][1]));
		}
		polyline.setPath(path);
		polyline.setMap(map);
		map.fitBounds(bounds);
	});
}

var highestGlobal = 0;

//Berechnung des höchsten Wertes einer Route
function getHighest(coords) {
	var vals = coords;
	var tmp = vals[0][2];
	for (var i = 1; i < vals.length; i++) {
		if (tmp < vals[i][2]) {
			tmp = vals[i][2];
		}
	}
	if (highestGlobal < tmp) {
		highestGlobal = tmp;
	}
}

//Berechnung des höchsten Wertes aller Routen
function getHighestGlobal() {
	for (var i = 1; i < 66; i++) {
		fetch(url + "tracklist/" + i).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return null;
			}
		}).then(result => {
			getHighest(result);
		}).catch(error => {
			console.error(error.message);
		});
	}
}
getHighestGlobal();

//Canvas Element erstellen
var myCanvas = createNode("canvas");

//Canvas Element an div anhängen
var myCanvasDiv = document.getElementById("heightProfile");
var ctx = myCanvas.getContext("2d");
append(myCanvasDiv, myCanvas);

//Höhenprofil zeichnen
function drawHeightProfile(coords) {
	var coordinates = coords;
	var heightValues = [];
	var points = coordinates.length;
	//Vorherige Werte speichern
	var prevWidth = myCanvas.width;
	var prevHeight = myCanvas.height;
	//Neue Werte berechnen
	calculateCanvasSize();
	//Abstand für Breite berechnen
	var val = 1.00;
	val /= points;
	val *= myCanvas.width;
	//heightValues befüllen
	for (let i = 0; i < points; i++) {
		heightValues.push(coordinates[i][2]);
	}
	//Alte "Zeichnung" löschen
	ctx.clearRect(0, 0, prevWidth, prevHeight);
	//Neuen Hintergrund zeichnen
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
	ctx.beginPath();
	//Erster Punkt bei 0
	ctx.moveTo(0, myCanvas.height - ((heightValues[0] / highestGlobal) * myCanvas.height));
	var width = val;
	var height;
	for (var j = 1; j < points; j++) {
		//Höhe umrechnen
		height = (heightValues[j] / highestGlobal) * myCanvas.height;
		height = myCanvas.height - height;
		//Linie weiter ziehen
		ctx.lineTo(width, height);
		//Einen Schritt weiter gehen
		width += val;
	}
	//Linie zeichnen
	ctx.strokeStyle = "#FFFFFF";
	ctx.strokeWidth = 20;
	ctx.stroke();
}

//Canvas Größe berechnen in Abhängigkeit der Fenster-Größe
var counter = 0;
function calculateCanvasSize() {
	counter++;
	console.log("calculate: " + counter);
	var w = window.innerWidth;
	var h = window.innerHeight;
	myCanvas.width = w / 4;
	myCanvas.height = h / 4.5;
}

function redraw() {
	//neu zeichnen
	if (latestId !== null) {
		fetch(url + "tracklist/" + latestId).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return null;
			}
		}).then(result => {
			drawHeightProfile(result);
		}).catch(error => {
			console.error(error.message);
		});
	}
}

var resize = 0;
window.addEventListener("resize", resizeActions);
function resizeActions() {
	console.log("resize " + resize);
	resize++;
	current.innerHTML = 1;
	eintraegeProSeiteBerechnen();
	redraw();
}
