/* PROTOTYPE DATA VISUALISATION APP: ISAAC HINMAN 2015 */

/* CREATE MODULE */
var spaceVis = angular.module('prototype', ['ngRoute']);
/* END CREATE MODULE */

/* CREATE FACTORY TO PORT RENDERER INTO CONTROLLERS */


/* CONFIGURE ROUTES */
spaceVis.config(function($routeProvider, $locationProvider) {
    $routeProvider

        /* ROUTE FOR STAR-FINDER PAGE */
        .when('/', {
            templateUrl : 'pages/star-finder.html',
            controller  : 'starFinderController',
            activetab: 'home'
        })
        /* END ROUTE FOR STAR-FINDER PAGE */

        /* ROUTE FOR EARTH PAGE */
        .when('/earth', {
            templateUrl : 'pages/earth.html',
            controller  : 'earthController',
            activetab: 'earth'
        })
        /* END ROUTE FOR EARTH PAGE */

        /* ROUTE FOR APOD PAGE */
        .when('/apod', {
            templateUrl : 'pages/apod.html',
            controller  : 'apodController'
        })
        /* END ROUTE FOR APOD PAGE */

        /* ROUTE FOR INFO PAGE */
        .when('/info', {
            templateUrl : 'pages/info.html',
            controller  : 'infoController'
        })
        /* END ROUTE FOR INFO PAGE */

});
/* END CONFIGURE ROUTES */

/* MAIN CONTROLLER */
spaceVis.controller('starFinderController', function($scope) {
});
/* END MAIN CONTROLLER */

/* EARTH CONTROLLER */
spaceVis.controller('earthController', function($scope) {
});
/*END EARTH CONTROLLER */

/* APOD CONTROLLER */
spaceVis.controller('apodController', function($scope) {

    $scope.load = function() {

        $("#lightSlider").lightSlider({
            item: 1,
            adaptiveHeight: true,
            enableTouch: true,
            enableDrag: true,
            loop: false,
            speed: 200,
            keyPress: true,
            slideMargin: 0

        });

        $('#lightSlider').onAfterSlide.refresh;

    }

});
/* END APOD CONTROLLER */

/* INFO CONTROLLER */
spaceVis.controller('infoController', function($scope) {

});
/* END INFO CONTROLLER */

/* NAV CONTROLLER */
spaceVis.controller('navController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
});
/* END NAV CONTROLLER */
