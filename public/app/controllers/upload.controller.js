var upload = angular.module('upload', [])
  .controller('upload-controller', [
    '$rootScope',
    '$scope',
    '$http',
    'reader-factory',
    function($rootScope, $scope, $http, readerFactory) {

      // $http.get('app/controllers/s3.json').success(function(data) {
      //   AWS.config.update({
      //     accessKeyId: data.s3_accessKeyId,
      //     secretAccessKeyId: data.s3_secretAccessKey
      //   });
      //   AWS.config.region = data.s3_region;
      //   $scope.uploader = new AWS.S3({ params: { Bucket: data.s3_bucket } });
      // });

      /* An intermediate function to link an md-button to a
      hidden file input */
      $scope.proxy = function(id) {
        angular.element($('#' + id)).click();
      };

      $scope.test = function() {
        console.log($scope.images.selected);
      };

      AWS.config.update({
        accessKeyId: 'AKIAJFVBLOTSKZ5554EA',
        secretAccessKey: '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'
      });
      AWS.config.region = 'us-west-2';
      $scope.uploader = new AWS.S3({ params: { Bucket: 'flukebook-dev-upload-tmp' } });

      $rootScope.images = {
        selected: [],
        uploaded: []
      };
      $scope.previews = [];
      $scope.select = function(element) {
        $scope.$apply(function() {
          var selectedImages = _.clone($rootScope.images.selected); // get current copy of $scope.selectedImages
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
            for (i in selectedImages) {
              if (fileEquality(file, selectedImages[i])) {
                contains = true;
                break;
              }
            }
            if (!contains) {
              readerFactory.readAsDataUrl(file, $scope)
                .then(function(result) {
                	console.log(file.name + " has image");
                  file.imageSrc = result;
                });
              selectedImages.push(file);
            }
          }

          $rootScope.images.selected = selectedImages;

        });
      };

      $scope.upload = function() {
        var images = _.clone($rootScope.images.selected);
        for (i in images) {

        	// remove the preview src before uploading the file
        	delete images[i].imageSrc

          var params = {
            Key: images[i].name,
            ContentType: images[i].type,
            Body: images[i]
          }

          $scope.uploader.upload(params, function(err, data) {
            if (err) {
              console.error(err);
            } else {
              console.log("COMPLETED UPLOAD");
            }
          }).on('httpUploadProgress', function(progress) {
          	var progress = Math.round(progress.loaded / progress.total * 100);
            console.log(images[i].name + ": " + progress + "%");
            $rootScope.images.selected[i].progress = progress;
          });
        }

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

    var readAsDataURL = function(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    };

    return { readAsDataUrl: readAsDataURL };

  }]);
