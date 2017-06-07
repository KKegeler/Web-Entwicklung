var map;
var GoogleMapsLoader = require("google-maps"); // only for common js environments
GoogleMapsLoader.KEY = "AIzaSyAqOM-iRIWZHE6f5x0wUF7fAFvCPuyKAFY";

GoogleMapsLoader.load(function (google) {
	var mapOptions = {
		center: new google.maps.LatLng(49.751185, 6.636405),
		zoom: 13
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
});
