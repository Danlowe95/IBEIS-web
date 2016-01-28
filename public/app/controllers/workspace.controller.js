angular.module('workspace-app', ['ngFlowGrid'])
    .controller('workspace-controller', ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', 'fgDelegate', function($scope, $mdSidenav, $mdToast, $mdDialog, fgDelegate) {
        //fgdelegate is used for ngFlowGrid

        /* PHOTOSWIPE VARIABLES */
        $scope.test_data = [{"submitterProject":"Faxafloi Bay Whale Distribution and Behavior","patterningCode":"3","numSpotsRight":52,
"spotImageFileName":"extract0a496f37-de71-4f01-94a8-188f3569b3b5.jpg","submitterAddress":"","photographerPhone":"",
"catalogNumber":"0a496f37-de71-4f01-94a8-188f3569b3b5","recordedBy":"Linda Rudin","submitterOrganization":"Elding Whale Watch",
"year":2014,"specificEpithet":"novaeangliae","submitterEmail":"linda_rudin@gmx.ch","distinguishingScar":"",
"class":"org.ecocean.Encounter","submitterPhone":"","hashedSubmitterEmail":"bb170d37a5e2c961b8c665a7a29335b2",
"modified":"2016-01-09","_sanitized":true,"measurements":[],"hasImages":true,"metalTags":[],"numSpotsLeft":52,
"month":4,

"images":[
{"_sanitized":true,"thumbUrl":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e970002.jpg","dataCollectionEventID":"518aca4e48f5889a0148f5904e970002","url":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e970002.jpg"},
{"_sanitized":true,"thumbUrl":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e980003.jpg",
"dataCollectionEventID":"518aca4e48f5889a0148f5904e980003",
"url":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e980003.jpg"},
{"_sanitized":true,"thumbUrl":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e990004.jpg",
"dataCollectionEventID":"518aca4e48f5889a0148f5904e990004","url":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e990004.jpg"},
{"_sanitized":true,"thumbUrl":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e9a0005.jpg","dataCollectionEventID":"518aca4e48f5889a0148f5904e9a0005","url":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e9a0005.jpg"},
{"_sanitized":true,"thumbUrl":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e9c0006.jpg","dataCollectionEventID":"518aca4e48f5889a0148f5904e9c0006","url":"http://52.32.240.124/wildbook_data_dir/encounters/0/a/0a496f37-de71-4f01-94a8-188f3569b3b5/518aca4e48f5889a0148f5904e9c0006.jpg"}],"day":21,"okExposeViaTapirLink":false,"dwcDateAdded":"2014-10-09","hashedPhotographerEmail":"","submitterID":"LindaR","dwcImageURL":"http://flukebook.org:80/encounters/encounter.jsp?number=0a496f37-de71-4f01-94a8-188f3569b3b5","photographerEmail":"","sex":"unknown","state":"approved","dateInMilliseconds":1398038400000,"photographerName":"","rightSpotImageFileName":"extract0a496f37-de71-4f01-94a8-188f3569b3b5.jpg","photographerAddress":"","minutes":"20","individualID":"2014-04-21","releaseDateLong":1412812800000,"size_guess":"no estimate provided","livingStatus":"alive","hour":14,"genus":"Megaptera","tissueSamples":[],"occurrenceRemarks":"","guid":"Flukebook:0a496f37-de71-4f01-94a8-188f3569b3b5","dwcDateAddedLong":1412812800000,"identificationRemarks":"Unmatched first encounter"}
];

        $scope.slides = [{
            title: 'title1',
            src: 'https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg',
            w: 539,
            h: 539,
            index: 1
        }, {
            title: 'title2',
            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
            w: 507,
            h: 539,
            index: 2
        }, {
            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
            w: 808,
            h: 539,
            index: 3,
            title: 'title3',
            gps: 'n/a'
        }, {
            title: 'title4',
            src: 'https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg',
            w: 718,
            h: 539,
            index: 4,
            gps: 'n/a'
        }, {
            title: 'title1',
            src: 'https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg',
            w: 539,
            h: 539,
            index: 1
        }, {
            title: 'title2',
            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
            w: 507,
            h: 539,
            index: 2
        }, {
            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
            w: 808,
            h: 539,
            index: 3,
            title: 'title3',
            gps: 'n/a'
        }, {
            title: 'title4',
            src: 'https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg',
            w: 718,
            h: 539,
            index: 4,
            gps: 'n/a'
        }, {
            title: 'title1',
            src: 'https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg',
            w: 539,
            h: 539,
            index: 1
        }, {
            title: 'title2',
            src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
            w: 507,
            h: 539,
            index: 2
        }, {
            src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
            w: 808,
            h: 539,
            index: 3,
            title: 'title3',
            gps: 'n/a'
        }, {
            title: 'title4',
            src: 'https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg',
            w: 718,
            h: 539,
            index: 4,
            gps: 'n/a'
        }, {
            title: 'title5',
            src: 'https://farm6.staticflickr.com/5023/5578283926_822e5e5791_b.jpg',
            w: 718,
            h: 539,
            index: 5,
            gps: 'n/a'
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
        $scope.updateGrid = function() {
            var homePageGrid = fgDelegate.getFlow('homePageGrid');

            homePageGrid.minItemWidth += 20;
            homePageGrid.refill(true);
        }


        //Attempting to use for indexing when focusing an image (image_info_Sidenav)
        $scope.image_index = -1

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
        $scope.image_index = -1;
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.toggleImageSidenav = function(index) {
            $scope.image_index = index;
            $mdSidenav('image').toggle();

        }

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

        /* SIDENAVS */
        $scope.close = function(id) {
            $mdSidenav(id).close();
            //sets image-focus to null.  If multiple sidenavs are toggled this could cause an issue (maybe).
            $scope.image_index = -1;
        };

        /* UPLOAD DIALOG */
        $scope.showUploadDialog = function(ev) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                templateUrl: 'app/views/includes/workspace/upload.dialog.html',
                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                }
            });
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
