var upload = angular.module('upload', [])
  .controller('upload-controller', [
    '$scope',
    '$http',
    function($scope, $http) {

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
        console.log($scope.uploadedImages);
        console.log(AWS.config);
      };

      $scope.uploadedImages = [];
      $scope.$watch("upImages", function(newValue, oldValue) {
        var newValue = _.clone(newValue);
        var justValues = $.map(newValue, function(val, key) {
          return val;
        }, true);
        var files = _.difference(justValues, $scope.uploadedImages);
        for (i in files) {
          var params = {
            Key: files[i].name,
            ContentType: files[i].type,
            Body: files[i]
          }
          
          AWS.config.update({
            accessKeyId: 'AKIAJFVBLOTSKZ5554EA',
            secretAccessKeyId: 'MWaPEpplIlHNeZspL6krTKh/muAa3l6rru5fIiMn'
          });
          AWS.config.region = 'us-west-2';
          console.log(AWS.config);
          var uploader = new AWS.S3({ params: { Bucket: 'flukebook-dev-upload-tmp' } });
          uploader.upload(params, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log("COMPLETED UPLOAD");
              $scope.uploadedImages.push(files[i]);
            }
          }).on('httpUploadProgress', function(progress) {
            console.log(Math.round(progress.loaded / progress.total * 100));
          });
        }
      });

    }
  ])
  .directive('fileModel', [
    '$parse',
    function($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function() {
            scope.$apply(function() {
              modelSetter(scope, element[0].files);
            });
          });
        }
      };
    }
  ]);
