angular.module('wildbook.service', [])
    .factory('Wildbook', ['$http', function($http) {
        var factory = {};

        // UPLOADING TO S3 AND THROUGH FLOW
        // ==================================
        factory.types = ["s3", "local"];
        factory.upload = function(images, type, progressCallback, completionCallback) {
            console.log("UPLOADING");
            // retrieve a mediaAssetSetId
            switch (_.indexOf(factory.types, type)) {
                case 0:
                    // s3
                    s3Upload(images, progressCallback, completionCallback);
                    break;
                case 1:
                    // local
                    flowUpload(images, progressCallback, completionCallback);
                    break;
                default:
                    // doesn't exist
                    // TODO: design failure return
                    return null;
            }
        };

        // upload to s3
        var s3Upload = function(images, progressCallback, completionCallback) {
            // AWS Uploader Config
            AWS.config.update({
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            });
            AWS.config.region = 'us-west-2';
            console.log("DOING S3 UPLOAD");
            var s3Uploader = new AWS.S3({
                params: {
                    Bucket: 'flukebook-dev-upload-tmp'
                }
            });
            var count = 0;
            var uploads = [];
            var prepend = (new Date()).getTime();
            for (i in images) {
                var key = prepend + '/' + images[i].name;
                var params = {
                    Key: key,
                    ContentType: images[i].type,
                    Body: images[i]
                };

                // start an upload for each of the images
                s3Uploader.upload(params, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(data);
                        var uploadData = {
                            bucket: data.Bucket,
                            key: data.key
                        };
                        uploads.push(uploadData);
                        count = count + 1;
                        completionCallback(uploads);
                    }
                }).on('httpUploadProgress', function(data) {
                    var progress = Math.round(data.loaded / data.total * 100);
                    var index = -1;
                    // find the image index, and return that
                    for (var j = 0; j < images.length; j++) {
                        var testKey = prepend + '/' + images[j].name;
                        if (data.key === testKey) {
                            index = j;
                            break;
                        }
                    }
                    if (index >= 0) {
                        progressCallback(index, progress);
                    } else {
                        // TODO: not found error handle
                    }
                });
            };
        };

        // upload to local server with flow
        var flowUpload = function(images, progressCallback, completionCallback) {
            var flow = new Flow({
                target: 'http://springbreak.wildbook.org/ResumableUpload',
                forceChunkSize: true,
                maxChunkRetries: 5,
                testChunks: false
            });
            var count = 0;
            flow.on('fileProgress', function(file, chunk) {
                var progress = Math.round(file._prevUploadedSize / file.size * 100);
                var index = -1;
                var fileKey = file.name;
                for (var i = 0; i < images.length; i++) {
                    var testKey = images[i].name;
                    if (testKey === fileKey) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0) {
                    console.log(index + " : " + progress);
                    progressCallback(index, progress);
                } else {
                    // TODO: not found error handle
                }
            });
            flow.on('fileSuccess', function(file, message, chunk) {
                console.log(file);
                var name = file.name;

                // TODO
            });
            flow.on('fileError', function(file, message, chunk) {
                // TODO: handle error
            });
            flow.on('complete', function() {
                // TODO: if media assets created automatically, use this for completion
                //  otherwise, use fileSuccess and count
                console.log("All flow uploads completed");
            });

            // add files to flow and upload
            for (i in images) {
                flow.addFile(images[i]);
            };
            console.log(flow.files);
            flow.upload();
        };

        // MEDIA assets
        // ==============

        // request mediaAssetSet
        var requestMediaAssetSet = function() {
            // TODO: check for errors?
            return $http.get('http://springbreak.wildbook.org/MediaAssetCreate?requestMediaAssetSet');
        };

        // create MediaAsset for flow upload
        // var mediaAsset = {
        //     MediaAssetCreate: [{
        //         setId: mediaAssetSetId,
        //         assets: [{
        //             filename: fileName
        //         }]
        //     }]
        // };

        factory.findMediaAssetSetIdFromUploadSet = function(setName) {
            var params = {
                method: "GET",
                url: 'http://springbreak.wildbook.org/WorkspaceServer',
                params: {
                    id: setName
                }
            };
            return $http(params);
        };

        factory.addAssetsToMediaAssetSet = function(assets, setId) {
            var mediaAssets = {
                MediaAssetCreate: [{
                    setId: setId,
                    assets: assets
                }]
            };
            return $http.post('http://springbreak.wildbook.org/MediaAssetCreate', mediaAssets);
        };

        // WORKSPACES
        // ============
        factory.retrieveWorkspaces = function(isImageSet) {
            return $.ajax({
                type: "GET",
                url: 'http://springbreak.wildbook.org/WorkspacesForUser',
                params: {
                    isImageSet: isImageSet
                }
            });
        };



        return factory;

    }]);
