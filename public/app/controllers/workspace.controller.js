var workspace = angular.module('workspace', [])
    .controller('workspace-controller', [
        '$rootScope', '$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$http', '$sce', 'reader-factory',
        function($rootScope, $scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $http, $sce, readerFactory) {


            $scope.uploadComplete = function(data) {
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
                    $scope.showUpload();
                    console.log("said no to changing!");

                });
            };
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
                    })
                })
            };

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


            //TODO comment what this does
            function sanitizePosition() {
                var current = $scope.toastPosition;
                if (current.bottom && last.top) current.top = false;
                if (current.top && last.bottom) current.bottom = false;
                if (current.right && last.left) current.left = false;
                if (current.left && last.right) current.right = false;
                last = angular.extend({}, current);
            };

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

            $scope.image_index = -1;

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            $scope.toggleImageSidenav = function(index) {
                $scope.image_index = index;
                $mdSidenav('image').toggle();
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
            //used to catch all form data for filtering and send in for query
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
                    })
                })
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
            };


            /* SIDENAVS */
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
                    .clickOutsideToClose(true)
                    .title('Cancelled')
                    .textContent(string)
                    .ariaLabel('Alert')
                    .ok('OK')
                );
            }

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
                $("#ibeis-process").load("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid);

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

            /* VIEW MENU */
            $scope.views = ['thumbnails', 'table', 'map'];
            $scope.view = $scope.views[0];
            $scope.setView = function(v) {
                $scope.view = v;
            };
            $scope.logoVisible = function() {
                var logo = $('#logo');
                if (logo.css('display') === 'none') {
                    return false;
                } else {
                    return true;
                }
            };

            var uploadDialog = {
                templateUrl: 'app/views/includes/workspace/upload.dialog.html',
                clickOutsideToClose: true,
                fullscreen: true,
                preserveScope: true,
                scope: $scope
            };

            $scope.showUpload = function(ev) {
                $mdDialog.show(uploadDialog);
            };

            $scope.test = function() {
                console.log("TESTING HEHE");
            };


            // stages:
            //  - 0 = select
            //  - 1 = upload
            //  - 2 = occurence
            //  - 3 = complete
            $scope.stage = 0;

            $scope.mediaAssetSetId = null;

            /* An intermediate function to link an md-button to a
            hidden file input */
            $scope.proxy = function(id) {
                angular.element($('#' + id)).click();
            };

            AWS.config.update({
                accessKeyId: 'AKIAJFVBLOTSKZ5554EA',
                secretAccessKey: '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'
            });
            AWS.config.region = 'us-west-2';
            $scope.uploader = new AWS.S3({ params: { Bucket: 'flukebook-dev-upload-tmp' } });

            $scope.images = {
                selected: [],
                uploaded: []
            };
            $scope.select = function(element) {
                var justFiles = $.map(element.files, function(val, key) {
                    return val;
                }, true);

                var fileEquality = function(f1, f2) {
                    if (f1.name != f2.name) return false;
                    if (f1.size != f2.size) return false;
                    if (f1.type != f2.type) return false;
                    if (f1.lastModified != f2.lastModified) return false;
                    return true;
                }
                for (i in justFiles) {
                    var contains = false;
                    var file = justFiles[i];
                    for (i in $scope.images.selected) {
                        if (fileEquality(file, $scope.images.selected[i])) {
                            contains = true;
                            break;
                        }
                    }
                    if (!contains) {
                        var index = $scope.images.selected.push(file) - 1;
                        readerFactory.readAsDataUrl(file, $scope, index);
                    }
                }

            };

            $scope.remove = function(i) {
                $scope.images.selected.splice(i, 1);
            };

            $scope.closeUpload = function() {
                $mdDialog.cancel();
            };

            $scope.keys = [];
            $scope.upload = function() {
                var count = 0;
                $scope.stage = 1;
                $http.get('http://springbreak.wildbook.org/MediaAssetCreate?requestMediaAssetSet')
                    .success(function(data) {
                        $scope.mediaAssetSetId = data.mediaAssetSetId;
                        var images = _.clone($scope.images.selected);
                        for (i in images) {

                            // remove the preview src before uploading the file
                            delete images[i].imageSrc
                            var key = $scope.mediaAssetSetId + '/' + images[i].name;
                            $scope.keys.push(key);
                            var params = {
                                Key: key,
                                ContentType: images[i].type,
                                Body: images[i]
                            }

                            $scope.uploader.upload(params, function(err, data) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log(data);
                                    var mediaAsset = {
                                        MediaAssetCreate: [{
                                            setId: $scope.mediaAssetSetId,
                                            assets: [{ bucket: data.Bucket, key: data.Key }]
                                        }]
                                    };

                                    $http.post('http://springbreak.wildbook.org/MediaAssetCreate', mediaAsset).then(function(data) {
                                        // console.log(  data);
                                        count++;
                                        if (count === $scope.images.selected.length) {
                                            console.log("Finished uploading that batch of images to the Media Asset Set with ID=" + $scope.mediaAssetSetId);
                                            $scope.uploadComplete({ id: $scope.mediaAssetSetId });
                                            $scope.stage = 2;
                                        }
                                    });
                                }
                            }).on('httpUploadProgress', function(data) {
                                var progress = Math.round(data.loaded / data.total * 100);
                                var index = -1;
                                for (var j = 0; j < $scope.images.selected.length; j++) {
                                    var test = $scope.mediaAssetSetId + '/' + $scope.images.selected[j].name;
                                    if (data.key == test) {
                                        index = j;
                                    }
                                }
                                if (index >= 0) {
                                    $scope.images.selected[index].progress = progress;
                                }
                            });
                        }
                    });
            };


            $scope.resetUpload = function() {
                $scope.stage = 0;
                $scope.images.selected = [];
                $scope.mediaAssetSetId = null;
            };
        }
    ])
    .factory('reader-factory', ['$q', function($q) {

        var onLoad = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.reject(reader.result);
                });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };

        var readAsDataURL = function(file, scope, index) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            deferred.promise.then(function(result) {
                scope.images.selected[index].imageSrc = result;
            });
        };

        return { readAsDataUrl: readAsDataURL };

    }]);
