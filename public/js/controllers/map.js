angular.module('shnApp')
    .controller('MapCtrl', function($scope) {
        window.onload = function() {
            cartodb.createVis('map', 'https://saveharlemnow.carto.com/api/v2/viz/a6b9d08c-e9fc-11e6-a3b3-0e05a8b3e3d7/viz.json');
        };
    });
