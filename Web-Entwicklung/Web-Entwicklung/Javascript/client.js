

var list = document.getElementById("list");


var url = document.URL;
var pagination = require("./pagination");
var GoogleMap = require("./GoogleMap");


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
	GoogleMap.fillList(result);
}).catch(error => {
	console.error(error.message);
});

//Paginierungsfunktion


//Wenn umgeschaltet wird,sichtbarkeiten umschalten
module.exports = createNode(), append();


