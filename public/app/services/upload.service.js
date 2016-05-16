angular.module('upload.service', [])
    .factory('Upload', [function() {
        var factory = {};

        // AWS Uploader Config
        AWS.config.update({
            accessKeyId: 'AKIAJFVBLOTSKZ5554EA',
            secretAccessKey: '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'
        });
        AWS.config.region = 'us-west-2';
        var s3Uploader = new AWS.S3({
            params: {
                Bucket: 'flukebook-dev-upload-tmp'
            }
        });

        // upload
        var types = ["s3", "local"];
        factory.upload = function(images, type, progressCallback) {
            // retrieve a mediaAssetSetId
            var mediaAssetSetId = requestMediaAssetSet();
            var typeIndex = _.indexOf(types, type);
            switch (typeIndex) {
                case 0:
                    // s3
                    return s3Upload(mediaAssetSetId, images, progressCallback);
                case 1:
                    // local
                    return directUpload(mediaAssetSetId, images, progressCallback);
                default:
                    // doesn't exist
                    // TODO: design failure return
                    return null;
            }
        };

        // upload to s3
        var s3Upload = function(mediaAssetSetId, images, progressCallback) {
            console.log("DOING S3 UPLOAD");
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
                        // TODO: on completion
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
                    }
                });
            };
        };

        // upload to local server
        var localUpload = function(mediaAssetSetId, images, progressCallback) {
            console.log("DOING LOCAL UPLOAD");
        };

        // request mediaAssetSet
        var requestMediaAssetSet = function() {
            // TODO: check for errors?
            $http.get('http://springbreak.wildbook.org/MediaAssetCreate?requestMediaAssetSet')
                .success(function(data) {
                    return data.mediaAssetSetId;
                });
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

            $http.post('http://springbreak.wildbook.org/MediaAssetCreate', mediaAsset);
        };

    }]);
