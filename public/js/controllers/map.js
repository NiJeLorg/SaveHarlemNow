angular.module('shnApp')
    .controller('MapCtrl', function ($scope, $mdDialog, mapLayersData, legendDOMElements) {

        // global variables
        let cdb = window.cartodb,
            choroplethLayersOn = true,
            map;

        const showSelectedLayerLegend = (layer) => {
            $('.legends-holder').append(legendDOMElements[layer.id]);
            if (layer.name === 'Existing Landmarks') {
                $('.legends-holder').append(legendDOMElements['existingHistoricDistricts']);
            }
            if (layer.name === 'Proposed Landmarks') {
                $('.legends-holder').append(legendDOMElements['proposedHistoricDistricts']);
            }
        };

        const hideNonSelectedLayerLegend = (layer) => {
            if (legendDOMElements[layer.id]) {
                legendDOMElements[layer.id].remove();
                if (layer.name === 'Existing Landmarks') {
                    legendDOMElements['existingHistoricDistricts'].remove();
                }
                if (layer.name === 'Proposed Landmarks') {
                    legendDOMElements['proposedHistoricDistricts'].remove();
                }
            }
        };

        $scope.selectedMapLayers = {};

        // ui interactions / event listeners
        $scope.zoomToHarlem = function () {
            map.setView([40.811550, -73.946477], 15);
        };

        $scope.zoomToAllManhattan = function () {
            map.setView([40.776355, -73.959961], 12);
        };

        $scope.turnLayerOn = (selectedLayer, $event) => {
            if (selectedLayer.layerType === 'choropleth') {
                $scope.mapLayers.filter((layer, index) => {
                    if (layer.layerType === 'choropleth' && layer.name !== selectedLayer.name) {
                        layer.sublayer.hide();
                        hideNonSelectedLayerLegend(layer);
                    }
                    selectedLayer.sublayer.show();
                    showSelectedLayerLegend(selectedLayer);
                });
            } else {
                if ($event.target.checked) {
                    selectedLayer.sublayer.show();
                    showSelectedLayerLegend(selectedLayer);
                    if (selectedLayer.name === 'Existing Landmarks') {
                        $scope.mapLayers.filter((layer, index) => {
                            if (layer.name === 'Existing Historic Districts') {
                                layer.sublayer.show();
                            }
                        });
                    }
                    if (selectedLayer.name === 'Proposed Landmarks') {
                        $scope.mapLayers.filter((layer, index) => {
                            if (layer.name === 'Proposed Historic Districts') {
                                layer.sublayer.show();
                            }
                        });
                    }
                } else {
                    selectedLayer.sublayer.hide();
                    hideNonSelectedLayerLegend(selectedLayer)
                    if (selectedLayer.name === 'Existing Landmarks') {
                        $scope.mapLayers.filter((layer, index) => {
                            if (layer.name === 'Existing Historic Districts') {
                                layer.sublayer.hide();
                            }
                        });
                    }
                    if (selectedLayer.name === 'Proposed Landmarks') {
                        $scope.mapLayers.filter((layer, index) => {
                            if (layer.name === 'Proposed Historic Districts') {
                                layer.sublayer.hide();
                            }
                        });
                    }
                }
            }
        };

        $scope.toggleChoroplethLayers = (state) => {
            if (state) {
                $('input:radio').attr('disabled', true)
                    .prop('checked', false);
                $scope.mapLayers.filter((layer, index) => {
                    if (layer.layerType === 'choropleth') {
                        layer.sublayer.hide();
                    }
                })
            } else {
                $('input:radio').attr('disabled', false);
            }
            $('.legends-holder .choropleth-legend').remove();
        };

        $scope.showOverlayNavigation = function () {
            $('.overlay-nav').css('width', '100%');
            $('.overlay-nav .overlay-content p').css('opacity', '1');
        };

        $scope.closeOverlayNavigation = function () {
            $('.overlay-nav').css('width', '0');
            $('.overlay-nav .overlay-content p').css('opacity', '0');
        };

        $scope.selectChoroplethMapLayerMobile = function (layer) {
            $scope.turnOnChoroplethMapLayer(layer);
            $scope.closeOverlayNavigation();
        };

        $scope.getMapLayerSelectedMobile = function (layer) {
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
            $scope.closeProjectInfoModal = function () {
                localStorage.closeProjectInfoModal = true;
                $mdDialog.hide();
            };
        }

        $scope.showProjectInfoModal = function () {
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
            const vizJSONs = {
                choropleth: 'https://saveharlemnow.carto.com/api/v2/viz/dd3b212e-fdde-11e6-adbd-0e3ebc282e83/viz.json',
                pointLinePolygonal: 'https://saveharlemnow.carto.com/api/v2/viz/4b650ba0-fde0-11e6-865d-0e3ebc282e83/viz.json'
            };

            map = L.map('map', {
                center: [40.811550, -73.946477],
                zoom: 16,
            });

            var baseMapLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
            });

            map.addLayer(baseMapLayer);

            function createCDBLayer(obj) {
                let sublayers = [];
                const makeSublayerNameIdFriendly = (name) => {
                    name = name.replace(/[\s']/g, '');
                    name = name[0].toLowerCase() + name.slice(1);
                    return name;
                };
                const returnLayerSource = (layerName) => {
                    let layerSource;
                    Object.keys(mapLayersData).forEach((key, index) => {
                        mapLayersData[key].map((layer, index) => {
                            if (layer.displayValue == layerName) {
                                layerSource = layer.layerSource;
                            }
                        });
                    });
                    return layerSource;
                };
                const selectLayerType = (layerName) => {
                    const layerTypes = {
                        choropleth: ['Development Potential', 'Land Use', 'Zoning', 'Plurality Group\'s Percent of Population', 'Landmark Rate', 'Inappropriate Zoning'],
                        pointLinePolygonal: ['Existing Landmarks', 'Proposed Landmarks', 'Landmarks At Risk', 'Existing Historic Districts', 'Proposed Historic Districts', 'Proposed Zoning Changes', 'NYC Community Board Districts', 'Subway Lines']
                    };
                    let layerType;
                    Object.keys(layerTypes).forEach((key, index) => {
                        layerTypes[key].map((layer, index) => {
                            if (layer === layerName) {
                                layerType = key;
                            }
                        });
                    });
                    return layerType;
                };
                const selectCategoryType = (layerName) => {
                    const categoryTypes = {
                        analytical: ['Development Potential', 'Inappropriate Zoning', 'Landmark Rate', 'Landmarks At Risk', 'Proposed Landmarks', 'Proposed Zoning Changes'],
                        informational: ['Existing Landmarks', 'Land Use', 'Zoning', 'Plurality Group\'s Percent of Population', 'NYC Community Board Districts', 'Subway Lines', 'Existing Historic Districts', 'Proposed Historic Districts']
                    };
                    let categoryType;
                    Object.keys(categoryTypes).forEach((key, index) => {
                        categoryTypes[key].map((layer, index) => {
                            if (layer === layerName) {
                                categoryType = key;
                            }
                        });
                    });
                    return categoryType;
                };

                Object.keys(obj).forEach((key, index) => {
                    cdb.createLayer(map, obj[key], {
                            legends: true
                        })
                        .addTo(map)
                        .done((layer) => {
                            let len = layer.getSubLayerCount(),
                                firstSublayer = layer.getSubLayer(0),
                                layerSublayers = firstSublayer._parent.layers;

                            for (var i = 0; i < len; i++) {
                                layer.getSubLayer(i).hide();
                                let sublayer = layer.getSubLayer(i);
                                sublayers.push({
                                    sublayer: sublayer,
                                    name: layerSublayers[i].options.layer_name,
                                    id: makeSublayerNameIdFriendly(layerSublayers[i].options.layer_name),
                                    layerSource: returnLayerSource(layerSublayers[i].options.layer_name),
                                    layerType: selectLayerType(layerSublayers[i].options.layer_name),
                                    categoryType: selectCategoryType(layerSublayers[i].options.layer_name),
                                    position: i,
                                });
                            }
                            $scope.mapLayers = sublayers;
                            $scope.$apply();
                            sublayers.map((sublayer, index) => {
                                cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(sublayer.position), sublayer.layerSource, {
                                    infowindowTemplate: $('#' + sublayer.id).html(),
                                });
                            });
                        })
                        .error((err) => {
                            console.log(err);
                        });
                });

            }
            createCDBLayer(vizJSONs);
        }
        showProjectInfoModalOnPageLoad();
        initMap();
    });
