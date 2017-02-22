angular.module('shnApp')
    .controller('MapCtrl', function($scope) {
        var cdb = window.cartodb;
        $scope.selectedMapLayers = {};
        var indexedSubLayers = {};
        var allSubLayers = [];

        $scope.mapLayers = {
            choroplethLayers: [{
                    displayValue: 'Built FAR',
                    modelValue: 'builtFar'
                },
                { displayValue: 'Land Use', modelValue: 'landUse' },
                { displayValue: 'Zoning', modelValue: 'zoning' },
                { displayValue: 'Landmark Rate', modelValue: 'landmarkRate' },
                { displayValue: 'Demographics', modelValue: 'demographics' }
            ],
            pointLinePolygonalLayers: [
                { displayValue: 'Existing Landmarks', modelValue: 'existingLandmarks' },
                { displayValue: 'Proposed Landmarks', modelValue: 'proposedLandmarks' },
                { displayValue: 'Landmarks At Risk', modelValue: 'landmarksAtRisk' },
                { displayValue: 'Existing Historic Districts', modelValue: 'existingHistoricDistricts' },
                { displayValue: 'Proposed Historic Districts', modelValue: 'proposedHistoricDistricts' },
                { displayValue: 'Proposed Zoning Changes', modelValue: 'proposedZoningChange' },
                { displayValue: 'NYC Community Districts', modelValue: 'nycCommunityDistricts' },
                { displayValue: 'Transportation Infrastructure', modelValue: 'transportationInfrastructure' }
            ]
        };


        $scope.getMapLayerSelected = function(layer) {
            if ($scope.selectedMapLayers[layer.modelValue] === true) {
                for (var key in indexedSubLayers) {
                    if (indexedSubLayers[key] === layer.displayValue) {
                        allSubLayers[key].show();
                    }
                }
            } else {
                for (var prop in indexedSubLayers) {
                    if (indexedSubLayers[prop] === layer.displayValue) {
                        allSubLayers[prop].hide();
                    }
                }
            }
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

                        // hide all layers when map loads
                        for (var i = 0; i < layer.getSubLayerCount(); i++) {
                            layer.getSubLayer(i).hide();
                            var sublayer = layer.getSubLayer(i);
                            allSubLayers.push(sublayer);
                        }

                        function mapSubLayers() {
                            var subLayerData = layer.getSubLayer(0),
                                subLayers = subLayerData._parent.layers;

                            // create  indexed object with matching layerrs_name
                            for (var j = 0; j < subLayers.length; j++) {
                                indexedSubLayers[j] = subLayers[j].options.layer_name;
                            }
                        }
                        mapSubLayers();
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }
            createCDBLayer();
        }
        initMap();
    });
