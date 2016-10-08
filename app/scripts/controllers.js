angular.module("citiesPicker")
.controller( 'MainController', [ '$scope', '$http', function($scope, $http) { 

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
            }
            //maxZoom: 14,
    		//minZoom: 1,
    		//doubleClickZoom: true,
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



	$scope.markers = new Array();

    /*
    $scope.$on("#mapboxid.click", function(event, args){
        var leafEvent = args.leafletEvent;

        $scope.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: "My Added Marker"
        });
    });
    */


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
                focus: true,
                title: "Here I am",
	        });
	        console.log("Markers");
    		console.log($scope.markers);
        });
        $scope.navOpen = false;
    };

    //--This function is trigerred when used types a place in SearchBox
    $scope.validateAndAdd = function(){

    	//--Once the place typed matches with one of the Google API list, it returns an object, so here I validate that.
    	if ($scope.place !== null && typeof $scope.place === 'object'){

    		//--Since the object has some functions that I do not need, I have to convert in a JSON string, and then, extract the JSON object itself.
    		var full_CityInfo = JSON.parse(JSON.stringify($scope.place));
    		console.log("Full Info");
    		console.log(full_CityInfo);
    		console.log("---------");

    		//--Since I do not need that much information about the city, but only name, latitude and logitude; I get just those items.
    		var markerToAdd = {
    			lat: full_CityInfo["geometry"]["location"]["lat"],
    			lng: full_CityInfo["geometry"]["location"]["lng"],
    			focus: true,
    			title: full_CityInfo["address_components"][0]["long_name"]
    		}
    		console.log("Marker to Add");
    		console.log(markerToAdd)
    		console.log("-----------")

    		$scope.markers.push(markerToAdd);

    		console.log("Markers");
    		console.log($scope.markers);

    	}	
    }
}]);
