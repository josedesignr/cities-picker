angular.module('citiesPicker')
.controller( 'MainController', [ '$scope', '$http', '$localStorage', function($scope, $http, $localStorage) { 

	$scope.currentLocation = '';
	$scope.locationBtn_legend = 'Where am I?'

	$scope.$storage = $localStorage.$default({
		markers: [],
		citiesList: []
	});

	$scope.currentCity = '';

	angular.extend($scope, {
        center: {
            lat: 3.9,
            lng: -73.5,
            zoom: 5
        },
        defaults: {
            //tileLayer: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            //tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            //tileLayer: '//api.mapbox.com/styles/v1/alvarojose827/citng3g0g003s2it88y9lg769/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvam9zZTgyNyIsImEiOiJjaXUwaGZqZnMwMWgzMnpwZzVrdmlpcnBxIn0.ElMgKpRdQu3aeOquy3qwPg',
            //tileLayer: 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvam9zZTgyNyIsImEiOiJjaXUwaGZqZnMwMWgzMnpwZzVrdmlpcnBxIn0.ElMgKpRdQu3aeOquy3qwPg',
            tileLayer: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvam9zZTgyNyIsImEiOiJjaXUwaGZqZnMwMWgzMnpwZzVrdmlpcnBxIn0.ElMgKpRdQu3aeOquy3qwPg',
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true,
                attribution: 'Mapbox'
            },
            //maxZoom: 14,
    		minZoom: 2,
    		doubleClickZoom: true
    		//scrollWheelZoom: false,
    		//attributionControl: true
        }
        /*
        icon: {
	        url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon.png',
	        retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-icon@2x.png',
	        size: [25, 41],
	        anchor: [12, 40],
	        popup: [0, -40],
	        shadow: {
	            url: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
	            retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.6.4/images/marker-shadow.png',
	            size: [41, 41],
	            anchor: [12, 40]
	        }
	    },
	    path: {
	        weight: 10,
	        opacity: 1,
	        color: '#0000ff'
	    }
	    */
    });

	//$scope.markers = new Array();
	//$scope.citiesList = [];

    $scope.navOpen = false;
	$scope.getMyLocation = function() {
        
        //--Button changes its lagend, in order to give some feedback
		$scope.locationBtn_legend = 'Finding location...';
		
		//--If user has not asked for current position yet
		if($scope.currentLocation === ''){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					//--This runs if geolocation is successful
					function(position){
						$scope.$apply(function(){

							//--Creates an object with 'center' (for map pane), and 'marker' info.
							$scope.currentLocation = {
								center: {
									lat: position.coords.latitude,
									lng: position.coords.longitude,
									zoom: 10
								},
								marker: {
									lat: position.coords.latitude,
				                	lng: position.coords.longitude,
				                	message: 'I am here!'
								}
							}
							//--Map moves to coords in 'center'
							$scope.center = $scope.currentLocation.center;
							
							//--The locations lists gets a new item labeled with "My current location"
							$scope.$storage.citiesList.push('My current location');

							//--I need this variable in order to know which item put active (yellow bar)
							$scope.indexInArray = $scope.$storage.citiesList.length - 1;
							$scope.currentCity = $scope.indexInArray
							
							//--Add a new marker to the array.
				            $scope.$storage.markers.push($scope.currentLocation.marker);

				            //--After location finishes, calls the function 'locationDone'
							locationDone();
						});
					},

					//--This runs if geolocation fails.
					function(error){
						locationDone();
						alert(error.message);
					},
					{
						enableHighAccuracy: true,
						timeout: 4000
					}
				);
			}
		}
		else {
			//--If user already asked for current location and it is in the list, then just move map.
			$scope.center = $scope.currentLocation.center;
			$scope.currentCity = $scope.indexInArray //--Put the yellow marker on the list.
			locationDone();
		}

		function locationDone() {
			$scope.locationBtn_legend = 'Where am I?';
			$scope.navOpen = false;
		}
    };

    //--This function is trigerred when used types a place in SearchBox
    $scope.validateAndAdd = function(){

    	//--Once the place typed matches with one of the Google API list, it returns an object, so here I validate that.
    	if ($scope.place !== null && typeof $scope.place === 'object'){

    		//--Since the object has some functions that I do not need, I have to convert in a JSON string, and then, extract the JSON object itself.
    		var full_CityInfo = JSON.parse(JSON.stringify($scope.place));

    		console.log(full_CityInfo);

    		//--Since I do not need that much information about the city, but only name, latitude and logitude; I get just those items.
    		var markerToAdd = {
    			lat: full_CityInfo['geometry']['location']['lat'],
    			lng: full_CityInfo['geometry']['location']['lng'],
    			message: full_CityInfo['address_components'][0]['long_name'],
    			title: full_CityInfo['address_components'][0]['long_name']
    		}

    		//--Add the created marker to the markers array.
    		$scope.$storage.markers.push(markerToAdd);

    		//--Add the city name to the list. This list is the one which is displayed in the aside panel.
    		$scope.$storage.citiesList.push(full_CityInfo['formatted_address']);
 

    		//--Map focuses the place that has just been added.
    		$scope.center = {
                lat: full_CityInfo['geometry']['location']['lat'],
                lng: full_CityInfo['geometry']['location']['lng'],
                zoom: 10
            };

    		//--Search box gets cleared.
    		$scope.place = '';

    		//--Put yellow marker in current location
    		$scope.currentCity = $scope.$storage.citiesList.length - 1;

    		//--Close panel if user is browsing from mobile.
    		$scope.navOpen = false;
    	}	
    }

    $scope.removeCity = function(_val){
    	
    	//--Remove city and marker from its arrays.
    	$scope.$storage.citiesList.splice(_val, 1);
    	$scope.$storage.markers.splice(_val, 1);

    	if ($scope.$storage.citiesList[_val] === 'My current location'){
    		$scope.currentLocation = '';
    	}
    }

    $scope.expandMap = function(){
    	$scope.center.zoom = 2;
    	$scope.navOpen = false;
    	$scope.currentCity = '';
    }

    $scope.moveMapHere = function(_val){
    	$scope.center = {
    		lat: $scope.$storage.markers[_val].lat,
    		lng: $scope.$storage.markers[_val].lng,
    		zoom: 10
    	};
    	$scope.navOpen = false;
    	$scope.currentCity = _val;
    }

    $scope.clearAll = function(){
    	$scope.$storage.markers = [];
    	$scope.$storage.citiesList = [];
    	$scope.currentLocation = '';
    }
}]);
