angular.module("citiesPicker")
.controller( 'MainController', [ '$scope', '$http', '$localStorage', function($scope, $http, $localStorage) { 

	$scope.$storage = $localStorage.$default({
		markers: [],
		citiesList: []
	});

	$scope.currentCity = "";

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
            tileLayer: 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvam9zZTgyNyIsImEiOiJjaXUwaGZqZnMwMWgzMnpwZzVrdmlpcnBxIn0.ElMgKpRdQu3aeOquy3qwPg',
            tileLayer: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvam9zZTgyNyIsImEiOiJjaXUwaGZqZnMwMWgzMnpwZzVrdmlpcnBxIn0.ElMgKpRdQu3aeOquy3qwPg',
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true,
                attribution: "Mapbox"
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
	$scope.getMyLocation = function(ip) {
        var url = "http://freegeoip.net/json/" + ip;
        $http.get(url).success(function(res) {
            
            $scope.center = {
                lat: res.latitude,
                lng: res.longitude,
                zoom: 10
            };
            $scope.ip = res.ip;

            $scope.markers.push({
	            lat: res.latitude,
                lng: res.longitude,
                title: "Here I am",
                message: "Here I am"
	        });
        });
        $scope.navOpen = false;
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
    			lat: full_CityInfo["geometry"]["location"]["lat"],
    			lng: full_CityInfo["geometry"]["location"]["lng"],
    			message: full_CityInfo["address_components"][0]["long_name"],
    			title: full_CityInfo["address_components"][0]["long_name"]
    		}

    		//--Add the created marker to the markers array.
    		$scope.$storage.markers.push(markerToAdd);

    		//--Add the city name to the list. This list is the one which is displayed in the aside panel.
    		$scope.$storage.citiesList.push(full_CityInfo["formatted_address"]);
 

    		//--Map focuses the place that has just been added.
    		$scope.center = {
                lat: full_CityInfo["geometry"]["location"]["lat"],
                lng: full_CityInfo["geometry"]["location"]["lng"],
                zoom: 10
            };

    		//--Search box gets cleared.
    		$scope.place = "";

    		//--Close panel if user is browsing from mobile.
    		$scope.navOpen = false;
    	}	
    }

    $scope.removeCity = function(_val){
    	
    	//--Remove city and marker from its arrays.
    	$scope.$storage.citiesList.splice(_val, 1);
    	$scope.$storage.markers.splice(_val, 1);
    }

    $scope.expandMap = function(){
    	$scope.center.zoom = 2;
    	$scope.navOpen = false;
    	$scope.currentCity = "";
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
}]);
