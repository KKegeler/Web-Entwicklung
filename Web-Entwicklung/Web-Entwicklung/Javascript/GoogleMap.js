var Modul = (function (Modul) {
	//npm modul google-maps einbinden (Wrapper für Google Maps API)
	var GoogleMapsLoader = require("google-maps");
	var pagination = require("./pagination");
	var heightProfile = require("./HeightProfile");
	var map;
	var polyline;
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


	
	//Client bekommt Koordinaten des Tracks zurück und setzt den Pfad der Polyline und die Grenzen
	function makeCoordinates(coords) {
		var path = [];
		var coordinates = coords;
		GoogleMapsLoader.load(function (google) {
			var bounds = new google.maps.LatLngBounds();
			for (let j = 0; j < coordinates.length; j++) {
				path.push(new google.maps.LatLng(coordinates[j][0], coordinates[j][1]));
				bounds.extend(new google.maps.LatLng(coordinates[j][0], coordinates[j][1]));
			}
			polyline.setPath(path);
			polyline.setMap(map);
			map.fitBounds(bounds);
		});
	}

	//Client bekommt Trackliste und erstellt die Liste
	function fillList(obj) {
		let list = document.getElementById("list");
		for (var i = 0; i < obj.names.length; i++) {
			let li = document.createElement("li");
			li.innerHTML = obj.names[i];
			li.setAttribute("ID", "" + obj.ids[i]);
			document.getElementById("list").appendChild(li);
		}
		pagination.calculateEntriesPerPage();
		//pagination.calculateEntriesPerPage();

		//OnClick wird an die Liste angehangen,client stellt wieder anfrage nach dem speziellen track
		list.onclick = function (event) {
			var clickedId = event.target.getAttribute("id");
			heightProfile.latestId = clickedId;
			fetch(url + "tracklist/" + clickedId).then(response => {
				if (response.ok) {
					return response.json();
				}
				else {
					return null;
				}
			}).then(result => {
				makeCoordinates(result);
				heightProfile.drawHeightProfile(result);
			}).catch(error => {
				console.error(error.message);
			});
		};
	}

	return {
		methode1: function () {
			console.log("Test");
		}
	};
})();


