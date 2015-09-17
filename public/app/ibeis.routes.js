angular.module('ibeis.routes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('index', {
                url: '',
                views: {
                	"sidebar": { templateUrl: "app/views/sidebars/sidebar.collections.html" },
                	"main": { templateUrl: "app/views/main/main.default.html" }
                }
            });

    });
