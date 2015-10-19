angular.module('ibeis.routes', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/views/pages/login.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/pages/login.html'
            })
            .state('workplace', {
                url: '/workplace',
                templateUrl: 'app/views/pages/workplace.html'
            });
    });
