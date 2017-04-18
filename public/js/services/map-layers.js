angular.module('shnApp')
    .factory('mapLayersData', [function() {

        return {
            choroplethMapLayer: [{
                    displayValue: 'Development Potential',
                    modelValue: 'developmentPotential',
                    layerSource: ['address', 'available_far', 'built_far', 'residential_far', 'commercial_far', 'commercial_far', 'facility_far', 'bbl'],
                },
                { displayValue: 'Land Use', modelValue: 'landUse', layerSource: ['address', 'land_use_description', 'bbl'] },
                { displayValue: 'Zoning', modelValue: 'zoning', layerSource: ['address', 'zoning_code', 'bbl'] },
                { displayValue: 'Plurality Group\'s Percent of Population', modelValue: 'pluralityGroupsPercentOfPopulation', layerSource: ['largest_racial_or_ethnic_group', 'percent_of_population'] },
                { displayValue: 'Landmark Rate', modelValue: 'landmarkRate', layerSource: ['number_of__landmarks', 'landmarks_per_1000_people'] },
                { displayValue: 'Inappropriate Zoning', modelValue: 'inappropriateZoning', layerSource: ['address', 'available_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'bbl'] },
            ],
            pointLinePolygonalMapLayer: [
                { displayValue: 'Existing Landmarks', modelValue: 'existingLandmarks', layerSource: ['link_to_building_image', 'landmark_name', 'landmark_preservation_number', 'designation_date', 'address', 'landmark_type', 'status', 'construction_year', 'bbl', 'link_to_pdf_document'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Landmarks', modelValue: 'proposedLandmarks', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Landmarks At Risk', modelValue: 'landmarksAtRisk', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Existing Historic Districts', modelValue: 'existingHistoricDistricts', layerSource: ['link_to_building_image','name', 'landmark_preservation_number', 'designation_date', 'link_to_pdf_document'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Historic Districts', modelValue: 'proposedHistoricDistricts', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'Proposed Zoning Changes', modelValue: 'proposedZoningChange', layerSource: [], layerType: 'pointLinePolygonal' },
                { displayValue: 'NYC Community Board Districts', modelValue: 'nycCommunityDistricts', layerSource: ['borocd'], layerType: 'pointLinePolygonal' },
                { displayValue: 'Subway Lines', modelValue: 'subwayLines', layerSource: [], layerType: 'pointLinePolygonal' }
            ]
        };
    }]);
