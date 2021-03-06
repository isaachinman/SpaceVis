/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NOTICE: This script was modified for use at installscripts.io in order to fix a broken image CDN link.
 *
 */

/**
 * @name GeolocationMarker for Google Maps v3
 * @version version 1.0
 * @author Chad Killingsworth [chadkillingsworth at missouristate.edu]
 * Copyright 2012 Missouri State University
 * @fileoverview
 * This library uses geolocation to add a marker and accuracy circle to a map.
 * The marker position is automatically updated as the user position changes.
 */

/**
 * @constructor
 * @param {google.maps.Map=} opt_map
 * @param {(google.maps.MarkerOptions|Object.<string>)=} opt_markerOpts
 * @param {(google.maps.CircleOptions|Object.<string>)=} opt_circleOpts
 */
function GeolocationMarker(opt_map, opt_markerOpts, opt_circleOpts) {
 
  var markerOpts = {
    'clickable': false,
    'cursor': 'pointer',
    'draggable': false,
    'flat': true,
    'icon': new google.maps.MarkerImage(
        'http://installscripts.io/assets/google-geomarker-blue-2215a4c6a5946cb7a203837d7fe03479.png',
        new google.maps.Size(15,15),
        new google.maps.Point(0,0),
        new google.maps.Point(7,7)),
    'optimized': false,
    'position': new google.maps.LatLng(0, 0),
    'title': 'Current location',
    'zIndex': 2
  };
 
  if(opt_markerOpts) {
    markerOpts = this.copyOptions_(markerOpts, opt_markerOpts);
  }
 
  var circleOpts = {
    'clickable': false,
    'radius': 0,
    'strokeColor': '1bb6ff',
    'strokeOpacity': .4,
    'fillColor': '61a0bf',
    'fillOpacity': .4,
    'strokeWeight': 1,
    'zIndex': 1
  };

  if(opt_circleOpts) {
    circleOpts = this.copyOptions_(circleOpts, opt_circleOpts);
  }
   
  this.marker_ = new google.maps.Marker(markerOpts);
  this.circle_ = new google.maps.Circle(circleOpts);
 
  this.circle_.bindTo('center', this.marker_, 'position');
  this.circle_.bindTo('map', this.marker_);
 
  if(opt_map) {
    this.setMap(opt_map);
  }
}

/**
 * @private
 * @type {google.maps.Map}
 */
GeolocationMarker.prototype.map_ = null;

/**
 * @private
 * @type {google.maps.Marker}
 */
GeolocationMarker.prototype.marker_ = null;

/**
 * @private
 * @type {google.maps.Circle}
 */
GeolocationMarker.prototype.circle_ = null;

/** @return {google.maps.Map} */
GeolocationMarker.prototype.getMap = function() {
  return this.map_;
};

/** @return {google.maps.LatLng?} */
GeolocationMarker.prototype.getPosition = function() {
  if (this.map_) {
    return this.marker_.getPosition();
  } else {
    return null;
  }
};

/** @return {google.maps.LatLngBounds?} */
GeolocationMarker.prototype.getBounds = function() {
  if (this.map_) {
    return this.circle_.getBounds();
  } else {
    return null;
  }
};

/** @return {number?} */
GeolocationMarker.prototype.getAccuracy = function() {
  if (this.map_) {
    return this.circle_.getRadius();
  } else {
    return null;
  }
};

/**
 * @private
 * @type {number}
 */
GeolocationMarker.prototype.watchId_ = -1;

/** @param {google.maps.Map} map */
GeolocationMarker.prototype.setMap = function(map) {
  this.map_ = map;
  if (map) {
    this.watchPosition_();
  } else {
    navigator.geolocation.clearWatch(this.watchId_);
    this.watchId_ = -1;
    this.marker_.setMap(map);
  }
};

/** @param {google.maps.MarkerOptions|Object.<string>} markerOpts */
GeolocationMarker.prototype.setMarkerOptions = function(markerOpts) {
  this.marker_.setOptions(this.copyOptions_({}, markerOpts));
};

/** @param {google.maps.CircleOptions|Object.<string>} circleOpts */
GeolocationMarker.prototype.setCircleOptions = function(circleOpts) {
  this.circle_.setOptions(this.copyOptions_({}, circleOpts));
};

/**
 * @private
 * @param {GeolocationPosition} position
 */
GeolocationMarker.prototype.updatePosition_ = function(position) {
  var newPosition = new google.maps.LatLng(position.coords.latitude,
      position.coords.longitude);
 
  this.circle_.setRadius(position.coords.accuracy);
 
  if (!this.marker_.getMap() ||
      !newPosition.equals(this.marker_.getPosition())) {
    this.marker_.setPosition(
        new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude));

    this.marker_.setPosition(newPosition);
    if (!this.marker_.getMap()) {
      this.marker_.setMap(this.map_);
    }
    var PosChangedData = new GeolocationMarkerPositionChangedEvent(newPosition,
        this.circle_.getBounds(), position.coords.accuracy);
    google.maps.event.trigger(this, 'position_changed', PosChangedData);
  }
};

/**
 * @private
 * @return {undefined}
 */
GeolocationMarker.prototype.watchPosition_ = function() {
  var self = this;
 
  var positionOpts =
      /** @type {GeolocationPositionOptions} */
      ({enableHighAccuracy: true, maximumAge: 1000});

  if(navigator.geolocation) {
    this.watchId_ = navigator.geolocation.watchPosition(
        function(position) { self.updatePosition_(position); },
        function(e) { google.maps.event.trigger(self, "geolocation_error", e); },
        positionOpts);
  }
};

/**
 * @private
 * @param {Object.<string,*>} target
 * @param {Object.<string,*>} source
 * @return {Object.<string,*>}
 */
GeolocationMarker.prototype.copyOptions_ = function(target, source) {
  for(var opt in source) {
    if(!GeolocationMarker.DISALLOWED_OPTIONS[opt]) {
      target[opt] = source[opt];
    }
  }
  return target;
}

/**
 * @const
 * @type {Object.<string, boolean>}
 */
GeolocationMarker.DISALLOWED_OPTIONS = {
  'map': true,
  'position': true,
  'radius': true
}

/**
 * @constructor
 * @private
 * @param {google.maps.LatLng=} latLng
 * @param {google.maps.LatLngBounds=} latLngBounds
 * @param {number=} accuracy
 */
function GeolocationMarkerPositionChangedEvent(latLng, latLngBounds,
    accuracy) {
  if(latLng) {
    this['position'] = latLng;
  }
 
  if(latLngBounds) {
    this['bounds'] = latLngBounds;
  }

  if(accuracy) {
    this['accuracy'] = accuracy;
  }
}

/** @type {google.maps.LatLng} */
GeolocationMarkerPositionChangedEvent.prototype['position'] = null;

/** @type {google.maps.LatLngBounds} */
GeolocationMarkerPositionChangedEvent.prototype['bounds'] = null;

/** @type {?number} */
GeolocationMarkerPositionChangedEvent.prototype['accuracy'] = null;
