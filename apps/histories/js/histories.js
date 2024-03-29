'use strict';

import histories_data from '../data/histories/histories_data.js';
import {descriptions, keywords, add_intro_modal} from './histories_ui.js';
import {get_transtext} from '../../../js/mf_i18n.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

function add_info(_map){
    /** create interactive info panel */
    var info = L.control({position:'topright'});
    info.onAdd = function (_map) {
        this._div = L.DomUtil.create('div', 'info legend');
        this.update();
        return this._div;
    };
    info.update = function (props) {
        this._div.innerHTML = props ?
            `<b>${props["Name of Farmer"]}</b><br/>
                ${props["Name of Farm"]}<br/>
                ${props["Date of Recording"]}`
            : get_transtext("hi_clickonmic");
    };

    return info.addTo(_map);
}

/** Create an HTML div to display a histories feature */
function create_html_popup( feature ){

    var props = feature.properties;
    // image path is base/picture[X].jpg
    var base = props["Clip Name"];
    var pics = props["Pictures"]? props["Pictures"][0] : undefined;
    /* create index by-base needed by onclick handlers */
    window.GLOBALS.history_props[base] = feature;

    return `
  <div>
      <h4>${props["Name of Farmer"]}</h4>
      <h5>${props["Name of Farm"]}</h5>
      <h6>${props["Date of Recording"]}</h6>
      <hr/>
      <div class="text-justify">${window.location.search=="?lang=cy"?
                  props["Cymraeg"]:props["Summary"]}
      </div>
      <div class="text-center">
        <button type="button" class="btn btn-link"
          onclick="GLOBALS.descriptions.modal('description_modal', GLOBALS.history_props.${base})">
          ${get_transtext("hi_see_more")}
        </button>
      </div>
      <div>
        <audio controls>
          <source src="./data/histories/opus/${base}.opus" type="audio/ogg">
          <source src="./data/histories/mp3/${base}.mp3" type="audio/mpeg">
          Your browser does not support the audio element
        </audio>
      </div>
    </div>
  `;
}

/** Add the markers on map and with dynamic popup content */
function add_histories_markers(_map, _histories, _info){


    var historiesIcon = L.icon({
        iconUrl: 'data/histories/mic.png',
        iconSize: [32,47]
    });

    /** Add markers */
    var hist_layer = L.geoJSON(_histories, {
        minZoom: 1,
        maxZoom: 18,
        pointToLayer: function(feature, latlng){
            return L.marker(latlng, {icon: historiesIcon});
        },
        onEachFeature: function(feature, layer){
            /** a) On mouse over/out (hover) update the info box.
             *   b) On mouse click recenter the map
             */
            layer.on({
                mouseover: function(e){
                    _info.update(layer.feature.properties);
                },
                mouseout: function(e){
                    _info.update();
                },
                click: function(e){ //re-center when user clicks a point
                    _map.panTo(e.target.getLatLng());
                }
            });
            layer.bindPopup(create_html_popup(feature));
        }
    });

    hist_layer.addTo(_map);

    return hist_layer;
    //marker.bindPopup(popup_long);
    //L.popup().setLatLng(e.latlng).setContent("test").openOn(_map)
}

$(document).ready(function() {

    /** export Globals -- needed for inline onclick events and for debugging */
    window.GLOBALS = {
        history_props: {},   // features dictionary indexed by "Clip Name"
        descriptions : descriptions, // descriptions UI functions
        leaflet_map : undefined
    };

    var spinner = $('.spinner');

    // Base layers
    //  .. OpenStreetMap
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 4,
        maxZoom: 17
    });

    /* Dyfi Biosphere Reserver outline */
    var boundary = L.geoJSON(dyfi_boundary, {
        minZoom: 3,
        maxZoom: 18,
        style: {
            "color": "#000000",
            "stroke": true,
            "fill": false,
            "weight": 5,
            "opacity": 0.65
        }
    });

    // Map
    var map = L.map('map', {
        center: [52.6, -3.76],
        zoom: 10,
        minZoom: 9,
        maxZoom: 18,
        fadeAnimation: false,
        layers: [osm]
    });
    
    map.attributionControl.setPrefix('');
    
    window.GLOBALS.leaflet_map = map;

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    var info = add_info(map);
    var hist_layer = add_histories_markers(map, histories_data, info);

    spinner.show();
    setTimeout(function() {
        spinner.hide();
    }, 1000);

    add_intro_modal('description_modal');
    
    //console.log(histories_data);
    var set = keywords.createSet(histories_data, (window.location.search=="?lang=cy")? "Keywords-cy": "Keywords");
    $('#histories_keywords').html(keywords.createHTML(set));

    /* handler when user clicks on a filter */
    keywords.bind(
        (checked)=>{
            hist_layer.eachLayer((layer) => {
                // corner-case: when the user deselects all-keywords then enable all features (i.e. none == all aka filters are disabled)
		if (checked.size == 0){
		    //console.log("empty filter. Enabling all features.");
		    layer.getElement().style.display = '';	      
		    return;
		}

		// check each feature's keywords have at least one keyword in the "checked" set.
		// If yes, make those features visible
		for ( var k of layer.feature.properties[(window.location.search=="?lang=cy")? "Keywords-cy": "Keywords"]){
		    if (checked.has(k)){
			if ( layer.getElement().style.display == 'none'){
			    // console.log("re-adding removed layer:" + layer.feature.properties["Clip Name"]);
			    layer.getElement().style.display = '';
			}
			return;
		    }
		}
		// no keyword found. Hide the feature
		//console.log("removing layer:" + layer.feature.properties["Clip Name"]);
		layer.getElement().style.display = 'none';
	    });
	});
});
