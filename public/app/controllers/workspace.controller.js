var workspace = angular.module('workspace', [])
    .controller('workspace-controller', [
        '$rootScope', '$scope', '$routeParams', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$http', '$sce', 'reader-factory',
        function($rootScope, $scope, $routeParams, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $http, $sce, readerFactory) {
            $scope.last_jobid = "jobid-0004";
            $scope.reviewOffset = 0;
            $scope.filtering_tests = null;
            $scope.workspace = "Select";
            $scope.new_name = {};
            $http.get('assets/json/fakeClassDefinitions.json').success(function(data) {
                $scope.filtering_tests = data;
            });

            $scope.queryWorkspace = function(params) {
                $scope.workspace_args = params;
                $.ajax({
                    type: "POST",
                    url: 'http://springbreak.wildbook.org/TranslateQuery',
                    data: params,
                    dataType: "json"
                }).then(function(data) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.$apply(function() {

                        $scope.currentSlides = data.assets;
                        console.log($scope.currentSlides);
                    })
                })
            };

            //query all workspaces
            $scope.queryWorkspaceList = function(){
                $.ajax({
                    type: "GET",
                    url: 'http://springbreak.wildbook.org/WorkspacesForUser'
                })
                .then(function(data) {
                    //We need to decide a proper variable for saving workspace data. do we need 1 or 2
                    $scope.$apply(function() {

                        data = data.slice(1, (data.length - 2));
                        $scope.workspaces = data.split(", ");
                        $scope.setWorkspace($scope.workspaces[0]);
                    })
                }).fail(function(data) {
                    console.log("failed workspaces get");
                });
            }
            $scope.queryWorkspaceList();

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

            /* TYPE MENU */
            $scope.types = ['images', 'annotations', 'animals'];
            $scope.type = $scope.types[0];

            $scope.setType = function(t) {
                if ($scope.type != t) {
                    $scope.type = t;
                }
            };
            /* WORKSPACES */
            $scope.setWorkspace = function(id_) {
                $.ajax({
                        type: "GET",
                        url: 'http://springbreak.wildbook.org/WorkspaceServer',
                        data: { id: id_ },
                        dataType: "json"
                    })
                    .then(function(data) {

                        $scope.$apply(function() {
                            console.log(data);
                            $scope.currentSlides = data.assets;
                            $scope.workspace = id_;
                            $scope.workspace_args = data.metadata.TranslateQueryArgs;
                            console.log($scope.workspace_args);
                        })
                    }).fail(function(data) {
                        console.log("failed workspace get");
                    });
            };

            $scope.saveWorkspace = function() {
                console.log("Name: "+$scope.new_name.form_data);
                //this has to have user input
                var params = $.param({
                    id: $scope.new_name.form_data,
                    args: JSON.stringify($scope.workspace_args)
                });
                $.ajax({
                        type: "POST",
                        url: 'http://springbreak.wildbook.org/WorkspaceServer',
                        data: params,
                        dataType: "json"
                    })
                    .then(function(data) {
                        // $scope.currentSlides = data.assets;
                        $scope.queryWorkspaceList();
                    }).fail(function(data) {
                        console.log("success or failure - needs fixing");
                        console.log(data);
                        $scope.queryWorkspaceList();
                    });
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
                }).fail(function(data) {

                    $mdDialog.show(
                        $mdDialog.alert()
                        // .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent('No Response from IA server.')
                        .ariaLabel('IA Error')
                        .ok('OK')
                        .targetEvent(ev)
                    )
                });
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
                    locals: {
                        image_index: $scope.image_index,
                        currentSlides: $scope.currentSlides
                    }

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

            $scope.submitDetectionReview = function() {
                $('#ia-detection-form').submit(function(ev) {
                    ev.preventDefault();
                    $.ajax({
                        url: $(this).attr('action'),
                        type: $(this).attr('method'),
                        dataType: 'json',
                        data: $(this).serialize()

                    }).then(function(data){
                        console.log("done");
                    }).fail(function(data){
                        console.log("error");
                    });
                    console.log("done?");
                    return false;
                });
                $('#ia-detection-form').submit();
            };

            $scope.incrementOffset = function() {
                $scope.submitDetectionReview();
                //add logic for only allowing numbers in range of images
                $scope.reviewOffset = $scope.reviewOffset + 1;
                $scope.loadHTMLwithOffset();
            };

            $scope.decrementOffset = function() {
                $scope.submitDetectionReview();
                //add logic for only allowing numbers in range of images
                $scope.reviewOffset = $scope.reviewOffset - 1;
                $scope.loadHTMLwithOffset();
            };

            $scope.endReview = function() {
                //do Submit of current review
                $scope.submitDetectionReview();
                //exit
                $scope.detectDialogCancel();
            };

            $scope.loadHTMLwithOffset = function() {
                console.log("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid + "&offset=" + $scope.reviewOffset);
                $("#ibeis-process").load("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid + "&offset=" + $scope.reviewOffset);

            };
            $scope.loadHTML = function() {
                $scope.reviewOffset = 0;
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


            $scope.test = function() {
                console.log($routeParams);
            };


            // stages:
            //  - 0 = select
            //  - 1 = upload
            //  - 2 = occurence
            //  - 3 = complete
            $scope.upload = {
                uploadType: "aws",
                dialog: {
                    templateUrl: 'app/views/includes/workspace/upload.dialog.html',
                    clickOutsideToClose: true,
                    fullscreen: true,
                    preserveScope: true,
                    scope: $scope
                },
                stage: 0,
                mediaAssetSetId: null,
                images: [],
                totalProgress: 0,
                reset: function() {
                    $scope.upload.stage = 0;
                    $scope.upload.images = [];
                    $scope.upload.mediaAssetSetId = null;
                    $scope.upload.totalProgress = 0;
                },
                select: function(element) {
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
                        for (i in $scope.upload.images) {
                            if (fileEquality(file, $scope.upload.images[i])) {
                                contains = true;
                                break;
                            }
                        }
                        if (!contains) {
                            var index = $scope.upload.images.push(file) - 1;
                            readerFactory.readAsDataUrl(file, $scope, index);
                        }
                    }
                },
                remove: function(i) {
                    $scope.upload.images.splice(i, 1);
                },
                show: function(ev) {
                    $mdDialog.show($scope.upload.dialog);
                },
                close: function() {
                    $mdDialog.cancel();
                },
                upload: function() {
                    var count = 0;
                    $scope.upload.stage = 1;
                    $http.get('http://springbreak.wildbook.org/MediaAssetCreate?requestMediaAssetSet')
                        .success(function(data) {
                            $scope.upload.mediaAssetSetId = data.mediaAssetSetId;
                            var images = _.clone($scope.upload.images);
                            for (i in images) {

                                // remove the preview src before uploading the file
                                delete images[i].imageSrc
                                var key = $scope.upload.mediaAssetSetId + '/' + images[i].name;
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
                                                setId: $scope.upload.mediaAssetSetId,
                                                assets: [{
                                                    bucket: data.Bucket,
                                                    key: data.Key
                                                }]
                                            }]
                                        };

                                        $http.post('http://springbreak.wildbook.org/MediaAssetCreate', mediaAsset).then(function(data) {
                                            // console.log(  data);
                                            count++;
                                            if (count === $scope.upload.images.length) {
                                                console.log("Finished uploading that batch of images to the Media Asset Set with ID=" + $scope.upload.mediaAssetSetId);
                                                $scope.upload.complete({
                                                    id: $scope.upload.mediaAssetSetId
                                                });
                                                $scope.upload.stage = 2;
                                            }
                                        });
                                    }
                                }).on('httpUploadProgress', function(data) {
                                    var progress = Math.round(data.loaded / data.total * 100);
                                    var index = -1;
                                    for (var j = 0; j < $scope.upload.images.length; j++) {
                                        var test = $scope.upload.mediaAssetSetId + '/' + $scope.upload.images[j].name;
                                        if (data.key == test) {
                                            index = j;
                                        }
                                    }
                                    if (index >= 0) {
                                        $scope.upload.images[index].progress = progress;
                                        $scope.upload.updateProgress();
                                    }
                                });
                            }
                        });
                },
                complete: function(data) {
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
                        $scope.upload.show();
                        console.log("said no to changing!");
                    });
                },
                updateProgress: function(data) {
                    var max = 100 * $scope.upload.images.length;
                    var sum = 0;
                    for (i in $scope.upload.images) {
                        sum = sum + $scope.upload.images[i].progress;
                    }
                    $scope.upload.totalProgress = Math.round(sum / max * 100);
                    console.log("total progress: " + $scope.upload.totalProgress);
                }
            };

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
            $scope.uploader = new AWS.S3({
                params: {
                    Bucket: 'flukebook-dev-upload-tmp'
                }
            });
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
                scope.upload.images[index].imageSrc = result;
            });
        };

        return {
            readAsDataUrl: readAsDataURL
        };

    }]);
