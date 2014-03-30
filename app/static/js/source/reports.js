/* global google:true, places:true */
/* jshint camelcase:false */

(function(){

  'use strict';

  $(document).ready(initialize);

  var map, lat, lng;
  var markers = [];
  var styleArray = [{'stylers':[{'hue':'#bbff00'},{'weight':0.5},{'gamma':0.5}]},{'elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'landscape.natural','stylers':[{'color':'#a4cc48'}]},{'featureType':'road','elementType':'geometry','stylers':[{'color':'#ffffff'},{'visibility':'on'},{'weight':1}]},{'featureType':'administrative','elementType':'labels','stylers':[{'visibility':'on'}]},{'featureType':'road.highway','elementType':'labels','stylers':[{'visibility':'simplified'},{'gamma':1.14},{'saturation':-18}]},{'featureType':'road.highway.controlled_access','elementType':'labels','stylers':[{'saturation':30},{'gamma':0.76}]},{'featureType':'road.local','stylers':[{'visibility':'simplified'},{'weight':0.4},{'lightness':-8}]},{'featureType':'water','stylers':[{'color':'#4aaecc'}]},{'featureType':'landscape.man_made','stylers':[{'color':'#718e32'}]},{'featureType':'poi.business','stylers':[{'saturation':68},{'lightness':-61}]},{'featureType':'administrative.locality','elementType':'labels.text.stroke','stylers':[{'weight':2.7},{'color':'#f4f9e8'}]},{'featureType':'road.highway.controlled_access','elementType':'geometry.stroke','stylers':[{'weight':1.5},{'color':'#e53013'},{'saturation':-42},{'lightness':28}]}];
  var image = '../img/pin.png';

  function initialize(){
    initMap(36, -86, 5);

    for(var i = 0; i < places.length; i++){
      addMarker(places[i]);
    }

    findMyLocation();
    $('#search').click(clickSearch);
  }

  function clickSearch(){
    var url = '/reports/query?lat=' + lat + '&lng=' + lng;
    window.location.href = url;
    $.getJSON(url, function(data){
      console.log(data);
    });
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
    // show seach button when browser receives current lat and lng
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
    var contentString = '<p id="#">' + location.name + '</p>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });
    var currentClick;
    var position = new google.maps.LatLng(location.lat, location.lng);
    var marker = new google.maps.Marker({map:map, position:position, title:location.address, icon:image});
    marker.set('id', location.id);
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      if(currentClick === marker){
        window.location.href = '/reports/' + marker.id;
      }
    });
    google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(15);
      map.setCenter(marker.getPosition());
      currentClick = marker;
      infowindow.open(map,marker);
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
