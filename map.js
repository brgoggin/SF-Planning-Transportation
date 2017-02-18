/**********************************************************
Section 1. SET UP THE BACKGROUND MAP and Initial Parameters
***********************************************************/

// create the Leaflet map container and initialize some other variables
var map = L.map('map');

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	var initialZoomLevel = 12;
} else {
	var initialZoomLevel = 10;
}

var layerOptions = null;

//initialize data with all dots
var dots = "All";
var dots2 = "All";

//add tile layer basemap to the map
var basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
var basemapAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
var basemapProperties = {minZoom: 10, maxZoom: 16, attribution: basemapAttribution};
var basemap = L.tileLayer(basemapUrl, basemapProperties);
map.addLayer(basemap);

/**************************************************************
Section 2: Generate Map Elements (Change with button) 
**************************************************************/

//create a function to create all the styles and functionality for the point data so it's reusable when we switch datasets dynamically
function createFeatures() {
	//Define Title
	var title = '<h4>SF Development Transportation Mitigation</h4>';
	
	//var button = '<h4>hello</h4>';
	var button = '<button onclick="updateMap();">Update Map</button>';
	
	//Create popup control for when hovering over polygon
	
   var menu = '<select id="mySelect">' +
	'<option value="All">All</option>' + 
    '<option value="No Significant Impacts">No Significant Impacts</option>' +
    '<option value="Significant Impacts">Significant Impacts</option>' +
    '</select>';
	
   var menu2 = '<select id="mySelect2">' +
	'<option value="All">All</option>' + 
    '<option value="CHS Consulting Group">CHS Consulting Group</option>' +
    '<option value="ESA">ESA</option>' +
	'<option value="Fehr & Peers">Fehr & Peers</option>' +
	'<option value="Adavant Consulting">Adavant Consulting</option>' +
    '</select>';


	var catchphrase = 'Click any project for details.'
	
	//Add title box
	info = L.control();

	info.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info');
		div.innerHTML = title  + catchphrase + '<br>' + '<b>Filters</b>' + '<br>' + 'Significant Impacts: ' + menu + '<br>' + 'Consultants: ' + menu2  + '<br>' +  button ;
		return div;
	};

	info.addTo(map);
	
	
	//specify what the circle markers should look like (radius and fill color are dynamically set later)
	var markerStyle = {radius: null, fillOpacity: 0.7, color: '#666666', opacity: 1, weight: 1, fillColor: null};
	var markerStyleHover = {radius: null, fillOpacity: 0.9, color: '#333333', opacity: 1, weight: 3, fillColor: null};


	// specify how to load the individual features: give each its styling and a text popup
	layerOptions = {
		filter: filter,
		pointToLayer: pointToLayer,
	    onEachFeature: onEachFeature
	};
	
	//function to filter out data
	
	function filter(feature, layer) {
		if (dots == "All" & dots2 == "All") {
			return true;
		} else if (dots == "All" & dots2 == "CHS Consulting Group") {
			return feature.properties.Consultant == "CHS Consulting Group";
		} else if (dots == "All" & dots2 == "ESA") {
			return feature.properties.Consultant == "ESA";
		} else if (dots == "All" & dots2 == "Fehr & Peers") {
			return feature.properties.Consultant == "Fehr & Peers";
		} else if (dots == "All" & dots2 == "Adavant Consulting") {
			return feature.properties.Consultant == "Adavant Consulting";
		} else if (dots == "No Significant Impacts" & dots2 == "All") {
			return feature.properties.sig_impacts == "No";
		} else if (dots == "No Significant Impacts" & dots2 == "CHS Consulting Group") {
			return feature.properties.sig_impacts == "No" & feature.properties.Consultant == "CHS Consulting Group";
		} else if (dots == "No Significant Impacts" & dots2 == "ESA") {
			return feature.properties.sig_impacts == "No" & feature.properties.Consultant == "ESA";
		} else if (dots == "No Significant Impacts" & dots2 == "Fehr & Peers") {
			return feature.properties.sig_impacts == "No" & feature.properties.Consultant == "Fehr & Peers";
		} else if (dots == "No Significant Impacts" & dots2 == "Adavant Consulting") {
			return feature.properties.sig_impacts == "No" & feature.properties.Consultant == "Adavant Consulting";
		} else if (dots == "Significant Impacts" & dots2 == "All") {
			return feature.properties.sig_impacts == "Yes";
		} else if (dots == "Significant Impacts" & dots2 == "CHS Consulting Group") {
			return feature.properties.sig_impacts == "Yes" & feature.properties.Consultant == "CHS Consulting Group";
		} else if (dots == "Significant Impacts" & dots2 == "ESA") {
			return feature.properties.sig_impacts == "Yes" & feature.properties.Consultant == "ESA";
		} else if (dots == "Significant Impacts" & dots2 == "Fehr & Peers") {
			return feature.properties.sig_impacts == "Yes" & feature.properties.Consultant == "Fehr & Peers";
		} else if (dots == "Significant Impacts" & dots2 == "Adavant Consulting") {
			return feature.properties.sig_impacts == "Yes" & feature.properties.Consultant == "Adavant Consulting";
		} else {
			return feature.properties.sig_impacts == "Yes";
		}
	}
	
	// function to add data points to map layer with proper styling
	function pointToLayer(feature, latlng) {
			markerStyle.radius = getRadius();
	        return L.circleMarker(latlng, markerStyle);
	}

	function getRadius() {
		//Make dots bigger if viewed on mobile
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		    if (map.getZoom()) { radius = Math.pow(map.getZoom(), 0.9); } //if map already exists, get current zoom level
		    else { radius = Math.pow(initialZoomLevel, 0.9); } //if it's the initial startup, use initial zoom level
		    return radius;
		} else {
		    if (map.getZoom()) { radius = Math.pow(map.getZoom(), 0.8); } //if map already exists, get current zoom level
		    else { radius = Math.pow(initialZoomLevel, 0.8); } //if it's the initial startup, use initial zoom level
		    return radius;
		}	
	}

	//make marker size scale with zoom
	map.on('zoomend', function() {
	    for (var key in geojsonLayer._layers) {
	        geojsonLayer._layers[key].setRadius(getRadius());
	    }
	});

	//check if someone's viewing this page directly instead of in iframe
	function inIframe() {
	    try {
	        return window.self !== window.top;
	    } catch (e) {
	        return true;
	    }
	}


	//************************************************************************
	//define interactions with a feature: clicks and hovers
	//************************************************************************

	function onEachFeature(feature, layer) {
	    layer.on({
	        mouseover: highlightFeature,
	        mouseout: resetHighlight, 
			click: clickFeature
	    });
	}

	//on mouseover, highlight the feature hovered over
	function highlightFeature(e) {
		var target = e.target;
	    markerStyleHover.radius = getRadius() * 1.2; //make radius 20% bigger when hovering
	    target.setStyle(markerStyleHover);
	    target.bringToFront();
		target.bringToFront();
	}

	//on mouseout, reset highlighted feature's style
	function resetHighlight(e) {
		var target = e.target;
	    markerStyle.radius = getRadius();
	    target.setStyle(markerStyle);
	}


	//on click, pan/zoom to feature and show popup
	function clickFeature(e) {
	    var target = e.target;
	    var latlng = target._latlng;
	    var props = target.feature.properties;
		var lat_lon = target.feature.geometry.coordinates;
		var lat = lat_lon[1];
		var zoomLevel = map.getZoom();
		var lon = lat_lon[0];
		var coordinates = {lat: lat, lng: lon};

		var popupContent = '<span class="popup-label"><b>Case Number:</b> ' + props.case_number  + '</span>' +
		'</br><span class="popup-label"><b>Address:</b> ' + props.Address  + '</span>' +
		'</br><span class="popup-label"><b>Consultant:</b> ' + props.Consultant  + '</span>' +
		'</br><span class="popup-label"><b>Significant Impacts?:</b> ' + props.sig_impacts  + '</span>' +
		'</br><span class="popup-label"><b>TIS/Circ Memo:</b> ' + props.TIS_Circ_Memo  + '</span>' + 
		'<button id="desc1" class = "button1">Show Recommended Mitigation Measures</button>' +
		'<br /><span class="description1">' + props.mitigation_measures + '<br />' + '</span>'+
		'<button id="desc2" class = "button2">Show Recommended Improvement Measures</button>' +
		'</br><span class="description2">' + props.improvement_measures  + '<br />' + '</span>'+
		'<button id="desc3" class = "button3">Show Recommended TDM Measures</button>' +
		'</br><span class="description3">' + props.TDM_measures  + '</span>';
		
		
	    var popup = L.popup().setContent(popupContent).setLatLng(latlng);
	    target.bindPopup(popup).openPopup(); 
		
	    //pan to feature and zoom in 1 if map is currently at/above initial zoom
		if (zoomLevel <= initialZoomLevel) { zoomLevel++; }
	    map.setView([lat, lon], zoomLevel);
		
		var descelement1 = document.getElementsByClassName("description1");
		var buttonelement1 = document.getElementsByClassName("button1");
		$(buttonelement1[buttonelement1.length - 1]).click(function(){
			  $(descelement1[descelement1.length - 1]).toggle();
		 });
		 
 		var descelement2 = document.getElementsByClassName("description2");
 		var buttonelement2 = document.getElementsByClassName("button2");
 		$(buttonelement2[buttonelement2.length - 1]).click(function(){
 			  $(descelement2[descelement2.length - 1]).toggle();
 		 });
		 
  		var descelement3 = document.getElementsByClassName("description3");
  		var buttonelement3 = document.getElementsByClassName("button3");
  		$(buttonelement3[buttonelement3.length - 1]).click(function(){
  			  $(descelement3[descelement3.length - 1]).toggle();
  		 });
		 

		 //updates popup content so that toggling works when opening popup a second time in the same session
		 target.updatePopup();

	}//end of defining interactions: clicks and hovers
	
}//end of createFeatures()

//create all the styles and functionality for the point data
createFeatures();

//***********************************************************************************
//Section 4: switch between recently completed and currently proposed development
//***********************************************************************************

function updateMap() {
dots = document.getElementById("mySelect").value;
dots2 = document.getElementById("mySelect2").value;
//remove the old data from the map and add the other dataset
map.removeLayer(geojsonLayer);
geojsonLayer = L.geoJson(dataset, layerOptions); 
map.addLayer(geojsonLayer);  
}

map.on('resize', function () {
    updateMap();
});

/**********************************************************
Section 5. CREATE MAP AND FIT BOUNDS
***********************************************************/

// create the layer and add to map
var geojsonLayer = L.geoJson(dataset, layerOptions); 
map.addLayer(geojsonLayer);

// fit the initial map view to the data points
map.fitBounds(geojsonLayer.getBounds(), {maxZoom: 12});
