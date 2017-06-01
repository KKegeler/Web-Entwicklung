(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.initMap = function () {
	var mapOptions = {
		center: new google.maps.LatLng(49.751185, 6.636405),
		zoom: 13
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


function initMap() {
	var mapOptions = {
		center: new google.maps.LatLng(49.751185, 6.636405),
		zoom: 13
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


},{}]},{},[1]);
