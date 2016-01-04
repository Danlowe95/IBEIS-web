angular.module('workspace.controller', [])
    .controller('workspace-controller', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', function($scope, $mdSidenav, $mdToast, $mdDialog) {
        /* PHOTOSWIPE VARIABLES */

        $scope.slides = [{
            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
            w: 964,
            h: 1024
        }, {
            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
            w: 1024,
            h: 683
        }];

        // define options (if needed)
        $scope.opts = {
            // history & focus options are disabled on CodePen
            history: false,
            focus: false,

            showAnimationDuration: 0,
            hideAnimationDuration: 0

        };

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8,
            options: {
                disableDefaultUI: true,
                draggable: true,
                minZoom: 4,
                zoomControl: true
            }
        };

        $scope.currentMarker = null;
        $scope.clickMarker = function(id) {
            console.log("marker clicked");
            $scope.currentMarker = id;
            $scope.toggleSidenav('marker');
        };

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

        /* SIDENAMVS */
        $scope.close = function(id) {
            $mdSidenav(id).close();
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

        /* VIEW MENU */
        $scope.views = ['thumbnails', 'table', 'map'];
        $scope.view = 'thumbnails';
        $scope.setView = function(v) {
            $scope.view = v;
            $(window).trigger('resize');
        };

        $scope.toggleLogo = function() {
            var logo = $('#logo');
            if (logo.css('display') === 'none') {
                logo.show();
            } else {
                logo.hide();
            }
        };

        $scope.logoVisible = function() {
            var logo = $('#logo');
            if (logo.css('display') === 'none') {
                return false;
            } else {
                return true;
            }
        }
    }]);
