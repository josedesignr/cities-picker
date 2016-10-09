"use strict";!function(){angular.module("citiesPicker",["ui-leaflet","google.places","ngStorage"])}();var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};angular.module("citiesPicker").controller("MainController",["$scope","$http","$localStorage",function(e,t,o){e.locationBtn_legend="Where am I?",e.$storage=o.$default({markers:[],citiesList:[]}),e.currentCity="",angular.extend(e,{center:{lat:3.9,lng:-73.5,zoom:5},defaults:{tileLayer:"https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvam9zZTgyNyIsImEiOiJjaXUwaGZqZnMwMWgzMnpwZzVrdmlpcnBxIn0.ElMgKpRdQu3aeOquy3qwPg",tileLayerOptions:{opacity:.9,detectRetina:!0,reuseTiles:!0,attribution:"Mapbox"},minZoom:2,doubleClickZoom:!0}}),e.navOpen=!1,e.getMyLocation=function(){e.locationBtn_legend="Finding location...",navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(t){angular.extend(e,{center:{lat:t.coords.latitude,lng:t.coords.longitude,zoom:10}}),e.$storage.citiesList.push("My current location"),e.$storage.markers.push({lat:t.coords.latitude,lng:t.coords.longitude,message:"I am here!"}),e.locationBtn_legend="Where am I?",e.navOpen=!1},function(t){alert(t.message),e.locationBtn_legend="Where am I?",e.navOpen=!1},{enableHighAccuracy:!0})},e.validateAndAdd=function(){if(null!==e.place&&"object"===_typeof(e.place)){var t=JSON.parse(JSON.stringify(e.place));console.log(t);var o={lat:t.geometry.location.lat,lng:t.geometry.location.lng,message:t.address_components[0].long_name,title:t.address_components[0].long_name};e.$storage.markers.push(o),e.$storage.citiesList.push(t.formatted_address),e.center={lat:t.geometry.location.lat,lng:t.geometry.location.lng,zoom:10},e.place="",e.navOpen=!1}},e.removeCity=function(t){e.$storage.citiesList.splice(t,1),e.$storage.markers.splice(t,1)},e.expandMap=function(){e.center.zoom=2,e.navOpen=!1,e.currentCity=""},e.moveMapHere=function(t){e.center={lat:e.$storage.markers[t].lat,lng:e.$storage.markers[t].lng,zoom:10},e.navOpen=!1,e.currentCity=t},e.clearAll=function(){e.$storage.markers=[],e.$storage.citiesList=[]}}]);