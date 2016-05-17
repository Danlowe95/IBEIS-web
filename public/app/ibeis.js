angular.module('ibeis', [
        // routes
        'ibeis.routes',
        // controllers
        'workspace',
        // services
        'upload.service',
        // imports
        'ngMaterial', // angular material
        'smart-table',
        'uiGmapgoogle-maps', // angular google maps
        'ngPhotoswipe', // photoswipe
        'ui-leaflet',
    ])
    // setup theme
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            // Available palettes: red, pink, purple, deep-purple,
            //   indigo, blue, light-blue, cyan, teal, green, light-green,
            //   lime, yellow, amber, orange, deep-orange, brown, grey,
            //   blue-grey
            .primaryPalette('green')
            .accentPalette('blue');
    });
