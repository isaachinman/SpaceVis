/*
VARIABLES FETCHED:
absmag: "4.85" -------------- ABSOLUTE MAGNITUDE
appmag: "-26.72" ------------ APPARENT MAGNITUDE
colorb_v: "0.65" ------------ COLOUR
created_at: "49:09.3" ------- CREATED AT
dcalc: "0"
distance_light_years: "0" --- DISTANCE
hipnum: "0" ----------------- HIPPARCOS NUMBER
id: "53794" ----------------- UNIQUE ID
label: "Sun" ---------------- NAME
luminosity: "0.8913" -------- LUMINOSITY
plx: "0" -------------------- PARALLAX
plxerr: "0" ----------------- PARALLAX MARGIN OF ERROR
speed: "0" ------------------ SPEED
texnum: "1"
updated_at: "49:09.3" ------- UPDATED AT


Temperature can be derived from magnitude and distance

*/

var blue = new THREE.Color();
var blueWhite = new THREE.Color();
var white = new THREE.Color();
var yellowWhite = new THREE.Color();
var yellow = new THREE.Color();
var orange = new THREE.Color();
var red = new THREE.Color();

/*

blue = 228° 100% 80%
blueWhite = 224° 100% 90%
white = 240° 100% 98%
yellowWhite = 64° 100% 92%
yellow = 52° 100% 82%
orange = 28° 100% 66%
red = 6° 95% 65%


 {v:-.63, hex:'#9aafff'},
  {v:.165, hex:'#cad8ff'},
  {v:.33, hex:'#f7f7ff'},
  {v:.495, hex:'#fcffd4'},
  {v:.66, hex:'#fff3a1'},
  {v:.825, hex:'#ffa350'},
  {v:2.057, hex:'#fb6252'},

*/

// SERIES OF FUNCTIONS TO TAKE 0-1 VALUE AND CONVERT
// Adapted from: en.wikipedia.org/wiki/HSL_color_space

// RGB TO HSL
// r=redvalue/g=greenvalue/b=bluevalue/array=hslrepresentation
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
// h=hue/s=saturation/l=lightness/array=rgbrepresentation
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



// PUT RENDERER INTO EXISTING CANVAS ELEMENT
document.body.appendChild( renderer.domElement );
document.getElementById("canvas-container").appendChild(renderer.domElement);

// STAR ROTATION
var starRotationY = .005;

// GET WIDTH AND HEIGHT
var width = (window.innerWidth * 0.8);
var height = (window.innerHeight * 0.8);

// CREATE SCENE
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
renderer.setSize( width / height );

// POSITION THE CAMERA
camera.position.z = 5;

// CREATE VARIOUS LIGHTING ELEMENTS
var light = new THREE.AmbientLight( 0x454545 ); // soft white light
scene.add( light );
directionalLight = new THREE.DirectionalLight( 0xffffff, 2.0 );
directionalLight.position.set( 1, 1, 0.5 ).normalize();
scene.add( directionalLight );
pointLight = new THREE.PointLight( 0xffaa00 );
pointLight.position.set( 0, 0, 0 );
scene.add( pointLight );

// SET UP XML DATABASE REQUEST
var databaseUrl = 'https://data.nasa.gov/resource/5bv2-dyn2';
var databaseXml = new XMLHttpRequest();
databaseXml.open('GET', databaseUrl, true);

