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
    $('#limitButton').click(limitItems);
    $('#prev').click(prevPage);
    $('#next').click(nextPage);
  }

  function findMyLocation(){
    getLocation();
  }

  function getLocation(){
    var geoOptions = {enableHighAccuracy: true, maximumAge: 1000, timeout: 60000};
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function geoSuccess(location) {
    console.log('lat', lat);
    console.log('lng', lng);
    lat = location.coords.latitude;
    lng = location.coords.longitude;
    $('#search').show();
  }

  function geoError() {
    console.log('Sorry, no position available.');
  }

  function initMap(lat, lng, zoom){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styleArray};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function addMarker(location){
    var currentClick;
    var position = new google.maps.LatLng(location.lat, location.lng);
    var marker = new google.maps.Marker({map:map, position:position, title:location.address});
    marker.set('id', location._id);
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      if(currentClick === marker){
        window.location.href = '/listings/' + marker.id;
      }
    });
    google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(15);
      map.setCenter(marker.getPosition());
      currentClick = marker;
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
