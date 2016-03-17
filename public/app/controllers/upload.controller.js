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
      $scope.upload = function(element) {
      	console.log(element.files);
      	var justFiles = $.map(element.files, function(val, key) {
          return val;
        }, true);
  			console.log(justFiles);
  			var newFiles = _.difference(justFiles, $scope.uploadedImages);
  			for (i in newFiles) {
  				var params = {
            Key: newFiles[i].name,
            ContentType: newFiles[i].type,
            Body: newFiles[i]
          }
          $scope.uploadedImages.push(newFiles[i]);

          AWS.config.update({
            accessKeyId: 'AKIAJFVBLOTSKZ5554EA',
            secretAccessKeyId: 'MWaPEpplIlHNeZspL6krTKh/muAa3l6rru5fIiMn'
          });
          AWS.config.region = 'us-west-2';
          // console.log(AWS.config);
          var uploader = new AWS.S3({ params: { Bucket: 'flukebook-dev-upload-tmp' } });
          uploader.upload(params, function(err, data) {
            if (err) {
              console.error(err);
            } else {
              console.log("COMPLETED UPLOAD");
            }
          }).on('httpUploadProgress', function(progress) {
            console.log(Math.round(progress.loaded / progress.total * 100));
          });
  			}
      };

    }
  ]);
