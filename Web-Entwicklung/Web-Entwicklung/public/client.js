﻿//npm modul google-maps einbinden (Wrapper für Google Maps API)
var map;
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
function fuelleListe(names) {
	console.dir("Namen" + names);
	names.forEach(function (name) {
		let li = createNode("li");
		li.innerHTML = name;
		append(list, li);
	});
	list.onclick = function (event) {

	};
}
