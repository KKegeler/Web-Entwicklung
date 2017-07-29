let url = document.URL;
let highestGlobal = 0;

//Canvas Element erstellen
let myCanvas = document.createElement("Canvas");

//Canvas Element an div anhängen
let myCanvasDiv = document.getElementById("heightProfile");
let ctx = myCanvas.getContext("2d");
myCanvasDiv.appendChild(myCanvas);

//Canvas Größe berechnen in Abhängigkeit der Fenster-Größe
function calculateCanvasSize() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	myCanvas.width = w / 4.5;
	myCanvas.height = h / 4.5;
}

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

//Höhenprofil zeichnen
let drawHeightProfile = function (coords) {
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
};

module.exports = drawHeightProfile;
