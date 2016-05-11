angular.module('ibeis.routes', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/views/pages/login.html'
            })
            .when('/workspace', {
                templateUrl: 'app/views/pages/workspace.html',
                controller: 'workspace-controller',
                controllerAs: 'wsCtrl'
            })
            .otherwise({
                redirectTo: '/login'
            });
    });
