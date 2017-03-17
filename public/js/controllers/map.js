angular.module('shnApp')
    .controller('MapCtrl', function($scope, $mdDialog) {
        var cdb = window.cartodb,
            indexedSubLayers = {},
            allSubLayers = {},
            initialSubLayersLength,
            choroplethInputs;


        $scope.disabledInputs = {};
        $scope.selectedMapLayers = {};
        var medianHouseholdIncome = angular.element('<div class="legend" id="medianHouseholdIncome"><div class="title"><p>Median Household Income</p></div><div class="range"><p>0</p><p>250k</p></div><div class="bar median-household-income-bar"></div></div>'),
            percentFemale = angular.element('<div class="legend" id="percentFemale"><div class="title"><p>Percent Female</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar percent-female-bar"></div></div>'),
            builtFar = angular.element('<div class="legend" id="builtFar"><div class="title"><p>Built FAR</p></div><div class="range"><p>0</p><p>7.39</p></div><div class="bar built-far-bar"></div></div>'),
            landUse = angular.element('<div class="legend" id="landUse"><div class="title">Land Use</div><div class="range"><p>02</p><span style="background: #5f4690"></span></div><div class="range"><p>04</p><span style="background: #1D6996"></span></div><div class="range"><p>05</p><span style="background: #38A6A5"></span></div><div class="range"><p>03</p><span style="background: #0F8252"></span></div><div class="range"><p>01</p><span style="background: #73AF48"></span></div><div class="range"><p>08</p><span style="background: #EDAD08"></span></div><div class="range"><p>11</p><span style="background: #E17C05"></span></div><div class="range"><p>06</p><span style="background: #CC503E"></span></div><div class="range"><p>10</p><span style="background: #8F326B"></span></div><div class="range"><p>07</p><span style="background: #6F4070"></span></div><div class="range"><p>OTHERS</p><span style="background: #6E6E6E"></span></div></div>'),
            zoning = angular.element('<div class="legend" id="zoning"><div class="title">Zoning</div><div class="range"><p>R7-2</p><span style="background: #5f4690"></span></div><div class="range"><p>R8-B</p><span style="background: #1D6996"></span></div><div class="range"><p>R7A</p><span style="background: #38A6A5"></span></div><div class="range"><p>R8</p><span style="background: #0F8252"></span></div><div class="range"><p>C6-2A</p><span style="background: #73AF48"></span></div><div class="range"><p>R6</p><span style="background: #EDAD08"></span></div><div class="range"><p>R8A</p><span style="background: #E17C05"></span></div><div class="range"><p>R7B</p><span style="background: #CC503E"></span></div><div class="range"><p>R6A</p><span style="background: #8F326B"></span></div><div class="range"><p>R10</p><span style="background: #6F4070"></span></div><div class="range"><p>OTHERS</p><span style="background: #6E6E6E"></span></div></div>'),
            medianAge = angular.element('<div id="medianAge" class="legend"><div class="title"><p>Median Age</p></div><div class="range"><p>0</p><p>71.1</p></div><div class="bar median-age-bar"></div></div>'),
            percentOwnerOccupied = angular.element('<div id="percentOwnerOccupied" class="legend"><div class="title"><p>Percent Owner Occupied</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar percent-owner-occupied-bar"></div></div>'),
            existingLandmarks = angular.element('<div class="legend" id="existingLandmarks"><div class="title"><p>Existing Landmarks</p></div><div class="range"><p>Landmarks</p><span style="background: #2562A2"></span></div></div>'),
            existingHistoricDistricts = angular.element('<div class="legend" id="existingHistoricDistricts"><div class="title"><p>Existing Historic Districts</p></div><div class="range"><p>Existing Historic Districts</p><span style="background: #FC6B21"></span></div></div>'),
            nycCommunityDistricts = angular.element('<div class="legend" id="nycCommunityDistricts"><div class="title"><p>NYC Community Districts</p></div><div class="range"><p>NYC Community Districts</p><span style="background: #FDD130"></span></div></div>'),
            subwayLines = angular.element('<div class="legend" id="subwayLines"><div class="title"><p>Subway Lines</p></div><div class="range"><p>B-D-F-M</p><span style="background: #ED703A"></span></div><div class="range"><p>A-C-E</p><span style="background: #0046A4"></span></div><div class="range"><p>4-5-6</p><span style="background: #468C3B"></span></div><div class="range"><p>N-Q-R-W</p><span style="background: #F4C733"></span></div><div class="range"><p>1-2-3</p><span style="background: #DB4E42"></span></div><div class="range"><p>J-Z</p><span style="background: #916639"></span></div><div class="range"><p>L-S</p><span style="background: #A5A7AA"></span></div><div class="range"><p>G</p><span style="background: #84B647"></span></div><div class="range"><p>7</p><span style="background: #A850AD"></span></div></div>');

        var legends = {
            medianHouseholdIncome: medianHouseholdIncome,
            percentFemale: percentFemale,
            builtFar: builtFar,
            landUse: landUse,
            zoning: zoning,
            medianAge: medianAge,
            percentOwnerOccupied: percentOwnerOccupied,
            existingLandmarks: existingLandmarks,
            existingHistoricDistricts: existingHistoricDistricts,
            nycCommunityDistricts: nycCommunityDistricts,
            subwayLines: subwayLines

        };


        $scope.mapLayers = {
            choroplethMapLayer: [{
                    displayValue: 'Built FAR',
                    modelValue: 'builtFar',
                    layerSource: ['built_far_over_max_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'address', 'bbl'],
                    layerType: 'choropleth',
                },
                { displayValue: 'Land Use', modelValue: 'landUse', layerSource: ['landuse', 'address', 'bbl'], layerType: 'choropleth' },
                { displayValue: 'Zoning', modelValue: 'zoning', layerSource: ['zonedist1', 'address', 'bbl'], layerType: 'choropleth' },
                { displayValue: 'Median Household Income', modelValue: 'medianHouseholdIncome', layerSource: ['median_household_income'], layerType: 'choropleth' },
                { displayValue: 'Percent Female', modelValue: 'percentFemale', layerSource: ['percent_female'], layerType: 'choropleth' },
                { displayValue: 'Median Age', modelValue: 'medianAge', layerSource: [], layerType: 'choropleth' },
                { displayValue: 'Percent Owner Occupied', modelValue: 'percentOwnerOccupied', layerSource: [], layerType: 'choropleth' },
                { displayValue: 'Plurality Group\'s Percent of Population', modelValue: 'pluralityGroupsPercentOfPopulation', layerSource: [], layerType: 'choropleth' }
            ],
            landmarkRateMapLayer: [
                { displayValue: 'Landmark Rate', modelValue: 'landmarkRate', layerSource: [], layerType: 'landmarkRate' },
            ],
            pointLinePolygonalMapLayer: [
                { displayValue: 'Existing Landmarks', modelValue: 'existingLandmarks', layerSource: ['pluto_addr', 'bbl', 'lm_type', 'status', 'last_action'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Landmarks', modelValue: 'proposedLandmarks', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Landmarks At Risk', modelValue: 'landmarksAtRisk', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Existing Historic Districts', modelValue: 'existingHistoricDistricts', layerSource: ['area_name', 'bbl', 'lm_type', 'status_of', 'last_actio'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Historic Districts', modelValue: 'proposedHistoricDistricts', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Zoning Changes', modelValue: 'proposedZoningChange', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'NYC Community Districts', modelValue: 'nycCommunityDistricts', layerSource: ['borocd'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Subway Lines', modelValue: 'subwayLines', layerSource: [], layerType: 'pointLinePolygonal' }
            ]
        };

        function disableChoroplethInputs(layer, status) {
            var i;
            if (status) {
                for (i = 0; i < $scope.mapLayers.choroplethLayers.length; i++) {
                    if (layer.modelValue === $scope.mapLayers.choroplethLayers[i].modelValue) {
                        angular.element('.layers-choropleth-layers .' + $scope.mapLayers.choroplethLayers[i].modelValue).prop('disabled', false);
                    } else {
                        angular.element('.layers-choropleth-layers .' + $scope.mapLayers.choroplethLayers[i].modelValue).prop('disabled', true);
                    }
                }
            } else {
                for (i = 0; i < $scope.mapLayers.choroplethLayers.length; i++) {
                    angular.element('.layers-choropleth-layers .' + $scope.mapLayers.choroplethLayers[i].modelValue).prop('disabled', false);
                }
            }

        }


        $scope.getMapLayerSelected = function(layer) {
            var prop,
                key = layer.layerType + 'MapLayer';


            function showMapLayer() {
                allSubLayers[key].forEach(function(sublayer, index) {
                    if (sublayer[1] === layer.displayValue) {
                        sublayer[0].show();
                        angular.element('.legends-holder').append(legends[layer.modelValue]);
                    }
                });
            }

            function hideMapLayer() {
                allSubLayers[key].forEach(function(sublayer, index) {
                    if (sublayer[1] === layer.displayValue) {
                        sublayer[0].hide();
                        legends[layer.modelValue].remove();
                    }
                });
            }

            ($scope.selectedMapLayers[layer.modelValue] === true) ? showMapLayer(): hideMapLayer();
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
            var choroplethVizJSON = ['https://saveharlemnow.carto.com/api/v2/viz/dd3b212e-fdde-11e6-adbd-0e3ebc282e83/viz.json', 'choroplethMapLayer'],
                landmarkRateVizJSON = ['https://saveharlemnow.carto.com/api/v2/viz/71fdef46-0814-11e7-ab64-0e3ff518bd15/viz.json', 'landmarkRateMapLayer'],
                pointLinePolygonalVizJSON = ['https://saveharlemnow.carto.com/api/v2/viz/4b650ba0-fde0-11e6-865d-0e3ebc282e83/viz.json', 'pointLinePolygonalMapLayer'];


            var map = L.map('map', {
                center: [40.811550, -73.946477],
                zoom: 14,
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
                                                    console.log(layer.getSubLayer(index), sublayer[1], index);
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
            createCDBLayer([choroplethVizJSON, landmarkRateVizJSON, pointLinePolygonalVizJSON]);
        }
        showProjectInfoModal();
        initMap();
    });
