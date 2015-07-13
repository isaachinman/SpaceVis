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

        // CREATE RENDERER AND PUT IT INTO DOM ELEMENT
        var renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });
        var canvas = document.getElementById("canvas-container");

        $(window).resize(function() {
            var width = (window.innerWidth * 0.8);
            var height = (window.innerHeight * 0.8);
            renderer.setSize( width / height );
        });

        // FORMULA FOR RADIUS: R=(L/(4*pi*s*T^4))^0.5

        // SERIES OF FUNCTIONS TO TAKE 0-1 VALUE AND CONVERT TO COLOUR
        // Adapted from: en.wikipedia.org/wiki/HSL_color_space

            // RGB TO HSL
            function rgbToHsl(r, g, b){
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;
                if(max == min){
                    h = s = 0; // achromatic
                }else{
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch(max){
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                return [h, s, l];
            }
            // HSL TO RGB FUNCTION
            function hslToRgb(h, s, l){
                var r, g, b;
                if(s == 0){
                    r = g = b = l; // achromatic
                }else{
                    function hue2rgb(p, q, t){
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }
                return [r * 255, g * 255, b * 255];
            }
            // HEX TO RGB FUNCTION
            function hexToRgb(hex) {
                return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                .slice(1).map(function(v){ return parseInt(v,16) });
            }
            // INTERPOLATE ARRAYS
            function interpolArrays(a,b,k){
              var c = a.slice();
              for (var i=0;i<a.length;i++) c[i]+=(b[i]-a[i])*k;
              return c;
            }
            var stones = [ // Your Data
              {v:-.63, hex:'#9aafff'},
              {v:.165, hex:'#cad8ff'},
              {v:.33, hex:'#f7f7ff'},
              {v:.495, hex:'#fcffd4'},
              {v:.66, hex:'#fff3a1'},
              {v:.825, hex:'#ffa350'},
              {v:2.057, hex:'#fb6252'},
            ]
            stones.forEach(function(s){
              s.rgb = hexToRgb(s.hex);
              s.hsl = rgbToHsl.apply(0, s.rgb);
            });
            function valueToRgbColor(val){
              for (var i=1; i<stones.length; i++) {
                if (val<=stones[i].v) {
                  var k = (val-stones[i-1].v)/(stones[i].v-stones[i-1].v),
                      hsl = interpolArrays(stones[i-1].hsl, stones[i].hsl, k);
                  return 'rgb('+hslToRgb.apply(0,hsl).map(function(v){ return v|0})+')';
                }
              }
              throw "bad value";
            }
        // END OF COLOUR FUNCTIONS //
        /////////////////////////////

        // DERIVE TEMPERATURE FROM BV COLOUR VALUE
        // ADAPTED FROM: www.uni.edu/morgans/stars/b_v.html
        function calculateTemp(value) {
            var C1 = 3.979145106714099;
            var C2 = -0.6544992268598245;
            var C3 = 1.740690042385095;
            var C4 = -4.608815154057166;
            var C5 = 6.792599779944473;
            var C6 = -5.396909891322525;
            var C7 = 2.19297037652249;
            var C8 = -.359495739295671;
            var f1 = value;
            bmv = parseFloat(f1);
            with (Math) {
                logt=C1+C2*bmv+C3*pow(bmv,2)+C4*pow(bmv,3)+C5*pow(bmv,4)+C6*pow(bmv,5)+C7*pow(bmv,6)+C8*pow(bmv,7);
                t=pow(10,logt);
            }
            return Math.round(t);
        }

        // PUT RENDERER INTO EXISTING CANVAS ELEMENT
        document.body.appendChild( renderer.domElement );
        document.getElementById("canvas-container").appendChild(renderer.domElement);

        // STAR ROTATION
        var starRotationY = .005;

        // GET WIDTH AND HEIGHT
        var width = (window.innerWidth * 0.8);
        var height = (window.innerHeight * 0.8);


        // CREATE SCENE
        var starScene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
        renderer.setSize( width / height );

        // POSITION THE CAMERA
        camera.position.z = 5;

        // CREATE VARIOUS LIGHTING ELEMENTS
        var light = new THREE.AmbientLight( 0x454545 ); // soft white light
        starScene.add( light );
        directionalLight = new THREE.DirectionalLight( 0xffffff, 2.0 );
        directionalLight.position.set( 1, 1, 0.5 ).normalize();
        starScene.add( directionalLight );
        pointLight = new THREE.PointLight( 0xffaa00 );
        pointLight.position.set( 0, 0, 0 );
        starScene.add( pointLight );

        // SET UP XML DATABASE REQUEST
        var databaseUrl = 'http://star-api.herokuapp.com/api/v1/stars';
        var databaseXml = new XMLHttpRequest();
        databaseXml.open('GET', databaseUrl, true);

        // SEND XML DATABASE REQUEST
        databaseXml.send(null);

        // WHEN REQUEST IS READY, PARSE DATABASE INTO ARRAY
        databaseXml.onreadystatechange=function() {
            if (databaseXml.readyState==4 && databaseXml.status==200) {
                window.databaseParse = JSON.parse(databaseXml.responseText);
                window.starDatabase = [];
                window.databaseParse.forEach(function(el) {
                    window.starDatabase.push(el.label)
                })
                console.log(starDatabase.length);
                // JQUERY UI AUTOCOMPLETE
                $("#search-box").autocomplete({source: window.starDatabase});
            }
        }

        ////////////////////////////////////////////////////
        ////////////// MAIN SEARCH FUNCTION ////////////////
        ////////////////////////////////////////////////////
        window.searchRequest = function() {

            // ADD LOADER ANIMATION
            $("#starContainer").addClass("hidden");
            $("#spinner").addClass("loader");

            searchTerm = document.getElementById('search-box').value;

            // SET UP XML SEARCH REQUEST
            var searchUrl = 'http://star-api.herokuapp.com/api/v1/stars/' + searchTerm;
            var searchXml = new XMLHttpRequest();
            searchXml.open('GET', searchUrl, true);

            // SEND XML SEARCH REQUEST
            searchXml.send(null);

            // WHEN REQUEST IS READY, PARSE RESULTS
            searchXml.onreadystatechange=function() {
                if (searchXml.readyState==4 && searchXml.status==200) {

                    // REMOVE LOADER ANIMATION
                    $("#starContainer").removeClass("hidden");
                    $("#spinner").removeClass("loader");

                    window.specificStar = JSON.parse(searchXml.responseText);
                    document.getElementById('object-name').innerHTML = window.specificStar.label;
                    document.getElementById('luminosity').innerHTML = window.specificStar.lum;
                    document.getElementById('distance').innerHTML = window.specificStar.distly + ' light years';
                    document.getElementById('colour').innerHTML = window.specificStar.colorb_v;
                    document.getElementById('temp').innerHTML = '~' + calculateTemp(window.specificStar.colorb_v) + 'K';

                    // IF STAR IS THE SUN, GET TEXTURE, ELSE SMOOTH MESH
                    if (window.specificStar.label === "Sun") {
                        var sunTexture = THREE.ImageUtils.loadTexture( "img/sun.jpg" );
                        sunTexture.wrapS = THREE.ClampToEdgeWrapping;
                        sunTexture.wrapT = THREE.ClampToEdgeWrapping;
                        sunTexture.minFilter = THREE.NearestFilter;
                        sunTexture.repeat.set( 1, 1 );
                        var starMaterial = new THREE.MeshBasicMaterial ( {map: sunTexture} );
                    } else {
                        // SET STAR COLOUR BASED ON FETCHED VALUE
                        var starColor = valueToRgbColor(window.specificStar.colorb_v);
                        var starMaterial = new THREE.MeshLambertMaterial ( {color: starColor} );
                    }

                    // ADD TEXT LABEL TO COLOUR
                    if (window.specificStar.colorb_v >= -.63 && window.specificStar.colorb_v < 0) {
                            document.getElementById('colour').innerHTML += " (Blue)";
                        } else if (window.specificStar.colorb_v >= 0 && window.specificStar.colorb_v < .165) {
                            document.getElementById('colour').innerHTML += " (Blueish White)";
                        } else if (window.specificStar.colorb_v >= .165 && window.specificStar.colorb_v < .33) {
                            document.getElementById('colour').innerHTML += " (White)";
                        } else if (window.specificStar.colorb_v >= .33 && window.specificStar.colorb_v < .495) {
                            document.getElementById('colour').innerHTML += " (Yellowish White)";
                        } else if (window.specificStar.colorb_v >= .495 && window.specificStar.colorb_v < .66) {
                            document.getElementById('colour').innerHTML += " (Yellow)";
                        } else if (window.specificStar.colorb_v >= .66 && window.specificStar.colorb_v < .825) {
                            document.getElementById('colour').innerHTML += " (Orange)";
                        } else if (window.specificStar.colorb_v >= .825 && window.specificStar.colorb_v <= 2.057) {
                            document.getElementById('colour').innerHTML += " (Red)";
                        }

                    // DEFINE GEOMETERY VARIABLES
                    if ($(window).width() < 600) {
                        var radius = 0.75;
                    } else {
                        var radius = 1;
                    }
                    var segments = 64;
                    var delta = 0.05;

                    // CREATE SPHERE
                    var starGeometry = new THREE.SphereGeometry( radius, segments, segments );
                    window.sphere = new THREE.Mesh( starGeometry, starMaterial );
                    starScene.add( window.sphere );

                    // RENDER FUNCTION
                    function render() {
                            starRender = requestAnimationFrame( render );
                            renderer.setSize( width, height );
                            window.sphere.rotation.y += starRotationY;
                            renderer.render( starScene, camera );
                        }

                    // IF RENDER ALREADY EXISTS, CANCEL AND CREATE NEW RENDER
                        if (typeof starFinderHappened === 'undefined') {
                            window.starFinderHappened = true;
                            render();
                        } else {
                            function reRender() {
                                cancelAnimationFrame( starRender );
                                starRender = requestAnimationFrame( render );
                                renderer.setSize( width, height );
                                sphere.rotation.y += starRotationY;
                                renderer.render( starScene, camera );
                            }
                            reRender();
                           }
                }
            }
        }
        searchRequest();
        window.clearScene = function() {
            if (typeof starScene !== 'undefined') {
                starScene.remove( window.sphere );
            }
        }
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

        window.toggleApodInfo = function() {
            $("#lightSlider > li.active > div.infoContainer").slideToggle();
        }

        // MONTH NAMES
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // SLIDE ARRAY
        window.imgIds = [];

        // GENERATE SLIDES FUNCTION
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
                                    // IF IMAGE, CREATE IMG; IF VIDEO, CREATE IFRAME
                                    if (mediaType == "image") {
                                        document.getElementById("apodLi"+i).innerHTML += '<img id="apod' + i + '" class="rounded-corners apod-image"><br><span id="apod' + i + 'Date" class="half-opacity-text"></span><div id="apod' + i + 'InfoContainer" class="infoContainer half-opacity-text rounded-corners" style="display:none"><span id="apod' + i + 'Title" class="block"></span><span id="apod' + i + 'Explanation"></span></div>';
                                    } else if (mediaType == "video") {
                                        document.getElementById("apodLi"+i).innerHTML += '<iframe id="apod' + i + '" class="apod-video" frameBorder="0"></iframe><br><span id="apod' + i + 'Date" class="half-opacity-text"></span></span><div id="apod' + i + 'InfoContainer" class="infoContainer half-opacity-text rounded-corners" style="display:none"><span id="apod' + i + 'Title" class="block"></span><span id="apod' + i + 'Explanation"></span></div>';
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
                                    document.getElementById('apod'+i+"Date").innerHTML = "<h4>" + day + " " + monthNames[monthName] + " " + year + "</h4>";
                                    document.getElementById('apod' + i + 'Title').innerHTML = '<h5>Title: "' + result.title + '"</h5>';
                                    document.getElementById('apod' + i + 'Explanation').innerHTML = result.explanation;
                                }

                                createDOM();
                                fillDOM();

                                // END LOADER ANIMATION ON INITIAL LOAD
                                if (i == (stopGeneratingSlides-1) && $("#spinner").hasClass("loader")) {
                                    $("#spinner").removeClass("loader");
                                    document.getElementById('apodContainer').style.visibility = "visible";
                                }
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
                document.getElementById('apodContainer').style.visibility = "hidden";
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

/* SKY CONTROLLER */
spaceVis.controller('skyController', function($scope) {

    $scope.load = function() {

        document.getElementById('skyContainer').style.visibility = "hidden";
        $("#spinner").addClass("loader");

        var map, GeoMarker;

        function initialize() {

            var mapOptions = {
                zoom: 2,
                maxZoom: 12,
                center: new google.maps.LatLng(0, 0),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            };

            map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

            // REMOVE LOADING ANIMATION WHEN MAP IS READY
            google.maps.event.addListenerOnce(map, 'idle', function(){
                setTimeout(function() {
                    $("#spinner").removeClass("loader");
                    document.getElementById('skyContainer').style.visibility = "visible";
                }, 100);
            });

            // CREATE SEARCH BOX AND LINK TO UI ELEMENT
            var input = document.getElementById('pac-input');
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            var searchBox = new google.maps.places.SearchBox(input);

            // RUN EVERYTIME A NEW LOCATION IS SELECTED
            google.maps.event.addListener(searchBox, 'places_changed', function() {

                // ONLY RUN IF USER HAS ALREADY REQUESTED SKY INFO
                if (window.skyFinderHasRun == 'ran') {
                    $('.dynamicText').html("");
                    getAllInfo();
                }

                var places = searchBox.getPlaces();

                markers = [];

                for (var i = 0, marker; marker = markers[i]; i++) {
                    marker.setMap(null);
                }

                // GET ICON, NAME, LOCATION
                var bounds = new google.maps.LatLngBounds();
                var place = null;
                var viewport = null;
                for (var i = 0; place = places[i]; i++) {
                    var image = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    // CREATE NEW MARKER
                    window.marker = new google.maps.Marker({
                        map: map,
                        icon: image,
                        title: place.name,
                        position: place.geometry.location
                    });
                    viewport = place.geometry.viewport;
                    markers.push(marker);

                    bounds.extend(place.geometry.location);
                }
                map.setCenter(bounds.getCenter());
                map.fitBounds(bounds);
            });
        }

        window.getMyLocation = function() {

            GeoMarker = new GeolocationMarker();
            GeoMarker.setCircleOptions({fillColor: '#808080'});

            google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
                map.setCenter(this.getPosition());
                map.fitBounds(this.getBounds());
            });

            GeoMarker.setMap(map);

            if(!navigator.geolocation) {
                alert('Your browser does not support geolocation');
            }
        }

        initialize();

        window.initialiseMapUI = function() {

            // DESKTOP VS MOBILE BEHAVIOUR
            if ($(window).width() > 600) {

                // RESIZE GOOGLE MAP
                $('#googleMap').animate({width:'40vw'}, 500);

                // SLIDE OUT INFO PANELS
                setTimeout(function() { $('.panel').slideDown(); }, 250);

                // WAIT UNTIL MAP HAS RESIZED AND PAN BACK TO MARKER
                setTimeout(function() {
                    var currentMarkerPosition = window.marker.getPosition();
                    google.maps.event.trigger(map, "resize");
                    map.panTo(currentMarkerPosition); }, 500);
            }
        }

        window.getAllInfo = function() {

            // GET AND SET CURRENT LOCATION VARS
            var currentLocation = map.getCenter();
            var currentLocationLat = currentLocation.A;
            var currentLocationLong = currentLocation.F;
            console.log(currentLocationLat);
            console.log(currentLocationLong);

            // DON'T RUN FUNCTION IF AT DEFAULT GLOBE VIEW
            if (currentLocationLat == 0 && currentLocationLong == 0) {
                alert("Please choose a valid location")
            } else {

                // SET VAR TO INDICATE FUNCTION HAS RUN ONCE
                window.skyFinderHasRun = 'ran';

                // GET WEATHER INFO
                function getSkyInfo() {
                    var skyUrl = "http://api.wunderground.com/api/ab3865c51ff9ccb5/hourly/q/" + currentLocationLat + "," + currentLocationLong + ".json";
                    var skyXML = new XMLHttpRequest();
                    skyXML.open('GET', skyUrl, true);
                    skyXML.send(null);

                    // WHEN REQUEST IS READY
                    skyXML.onreadystatechange=function() {
                        if (skyXML.readyState==4 && skyXML.status==200) {
                            var skyParse = JSON.parse(skyXML.responseText);
                            var cloudiness = skyParse.hourly_forecast[0].sky;
                            var visibilityMessage = (skyParse.hourly_forecast[0].condition).toLowerCase();
                            document.getElementById('cloudMessage').innerHTML = visibilityMessage;
                            document.getElementById('cloudPercent').innerHTML = cloudiness;
                            $('#skyMoreInfo').removeClass('hidden');
                            console.log(skyParse);
                        }
                    }

                }

                // GET PLANET INFO
                function getPlanetsInfo() {
                    var planetUrl = "http://crossorigin.me/http://planets-api.awsm.st/visible/" + currentLocationLat + "/" + currentLocationLong;
                    var planetXML = new XMLHttpRequest();
                    planetXML.open('GET', planetUrl, true);
                    planetXML.send(null);

                    // WHEN REQUEST IS READY
                    planetXML.onreadystatechange=function() {
                        if (planetXML.readyState==4 && planetXML.status==200) {
                            var planetParse = JSON.parse(planetXML.responseText);
                            console.log(planetParse);

                            var planetList = [];
                            planetParse.forEach(function(el) {
                                planetList.push(el.name)
                                document.getElementById('planetsVisible').innerHTML += el.name + ' (' + el.description.azimuth + ', ' + ((el.description.altitude).toLowerCase()) + ')' + '<br>';
                            })
                        }
                    }
                }

                // GET MOON AND SUN INFO
                function getMoonInfo() {
                    var moonUrl = "http://api.wunderground.com/api/ab3865c51ff9ccb5/astronomy/q/" + currentLocationLat + "," + currentLocationLong + ".json";
                    var moonXML = new XMLHttpRequest();
                    moonXML.open('GET', moonUrl, true);
                    moonXML.send(null);

                    // WHEN REQUEST IS READY
                    moonXML.onreadystatechange=function() {
                        if (moonXML.readyState==4 && moonXML.status==200) {
                            var moonParse = JSON.parse(moonXML.responseText);

                            // FILL IN MOON INFO
                            document.getElementById('moonPhase').innerHTML += 'Current phase: ' + (moonParse.moon_phase.phaseofMoon).toLowerCase();
                            document.getElementById('moonPercent').innerHTML += 'The Moon is ' + moonParse.moon_phase.percentIlluminated + '% illuminated';
                            // FILL IN SUN INFO
                            document.getElementById('sunrise').innerHTML += 'Sunrise is at ' + moonParse.sun_phase.sunrise.hour + ':' + moonParse.sun_phase.sunrise.minute;
                            document.getElementById('sunset').innerHTML += 'Sunset is at ' + moonParse.sun_phase.sunset.hour + ':' + moonParse.sun_phase.sunset.minute;
                            console.log(moonParse);
                        }
                    }
                }

                // RUN ALL INFO REQUESTS
                getSkyInfo();
                getPlanetsInfo();
                getMoonInfo();
            }
        }
    }
});
/* END SKY CONTROLLER */

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
