var workspace = angular.module('workspace', [])
    .controller('workspace-controller', ['$scope', '$rootScope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$http', '$sce', function($scope, $rootScope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $http, $sce) {


        $scope.$on('uploadComplete', function(event, data) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to see your uploaded images?')
                .textContent('Here is the media asset set id: ' + data.id)
                .ok('Yes')
                .cancel("No");
            $mdDialog.show(confirm).then(function() {
                var query = {
                    class: 'org.ecocean.media.MediaAssetSet',
                    query: JSON.stringify(data)
                };
                $scope.queryWorkspace(query);
                $scope.mode = 'workspace';
            }, function() {
                $scope.mode = 'workspace';
                console.log("said no to changing!");
            });
        });
        
        $scope.last_jobid = "jobid-0000";
        $scope.filtering_tests = null;
        $http.get('assets/json/fakeClassDefinitions.json').success(function(data) {
            $scope.filtering_tests = data;
        });
        // Start of real querying
        $scope.queryWorkspace = function(params) {
            $.ajax({
                type: "POST",
                url: 'http://springbreak.wildbook.org/TranslateQuery',
                data: params,
                dataType: "json"
            }).then(function(data) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.$apply(function() {
                    console.log(data);
                    $scope.currentSlides = data.assets;
                    console.log($scope.currentSlides);
                });
            });
        }

        var testQuery = {
            class: 'org.ecocean.media.MediaAsset',
            range: 10
        };
        $scope.queryWorkspace(testQuery);

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

        //default
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

        $scope.secondaryTestImages = [{ title: 'Smiley', src: 'http://i.imgur.com/J5YLlJv.png', index: 0 }];
        $scope.secondaryTestAnnotations = [{ title: 'Smiley', src: 'http://i.imgur.com/J5YLlJv.png', index: 0 }];

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
        $scope.image_index = -1;

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        $scope.toggleImageSidenav = function(index) {
            $scope.image_index = index;
            $mdSidenav('image').toggle();
        };

        //Map
        $scope.currentMarker = null;
        $scope.clickMarker = function(id) {
            console.log("marker clicked");
            $scope.currentMarker = id;
            $scope.toggleSidenav('marker');
        };
        /* SIDENAVS */
        $scope.close = function(id) {
            $mdSidenav(id).close();
            //sets image-focus to null.  If multiple sidenavs are toggled this could cause an issue (maybe).
            $scope.image_index = -1;
        };

        $scope.workspace = 'Primary';
        $scope.workspaces = ['Primary', 'Secondary'];
        $scope.setWorkspace = function(w) {
            $scope.workspace = w;
            //query new workspace to get data
        };

        /* TYPE MENU */
        $scope.types = ['images', 'annotations', 'animals'];
        $scope.type = $scope.types[0];

        $scope.setType = function(t) {
            if ($scope.type != t) {
                $scope.type = t;
            }
        };

        /* FILTERING */
        $scope.filterData = {};
        $scope.submitFilters = function() {
            var params = JSON.stringify($scope.filterData);
            console.log(params);
            $scope.queryWorkspace(params);
            $scope.close('filter');

        };


        $scope.convertDateTime = function(dateTime) {
            try {
                return new Date(dateTime).toISOString().substring(0, 10);
            } catch (e) {
                return "No Date Provided";
            }

        };

        $scope.startDetection = function(ev) {
            //create javascript for loop to get all ids, send all ids to 
            image_ids = [];
            var i;
            for (i = 0; i < $scope.currentSlides.length; i++) {
                image_ids.push($scope.currentSlides[i].id);
            }
            var detect_data = "{detect: [" + image_ids + "]}";
            console.log(detect_data);
            $.ajax({
                type: "POST",
                url: 'http://springbreak.wildbook.org/ia',
                data: detect_data,
                dataType: "json",
                contentType: 'application/javascript'
            }).then(function(data) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.$apply(function() {
                    $scope.last_jobid = data.sendDetect.response;
                    // $scope.ia_url = "http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid + "&index=4";
                    console.log("New jobID " + data.sendDetect.response);

                    $scope.showDetectionReview(ev);
                });
            }).fail(function(data) {

                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent('No Response from IA server.')
                    .ariaLabel('IA Error')
                    .ok('OK')
                    .targetEvent(ev)
                );
            });


        };
        $scope.showImageInfo = function(ev, index) {
            $scope.image_index = index;
            $mdDialog.show({
                    controller: ImageDialogController,
                    templateUrl: 'app/views/includes/workspace/image.info.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    locals: { image_index: $scope.image_index, currentSlides: $scope.currentSlides }

                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.showDetectionReview = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                templateUrl: 'app/views/includes/workspace/detection.review.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true

            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        $scope.detectDialogCancel = function() {
            $mdDialog.cancel();
        };
        //unused?
        $scope.detectDialogHide = function() {
            $mdDialog.hide();
        };

        $scope.loadHTML = function() {
            console.log("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid);
            $("#ibeis-process").load("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid + "&index=4");

        };

        function ImageDialogController($scope, $mdDialog, image_index, currentSlides) {
            $scope.image_index = image_index;
            $scope.currentSlides = currentSlides;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }


        /* SIDENAVS */
        //This should be changed to be more specific to sidenavs
        $scope.close = function(id) {
            $mdSidenav(id).close();
            //sets image-focus to null.  If multiple sidenavs are toggled this could cause an issue (maybe).
            $scope.image_index = -1;
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


        $scope.confirmDialog = function(string) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Cancelled')
                .textContent(string)
                .ariaLabel('Alert')
                .ok('OK')
            );
        }


        /* VIEW MENU */
        $scope.views = ['thumbnails', 'table', 'map'];
        $scope.view = $scope.views[0];
        $scope.setView = function(v) {
            $scope.view = v;
        };

        // $scope.modes = ['workspace', 'upload'];
        $scope.mode = 'workspace';
        $scope.setMode = function(m) {
            $scope.mode = m;
            console.log($scope.mode);
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
        };
    }]);
