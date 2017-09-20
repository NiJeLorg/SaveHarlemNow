angular.module('shnApp')
    .factory('mapLayersData', [function () {

        return {
            analyticalMapLayers: [{
                    displayValue: 'Development Potential',
                    layerSource: ['address', 'available_far', 'built_far', 'residential_far', 'commercial_far', 'commercial_far', 'facility_far', 'bbl'],
                },
                {
                    displayValue: 'Inappropriate Zoning',
                    layerSource: ['address', 'available_far', 'built_far', 'residential_far', 'commercial_far', 'facility_far', 'bbl']
                },
                {
                    displayValue: 'Landmark Rate',
                    layerSource: ['number_of__landmarks', 'landmarks_per_1000_people']
                },
                {
                    displayValue: 'Landmarks At Risk',
                    layerSource: [],
                },
                {
                    displayValue: 'Proposed Landmarks',
                    layerSource: ['photo', 'landmark_name', 'address', 'description'],
                },
                {
                    displayValue: 'Proposed Zoning Changes',
                    layerSource: [],
                },
            ],
            informationalMapLayers: [{
                    displayValue: 'Existing Landmarks',
                    layerSource: ['link_to_building_image', 'landmark_name', 'landmark_preservation_number', 'designation_date', 'address', 'landmark_type', 'status', 'construction_year', 'bbl', 'link_to_pdf_document'],
                },
                {
                    displayValue: 'Land Use',
                    layerSource: ['address', 'land_use_description', 'bbl']
                },
                {
                    displayValue: 'Zoning',
                    layerSource: ['address', 'zoning_code', 'bbl']
                },
                {
                    displayValue: 'Plurality Group\'s Percent of Population',
                    layerSource: ['largest_racial_or_ethnic_group', 'percent_of_population']
                },
                {
                    displayValue: 'NYC Community Board Districts',
                    layerSource: ['borocd'],
                },
                {
                    displayValue: 'Subway Lines',
                    layerSource: [],
                },
                {
                    displayValue: 'Existing Historic Districts',
                    layerSource: ['link_to_building_image', 'name', 'landmark_preservation_number', 'designation_date', 'link_to_pdf_document'],
                },
                {
                    displayValue: 'Proposed Historic Districts',
                    layerSource: ['photo', 'historic_district_name', 'description'],
                },

            ]
        };
    }]);
