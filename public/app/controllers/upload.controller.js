var upload = angular.module('upload', [])
  .controller('upload-controller', [
    '$scope',
    function($scope) {

    	$scope.testlist=["1", "2", "3"];

      /* An intermediate function to link an md-button to a
      hidden file input */
      $scope.proxy = function(id) {
        console.log('clickarino');
        angular.element($('#' + id)).click();
      };

      $scope.test = function() {
        var bucket = new AWS.S3();
        console.log(bucket);
        console.log($scope.uploadedImages);
        console.log($scope.previews);
      };

      $scope.uploadedImages = [];
      $scope.previews = [];
      $scope.$watch("upImages", function(newValue, oldValue) {
        var justValues = $.map(newValue, function(val, key) {
          return val;
        });
        $scope.uploadedImages = $.extend(true, $scope.uploadedImages, justValues);
        for (var i in $scope.uploadedImages) {
          if ($scope.uploadedImages[i].src === undefined) {
            // set src using FileReader
            var r = new FileReader();
            r.onload = function(e) {
              $scope.previews.push(e.target.result);
            };
            r.readAsDataURL($scope.uploadedImages[i]);
          }
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
