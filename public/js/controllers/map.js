angular.module('shnApp')
    .controller('MapCtrl', function($scope, $mdDialog) {
        var cdb = window.cartodb,
            indexedSubLayers = {},
            allSubLayers = {},
            initialSubLayersLength,
            choroplethInputs,
            map;


        $scope.disabledInputs = {};
        $scope.selectedMapLayers = {};
        $scope.selectedChroplethMapLayer = '';
        var
            developmentPotential = angular.element('<div class="legend" id="developmentPotential"><div class="title"><p>AVAILABLE FAR</p></div><div class="range"><p>0</p><p>40</p></div><div class="bar development-potential-bar"></div></div>'),
            landUse = angular.element('<div class="legend" id="landUse"><div class="title">Land Use</div><div class="range"><p>Family Walk- Up Buildings</p><span style="background: #5f4690"></span></div><div class="range"><p>Mixed Residential and Commercial Buildings</p><span style="background: #1D6996"></span></div><div class="range"><p>Commercial and Office Buildings</p><span style="background: #38A6A5"></span></div><div class="range"><p> Family Elevator Buildings</p><span style="background: #0F8252"></span></div><div class="range"><p>One & Two Family Buildings </p><span style="background: #73AF48"></span></div><div class="range"><p>Public Facilities and Institutions</p><span style="background: #EDAD08"></span></div><div class="range"><p>Vacant Land</p><span style="background: #E17C05"></span></div><div class="range"><p>Industrial and Manufacturing</p><span style="background: #CC503E"></span></div><div class="range"><p>Parking Facilities</p><span style="background: #8F326B"></span></div><div class="range"><p>Transportation and Utility</p><span style="background: #6F4070"></span></div><div class="range"><p>OTHERS</p><span style="background: #6E6E6E"></span></div></div>'),
            zoning = angular.element('<div class="legend" id="zoning"><div class="title">Zoning</div><div class="range"><p>R7-2</p><span style="background: #5f4690"></span></div><div class="range"><p>R8-B</p><span style="background: #1D6996"></span></div><div class="range"><p>R7A</p><span style="background: #38A6A5"></span></div><div class="range"><p>R8</p><span style="background: #0F8252"></span></div><div class="range"><p>C6-2A</p><span style="background: #73AF48"></span></div><div class="range"><p>R6</p><span style="background: #EDAD08"></span></div><div class="range"><p>R8A</p><span style="background: #E17C05"></span></div><div class="range"><p>R7B</p><span style="background: #CC503E"></span></div><div class="range"><p>R6A</p><span style="background: #8F326B"></span></div><div class="range"><p>R10</p><span style="background: #6F4070"></span></div><div class="range"><p>OTHERS</p><span style="background: #6E6E6E"></span></div></div>'),
            pluralityGroupsPercentOfPopulation = angular.element('<div class="legend" id="pluralityGroupsPercentOfPopulation"><div class="title"><p>Plurality Group\'s Percent of Population</div><div class="title"><p>White</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar plurality-white-bar"></div><div class="title"><p>Black</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar plurality-black-bar"></div><div class="title"><p>Asian</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar plurality-asian-bar"></div><div class="title"><p>Latino</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar plurality-latino-bar"></div><div class="title"><p>Two Plus</p></div><div class="range"><p>0</p><p>100</p></div><div class="bar plurality-two-plus-bar"></div></div>'),
            inappropriateZoning = angular.element('<div class="legend" id="inappropriateZoning"><div class="title"><p>Inappropriate Zoning</p></div><div class="range"><p>Zoned R7A and available FAR > 5</p><span style="background: #382C9C"></span></div></div>'),
            existingLandmarks = angular.element('<div class="legend" id="existingLandmarks"><div class="title"><p>Existing Landmarks</p></div><div class="title"><p style="color: #979EA1">LANDMARK TYPE</p></div><div class="range"><p>INDIVIDUAL LANDMARK</p><span style="background: #E600A9"></span></div><div class="range"><p>INTERIOR LANDMARK</p><span style="background: #0070FF"></span></div><div class="range"><p>SCENIC LANDMARK</p><span style="background: #267300"></span></div></div>'),
            existingHistoricDistricts = angular.element('<div class="legend" id="existingHistoricDistricts"><div class="title"><p>Existing Historic Districts</p></div><div class="range"><p>DESIGNATED</p><span style="background: #FFCC00"></span></div><div class="range"><p>CALENDARED</p><span style="background: #FC6B21"></span></div><div class="range"><p>HEARD</p><span style="background: #38A6A5"></span></div></div>'),
            nycCommunityDistricts = angular.element('<div class="legend" id="nycCommunityDistricts"><div class="title"><p>NYC Community Districts</p></div><div class="range"><p>NYC Community Districts</p><span style="background: #FDD130"></span></div></div>'),
            subwayLines = angular.element('<div class="legend" id="subwayLines"><div class="title"><p>Subway Lines</p></div><div class="range"><p>B-D-F-M</p><span style="background: #ED703A"></span></div><div class="range"><p>A-C-E</p><span style="background: #0046A4"></span></div><div class="range"><p>4-5-6</p><span style="background: #468C3B"></span></div><div class="range"><p>N-Q-R-W</p><span style="background: #F4C733"></span></div><div class="range"><p>1-2-3</p><span style="background: #DB4E42"></span></div><div class="range"><p>J-Z</p><span style="background: #916639"></span></div><div class="range"><p>L-S</p><span style="background: #A5A7AA"></span></div><div class="range"><p>G</p><span style="background: #84B647"></span></div><div class="range"><p>7</p><span style="background: #A850AD"></span></div></div>');

        var legends = {
            developmentPotential: developmentPotential,
            landUse: landUse,
            zoning: zoning,
            pluralityGroupsPercentOfPopulation: pluralityGroupsPercentOfPopulation,
            inappropriateZoning: inappropriateZoning,
            existingLandmarks: existingLandmarks,
            existingHistoricDistricts: existingHistoricDistricts,
            nycCommunityDistricts: nycCommunityDistricts,
            subwayLines: subwayLines,
        };


        $scope.mapLayers = {
            choroplethMapLayer: [{
                    displayValue: 'Development Potential',
                    modelValue: 'developmentPotential',
                    layerSource: ['built_far_over_max_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'address', 'bbl'],
                    layerType: 'choropleth',
                },
                { displayValue: 'Land Use', modelValue: 'landUse', layerSource: ['landuse', 'address', 'bbl'], layerType: 'choropleth' },
                { displayValue: 'Zoning', modelValue: 'zoning', layerSource: ['zonedist1', 'address', 'bbl'], layerType: 'choropleth' },
                { displayValue: 'Plurality Group\'s Percent of Population', modelValue: 'pluralityGroupsPercentOfPopulation', layerSource: [], layerType: 'choropleth' },
                { displayValue: 'Landmark Rate', modelValue: 'landmarkRate', layerSource: [], layerType: 'choropleth' },
                { displayValue: 'Inappropriate Zoning', modelValue: 'inappropriateZoning', layerSource: ['built_far_over_max_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'address', 'bbl'], layerType: 'choropleth' },
            ],
            pointLinePolygonalMapLayer: [
                { displayValue: 'Existing Landmarks', modelValue: 'existingLandmarks', layerSource: ['address', 'landmark_type', 'status', 'bbl', 'last_action', 'link_to_pdf_document'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Landmarks', modelValue: 'proposedLandmarks', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Landmarks At Risk', modelValue: 'landmarksAtRisk', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Existing Historic Districts', modelValue: 'existingHistoricDistricts', layerSource: ['name', 'last_action'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Historic Districts', modelValue: 'proposedHistoricDistricts', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Zoning Changes', modelValue: 'proposedZoningChange', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'NYC Community Board Districts', modelValue: 'nycCommunityDistricts', layerSource: ['borocd'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Subway Lines', modelValue: 'subwayLines', layerSource: [], layerType: 'pointLinePolygonal' }
            ]
        };

        $scope.existingLandmarks = {
            displayValue: 'Existing Landmarks',
            layerType: 'pointLinePolygonal'
        };



        $scope.zoomToHarlem = function() {
            map.setView([40.811550, -73.946477], 15);
        };

        $scope.zoomToAllManhattan = function() {
            map.setView([40.776355, -73.959961], 12);
        };

        $scope.turnOnChoroplethMapLayer = function(layer) {
            var key = layer.layerType + 'MapLayer';
            allSubLayers[key].forEach(function(sublayer, index) {
                if (sublayer[1] === layer.displayValue) {
                    sublayer[0].show();
                    if (angular.element('.legends-holder').children().length > 0) {
                        angular.element('.legends-holder').children()[0].remove();
                    }
                    angular.element('.legends-holder').append(legends[layer.modelValue]);
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
                            angular.element('.legends-holder').append(legends[layer.modelValue]);
                        }
                    });
                } else {
                    arr.forEach(function(item, index) {
                        allSubLayers[key].forEach(function(sublayer, index) {
                            if (sublayer[1] === item.displayValue) {
                                sublayer[0].show();
                                angular.element('.legends-holder').append(legends[item.modelValue]);
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
                            if (legends[layer.modelValue]) {
                                legends[layer.modelValue].remove();
                            }
                        }
                    });
                } else {
                    arr.forEach(function(item, index) {
                        allSubLayers[key].forEach(function(sublayer, index) {
                            if (sublayer[1] === item.displayValue) {
                                sublayer[0].hide();
                                if (legends[item.modelValue]) {
                                    legends[item.modelValue].remove();
                                }
                            }
                        });
                    });
                }
            }

            // showMapLayer(layer);
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


        $('.overlay-content p').click(function() {
            console.log('i might');
            $('.overlay-content p').css('color', 'yellow');
        });

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
                            console.log(allSubLayers, 'allSubLayers');
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                });
            }
            createCDBLayer([choroplethVizJSON, pointLinePolygonalVizJSON]);
        }
        showProjectInfoModal();
        initMap();
    });
