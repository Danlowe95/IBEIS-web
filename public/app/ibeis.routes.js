angular.module('ibeis.routes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/pages/login.html'
            })
            .state('workspace', {
                url: '/workspace',
                templateUrl: 'app/views/pages/workspace.html',
                controller: 'workspace-controller'
            });
    });
