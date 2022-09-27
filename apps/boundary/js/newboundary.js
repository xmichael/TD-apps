'use strict';

/** main **/
$(document).ready(function() {
    var spinner = $('.spinner');

    /***** OVERLAYS ****/
    
    //  .. OpenStreetMap
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 4,
	maxNativeZoom: 19,
	maxZoom: 20
    });

    var osmgray = L.tileLayer.grayscale('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 4,
	maxNativeZoom: 19,
	maxZoom: 20
    });

    /* OSM Piano (from CycleOSM) */
    var piano = L.tileLayer('https://{s}.piano.tiles.quaidorsay.fr/fr/{z}/{x}/{y}.png', {
	attribution: 'Tiles <a href="https://github.com/tilery/pianoforte">PianoFr</a> | &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 20,
    });

    /***** OVERLAYS ****/
    
    /* Dyfi Biosphere Reserve outline */
    var boundary = L.geoJSON(dyfi_boundary, {
	minZoom: 8,
	maxZoom: 20,
	style: {
	    "color": "#FF0000",
	    "stroke": true,
	    "fill": false,
	    "weight": 5,
	    "opacity": 0.65
	}
    });

    //  white background
    var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==", {
	minZoom: 4,
	maxZoom: 20
    });

    /***** MAP ****/
    
    var map = L.map('map', {
	center: [52.60, -4.040],
	zoom: 10,
	minZoom: 10,
	maxZoom: 20,
	fadeAnimation: false,
	layers: [osmgray]
    });
    
    map.attributionControl.setPrefix('');

    var basemaps = {
	"OpenStreetMap Grayscale": osmgray,
	"No background": white
    };


    // Don't allow scrolling outside initial view
    map.setMaxBounds(map.getBounds());

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1500);


});
