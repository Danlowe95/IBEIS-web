angular.module('workspace.controller', [])
    .controller('workspace-controller', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
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
