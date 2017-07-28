let map;
let polyline;
let entriesPerPage;
let list = document.getElementById("list");
let previous = document.getElementById("previousPage");
let next = document.getElementById("nextPage");
let current = document.getElementById("currentPage");
let pages = document.getElementById("Pages");
let url = document.URL;
//npm modul google-maps einbinden (Wrapper für Google Maps API)
let GoogleMapsLoader = require("google-maps");
//API-Key setzen
GoogleMapsLoader.KEY = "AIzaSyAqOM-iRIWZHE6f5x0wUF7fAFvCPuyKAFY";

//Google Maps API laden
GoogleMapsLoader.load(function (google) {
	//Map-Options setzen
	let mapOptions = {
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
	fillList(result);
}).catch(error => {
	console.error(error.message);
});

//Paginierungsfunktion
function paginate() {
	//benötigte Werte holen
	let currentPage = parseInt(current.textContent);
	let children = list.childNodes;
	let currentPages = Math.floor(children.length / entriesPerPage) + 1;
	//Falls Fenster zu klein -> maximale Seitenzahl = eine Seite pro Route
	if (currentPages === 67) {
		currentPages = 65;
	}
	//Aktuelle Seitenzahl anzeigen
	pages.innerHTML = currentPages;

	//Nicht benötigte Einträge unsichtbar machen
	for (let v = 1; v < children.length; v++) {
		let id = children[v].getAttribute("id");
		let elem = document.getElementById(id);
		if (v > entriesPerPage) {
			//Elemente ausblenden
			elem.style.display = "none";
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
			let newPage = currentPage - 1;
			current.innerHTML = newPage;
			togglePages(newPage);
		}
	};

	//OnClick Listener von Next
	next.onclick = function () {
		let pagesValue = parseInt(pages.textContent);
		currentPage = parseInt(current.textContent);
		if (currentPage === pagesValue) {
			current.innerText = currentPage;
		}
		else {
			let newCurrentPage = currentPage + 1;
			current.innerText = newCurrentPage;
			togglePages(newCurrentPage);
		}
	};
}

//Wenn umgeschaltet wird,sichtbarkeiten umschalten
function togglePages(currentPage) {
	let previousPage = currentPage - 1;
	//von wo bis wo anzeigen
	let from = (entriesPerPage * previousPage) + 1;
	let to = currentPage * entriesPerPage;
	let children = list.childNodes;
	//Alle ausblenden
	for (let i = 1; i < children.length; i++) {
		let id = children[i].getAttribute("id");
		document.getElementById(id).style.display = "none";
	}
	//Aktuelle Einträge anzeigen
	for (let i = from; i <= to; i++) {
		//Für max 65 Einträge
		if (i <= 65) {
			let id = children[i].getAttribute("id");
			document.getElementById(id).style.display = "block";
		}
	}
}
//Die Einträge pro Seite berechnen,wird am Anfang aufgerufen und bei jedem Resize
function calculateEntriesPerPage() {
	let browserHeight = window.innerHeight;
	//Berechnung durch Höhe des Fensters - Höhe der Pagination div geteilt durch Höhe pro li-Element
	entriesPerPage = Math.round((browserHeight - 22) / 32);
	paginate();
}
//Zwischenspeicher letzte angeklickte Route
let latestResult = null;
//Erstellen der List-Elemente und Befüllen der Liste
function fillList(obj) {
	for (let i = 0; i < obj.names.length; i++) {
		let li = createNode("li");
		li.innerHTML = obj.names[i];
		li.setAttribute("ID", "" + obj.ids[i]);
		append(list, li);
	}
	calculateEntriesPerPage();
	//OnClick wird an die Liste angehangen,client stellt Anfrage nach dem speziellen Track
	list.onclick = function (event) {
		let clickedId = event.target.getAttribute("id");
		latestId = clickedId;
		fetch(url + "tracklist/" + clickedId).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return null;
			}
		}).then(result => {
			makeCoordinates(result);
			drawHeightProfile(result);
			latestResult = result;
		}).catch(error => {
			console.error(error.message);
		});
	};
}
//Client bekommt Koordinaten des Tracks zurück und setzt den Pfad der Polyline und die Grenzen
function makeCoordinates(coords) {
	let path = [];
	let coordinates = coords;
	GoogleMapsLoader.load(function (google) {
		let bounds = new google.maps.LatLngBounds();
		for (let j = 0; j < coordinates.length; j++) {
			path.push(new google.maps.LatLng(coordinates[j][0], coordinates[j][1]));
			bounds.extend(new google.maps.LatLng(coordinates[j][0], coordinates[j][1]));
		}
		polyline.setPath(path);
		polyline.setMap(map);
		map.fitBounds(bounds);
	});
}

let highestGlobal = 0;

//Berechnung des höchsten Wertes einer Route
function getHighest(coords) {
	let vals = coords;
	let tmp = vals[0][2];
	for (let i = 1; i < vals.length; i++) {
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
	for (let i = 1; i < 66; i++) {
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
let myCanvas = createNode("canvas");

//Canvas Element an div anhängen
let myCanvasDiv = document.getElementById("heightProfile");
let ctx = myCanvas.getContext("2d");
append(myCanvasDiv, myCanvas);

//Höhenprofil zeichnen
function drawHeightProfile(coords) {
	let coordinates = coords;
	let heightValues = [];
	let points = coordinates.length;
	//Vorherige Werte speichern
	let prevWidth = myCanvas.width;
	let prevHeight = myCanvas.height;
	//Neue Werte berechnen
	calculateCanvasSize();
	//Abstand für Breite berechnen
	let val = 1.00;
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
	let width = val;
	let height;
	for (let j = 1; j < points; j++) {
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
function calculateCanvasSize() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	myCanvas.width = w / 4.5;
	myCanvas.height = h / 4.5;
}

//Listener für Änderung der Fenstergröße
window.addEventListener("resize", resizeActions);
function resizeActions() {
	current.innerHTML = 1;
	calculateEntriesPerPage();
	if (latestResult !== null) {
		makeCoordinates(latestResult);
		drawHeightProfile(latestResult)
	}
}
