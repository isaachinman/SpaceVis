/* PROTOTYPE DATA VISUALISATION APP: ISAAC HINMAN 2015 */

/* CREATE MODULE */
var prototype = angular.module('prototype', ['ngRoute']);
/* END CREATE MODULE */

/* CREATE FACTORY TO PORT RENDERER INTO CONTROLLERS */


/* CONFIGURE ROUTES */
prototype.config(function($routeProvider, $locationProvider) {
    $routeProvider

        /* ROUTE FOR STAR-FINDER PAGE */
        .when('/', {
            templateUrl : 'pages/star-finder.html',
            controller  : 'starFinderController'
        })
        /* END ROUTE FOR STAR-FINDER PAGE */

        /* ROUTE FOR TORUS PAGE */
        .when('/torus', {
            templateUrl : 'pages/torus.html',
            controller  : 'torusController'
        })
        /* END ROUTE FOR TORUS PAGE */

        /* ROUTE FOR EARTH PAGE */
        .when('/earth', {
            templateUrl : 'pages/earth.html',
            controller  : 'earthController'
        })
        /* END ROUTE FOR EARTH PAGE */

        /* ROUTE FOR INFO PAGE */
        .when('/info', {
            templateUrl : 'pages/info.html',
            controller  : 'infoController'
        })
        /* END ROUTE FOR INFO PAGE */

});
/* END CONFIGURE ROUTES */

/* MAIN CONTROLLER */
prototype.controller('starFinderController', function($scope) {

});
/* END MAIN CONTROLLER */

/* TORUS CONTROLLER */
prototype.controller('torusController', function($scope) {

});
/* END TORUS CONTROLLER */

/* CYLINDER CONTROLLER */
prototype.controller('earthController', function($scope) {

});
/*END CYLINDER CONTROLLER */

/* INFO CONTROLLER */
prototype.controller('infoController', function($scope) {

});
/* END INFO CONTROLLER */

