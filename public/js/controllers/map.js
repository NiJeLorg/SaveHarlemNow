angular.module('shnApp')
    .controller('MapCtrl', function($scope) {
        var cdb = window.cartodb;
        $scope.mapLayers = {
            choroplethLayers: ['Built FAR', 'Land Use', 'Zoning', 'Landmark Rate', 'Demographics'],
            pointLinePolygonalLayers: ['Existing Landmarks', 'Proposed Landmarks', 'Landmarks At Risk', 'Existing Historic Districts', 'Proposed Historic Districts', 'Proposed Zoning Changes', 'NYC Community Boards', 'Transportation Infrastructure']
        };

        function initMap() {
            var map = L.map('map', {
                center: [40.811550, -73.946477],
                zoom: 13
            });

            var baseMapLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
            });

            map.addLayer(baseMapLayer);

            function createCDBLayer() {
                var vizJSON = 'https://saveharlemnow.carto.com/api/v2/viz/a6b9d08c-e9fc-11e6-a3b3-0e05a8b3e3d7/viz.json';
                cdb.createLayer(map, vizJSON, { 'https': true })
                    .addTo(map)
                    .done(function(layer) {
                        var numOfSubLayers = layer.getSubLayerCount();
                        for (var i = 0; i < numOfSubLayers; i++) {
                            layer.getSubLayer(i).hide();
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }
            createCDBLayer();
        }
        initMap();
    });
