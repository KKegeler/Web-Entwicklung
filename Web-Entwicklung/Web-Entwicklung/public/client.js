//npm modul google-maps einbinden (Wrapper für Google Maps API)
var map;
var polyline;
var eintraegeProSeite;
var list = document.getElementById("list");
var GoogleMapsLoader = require("google-maps");
var previous = document.getElementById("previousPage");
var next = document.getElementById("nextPage");
var curent = document.getElementById("currentPage");
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

/*
GoogleMapsLoader.event.addDomListener(window, "resize", function () {
	var center = map.getCenter();
	GoogleMapsLoader.maps.event.trigger(map, "resize");
	map.setCenter(center);
	window.alert("Resize triggered!");
});

GoogleMapsLoader.onLoad(function (google) {
	window.alert("onload");
	google.event.addDomListener(window, "resize", function () {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
		window.alert("Resize triggered!");
	});
});*/

//Hilfsfunktion zum Element erstellen
function createNode(element) {
	return document.createElement(element);
}

//Hilfsfunktion zum anhängen an ein element;
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
	let currentPage = parseInt(curent.textContent);
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
		currentPage = parseInt(curent.textContent);
		if (currentPage === 1) {
			curent.innerHTML = currentPage;
		}
		else {
			let neuePage = currentPage - 1;
			curent.innerHTML = neuePage;
			togglePages(neuePage);
		}
	};

	//OnClick Listener von Next
	next.onclick = function () {
		let pagesValue = parseInt(pages.textContent);
		currentPage = parseInt(curent.textContent);
		if (currentPage === pagesValue) {
			console.log("Next OnClick if");
			curent.innerText = currentPage;
		}
		else {
			console.log("Next OnClick else");
			let neuecurrentPage = currentPage + 1;
			curent.innerText = neuecurrentPage;
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
		document.getElementById(id).style.display = "table";
	}
}

//Die Einträge pro Seite berechnen,wird am Anfang aufgerufen und bei jedem Reseize
function eintraegeProSeiteBerechnen() {
	let browserhöhe = document.documentElement.clientHeight;
	console.log(browserhöhe);
	let neueeintraege = Math.round(((browserhöhe / 10) / 2) - 2);
	eintraegeProSeite = neueeintraege;
	paginate();
}

//Wenn Festergröße verändert wird
window.onresize = function () {
	curent.innerHTML = 1;
	eintraegeProSeiteBerechnen();
};

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
		fetch(url + "tracklist/" + geklickteId).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return null;
			}
		}).then(result => {
			makeCoordinaten(result);
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
