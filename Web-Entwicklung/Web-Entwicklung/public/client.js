window.initMap = function () {
	var mapOptions = {
		center: new google.maps.LatLng(49.751185, 6.636405),
		zoom: 13
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
};
