var createNode = require("./client");
var append = require("./client");
var highestGlobal = require("./client");

let myCanvas;
let ctx;

function makeCanvas() {
//Canvas Element erstellen
	myCanvas = createNode("canvas");

//Canvas Element an div anhängen
	let myCanvasDiv = document.getElementById("heightProfile");
	ctx = myCanvas.getContext("2d");
	append(myCanvasDiv, myCanvas);
}

//Höhenprofil zeichnen
function drawHeightProfile(coords) {
	makeCanvas();
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
