/* PROTOTYPE DATA VISUALISATION APP: ISAAC HINMAN 2015 */

/* CREATE MODULE */
var prototype = angular.module('prototype', ['ngRoute']);
/* END CREATE MODULE */

/* CREATE FACTORY TO PORT RENDERER INTO CONTROLLERS */


/* CONFIGURE ROUTES */
prototype.config(function($routeProvider, $locationProvider) {
    $routeProvider

        /* ROUTE FOR MAIN PAGE */
        .when('/', {
            templateUrl : 'pages/main.html',
            controller  : 'mainController'
        })
        /* END ROUTE FOR MAIN PAGE */

        /* ROUTE FOR TORUS PAGE */
        .when('/torus', {
            templateUrl : 'pages/torus.html',
            controller  : 'torusController'
        })
        /* END ROUTE FOR TORUS PAGE */

        /* ROUTE FOR CYLINDER PAGE */
        .when('/cylinder', {
            templateUrl : 'pages/cylinder.html',
            controller  : 'cylinderController'
        })
        /* END ROUTE FOR CYLINDER PAGE */

        /* ROUTE FOR INFO PAGE */
        .when('/info', {
            templateUrl : 'pages/info.html',
            controller  : 'infoController'
        })
        /* END ROUTE FOR INFO PAGE */

});
/* END CONFIGURE ROUTES */

/* MAIN CONTROLLER */
prototype.controller('mainController', function($scope) {

});
/* END MAIN CONTROLLER */

/* TORUS CONTROLLER */
prototype.controller('torusController', function($scope) {

});
/* END TORUS CONTROLLER */

/* CYLINDER CONTROLLER */
prototype.controller('cylinderController', function($scope) {

});
/*END CYLINDER CONTROLLER */

/* INFO CONTROLLER */
prototype.controller('infoController', function($scope) {

});
/* END INFO CONTROLLER */

