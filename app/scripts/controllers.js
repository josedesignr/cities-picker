angular.module("citiesPicker")
.controller( 'MainController', [ '$scope', function($scope) { 
	
	angular.extend($scope, {
        center: {
            lat: 3.9,
            lng: -73.5,
            zoom: 5
        }
    });

    $scope.getMyLocation = function(){
    	console.log("Hola!");
    	angular.extend($scope, {
	        center: {
	        	autoDiscover: true,
	        	zoom: 12
	        }
	    });
    }

    $scope.toggleMenu = function(){
    	$scope.navOpen = !$scope.navOpen;
    }
}]);