angular.module('workspace.controller', [])
    .controller('workspace-controller', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', function($scope, $mdSidenav, $mdToast, $mdDialog) {
        $scope.testItems = Array.apply(null, {
            length: 100
        }).map(Number.call, Number);
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        //TODO comment what this does
        $scope.toastPosition = angular.extend({}, last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function(pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        //TODO comment what this does
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        }
        //TODO comment what this does
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

        /* UPLOAD DIALOG */
        $scope.showUploadDialog = function(ev) {
            $mdDialog.show(
                $mdDialog.alert({
                    title: 'Upload',
                    content: 'This is where the upload dialog will be.',
                    ok: 'Close'
                })
            );
        };

        /* SHARE DIALOG */
        $scope.showShareDialog = function(ev) {
            $mdDialog.show(
                $mdDialog.alert({
                    title: 'Share',
                    content: 'This is where the share dialog will be.',
                    ok: 'Close'
                })
            );
        };

        /* WORKSPACES */
        $scope.workspace = 'ws1';
        $scope.workspaces = ['ws1', 'ws2', 'ws3'];
        $scope.setWorkspace = function(w) {
            $scope.workspace = w;
        };

        /* TYPE MENU */
        $scope.types = ['images', 'annotations', 'animals'];
        $scope.type = 'images';
        $scope.setType = function(t) {
            $scope.type = t;
        };
        // WIP Type Menu
        // $scope.types = ['images', 'annotations', 'animals'];
        // $scope.types_selected = [images:true, annotations:true, animals:true];
        // $scope.changeType = function(t) {
        //     $scope.types_selected[t] = !$scope.types_selected[t];
        // };

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