// PUT APP TOKEN INTO HEADER
databaseXml.setRequestHeader('X-App-Token', 'Bi2coYHtAa9AScPW7tsCWvTBx');

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
function searchRequest() {

    searchTerm = document.getElementById('search-box').value;

    // SET UP XML SEARCH REQUEST
    var searchUrl = 'https://data.nasa.gov/resource/5bv2-dyn2?label=' + searchTerm;
    var searchXml = new XMLHttpRequest();
    searchXml.open('GET', searchUrl, true);

    // PUT APP TOKEN INTO HEADER
    searchXml.setRequestHeader('X-App-Token', 'Bi2coYHtAa9AScPW7tsCWvTBx');

    // SEND XML SEARCH REQUEST
    searchXml.send(null);

    // WHEN REQUEST IS READY, PARSE RESULTS
    searchXml.onreadystatechange=function() {
        if (searchXml.readyState==4 && searchXml.status==200) {
            window.specificStar = JSON.parse(searchXml.responseText);
            document.getElementById('object-name').innerHTML = window.specificStar[0].label;
            document.getElementById('luminosity').innerHTML = window.specificStar[0].luminosity;
            document.getElementById('distance').innerHTML = window.specificStar[0].distance_light_years;
            document.getElementById('colour').innerHTML = window.specificStar[0].colorb_v;

            console.log(window.specificStar);

            // IF STAR IS THE SUN, GET TEXTURE, ELSE SMOOTH MESH
            if (window.specificStar[0].label === "Sun") {
                var sunTexture = THREE.ImageUtils.loadTexture( "images/sun.jpg" );
                sunTexture.wrapS = THREE.ClampToEdgeWrapping;
                sunTexture.wrapT = THREE.ClampToEdgeWrapping;
                sunTexture.minFilter = THREE.NearestFilter;
                sunTexture.repeat.set( 1, 1 );
                var starMaterial = new THREE.MeshBasicMaterial ( {map: sunTexture} );
            } else {
                // SET STAR COLOUR BASED ON FETCHED VALUE
                var starColor = valueToRgbColor(window.specificStar[0].colorb_v);
                var starMaterial = new THREE.MeshLambertMaterial ( {color: starColor} );
            }

            // ADD TEXT LABEL TO COLOUR
            if (window.specificStar[0].colorb_v >= -.63 && window.specificStar[0].colorb_v < 0) {
                    document.getElementById('colour').innerHTML += " (Blue)";
                }
                  else if (window.specificStar[0].colorb_v >= 0 && window.specificStar[0].colorb_v < .165) {
                    document.getElementById('colour').innerHTML += " (Blueish White)";
                } else if (window.specificStar[0].colorb_v >= .165 && window.specificStar[0].colorb_v < .33) {
                    document.getElementById('colour').innerHTML += " (White)";
                } else if (window.specificStar[0].colorb_v >= .33 && window.specificStar[0].colorb_v < .495) {
                    document.getElementById('colour').innerHTML += " (Yellowish White)";
                } else if (window.specificStar[0].colorb_v >= .495 && window.specificStar[0].colorb_v < .66) {
                    document.getElementById('colour').innerHTML += " (Yellow)";
                } else if (window.specificStar[0].colorb_v >= .66 && window.specificStar[0].colorb_v < .825) {
                    document.getElementById('colour').innerHTML += " (Orange)";
                } else if (window.specificStar[0].colorb_v >= .825 && window.specificStar[0].colorb_v <= 2.057) {
                    document.getElementById('colour').innerHTML += " (Red)";
                }

            // DEFINE GEOMETERY VARIABLES
            var radius = 1;
            var segments = 64;
            var delta = 0.05;

            // CREATE SPHERE
            var starGeometry = new THREE.SphereGeometry( radius, segments, segments );
            window.sphere = new THREE.Mesh( starGeometry, starMaterial );
            scene.add( window.sphere );

            // CREATE DIAMETER LINE
            /*
            var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
            var lineGeometry = new THREE.CircleGeometry( radius+delta, segments );
            lineGeometry.vertices.shift();
            diameterLine = new THREE.Line ( lineGeometry, lineMaterial );
            diameterLine.rotation.x = Math.PI/2 + 0.1;
            scene.add( diameterLine );
            */

            // CREATE DIAMETER LABEL
            /*
            var diameterLabel = document.createElement('div');
            diameterLabel.style.position = 'absolute';
            diameterLabel.style.width = 100;
            diameterLabel.style.height = 100;
            diameterLabel.style.top = 65 + "%";
            diameterLabel.style.left = 62.5 + "%";
            diameterLabel.innerHTML = "Diameter: XXXX";
            document.body.appendChild(diameterLabel);
            */

            // RENDER FUNCTION
            function render() {
                    starRender = requestAnimationFrame( render );
                    renderer.setSize( width, height );
                    window.sphere.rotation.y += starRotationY;
                    renderer.render( scene, camera );
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
                        renderer.render( scene, camera );
                    }
                    reRender();
                   }
        }
    }
}

searchRequest();




