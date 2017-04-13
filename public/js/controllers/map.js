angular.module('shnApp')
    .controller('MapCtrl', function($scope, $mdDialog, mapLayersData, legendDOMElements) {

        // global variables
        var cdb = window.cartodb,
            allSubLayers = {},
            map;


        $scope.selectedMapLayers = {};

        $scope.mapLayers = mapLayersData;

        $scope.existingLandmarks = {
            displayValue: 'Existing Landmarks',
            layerType: 'pointLinePolygonal'
        };

        $scope.choroplethLayersVisibility = false;


        // ui interactions / event listeners
        $scope.zoomToHarlem = function() {
            map.setView([40.811550, -73.946477], 15);
        };

        $scope.zoomToAllManhattan = function() {
            map.setView([40.776355, -73.959961], 12);
        };



        $scope.enableChoroplethLayers = function(state) {
            if (!state) {
                angular.element('.layers-choropleth-layers .map-layer input:radio').each(function() {
                    angular.element(this).attr('disabled', true);
                    var mapLayers = Object.keys(allSubLayers);
                    mapLayers.forEach(function(sublayer, index) {
                        if (sublayer === 'choroplethMapLayer') {
                            allSubLayers[sublayer].forEach(function(layer, index) {
                                layer[0].hide();
                                angular.element('.legends-holder .choropleth-legend').remove();
                            });
                        }
                    });
                });
            } else {
                angular.element('.layers-choropleth-layers .map-layer input:radio').each(function() {
                    angular.element(this).attr('disabled', false);
                });
            }
        };

        $scope.turnOnChoroplethMapLayer = function(layer) {
            var key = Object.keys(allSubLayers)[0];

            allSubLayers[key].forEach(function(sublayer, index) {
                if (sublayer[1] === layer.displayValue) {
                    sublayer[0].show();
                    if (angular.element('.legends-holder .choropleth-legend')) {
                        angular.element('.legends-holder .choropleth-legend').remove();
                        angular.element('.legends-holder').append(legendDOMElements[layer.modelValue]);
                    }
                } else {
                    sublayer[0].hide();
                }
            });

        };


        $scope.getMapLayerSelected = function(layer) {
            var prop,
                key = layer.layerType + 'MapLayer',
                arr = [{ modelValue: 'existingLandmarks', displayValue: 'Existing Landmarks' }, { modelValue: 'existingHistoricDistricts', displayValue: 'Existing Historic Districts' }];

            function showMapLayer(layer) {
                if (layer.displayValue !== 'Existing Landmarks') {
                    allSubLayers[key].forEach(function(sublayer, index) {
                        if (sublayer[1] === layer.displayValue) {
                            sublayer[0].show();
                            angular.element('.legends-holder').append(legendDOMElements[layer.modelValue]);
                        }
                    });
                } else {
                    arr.forEach(function(item, index) {
                        allSubLayers[key].forEach(function(sublayer, index) {
                            if (sublayer[1] === item.displayValue) {
                                sublayer[0].show();
                                angular.element('.legends-holder').append(legendDOMElements[item.modelValue]);
                            }
                        });
                    });

                }
            }

            function hideMapLayer(layer) {
                if (layer.displayValue !== 'Existing Landmarks') {
                    allSubLayers[key].forEach(function(sublayer, index) {
                        if (sublayer[1] === layer.displayValue) {
                            sublayer[0].hide();
                            if (legendDOMElements[layer.modelValue]) {
                                legendDOMElements[layer.modelValue].remove();
                            }
                        }
                    });
                } else {
                    arr.forEach(function(item, index) {
                        allSubLayers[key].forEach(function(sublayer, index) {
                            if (sublayer[1] === item.displayValue) {
                                sublayer[0].hide();
                                if (legendDOMElements[item.modelValue]) {
                                    legendDOMElements[item.modelValue].remove();
                                }
                            }
                        });
                    });
                }
            }

            ($scope.selectedMapLayers[layer.modelValue] === true) ? showMapLayer(layer): hideMapLayer(layer);

        };

        $scope.showOverlayNavigation = function() {
            $('.overlay-nav').css('width', '100%');
            $('.overlay-nav .overlay-content p').css('opacity', '1');
        };

        $scope.closeOverlayNavigation = function() {
            $('.overlay-nav').css('width', '0');
            $('.overlay-nav .overlay-content p').css('opacity', '0');
        };

        $scope.selectChoroplethMapLayerMobile = function(layer) {
            $scope.turnOnChoroplethMapLayer(layer);
            $scope.closeOverlayNavigation();
        };

        $scope.getMapLayerSelectedMobile = function(layer) {
            if (layer.selectedOnMobile === true) {
                $scope.selectedMapLayers[layer.modelValue] = false;
                $scope.getMapLayerSelected(layer);
                layer.selectedOnMobile = false;
            } else {
                $scope.selectedMapLayers[layer.modelValue] = true;
                $scope.getMapLayerSelected(layer);
                layer.selectedOnMobile = true;
            }
            $scope.closeOverlayNavigation();
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

        $scope.showProjectInfoModal = function() {
            $mdDialog.show({
                controller: ProjectInfoModalController,
                templateUrl: 'views/project-info-modal.html',
                clickOutsideToClose: true,
            });
        };

        function showProjectInfoModalOnPageLoad() {
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
            var choroplethVizJSON = ['https://saveharlemnow.carto.com/api/v2/viz/dd3b212e-fdde-11e6-adbd-0e3ebc282e83/viz.json', 'choroplethMapLayer'],
                pointLinePolygonalVizJSON = ['https://saveharlemnow.carto.com/api/v2/viz/4b650ba0-fde0-11e6-865d-0e3ebc282e83/viz.json', 'pointLinePolygonalMapLayer'];


            map = L.map('map', {
                center: [40.811550, -73.946477],
                zoom: 16,
            });

            var baseMapLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
            });

            map.addLayer(baseMapLayer);

            function createCDBLayer(arr) {

                arr.forEach(function(vizJSON, index) {

                    cdb.createLayer(map, vizJSON[0], { legends: true })
                        .addTo(map)
                        .done(function(layer) {

                            function storeSublayers() {
                                allSubLayers[vizJSON[1]] = [];
                                for (var i = 0; i < layer.getSubLayerCount(); i++) {
                                    layer.getSubLayer(i).hide();
                                    var sublayer = layer.getSubLayer(i);
                                    allSubLayers[vizJSON[1]].push([sublayer]);
                                }
                            }

                            storeSublayers();

                            function mapSubLayers(obj) {
                                var subLayerData = layer.getSubLayer(0),
                                    subLayers = subLayerData._parent.layers;
                                subLayers.forEach(function(sublayer, index) {
                                    allSubLayers[vizJSON[1]][index][1] = sublayer.options.layer_name;
                                });

                                for (var key in obj) {
                                    if (key === vizJSON[1]) {
                                        allSubLayers[key].forEach(function(sublayer, index) {
                                            for (var i = 0; i < obj[key].length; i++) {
                                                if (sublayer[1] === obj[key][i].displayValue) {
                                                    cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(index), obj[key][i].layerSource, {
                                                        infowindowTemplate: $('#' + obj[key][i].modelValue).html(),
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            }

                            mapSubLayers($scope.mapLayers);
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                });
            }
            createCDBLayer([choroplethVizJSON, pointLinePolygonalVizJSON]);
        }
        showProjectInfoModalOnPageLoad();
        initMap();


        angular.element(document).ready(function() {
            console.log(angular.element('.map-container .cartodb-infowindow .cartodb-popup .cartodb-popup-content-wrapper .cartodb-popup-content'));
        });
    });
