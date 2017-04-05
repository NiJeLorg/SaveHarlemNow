angular.module('shnApp')
    .factory('mapLayersData', [function() {

        return {
            choroplethMapLayer: [{
                    displayValue: 'Development Potential',
                    modelValue: 'developmentPotential',
                    layerSource: ['built_far_over_max_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'address', 'bbl'],
                },
                { displayValue: 'Land Use', modelValue: 'landUse', layerSource: ['landuse', 'address', 'bbl'] },
                { displayValue: 'Zoning', modelValue: 'zoning', layerSource: ['zonedist1', 'address', 'bbl'] },
                { displayValue: 'Plurality Group\'s Percent of Population', modelValue: 'pluralityGroupsPercentOfPopulation', layerSource: [] },
                { displayValue: 'Landmark Rate', modelValue: 'landmarkRate', layerSource: [] },
                { displayValue: 'Inappropriate Zoning', modelValue: 'inappropriateZoning', layerSource: ['built_far_over_max_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'address', 'bbl'] },
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
    }]);
