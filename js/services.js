'use strict';

// Forecast.io/DarskyApi 

var forecastioWeather = ['$q', '$resource', '$http', 'FORECASTIO_KEY', 
  function($q, $resource, $http, FORECASTIO_KEY) {
  var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';

  var weatherResource = $resource(url, {
    callback: 'JSON_CALLBACK',
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    //getAtLocation: function(lat, lng) {
    getCurrentWeather: function(lat, lng) {
      return $http.jsonp(url + lat + ',' + lng + '?callback=JSON_CALLBACK');
    }
  }
}];

// Accuweather API for City name

var forecastCity = ['$q', '$resource', '$http', 'ACCUWEATHER_KEY', function($q, $resource, $http, ACCUWEATHER_KEY){
  var urlCity = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + ACCUWEATHER_KEY + '&q=';

  var weatherResource = $resource(urlCity, {
    callback: 'JSON_CALLBACK',
  }, {
    get: {
      method: 'JSON'
    }
  });

  return {
    //getAtLocation: function(lat, lng) {
    getCurrentCity: function(lat, lng) {
      return $http.get(urlCity + lat + ',' + lng);
    }
  }
}]

angular.module('starter.services', ['ngResource'])
.factory('Weather', forecastioWeather)
.factory('City', forecastCity)

//Define filter to be used in View

.filter('floor', function() {
  return function(input) {
    return Math.floor(input);
  };
});