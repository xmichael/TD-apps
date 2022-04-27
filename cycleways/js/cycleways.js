'use strict';

const BR_BOUNDS = L.latLngBounds(L.latLng(-4.265536, 52.394051), L.latLng(-3.477471, 52.798697));

import {html_legend_cycleways} from './cycleways_ui.js';

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

    /* CycleOSM lite (zoom 11-20) where everything is prerendered with custom cartocss */
    var cyclosm_lite = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png', {
        attribution: 'CyclOSM Lite',
        minZoom: 11,
        maxZoom: 20
    });
	
    /* OSM Piano (from CycleOSM) -- can be used instead of grayscale OSM but is too basic */
    var piano = L.tileLayer('https://{s}.piano.tiles.quaidorsay.fr/fr/{z}/{x}/{y}.png', {
	attribution: 'Tiles <a href="https://github.com/tilery/pianoforte">PianoFr</a> | &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 20
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

    /* My cycleways geojson wheere everything is just a line */
    var cycleways = L.geoJSON(cycleways_in_BR, {
	minZoom: 10,
	maxZoom: 11,
	style: {
	    "color": "#0000FF",
	    "stroke": true,
	    "fill": false,
	    "weight": 3,
	    "opacity": 0.3
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
	layers: [osmgray],
    });
    
    map.attributionControl.setPrefix('');

    var basemaps = {
	"OpenStreetMap Grayscale": osmgray,
	"No background": white
    };


    // Don't allow scrolling outside initial view
    map.setMaxBounds(map.getBounds());
    // Don't allow scrolling outside Dyfi BR
    //map.setMaxBounds(BR_BOUNDS);

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);
    cycleways.addTo(map);
    cyclosm_lite.addTo(map);
    
    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1500);

    /*********************/
    /****** LEGEND ********/
    var legend = L.control({
	position: 'bottomright'
    });

    legend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML += `
    <div id="cycleways_legend" class="d-flex flex-column">
    </div>
    `;
	var draggable = new L.Draggable(div);
	draggable.enable();

	return div;
    };

    legend.addTo(map);

    /*********************/

    $('#cycleways_legend').html(html_legend_cycleways);
});
