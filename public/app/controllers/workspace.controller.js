angular.module('workspace.controller', [])
    .controller('workspace-controller', ['$scope', '$mdSidenav', '$mdToast', function($scope, $mdSidenav, $mdToast) {
        $scope.testItems = Array.apply(null, {length: 100}).map(Number.call, Number);
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };


        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({}, last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function(pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        }
        $scope.undoFilter = function() {
            var toast = $mdToast.simple()
                .content('You undid your last filter!')
                .action('REDO')
                .highlightAction(false)
                .position($scope.getToastPosition());
            $mdToast.show(toast).then(function(response) {
                if (response == 'redo') {
                    alert('You redid the filter.');
                }
            });
        };

        /* TYPE MENU */
        $scope.types = ['images', 'annotations', 'animals'];
        $scope.type = 'images';
        $scope.setType = function(t) {
            $scope.type = t;
        };

        /* VIEW MENU */
        $scope.views = ['thumbnails', 'table', 'map'];
        $scope.view = 'thumbnails';
        $scope.setView = function(v) {
            $scope.view = v;
        };
    }])
    .controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('right').close();
        };
        $scope.save = function() {
            //save information required
            $mdSidenav('right').close();
        }
    });
