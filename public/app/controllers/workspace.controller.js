angular.module('workspace-app', ['ngFlowGrid'])
    .controller('workspace-controller', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', 'fgDelegate', function($scope, $mdSidenav, $mdToast, $mdDialog, fgDelegate) {
        //fgdelegate is used for ngFlowGrid

        /* PHOTOSWIPE VARIABLES */
        $scope.slides = [{
            title: 'title1',
            src: 'https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg',
            w: 500,
            h: 500,
            index: 0
        }, {
            title: 'title2',
            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
            w: 500,
            h: 500,
            index: 1
        }, {
            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
            w: 500,
            h: 500,
            index: 2,
            title: 'title3'
        }, {
            title: 'title4',
            src: 'https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg',
            w: 500,
            h: 500,
            index: 3
        }, {
            title: 'title5',
            src: 'https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg',
            w: 500,
            h: 500,
            index: 4
        }];

        // define options
        $scope.opts = {
            // history & focus options are disabled on CodePen
            history: false,
            focus: false,

            showAnimationDuration: 0,
            hideAnimationDuration: 0
        };
        //ngFlowGrid Method (what does it do?)
        $scope.updateGrid = function(){
        var homePageGrid = fgDelegate.getFlow('homePageGrid');

        homePageGrid.minItemWidth += 20;
        homePageGrid.refill(true);
    }




        //Options relating to photoswipe
        $scope.startEvent = 'START_GALLERY';

        $scope.showGallery = function(i) {
            $scope.opts.index = i || $scope.opts.index;
            $scope.$broadcast($scope.startEvent);
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

        //Map
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
