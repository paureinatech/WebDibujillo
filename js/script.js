var mymap = L.map('mapid', {scrollWheelZoom:false}).setView([41.6486572,-0.8763756], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

mymap.on('click', function() {
  if (mymap.scrollWheelZoom.enabled()) {
    mymap.scrollWheelZoom.disable();
  }
  else {
    mymap.scrollWheelZoom.enable();
  }
});


var latitudeDesde;
var longitudeDesde;
var latitudeHasta;
var longitudeHasta;

function getCoordDesde(city){
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "http://eu1.locationiq.com/v1/search.php?key=pk.d3c113fbd95530b59d8e5feb68d1e8ad&q="+city+",Zaragoza,España&format=json",
    "method": "GET"
  }
  
  $.ajax(settings).done(function (response) {
    latitudeDesde = response[0].lat;
    longitudeDesde = response[0].lon;
  });
}

function getCoordHasta(city){
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "http://eu1.locationiq.com/v1/search.php?key=pk.d3c113fbd95530b59d8e5feb68d1e8ad&q="+city+",Zaragoza,España&format=json",
    "method": "GET"
  }
  
  $.ajax(settings).done(function (response) {
    latitudeHasta = response[0].lat;
    longitudeHasta = response[0].lon;
  });
}

function addRoute(){
  
  var desde = document.getElementById("origen").value;
  var hasta = document.getElementById("destino").value;

  // var salida = document.getElementById("salida").value;
  // var llegada = document.getElementById("llegada").value;
  // var pasajeros = document.getElementById("pasajeros").value;
  // var fecha = document.getElementById("fecha").value;

  getCoordDesde(desde);
  getCoordHasta(hasta);

  L.Routing.control({
    waypoints: [
        L.latLng(latitudeDesde,longitudeDesde),
        L.latLng(latitudeHasta,longitudeHasta)
    ],
    routeWhileDragging: true
  }).addTo(mymap);
}

