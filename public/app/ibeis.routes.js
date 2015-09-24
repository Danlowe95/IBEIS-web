angular.module('ibeis.routes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/w/all');

        $stateProvider
            .state('workplace', {
                url: '/w/:wid',
                views: {
                    'sidebar': {
                        templateUrl: 'app/views/sidebars/sidebar.collections.html'
                    },
                    'main': {
                        templateUrl: 'app/views/main/main.default.html'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Some Workplace'
                }
            }).state('workplace.collection', {
                url: '/c/:cid',
                ncyBreadcrumb: {
                    label: 'Some Collection'
                }
            });
    });
