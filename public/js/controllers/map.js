angular.module('shnApp')
    .controller('MapCtrl', function($scope, $mdDialog) {
        var cdb = window.cartodb;
        $scope.selectedMapLayers = {};
        var indexedSubLayers = {};
        var allSubLayers = [];

        $scope.mapLayers = {
            choroplethLayers: [{
                    displayValue: 'Built FAR',
                    modelValue: 'builtFar',
                    layerSource: ['builtfar_maxfar', 'builtfar', 'residfar', 'commfar', 'facilfar', 'address', 'bbl']
                },
                { displayValue: 'Land Use', modelValue: 'landUse', layerSource: ['landuse', 'address', 'bbl'] },
                { displayValue: 'Zoning', modelValue: 'zoning', layerSource: ['zonedist1', 'address', 'bbl'] },
                { displayValue: 'Landmark Rate', modelValue: 'landmarkRate', layerSource: [] },
                { displayValue: 'Median Household Income', modelValue: 'medianHouseholdIncome', layerSource: ['med_hh_inc'] },
                { displayValue: 'Percent Female', modelValue: 'percentFemale', layerSource: ['pct_female'] }

            ],
            pointLinePolygonalLayers: [
                { displayValue: 'Existing Landmarks', modelValue: 'existingLandmarks', layerSource: ['pluto_addr', 'bbl', 'lm_type', 'status', 'last_actio'] },
                { displayValue: 'Proposed Landmarks', modelValue: 'proposedLandmarks', layerSource: [] },
                { displayValue: 'Landmarks At Risk', modelValue: 'landmarksAtRisk', layerSource: [] },
                { displayValue: 'Existing Historic Districts', modelValue: 'existingHistoricDistricts', layerSource: ['area_name', 'bbl', 'lm_type', 'status_of', 'last_actio'] },
                { displayValue: 'Proposed Historic Districts', modelValue: 'proposedHistoricDistricts', layerSource: [] },
                { displayValue: 'Proposed Zoning Changes', modelValue: 'proposedZoningChange', layerSource: [] },
                { displayValue: 'NYC Community Districts', modelValue: 'nycCommunityDistricts', layerSource: ['borocd'] },
                { displayValue: 'Transportation Infrastructure', modelValue: 'transportationInfrastructure', layerSource: [] }
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

        function ProjectInfoModalController($scope, $mdDialog) {
            $scope.closeProjectInfoModal = function() {
                localStorage.closeProjectInfoModal = true;
                $mdDialog.hide();
            };
        }

        function AboutInfoModalController($scope, $mdDialog) {

        }

        $scope.showAboutInfoModal = function() {
            $mdDialog.show({
                controller: AboutInfoModalController,
                templateUrl: 'views/about-info-modal.html',
                clickOutsideToClose: true,
            });
        };

        function showProjectInfoModal() {
            var status = localStorage.closeProjectInfoModal;
            if (!status) {
                $mdDialog.show({
                    controller: ProjectInfoModalController,
                    templateUrl: 'views/project-info-modal.html',
                    clickOutsideToClose: true,
                });
            }
        }

        function initMap() {
            var map = L.map('map', {
                center: [40.811550, -73.946477],
                zoom: 14,
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

                        function createInfowindows(obj) {
                            Object.keys(obj).forEach(function(key) {
                                for (var prop in indexedSubLayers) {
                                    for (var i = 0; i < obj[key].length; i++) {
                                        if (indexedSubLayers[prop] === obj[key][i].displayValue) {
                                            cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(prop), obj[key][i].layerSource, {
                                                infowindowTemplate: $(obj[key][i].modelValue).html(),
                                            });
                                        }
                                    }
                                }
                            });
                        }
                        mapSubLayers();
                        createInfowindows($scope.mapLayers);
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }
            createCDBLayer();
        }
        showProjectInfoModal();
        initMap();
        // console.log(indexedSubLayers);
    });
