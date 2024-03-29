'use strict';

import food_data from '../data/site_work_plans.js';
import {descriptions, keywords, utils} from './swp_ui.js';
import {get_transtext} from '../../../js/mf_i18n.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

/* Show intro modal
   params:
   _id : the id of the element for the modal
   text: the actual html text
 */

function add_intro_modal(_id, text) {
    var html = `
      <!-- modal-{sm,lg,xl} -->
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${get_transtext('site_work_plans_intro_title')}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
               ${text}
            </div>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;
    $('#' + _id).html(html).modal();
}

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
			       `<b>${utils.get_translated_property(props,"Name")}</b><br/>
      ${props["Address"]}` : get_transtext('site_work_plans_click_on_icon');
    };

    return info.addTo(_map);
}

/** Create an HTML div to display a histories feature */
function create_html_popup( feature ){
   
}

/** Add the markers on map and with dynamic popup content */
function add_histories_markers(_map, _histories, _info){


    var storeIcon = L.icon({
	iconUrl: 'data/icons/distributor.svg',
	iconSize: [28, 33]
    });
    var growIcon = L.icon({
	iconUrl: 'data/icons/grow.svg',
	iconSize: [28, 33]
    });
    var socialIcon = L.icon({
	iconUrl: 'data/icons/social_farming.svg',
	iconSize: [28, 33]
    });
    var compostIcon = L.icon({
	iconUrl: 'data/icons/compost.svg',
	iconSize: [28, 33]
    });

    /** Add markers */
    var hist_layer = L.geoJSON(_histories, {
	minZoom: 1,
	maxZoom: 20,
	pointToLayer: function(feature, latlng){
	    var x = feature.properties["Keywords (EN)"]; 
	    if (x.includes('Community Composting'))
		return L.marker(latlng, {icon: compostIcon});
	    if (x.includes('Social Farming'))
		return L.marker(latlng, {icon: socialIcon});
	    if (x.includes('Community Growing'))
		return L.marker(latlng, {icon: growIcon});
	    // dodgy points are displayed with a store icon
	    return L.marker(latlng, {icon: storeIcon});
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
		    /* NOTE: overriding short popup for now. Immediately open the modal when clicking an icon*/
		    GLOBALS.descriptions.modal('description_modal', GLOBALS.history_props[layer.feature.properties["ID"]]);
		}
            });
	    /* NOTE: overriding short popup for now. Immediately open the modal when clicking an icon*/
	    var props = feature.properties;
	    var base = props["ID"];
	    /* create index by "ID" needed by onclick handlers */
	    window.GLOBALS.history_props[base] = feature;
	}
    });

    hist_layer.addTo(_map);

    return hist_layer;
    //marker.bindPopup(popup_long);
    //L.popup().setLatLng(e.latlng).setContent("test").openOn(_map)
}

/** Remove the sidebar */
function remove_sidebar(){
	// remove sidebar, resize bootstrap grid, resize leaflet by triggering resize event
	document.getElementById("sidebar-box").remove();
	document.getElementById("map-box").classList.remove('col-sm-10');
	document.getElementById("map-box").classList.add('col-sm-12');
	window.dispatchEvent(new Event('resize'));  
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
	maxNativeZoom: 19,
	maxZoom: 20
    });

    /* Dyfi Biosphere Reserver outline */
    var boundary = L.geoJSON(dyfi_boundary, {
	minZoom: 3,
	maxZoom: 20,
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
	zoom: 11,
	minZoom: 10,
	maxZoom: 20,
	wheelPxPerZoomLevel: 200,
	fadeAnimation: false,
	layers: [osm]
    });
    
    map.attributionControl.setPrefix('');
    
    window.GLOBALS.leaflet_map = map;

    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    var info = add_info(map);
    var hist_layer = add_histories_markers(map, food_data, info);

    spinner.show();
    setTimeout(function() {
	spinner.hide();
    }, 1000);

    
    // console.log(food_data);
    var set = keywords.createSet(food_data,"Keywords");
    $('#food_keywords').html(keywords.createHTML(set));

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
		for ( var k of utils.get_translated_property(layer.feature.properties, "Keywords") ){
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

    /*********************/
    // IF "categories" is specified in URL query string then enable only this checkbox
    let category = new URLSearchParams(document.location.search).get("category");
    let category_map = {
	"community_growing" : "Community Growing",
	"field_scale_trials" : "Field Scale Trial",
	"csa_cluster": "CSA Cluster",
	"community_composting": "Community Composting",
	"perennial_green_manures": "Perennial Green Manures"
    };
    if ( category in category_map ){	
	// pre-select category on sidebar
	document.getElementById(category_map[category]).click();
	//remove_sidebar();
    }
    /** SPECIAL CATEGORIES */
    // category === "all" is only used at the gateway index.html and produces a different intro screen WITHOUT a sidebar
    else if (category === "all"){
	document.getElementById("Field Scale Trial").click();
	add_intro_modal('description_modal',get_transtext('gateway_intro_body'));
	remove_sidebar();
    }
    // used to select csa_cluster with a different intro screnn and WITHOUT a sidebar
    else if (category === "csa_only"){
	document.getElementById("CSA Cluster").click();
	add_intro_modal('description_modal',get_transtext('csa_only_intro_body'));
	remove_sidebar();
    }
    // ONLY display modal IF no category is preselected
    else { 
	add_intro_modal('description_modal',get_transtext('site_work_plans_intro_body'));
    }
    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);

});
