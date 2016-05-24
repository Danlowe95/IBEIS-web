angular.module('upload.service', [])
    .factory('Upload', ['$http', function($http) {
        var factory = {};

        // upload
        factory.types = ["s3", "local"];
        factory.upload = function(images, type, progressCallback, completionCallback) {
            console.log("UPLOADING");
            // retrieve a mediaAssetSetId
            requestMediaAssetSet().success(function(data) {
                var mediaAssetSetId = data.mediaAssetSetId;
                switch (_.indexOf(factory.types, type)) {
                    case 0:
                        // s3
                        s3Upload(mediaAssetSetId, images, progressCallback, completionCallback);
                        break;
                    case 1:
                        // local
                        flowUpload(mediaAssetSetId, images, progressCallback, completionCallback);
                        break;
                    default:
                        // doesn't exist
                        // TODO: design failure return
                        return null;
                }
            });
        };

        // upload to s3
        var s3Upload = function(mediaAssetSetId, images, progressCallback, completionCallback) {
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
            for (i in images) {
                var key = mediaAssetSetId + '/' + images[i].name;
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
                        createS3MediaAsset(mediaAssetSetId, data).success(function(data) {
                            console.log(data);
                            count = count + 1;
                            if (count >= images.length) {
                                completionCallback(mediaAssetSetId);
                            }
                        });
                    }
                }).on('httpUploadProgress', function(data) {
                    var progress = Math.round(data.loaded / data.total * 100);
                    var index = -1;
                    // find the image index, and return that
                    for (var j = 0; j < images.length; j++) {
                        var testKey = mediaAssetSetId + '/' + images[j].name;
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
        var flowUpload = function(mediaAssetSetId, images, progressCallback, completionCallback) {
            var flow = new Flow({
                target: 'http://springbreak.wildbook.org/ResumableUpload',
                forceChunkSize: true,
                query: {
                    mediaAssetSetId: mediaAssetSetId
                },
                testChunks: false
            });
            // flowUploader.assignBrowse($('#' + uploadButtonID));
            flow.on('fileProgress', function(file, chunk) {
                var progress = Math.round(file._prevUploadedSize / file.size * 100);
                var index = -1;
                var fileKey = mediaAssetSetId + '/' + file.name;
                for (var i = 0; i < images.length; i++) {
                    var testKey = mediaAssetSetId + '/' + images[i].name;
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
                // TODO: create media assets for flow files
            });
            flow.on('fileError', function(file, message, chunk) {
                // TODO: handle error
            });
            flow.on('complete', function() {
                // TODO: if media assets created automatically, use this for completion
                //  otherwise, use fileSuccess and count
            });

            // add files to flow and upload
            for (i in images) {
                var image = _.clone(images[i]);
                console.log(image);
                delete image.imageSrc;
                console.log(image);
                flow.addFile(image);
            };
            flow.upload();
        };

        // request mediaAssetSet
        var requestMediaAssetSet = function() {
            // TODO: check for errors?
            return $http.get('http://springbreak.wildbook.org/MediaAssetCreate?requestMediaAssetSet');
        };

        // create MediaAsset
        var createS3MediaAsset = function(mediaAssetSetId, uploadData) {
            var mediaAsset = {
                MediaAssetCreate: [{
                    setId: mediaAssetSetId,
                    assets: [{
                        bucket: uploadData.Bucket,
                        key: uploadData.key
                    }]
                }]
            };

            return $http.post('http://springbreak.wildbook.org/MediaAssetCreate', mediaAsset);
        };

        return factory;

    }]);
