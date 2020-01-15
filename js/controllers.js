angular.module('starter.controllers', [])
.constant('FORECASTIO_KEY', 'Put Your own Dark Sky API Key here').constant('ACCUWEATHER_KEY', 'Put Your own Accuweather API Key here')
.controller('HomeCtrl', function($scope,Weather,City) {
	//read default settings into scope
	// console.log('inside home');

  //Show Current Date and Time
    $scope.today = new Date();

  // Here On Start it will ask for user's GPS Co-ordinates
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }

  // On successfully getting the Latitude and longitude, save it
  function onSuccess(position){
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      //call getCurrentWeather method in factory ‘Weather’, Pass lat and long
      Weather.getCurrentWeather(latitude,longitude).then(function(resp) {


        $scope.current = resp.data; //whole weather data received from weather API

        // initialize weather Icons 
        var icons = new Skycons({"color":"orange"});
        
        $scope.current.currently.temperature = changetemp($scope.current.currently.temperature); // change the Farenheit temp received into Celsius

        // chartJS hourly temp and time Array to save received data
        var tempArray = [];
        var timeArray = [];

        for(i=0; i < 5; i++){
          // adding a new celsius property to each object 
          $scope.current.hourly.data[i]['temperatureC'] = changetemp($scope.current.hourly.data[i].temperature);
          tempArray.push($scope.current.hourly.data[i]['temperatureC']); 
          timeArray.push(i);
        }
        // console.log(timeArray)
        // console.log(tempArray)

        // ChartJS 
        chartJS(timeArray,tempArray);
        angular.element(document).ready(function () {
          icons.set("weather-icon",$scope.current.currently.icon); 
          for(i=0; i < 5; i++){
          // adding a new celsius property to each object 
            $scope.current.hourly.data[i]['temperatureC'] = changetemp($scope.current.hourly.data[i].temperature);
            // console.log($scope.current.hourly.data[i].icon);

            icons.set("weather-icon-"+i,$scope.current.hourly.data[i].icon); //set icons for all chartJS canvases in hourly tab
          }

        });
        
        icons.play();

        //Now from the lat and long we received above, Get City name
      City.getCurrentCity(latitude,longitude).then(function(respCity) {

        $scope.currentCity = respCity.data.SupplementalAdminAreas[0].EnglishName;
        // console.log('GOT CITY', $scope.currentCity);
        //debugger;
      }, function(error) {
        alert('Unable to get city details');
        console.error(error);
      });

      console.log('GOT CURRENT', $scope.current);
      //debugger;
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });

  };

  function onError(error) {
    alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
  }

  function changetemp(faren){
      var celsius = faren;
      //console.log(celsius)
      return Math.round((celsius-32) * (5/9));
    }

    //chartJS, set custom options, pass data


  function chartJS(timeArr,tempArr){
      var canvas = document.getElementById("canvas");

    // Apply multiply blend when drawing datasets
      var multiply = {
      beforeDatasetsDraw: function(chart, options, el) {
        chart.ctx.globalCompositeOperation = 'multiply';
      },
      afterDatasetsDraw: function(chart, options) {
        chart.ctx.globalCompositeOperation = 'source-over';
      },
    };
      var config = {
          type: 'line',
          data: {
              labels: timeArr,
              datasets: [
                {
                    label: 'Temperature',
                    data: tempArr, //temperature Array
                    fill: true,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 0,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
                    pointHoverBorderWidth: 10,
                    lineTension: 0,
                }
              ]
          },
              options: {
                responsive: false,
                elements: { 
                  point: {
                    radius: 2,
                    hitRadius: 6, 
                    hoverRadius: 6 
                  } 
                },
                legend: {
                  display: false,
                },
                tooltips: {
                  backgroundColor: 'transparent',
                  displayColors: false,
                  bodyFontSize: 10,
                  callbacks: {
                    label: function(tooltipItems, data) { 
                      return tooltipItems.yLabel + '°C';
                    }
                  }
                },
                scales: {
                  xAxes: [{
                    display: false,
                    offset:true,

                  }],
                  yAxes: [{
                    display: false,
                    offset:true,
                    ticks: {
                      max: Math.max.apply(null, tempArr,timeArr) + 1, //max value + 1
                }
                  }]
                }
              },
              plugins: [multiply],
          };

          window.chart = new Chart(canvas, config);
            }

});
