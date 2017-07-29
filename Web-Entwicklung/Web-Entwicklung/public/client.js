let drawHeightProfile = require("./heightprofile");
let drawLine = require("./line");
let pagination = require("./pagination");
let map;
let polyline;
let current = document.getElementById("currentPage");
let url = document.URL;
let list = document.getElementById("list");
let latestResult = null;

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

//Client stellt beim Webseite starten anfrage an den Server für die Trackliste
fetch(url + "tracklist").then(response => {
	if (response.ok) {
		return response.json();
	}
	else {
		return null;
	}
}).then(result => {
	latestResult = pagination.fillList(result, GoogleMapsLoader, map, polyline);
}).catch(error => {
	console.error(error.message);
});

//Liste onclick-Listener
list.onclick = function (event) {
	console.log("onclick");
	let clickedId = event.target.getAttribute("id");
	//Wenn man Liste anklickt statt Element,wird Fehler abgefangen
	if (clickedId !== "list") {
		fetch(url + "tracklist/" + clickedId).then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				return null;
			}
		}).then(result => {
			drawLine(GoogleMapsLoader, map, polyline, result);
			drawHeightProfile(result);
			latestResult = result;
		}).catch(error => {
			console.error(error.message);
		});
	}
};

//Listener für Änderung der Fenstergröße
window.addEventListener("resize", resizeActions);
function resizeActions() {
	current.innerHTML = 1;
	pagination.calculateEntriesPerPage();
	if (latestResult !== null) {
		drawLine(GoogleMapsLoader, map, polyline, latestResult);
		drawHeightProfile(latestResult);
	}
}
