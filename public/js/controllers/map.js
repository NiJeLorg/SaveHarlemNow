angular.module('shnApp')
    .controller('MapCtrl', function($scope, $mdDialog) {
        var cdb = window.cartodb,
            indexedSubLayers = {},
            allSubLayers = [],
            initialSubLayersLength;


        $scope.selectedMapLayers = {};
        var medianHouseholdIncome = angular.element('<div class="legend" id="medianHouseholdIncome"><div class="title"><p>Median Household Income</p></div><div class="range"><p>0</p><p>250k</p></div><div class="bar median-household-income-bar"></div></div>'),
            percentFemale = angular.element('<div class="legend" id="percentFemale"><div class="title"><p>Percent Female</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar percent-female-bar"></div></div>'),
            builtFar = angular.element('<div class="legend" id="builtFar"><div class="title"><p>Built FAR</p></div><div class="range"><p>0</p><p>7.39</p></div><div class="bar built-far-bar"></div></div>'),
            landUse = angular.element('<div class="legend" id="landUse"><div class="title">Land Use</div><div class="range"><p>02</p><span style="background: #5f4690"></span></div><div class="range"><p>04</p><span style="background: #1D6996"></span></div><div class="range"><p>05</p><span style="background: #38A6A5"></span></div><div class="range"><p>03</p><span style="background: #0F8252"></span></div><div class="range"><p>01</p><span style="background: #73AF48"></span></div><div class="range"><p>08</p><span style="background: #EDAD08"></span></div><div class="range"><p>11</p><span style="background: #E17C05"></span></div><div class="range"><p>06</p><span style="background: #CC503E"></span></div><div class="range"><p>10</p><span style="background: #8F326B"></span></div><div class="range"><p>07</p><span style="background: #6F4070"></span></div><div class="range"><p>OTHERS</p><span style="background: #6E6E6E"></span></div></div>'),
            zoning = angular.element('<div class="legend" id="zoning"><div class="title">Zoning</div><div class="range"><p>R7-2</p><span style="background: #5f4690"></span></div><div class="range"><p>R8-B</p><span style="background: #1D6996"></span></div><div class="range"><p>R7A</p><span style="background: #38A6A5"></span></div><div class="range"><p>R8</p><span style="background: #0F8252"></span></div><div class="range"><p>C6-2A</p><span style="background: #73AF48"></span></div><div class="range"><p>R6</p><span style="background: #EDAD08"></span></div><div class="range"><p>R8A</p><span style="background: #E17C05"></span></div><div class="range"><p>R7B</p><span style="background: #CC503E"></span></div><div class="range"><p>R6A</p><span style="background: #8F326B"></span></div><div class="range"><p>R10</p><span style="background: #6F4070"></span></div><div class="range"><p>OTHERS</p><span style="background: #6E6E6E"></span></div></div>');

        var legends = {
            medianHouseholdIncome: medianHouseholdIncome,
            percentFemale: percentFemale,
            builtFar: builtFar,
            landUse: landUse,
            zoning: zoning
        };


        $scope.mapLayers = {
            choroplethLayers: [{
                    displayValue: 'Built FAR',
                    modelValue: 'builtFar',
                    layerSource: ['builtfar_maxfar', 'builtfar', 'residfar', 'commfar', 'facilfar', 'address', 'bbl'],
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
            var key, prop;
            if ($scope.selectedMapLayers[layer.modelValue] === true) {
                for (key in indexedSubLayers) {
                    if (indexedSubLayers[key] === layer.displayValue) {
                        allSubLayers[key].show();
                        angular.element('.legends-holder').append(legends[layer.modelValue]);
                    }
                }
            } else {
                for (key in indexedSubLayers) {
                    if (indexedSubLayers[key] === layer.displayValue) {
                        allSubLayers[key].hide();
                        legends[layer.modelValue].remove();
                    }
                }
            }
        };

        $scope.showOverlayNavigation = function() {
            $('.overlay-nav').css('width', '100%');
            $('.overlay-nav .overlay-content p').css('opacity', '1');
        };

        $scope.closeOverlayNavigation = function() {
            $('.overlay-nav').css('width', '0');
            $('.overlay-nav .overlay-content p').css('opacity', '0');
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
            var choroplethVizJSON = 'https://saveharlemnow.carto.com/api/v2/viz/dd3b212e-fdde-11e6-adbd-0e3ebc282e83/viz.json',
                pointLinePolygonalVizJSON = 'https://saveharlemnow.carto.com/api/v2/viz/4b650ba0-fde0-11e6-865d-0e3ebc282e83/viz.json';

            var map = L.map('map', {
                center: [40.811550, -73.946477],
                zoom: 14,
            });

            var baseMapLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
            });

            map.addLayer(baseMapLayer);


            function createCDBLayer(vizJSON) {
                cdb.createLayer(map, vizJSON, { legends: true })
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
                                subLayers = subLayerData._parent.layers,
                                len = Object.keys(indexedSubLayers).length,
                                j;
                            // create  indexed object with matching layerrs_name
                            if (len > 1) {
                                for (j = 0; j < subLayers.length; j++) {
                                    indexedSubLayers[len + j] = subLayers[j].options.layer_name;
                                }
                            } else {
                                for (j = 0; j < subLayers.length; j++) {
                                    indexedSubLayers[j] = subLayers[j].options.layer_name;
                                }
                                initialSubLayersLength = Object.keys(indexedSubLayers).length;
                            }

                        }

                        function createInfowindows(obj) {
                            var len = Object.keys(indexedSubLayers).length,
                                prop,
                                i;

                            if (len === initialSubLayersLength) {
                                for (prop in indexedSubLayers) {
                                    for (i = 0; i < obj.choroplethLayers.length; i++) {
                                        if (indexedSubLayers[prop] === obj.choroplethLayers[i].displayValue) {
                                            cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(prop), obj.choroplethLayers[i].layerSource, {
                                                infowindowTemplate: $(obj.choroplethLayers[i].modelValue).html(),
                                            });
                                        }
                                    }
                                }
                            } else {
                                for (prop in indexedSubLayers) {
                                    for (i = 0; i < obj.pointLinePolygonalLayers.length; i++) {
                                        if (indexedSubLayers[prop] === obj.pointLinePolygonalLayers[i].displayValue && indexedSubLayers[prop] !== 'NYC Community Districts') {
                                            console.log(indexedSubLayers[prop]);
                                            cdb.vis.Vis.addInfowindow(map, layer.getSubLayer((prop - initialSubLayersLength)), obj.pointLinePolygonalLayers[i].layerSource, {
                                                infowindowTemplate: $(obj.pointLinePolygonalLayers[i].modelValue).html(),
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        mapSubLayers();
                        createInfowindows($scope.mapLayers);
                        console.log(indexedSubLayers)
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }
            createCDBLayer(choroplethVizJSON);
            createCDBLayer(pointLinePolygonalVizJSON);
        }
        showProjectInfoModal();
        initMap();
    });
