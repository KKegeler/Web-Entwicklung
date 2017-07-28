var HeightProf = (function () {
	var latestId = null;
	var pagination = require("./pagination");
	var url = document.URL;

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
	var myCanvas = document.createElement("canvas");

	//Canvas Element an div anhängen
	var myCanvasDiv = document.getElementById("heightProfile").appendChild(myCanvas);
	var ctx = myCanvas.getContext("2d");
	//document.appendChild(myCanvasDiv, myCanvas);

	//Canvas Größe berechnen in Abhängigkeit der Fenster-Größe
	var counter = 0;
	function calculateCanvasSize() {
		counter++;
		//console.log("calculate: " + counter);
		var w = window.innerWidth;
		var h = window.innerHeight;
		myCanvas.width = w / 4.5;
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

	//Listener für Änderung der Fenstergröße
	var resize = 0;
	window.addEventListener("resize", resizeActions);
	function resizeActions() {
		//console.log("resize " + resize);
		resize++;
		current.innerHTML = 1;
		pagination.calculateEntriesPerPage();
		redraw();
	}

	return {
		drawHeightProfile: function (coords) {
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
	}
})();
	