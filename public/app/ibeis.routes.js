angular.module('ibeis.routes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        //doesn't work, supposed to redirect any unknown url
        $urlRouterProvider.otherwise("/state1");
        //works
        $stateProvider
            .state('index', {
                url: '',
                views: {
                	'sidebar': { templateUrl: 'app/views/sidebars/sidebar.collections.html' },
                	'main': { templateUrl: 'app/views/main/main.default.html' }
                },
                ncyBreadcrumb: {
                    label: 'All Workplaces'
                }
            });


    });
