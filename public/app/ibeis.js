angular.module('ibeis', [
        // routes
        'ibeis.routes',
        // controllers
        'workspace-app',
        // imports
        'ngMaterial', // angular material
        // 'ngMessages', //angular messages - used with cards?
        'ngFlowGrid',
        'smart-table',
        'yaru22.md', // markdown display (for help maybe)
        'ncy-angular-breadcrumb', // breadcrumbs made easy
        'uiGmapgoogle-maps', // angular google maps
        'ngPhotoswipe' // photoswipe
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
