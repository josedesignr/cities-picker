angular.module('citiesPicker')
.config(['$routeProvider', function($routeProvider){
    
    $routeProvider
    .when('/', {
    	templateUrl: 'views/main.html'
    })
    .otherwise({redirectTo: '/'});
}]);



