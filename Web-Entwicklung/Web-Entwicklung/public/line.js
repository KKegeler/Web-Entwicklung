//Client bekommt Koordinaten des Tracks zurück und setzt den Pfad der Polyline und die Grenzen
let drawLine = function (loader, map, line, coords) {
	let path = [];
	let coordinates = coords;
	loader.load(function (google) {
		let bounds = new google.maps.LatLngBounds();
		for (let j = 0; j < coordinates.length; j++) {
			path.push(new google.maps.LatLng(coordinates[j][0], coordinates[j][1]));
			bounds.extend(new google.maps.LatLng(coordinates[j][0], coordinates[j][1]));
		}
		line.setPath(path);
		line.setMap(map);
		map.fitBounds(bounds);
	});
};

module.exports = drawLine;
