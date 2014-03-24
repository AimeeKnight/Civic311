/* global google:true, places:true */
/* jshint camelcase:false */

(function(){

  'use strict';

  $(document).ready(initialize);

  var map, lat, lng;
  var markers = [];
  var styleArray = [{'stylers':[{'visibility':'off'}]},{'featureType':'road','stylers':[{'visibility':'on'},{'color':'#ffffff'}]},{'featureType':'road.arterial','stylers':[{'visibility':'on'},{'color':'#fee379'}]},{'featureType':'road.highway','stylers':[{'visibility':'on'},{'color':'#fee379'}]},{'featureType':'landscape','stylers':[{'visibility':'on'},{'color':'#f3f4f4'}]},{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#7fc8ed'}]},{},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#83cead'}]},{'elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'weight':0.9},{'visibility':'off'}]}];

  function initialize(){
    initMap(36, -86, 3);
    for(var i = 0; i < places.length; i++){
      addMarker(places[i]);
    }
    findMyLocation();
    $('#search').click(clickSearch);
  }

  function clickSearch(){
    window.location.href = ('/reports/query?lat=' + lat + '&lng=' + lng);
  }

  function findMyLocation(){
    getLocation();
  }

  function getLocation(){
    var geoOptions = {enableHighAccuracy: true, maximumAge: 1000, timeout: 60000};
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function geoSuccess(location) {
    lat = location.coords.latitude;
    lng = location.coords.longitude;
    // show search button when broswer sends location
    $('#search').show();
  }

  function geoError() {
    console.log('Sorry, no position available.');
  }

  function initMap(lat, lng, zoom){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function addMarker(location){
    var position = new google.maps.LatLng(location.lat, location.lng);
    var marker = new google.maps.Marker({map:map, position:position, title:location.address});
    markers.push(marker);
  }

})();

