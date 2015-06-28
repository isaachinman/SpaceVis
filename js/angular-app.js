/* PROTOTYPE DATA VISUALISATION APP: ISAAC HINMAN 2015 */

/* CREATE MODULE */
var spaceVis = angular.module('prototype', ['ngRoute']);
/* END CREATE MODULE */

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

        /* ROUTE FOR SKY PAGE */
        .when('/sky', {
            templateUrl : 'pages/sky.html',
            controller  : 'skyController'
        })
        /* END ROUTE FOR SKY PAGE */

        /* ROUTE FOR INFO PAGE */
        .when('/info', {
            templateUrl : 'pages/info.html',
            controller  : 'infoController'
        })
        /* END ROUTE FOR INFO PAGE */

});
/* END CONFIGURE ROUTES */

/*********************************************************/
/******************** STAR CONTROLLER ********************/
/*********************************************************/
spaceVis.controller('starFinderController', function($scope) {

    $scope.load = function() {

    }

});
/* END STAR CONTROLLER */

/*********************************************************/
/******************** EARTH CONTROLLER *******************/
/*********************************************************/
spaceVis.controller('earthController', function($scope) {

});
/*END EARTH CONTROLLER */

/*********************************************************/
/******************** APOD CONTROLLER ********************/
/*********************************************************/
spaceVis.controller('apodController', function($scope) {

    $scope.load = function() {

        // MONTH NAMES
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // SLIDE ARRAY
        window.imgIds = [];

        ////////////////////////////////////
        ////////// GENERATE SLIDES /////////
        ////////////////////////////////////

            function generateSlides() {

                var stopGeneratingSlides = (window.imgIds.length + 10);

                var startLength = (window.imgIds.length + 1);

                for (var i = startLength; i < stopGeneratingSlides; i++) {

                    // SET UP NEW SLIDE HTML
                    var li = '<li id="apodLi'+i+'"></li>';
                    $('#lightSlider').append(li);
                    window.imgIds.push('apod'+i);

                    // GENERATE XML REQUEST
                    function slideSetUp(callback) {

                        // GENERATE DATE
                        var date = new Date();
                        date.setDate(date.getDate() - (i-1));
                        var day = date.getDate();
                        var month = ("0" + (date.getMonth() +1)).slice(-2);
                        var monthName = date.getMonth();
                        var year = date.getFullYear();

                        var apodUrl = "https://api.nasa.gov/planetary/apod?concept_tags=True&date=" + year + "-" + month + "-" + day + "&api_key=5iF1Ge5myl5KDyqPuyZ1XxQyAMCNxbCt0dlR3M7R";
                        var apodXml = new XMLHttpRequest();
                        apodXml.open('GET', apodUrl, true);
                        apodXml.send(null);

                        // WHEN REQUEST IS READY, ADD IMG SRC
                        apodXml.onreadystatechange=function() {
                            if (apodXml.readyState==4 && apodXml.status==200) {
                                var apodParse = JSON.parse(apodXml.responseText);
                                callback(apodParse);
                            }
                        }
                    }

                        slideSetUp(
                            (function(i, day, monthName, year) {
                                return function(result) {

                                    var mediaType = result.media_type;

                                    function createDOM() {
                                        if (mediaType == "image") {
                                            document.getElementById("apodLi"+i).innerHTML += '<img id="apod' + i + '" class="rounded-corners apod-image"><br><span id="apod' + i + 'Date"></span>';
                                        } else if (mediaType == "video") {
                                            document.getElementById("apodLi"+i).innerHTML += '<iframe id="apod' + i + '" class="apod-video" frameBorder="0"></iframe><br><span id="apod' + i + 'Date"></span>';
                                            /*
                                            var newSlide = '<li><iframe id="apod' + i + '" class="apod-video"></iframe><br><span id="apod' + i + 'Date"></span></li>';
                                            $('#lightSlider').append(newSlide);
                                            */
                                        }
                                    }

                                    function fillDOM() {
                                        // GENERATE DATE
                                        var date = new Date();
                                        date.setDate(date.getDate() - (i-1));
                                        var day = date.getDate();
                                        var monthName = date.getMonth();
                                        var year = date.getFullYear();
                                        document.getElementById('apod'+i).src = result.url;
                                        document.getElementById('apod'+i+"Date").innerHTML = day + " " + monthNames[monthName] + " " + year;
                                    }

                                    createDOM();
                                    fillDOM();
                                }
                            })(i)
                        );
                }
            }

            generateSlides();

            // SET UP SLIDER
            window.slider = $("#lightSlider").lightSlider({
                    item: 1,
                    adaptiveHeight: true,
                    enableTouch: true,
                    enableDrag: true,
                    loop: false,
                    speed: 0,
                    keyPress: true,
                    slideMargin: 0,
                    gallery: false,

                    // LOADING SEQUENCE PLACEHOLDER
                    onBeforeStart: function (el) {
                        $("#spinner").addClass("loader");
                        setTimeout(function(){
                            $("#spinner").removeClass("loader");
                            document.getElementById('apodContainer').style.visibility = "visible"
                        }, 3000);
                    },

                    // AFTER EACH SLIDE TRANSITION, DO THIS
                    onAfterSlide: function (el) {

                        // WHEN GETTING CLOSE TO END OF SLIDES, ADD MORE
                        currentSlide = '#apod' + (window.imgIds.length - 3);

                        if ($(currentSlide).parent().hasClass("active")) {
                            generateSlides();
                            window.slider.refresh();
                        };

                    },

                });

    }

});
/* END APOD CONTROLLER */

/* INFO CONTROLLER */
spaceVis.controller('skyController', function($scope) {

    $scope.load = function() {





    }

});
/* END INFO CONTROLLER */

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
