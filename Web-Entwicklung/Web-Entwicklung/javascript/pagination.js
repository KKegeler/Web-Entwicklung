let previous = document.getElementById("previousPage");
let next = document.getElementById("nextPage");
let current = document.getElementById("currentPage");
let pages = document.getElementById("Pages");
let list = document.getElementById("list");
let entriesPerPage;

//Erstellen der List-Elemente und Befüllen der Liste
let fillList = function (obj) {
	for (let i = 0; i < obj.names.length; i++) {
		let li = document.createElement("li");
		li.innerHTML = obj.names[i];
		li.setAttribute("ID", "" + obj.ids[i]);
		list.appendChild(li);
	}
	calculateEntriesPerPage();
};
//Die Einträge pro Seite berechnen,wird am Anfang aufgerufen und bei jedem Resize
let calculateEntriesPerPage = function () {
	let browserHeight = window.innerHeight;
	//Berechnung durch Höhe des Fensters - Höhe der Pagination div geteilt durch Höhe pro li-Element
	entriesPerPage = Math.round((browserHeight - 22) / 32);
	paginate();
};

//Paginierungsfunktion
function paginate() {
	//benötigte Werte holen
	let currentPage = parseInt(current.textContent);
	let children = list.childNodes;
	let currentPages = Math.ceil((children.length - 1) / entriesPerPage);
	//Falls Fenster zu klein -> maximale Seitenzahl = eine Seite pro Route
	if (currentPages > 65) {
		currentPages = 65;
	}
	//Aktuelle Seitenzahl anzeigen
	pages.innerHTML = currentPages;

	//Nicht benötigte Einträge unsichtbar machen
	for (let v = 1; v < children.length; v++) {
		let id = children[v].getAttribute("id");
		let elem = document.getElementById(id);
		if (v > entriesPerPage) {
			//Elemente ausblenden
			elem.style.display = "none";
		}
		else {
			elem.style.display = "block";
		}
	}

	//OnClick Listener von previous
	previous.onclick = function () {
		currentPage = parseInt(current.textContent);
		if (currentPage === 1) {
			current.innerHTML = currentPage;
		}
		else {
			let newPage = currentPage - 1;
			current.innerHTML = newPage;
			togglePages(newPage);
		}
	};

	//OnClick Listener von Next
	next.onclick = function () {
		let pagesValue = parseInt(pages.textContent);
		currentPage = parseInt(current.textContent);
		if (currentPage === pagesValue) {
			current.innerText = currentPage;
		}
		else {
			let newCurrentPage = currentPage + 1;
			current.innerText = newCurrentPage;
			togglePages(newCurrentPage);
		}
	};
}

//Wenn umgeschaltet wird,sichtbarkeiten umschalten
function togglePages(currentPage) {
	let previousPage = currentPage - 1;
	//von wo bis wo anzeigen
	let from = (entriesPerPage * previousPage) + 1;
	let to = currentPage * entriesPerPage;
	let children = list.childNodes;
	//Alle ausblenden
	for (let i = 1; i < children.length; i++) {
		let id = children[i].getAttribute("id");
		document.getElementById(id).style.display = "none";
	}
	//Aktuelle Einträge anzeigen
	for (let i = from; i <= to; i++) {
		//Für max 65 Einträge
		if (i <= 65) {
			let id = children[i].getAttribute("id");
			document.getElementById(id).style.display = "block";
		}
	}
}

exports.calculateEntriesPerPage = calculateEntriesPerPage;
exports.fillList = fillList;
