//npm modul google-maps einbinden (Wrapper für Google Maps API)
var map;
var polyline;
var eintraegeProSeite;
var list = document.getElementById("list");
var GoogleMapsLoader = require("google-maps");
var paginationdiv = document.getElementById("pagination");
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

function paginate() {
	let browserhöhe = document.documentElement.clientHeight;
	var currentPage = 1;
	let seiten = Math.round(browserhöhe / eintraegeProSeite);
	console.log("Seiten: " + seiten);
	for (var i = 0; i <= seiten; i++) {
		let a = createNode("a");
		a.innerHTML = i + 1;
		a.setAttribute("class", "" + (i + 1));
		append(paginationdiv, a);
	}

	let children = list.childNodes;
	for (let v = 1; v < children.length; v++) {
		//let id = children.
		let id = children[v].getAttribute("id");
		let elem = document.getElementById(id);
		if (v > eintraegeProSeite) {
			elem.style.display = "none";
		} //elemente ausblenden
		else {
			elem.style.display = "block";
		}
	}

	paginationdiv.onclick = function (event) {
		let seitenid = event.target.getAttribute("class");
		let vorherigeSeite = seitenid - 1;
		let von = (eintraegeProSeite * vorherigeSeite) + 1;
		let bis = seitenid * eintraegeProSeite;
		let childs = list.childNodes;
		for (let i = 1; i < childs.length; i++) {
			let Id = childs[i].getAttribute("id");
			document.getElementById(Id).style.display = "none";
		}

		for (let i = von; i < bis; i++) {
			let id = childs[i].getAttribute("id");
			document.getElementById(id).style.display = "block";
		}
	};
}

function eintraegeProSeiteBerechnen() {
	let browserhöhe = document.documentElement.clientHeight;
	let neueeintraege = Math.round((browserhöhe / 2) / 10);
	eintraegeProSeite = neueeintraege;
	console.log("EintraegeProSeite: " + eintraegeProSeite);
	paginate();
}

window.onresize = eintraegeProSeiteBerechnen;
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

var myCanvas = createNode("canvas");
myCanvas.width = 400;
myCanvas.height = 200;
var myCanvasDiv = document.getElementById("heightProfile")
var ctx = myCanvas.getContext("2d");
append(myCanvasDiv, myCanvas);

var highestGlobal = 0;
getHighestGlobal();

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

function drawHeightProfile(coords) {
	var coordinates = coords;
	var heightValues = [];
	var points = coordinates.length;
	var val = 1.00;
	val /= points;
	val *= 400;
	val = Number(val).toFixed(2);
	console.log("Val: " + val);

	for (let i = 0; i < points; i++) {
		heightValues.push(coordinates[i][2]);
	}
	ctx.clearRect(0, 0, 400, 200);
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, 400, 200);
	ctx.beginPath();
	ctx.moveTo(0, 200 - ((heightValues[0] / highestGlobal) * 200));
	var width = parseFloat(val);
	var height;
	for (var j = 1; j < points; j++) {
		height = (heightValues[j] / highestGlobal) * 200;
		height = 200 - height;
		ctx.lineTo(width, height);
		width = Number(parseFloat(parseFloat(width) + parseFloat(val))).toFixed(2);
	}
	console.log("Temp: " + width);
	ctx.strokeStyle = "#FFFFFF";
	ctx.strokeWidth = 20;
	ctx.stroke();
	console.log("Höhenprofil: " + heightValues[0]);
}
