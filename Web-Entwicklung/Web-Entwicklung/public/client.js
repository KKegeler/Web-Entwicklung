//npm modul google-maps einbinden (Wrapper für Google Maps API)
var map;
var polyline;
var list = document.getElementById("list");
var GoogleMapsLoader = require("google-maps");
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
//Hilffunktion zum anhängen an ein element;
function append(parent, el) {
	return parent.appendChild(el);
}
//Client stellt beim Webseite starten anfrage an den Server für die Trackliste
fetch("http://localhost:8080/tracklist").then(response => {
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
//Client bekommt Trackliste und erstellt die Liste
function fuelleListe(obj) {
	for (var i = 0; i < obj.names.length; i++) {
		let li = createNode("li");
		li.innerHTML = obj.names[i];
		li.setAttribute("ID", "" + obj.ids[i]);
		append(list, li);
	}
	//OnClick wird an die Liste angehangen,client stellt wieder anfrage nach dem speziellen track
	list.onclick = function (event) {
		var geklickteId = event.target.getAttribute("id");
		fetch("http://localhost:8080/tracklist/" + geklickteId).then(response => {
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
	//console.log("TestVariable: " + typeof())
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
