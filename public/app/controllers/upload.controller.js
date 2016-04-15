var upload = angular.module('upload', [])
  .controller('upload-controller', [
    '$rootScope',
    '$scope',
    '$http',
    'reader-factory',
    function($rootScope, $scope, $http, readerFactory) {

      // stages:
      //  - 0 = select
      //  - 1 = upload
      //  - 2 = occurence
      //  - 3 = complete
      $rootScope.stage = 0;

      $rootScope.mediaAssetSetId = null;

      /* An intermediate function to link an md-button to a
      hidden file input */
      $rootScope.proxy = function(id) {
        angular.element($('#' + id)).click();
      };

      AWS.config.update({
        accessKeyId: 'AKIAJFVBLOTSKZ5554EA',
        secretAccessKey: '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'
      });
      AWS.config.region = 'us-west-2';
      $rootScope.uploader = new AWS.S3({ params: { Bucket: 'flukebook-dev-upload-tmp' } });

      $rootScope.images = {
        selected: [],
        uploaded: []
      };
      $rootScope.select = function(element) {
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
          for (i in $rootScope.images.selected) {
            if (fileEquality(file, $rootScope.images.selected[i])) {
              contains = true;
              break;
            }
          }
          if (!contains) {
            var index = $rootScope.images.selected.push(file) - 1;
            readerFactory.readAsDataUrl(file, $rootScope, index);
          }
        }

      };

      $rootScope.remove = function(i) {
        $rootScope.images.selected.splice(i, 1);
      };

      $rootScope.keys = [];
      $rootScope.upload = function() {
        var count = 0;
        $rootScope.stage = 1;
        $http.get('http://springbreak.wildbook.org/MediaAssetCreate?requestMediaAssetSet')
          .success(function(data) {
            $rootScope.mediaAssetSetId = data.mediaAssetSetId;
            var images = _.clone($rootScope.images.selected);
            for (i in images) {

              // remove the preview src before uploading the file
              delete images[i].imageSrc
              var key = $rootScope.mediaAssetSetId + '/' + images[i].name;
              $rootScope.keys.push(key);
              var params = {
                Key: key,
                ContentType: images[i].type,
                Body: images[i]
              }

              $rootScope.uploader.upload(params, function(err, data) {
                if (err) {
                  console.error(err);
                } else {
                  var mediaAsset = {
                    MediaAssetCreate: [{
                      setId: $rootScope.mediaAssetSetId,
                      assets: [{ bucket: data.Bucket, key: data.Key }]
                    }]
                  };
                  $http.post('http://springbreak.wildbook.org/MediaAssetCreate', mediaAsset).success(function() {
                    count++;
                    if (count === $rootScope.images.selected.length) {
                      console.log("Finished uploading that batch of images to the Media Asset Set with ID=" + $rootScope.mediaAssetSetId);
                      $scope.$emit('uploadComplete', { id: $rootScope.mediaAssetSetId });
                    }
                  });
                }
              }).on('httpUploadProgress', function(data) {
                var progress = Math.round(data.loaded / data.total * 100);
                var index = -1;
                for (var j = 0; j < $rootScope.images.selected.length; j++) {
                  var test = $rootScope.mediaAssetSetId + '/' + $rootScope.images.selected[j].name;
                  if (data.key == test) {
                    index = j;
                  }
                }
                if (index >= 0) {
                  $rootScope.images.selected[index].progress = progress;
                }
              });
            }
          });
      };
    }
  ])
  .controller('direct-controller', [function() {

  }])
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
