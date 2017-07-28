var Modul = (function (modul) {
	var previous = document.getElementById("previousPage");
	var next = document.getElementById("nextPage");
	var current = document.getElementById("currentPage");
	var pages = document.getElementById("Pages");
	var entriesPerPage;

	function paginate() {
		//benötigte Werte holen
		let currentPage = parseInt(current.textContent);
		let children = list.childNodes;
		let currentPages = Math.floor(children.length / entriesPerPage) + 1;

		if (currentPages === 67) {
			currentPages = 65;
		}

		pages.innerHTML = currentPages;

		//Nicht benötigte Einträge unsichtbar machen
		for (let v = 1; v < children.length; v++) {
			let id = children[v].getAttribute("id");
			let elem = document.getElementById(id);
			if (v > entriesPerPage) {
				elem.style.display = "none";
				//elemente ausblenden
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
				//console.log("Next OnClick if");
				current.innerText = currentPage;
			}
			else {
				//console.log("Next OnClick else");
				let newCurrentPage = currentPage + 1;
				current.innerText = newCurrentPage;
				togglePages(newCurrentPage);
			}
		};
	}

	function togglePages(currentPage) {
		let previousPage = currentPage - 1;
		let from = (entriesPerPage * previousPage) + 1;
		let to = currentPage * entriesPerPage;
		let children = list.childNodes;

		for (let i = 1; i < children.length; i++) {
			let id = children[i].getAttribute("id");
			document.getElementById(id).style.display = "none";
		}

		for (let i = from; i <= to; i++) {
			let id = children[i].getAttribute("id");
			document.getElementById(id).style.display = "block";
		}
	}

	//Die Einträge pro Seite berechnen,wird am Anfang aufgerufen und bei jedem Reseize
	modul.calculateEntriesPerPage = function () {
		console.log("CalculateEntries");
		let browserHeight = window.innerHeight;
		//console.log(browserHeight);
		//Berechnung durch Höhe des Fensters - Höhe der Pagination div geteilt durch Höhe pro li-Element
		let newEntries = Math.round((browserHeight - 22) / 32);
		entriesPerPage = newEntries;
		paginate();
	}

	return modul;
}(Modul || {}));


