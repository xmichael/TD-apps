'use strict';

/* sidebar with crops list in two languages */
import {add_sidebar, add_intro_modal, html_legend_alc2, html_legend_cscp} from './crops_ui.js';
import {gettext} from '../../js/mf_i18n.js';
import {croplist, croplist2select, croplist_create_path} from './croplist.js';

/** global namespace */
window.GLOBALS = {};
/*********************/

/** Get user selection for crop, scenario, year */
function get_selection(value){
    var scenario = $('input[name=scenario]:checked').val();
    var year = $('input[name=year]:checked').val();
    
    var tiff_url = `./data/${year}/${croplist_create_path(value, year, scenario)}`;
    
    return tiff_url;
}


/** Add a geotiff on map */
function add_geotiff(_map, _url){
    /** Add GeoTIFFs */

    //add new _url
    fetch(_url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                //console.log("georaster:", georaster);
                var layer = new GeoRasterLayer({
                    georaster: georaster,
                    attribution: "Produced using outputs from the Welsh Government led Capability, Suitability and Climate Programme project",
                    minZoom: 1,
                    maxZoom: 18,
                    opacity: 0.7,
                    pixelValuesToColorFn: function(x){
                        if (x==0){
                            return '#bfbdb0';
                        }
                        if (x==1)
                        {
                            return '#00ea0b';
                        }
                        if (x==2){
                            return '#ff9827';
                        }
                        return null;
                    }
                });
		//clear map after fetching new one
		_map.eachLayer( function(x){
		    if (x instanceof GeoRasterLayer){
			_map.removeLayer(x);
		    }
		});
		//add new one		
                layer.addTo(_map);
            });
        });  
}

function CSCP_bind_all_inputs(_map, _select){
    $("fieldset :input").change(function() {
	//omg with 3rd party JS libraries...
	const selected_crop = _select[0].selectize.getValue();
	if (selected_crop){
            var url = get_selection(selected_crop);
            add_geotiff(_map,url);
	}
    });
}

$(document).ready(function() {

    /** export Globals -- needed for inline onclick events and for debugging */
    window.GLOBALS = {
        leaflet_map : undefined,
	select_crops: undefined
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

    // ALC2 Grades
    var ALC2 = L.tileLayer('data/tiles/ALC2/{z}/{x}/{y}.png', {
        minZoom: 5,
        attribution: "| © Crown copyright. Mapping derived from soils data © Cranfield University (NSRI) and for the Controller of HMSO 2020 © Crown copyright 2020, the Met Office. Contains OS data © Crown copyright and database right 2020. Contains Natural Resources Wales information © Natural Resources Wales and Database Right.",
        maxNativeZoom: 13,
        maxZoom: 20,
        opacity: 0.5
    });
    
    // Map
    var map = L.map('map', {
        center: [52.6, -3.76],
        zoom: 11,
        minZoom: 10,
        maxZoom: 18,
        fadeAnimation: false,
        layers: [osm]
    });

    map.attributionControl.setPrefix('');
    
    window.GLOBALS.leaflet_map = map;

    // Add overlays (no base maps)
    var overlays = {};
    overlays[`${gettext("Predictive ALC map")} v.2 <span class='text-info'>(${gettext("Contemporary")})</span>`] = ALC2;
    L.control.layers({}, overlays, {
        collapsed: false
    }).addTo(map);


    /* sequence matters for click events on map (lastest grabs clicks) */
    boundary.addTo(map);

    //add_geotiff(map,'./data/old/Barley/Barley_2020-high.tif');
    //add_geotiff(map,'./data/2020/Barley_2020-high_WGS84_clip_b1.tif');

    spinner.show();
    setTimeout(function() {
        spinner.hide();
    }, 1000);

    add_sidebar('sidebar');
    add_intro_modal('description_modal');

    //use selectize for sidebar
    var select_crops = $('#crops').selectize({
	create: false,
    });
    window.GLOBALS.select_crops = select_crops;

    
    /*********************/

    // Fit to overlay bounds
    //map.fitBounds([[52.330180936, -3.36476263021], [52.885998209, -4.39698523643]]);
    CSCP_bind_all_inputs(map, select_crops);


    /*********************/
    /****** LEGEND ********/

    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += `
<div id="crops_legend" class="d-flex flex-column">
</div>
    `;
        var draggable = new L.Draggable(div);
        draggable.enable();

        return div;
    };

    legend.addTo(map);
    
    //start with CSCP legend by default
    $('#crops_legend').html(html_legend_cscp);

    //switch legend when adding ALC2 overlay
    map.on('overlayadd', function(l){
	if (l.name.startsWith('Predictive') || l.name.startsWith('Map ALC')){
	    $('#crops_legend').html(html_legend_alc2);
	}
    });
    map.on('overlayremove', function(l){
	    $('#crops_legend').html(html_legend_cscp);
    });


});

