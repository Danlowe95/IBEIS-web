var workspace = angular.module('workspace', [])
    .controller('workspace-controller', [
        '$rootScope', '$scope', '$routeParams', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$http', '$sce', 'reader-factory', 'Upload',
        function($rootScope, $scope, $routeParams, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $http, $sce, readerFactory, Upload) {

            //DECLARE VARIABLES
            $scope.last_jobid = "jobid-0004";
            $scope.reviewOffset = 0;
            $scope.workspace = "Select";
            $scope.new_name = {};
            $scope.reviewData = {};

            //Might be outdated, used sometimes to query with specific parameters
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

            //query all workspaces to populate workspace dropdown
            $scope.queryWorkspaceList = function() {
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

            //map variable
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


            //don't know, unused
            function sanitizePosition() {
                var current = $scope.toastPosition;
                if (current.bottom && last.top) current.top = false;
                if (current.top && last.bottom) current.bottom = false;
                if (current.right && last.left) current.left = false;
                if (current.left && last.right) current.right = false;
                last = angular.extend({}, current);
            };

            //used for index in workspace
            $scope.image_index = -1;

            //used for filtering/other sidenavs
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


            /* SIDENAVS */
            $scope.close = function(id) {
                $mdSidenav(id).close();
                //sets image-focus to null.  If multiple sidenavs are toggled this could cause an issue (maybe).
                $scope.image_index = -1;
            };

            /* TYPE MENU */
            //Used for top-right selector to change the data between the below 3 items
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
                        data: {
                            id: id_
                        },
                        dataType: "json"
                    })
                    .then(function(data) {

                        $scope.$apply(function() {
                            console.log(data);
                            $scope.currentSlides = data.assets;
                            $scope.workspace = id_;
                            $scope.workspace_args = data.metadata.TranslateQueryArgs;
                        })
                    }).fail(function(data) {
                        console.log("failed workspace get");
                    });
            };

            //used when save button is pressed
            $scope.saveWorkspace = function() {
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
            $scope.deleteWorkspace = function() {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete this workspace?')
                    .textContent('This will delete the current filtering parameters.  All of your images will remain in the database.')
                    .ok('Yes')
                    .cancel("No");
                $mdDialog.show(confirm).then(function() {
                    $.ajax({
                            type: "POST",
                            url: 'http://springbreak.wildbook.org/WorkspaceDelete',
                            data: {
                                id: $scope.workspace
                            },
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
                }, function() {
                    console.log("said no to changing!");
                });

            };
            /* FILTERING */
            //used to catch all form data for filtering and send in for query
            $scope.filter = {
                filtering_tests: null,
                filterData: {},
                submitFilters: function() {
                    var params = JSON.stringify($scope.filter.filterData);
                    $scope.queryWorkspace(params);
                    $scope.close('filter');

                },

                undoFilter: function() {
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
                }

            };
            //fake filtering data
            $http.get('assets/json/fakeClassDefinitions.json').success(function(data) {
                $scope.filter.filtering_tests = data;
            });
            //used in table view
            $scope.convertDateTime = function(dateTime) {
                try {
                    return new Date(dateTime).toISOString().substring(0, 10);
                } catch (e) {
                    return "No Date Provided";
                }
            };

            //object where all identification methods are stored
            $scope.identification = {
                startIdentification: function(ev) {

                },
                showIdentificationReview: function(ev) {
                    // $scope.startCheckDetection();
                    $mdDialog.show({
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: 'app/views/includes/workspace/identification.review.html',
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true

                    });
                },
                submitIdentificationReview: function() {
                    $('#ia-identification-form').submit(function(ev) {
                        ev.preventDefault();
                        $.ajax({
                            url: $(this).attr('action'),
                            type: $(this).attr('method'),
                            dataType: 'json',
                            data: $(this).serialize()

                        }).then(function(data) {
                            console.log("done");
                        }).fail(function(data) {
                            console.log("error");
                        });
                        return false;
                    });
                    $('#ia-detection-form').submit();
                },
                loadIdentificationHTML: function() {
                    $scope.reviewOffset = 0;
                    console.log("http://springbreak.wildbook.org/ia?getIdentificationReviewHtml=" + $scope.last_jobid);
                    $("#ibeis-process").load("http://springbreak.wildbook.org/ia?getIdentificationReviewHtml=" + $scope.last_jobid);
                },

            };

            //object where all detection functions are stored
            $scope.detection = {
                startDetection: function(ev) {
                    //get all image id's in the workspace
                    image_ids = [];
                    var i;
                    for (i = 0; i < $scope.currentSlides.length; i++) {
                        image_ids.push($scope.currentSlides[i].id);
                    }
                    //put into data object to send
                    var detect_data = "{detect: [" + image_ids + "]}";
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
                            //detection has started.  Save the job id, then launch review
                            $scope.last_jobid = data.sendDetect.response;
                            console.log("New jobID " + data.sendDetect.response);

                            $scope.detection.showDetectionReview(ev);
                        })
                    }).fail(function(data) {

                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error')
                            .textContent('No Response from IA server.')
                            .ariaLabel('IA Error')
                            .ok('OK')
                            .targetEvent(ev)
                        )
                    });
                },
                //used to query for results every 3 seconds until it gets a response
                startCheckDetection: function() {
                    $scope.reviewData.reviewReady = false;
                    $scope.detection.detectionChecker = setInterval($scope.detection.checkLoadedDetection, 3000);
                },
                //check function every x seconds
                checkLoadedDetection: function() {
                    $scope.detection.loadDetectionHTML();
                    var myElem = document.getElementById('ia-detection-form');
                    if (myElem != null) {
                        clearInterval($scope.detection.detectionChecker);
                        $scope.reviewData.reviewReady = true;

                    }
                },
                //creates a dialog
                showDetectionReview: function(ev) {
                    $scope.detection.startCheckDetection();
                    $mdDialog.show({
                        scope: $scope,
                        preserveScope: true,
                        templateUrl: 'app/views/includes/workspace/detection.review.html',
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: true

                    });
                },

                detectDialogCancel: function() {
                    $mdDialog.cancel();
                },
                //unused?
                detectDialogHide: function() {
                    $mdDialog.hide();
                },
                //on button click prev/next/saveandexit
                submitDetectionReview: function() {
                    $('#ia-detection-form').submit(function(ev) {
                        ev.preventDefault();
                        $.ajax({
                            url: $(this).attr('action'),
                            type: $(this).attr('method'),
                            dataType: 'json',
                            data: $(this).serialize()

                        }).then(function(data) {
                            console.log("done");
                        }).fail(function(data) {
                            console.log("error");
                        });
                        return false;
                    });
                    $('#ia-detection-form').submit();
                },
                //temp function
                incrementOffset: function() {
                    $scope.detection.submitDetectionReview();
                    //add logic for only allowing numbers in range of images
                    $scope.reviewOffset = $scope.reviewOffset + 1;
                    $scope.detection.loadDetectionHTMLwithOffset();
                },
                //temp function
                decrementOffset: function() {
                    $scope.detection.submitDetectionReview();
                    //add logic for only allowing numbers in range of images
                    $scope.reviewOffset = $scope.reviewOffset - 1;
                    $scope.detection.loadDetectionHTMLwithOffset();
                },
                //temp function
                endReview: function() {
                    //do Submit of current review
                    $scope.detection.submitDetectionReview();
                    //exit
                    $scope.detection.detectDialogCancel();
                },
                //temp function
                loadDetectionHTMLwithOffset: function() {
                    console.log("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid + "&offset=" + $scope.reviewOffset);
                    $("#ibeis-process").load("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid + "&offset=" + $scope.reviewOffset);

                },
                //queries for the actual detection html and sets it in the page
                loadDetectionHTML: function() {
                    $scope.reviewOffset = 0;
                    console.log("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid);
                    $("#ibeis-process").load("http://springbreak.wildbook.org/ia?getDetectReviewHtml=" + $scope.last_jobid);
                }


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

            /* IMAGE INFO DIALOG */
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
            //launched on image click, uses the above controller
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



            //everything below is upload

            // stages:
            //  - 0 = select
            //  - 1 = upload
            //  - 2 = occurence
            //  - 3 = complete
            $scope.upload = {
                types: Upload.types,
                type: "s3",
                updateType: function() {
                    var t = $routeParams.upload;
                    if (t && _.indexOf($scope.upload.types, t) !== -1) {
                        $scope.upload.type = t;
                    }
                    console.log($scope.upload.type);
                },
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
                    $scope.upload.totalProgress = 0;
                },
                select: function(element) {
                    var justFiles = $.map(element.files, function(val, key) {
                        return val;
                    }, true);

                    console.log(justFiles);

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
                progressCallback: function(index, progress) {
                    $scope.upload.images[index].progress = progress;
                    $scope.upload.updateProgress();
                },
                completionCallback: function(mediaAssetSetId) {
                    $scope.setWorkspace($scope.workspace);
                    $scope.upload.stage = 2;

                    $scope.upload.mediaAssetSetId = mediaAssetSetId;

                    $mdDialog.show($scope.upload.completionDialog.dialog);
                },
                completionDialog: {
                    dialog: {
                        templateUrl: 'app/views/includes/workspace/completed_upload.dialog.html',
                        clickOutsideToClose: false,
                        preserveScope: true,
                        scope: $scope
                    },
                    workspace_name: "",
                    completeUpload: function(mediaAssetSetId) {
                        console.log("COMPLETING UPLOAD: creating a workspace");
                        var query = {
                            class: 'org.ecocean.media.MediaAssetSet',
                            query: JSON.stringify({
                                id: $scope.upload.mediaAssetSetId
                            })
                        };
                        var params = $.param({
                            id: $scope.upload.completionDialog.workspace_name,
                            args: JSON.stringify(query)
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
                        $mdDialog.hide($scope.upload.completionDialog.dialog);
                        $scope.upload.completionDialog.reset();
                    },
                    generateName: function() {
                        console.log("GENERATING NAME");
                        var date = new Date();
                        var dateString = date.toDateString();
                        var timeString = date.toTimeString();
                        var generated = dateString + " " + timeString;
                        $scope.upload.completionDialog.workspace_name = generated;
                    },
                    reset: function() {
                        $scope.upload.completionDialog.workspace_name = "";
                    }
                },
                upload: function() {
                    $scope.upload.stage = 1;
                    Upload.upload($scope.upload.images, $scope.upload.type, $scope.upload.progressCallback, $scope.upload.completionCallback);
                },
                updateProgress: function() {
                    var max = 100 * $scope.upload.images.length;
                    var sum = 0;
                    for (i in $scope.upload.images) {
                        sum = sum + $scope.upload.images[i].progress;
                    }
                    $scope.upload.totalProgress = Math.round(sum / max * 100);
                }
            };

            /* An intermediate function to link an md-button to a
            hidden file input */
            $scope.proxy = function(id) {
                angular.element($('#' + id)).click();
            };

            $scope.upload.updateType();
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

    }]);;
