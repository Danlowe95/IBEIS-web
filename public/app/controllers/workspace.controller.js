var workspace = angular.module('workspace', [])
  .controller('workspace-controller', [
    '$scope',
    '$mdSidenav',
    '$mdToast',
    '$mdDialog',
    '$mdMedia',
    '$http',
    function($scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $http) {

      $scope.fluke_data = null;
      $http.get('assets/json/fluke_annotations.json').success(function(data) {
        $scope.currentSlides = data;
      });
      $scope.filtering_tests = null;
      $http.get('assets/json/fakeClassDefinitions.json').success(function(data) {
        $scope.filtering_tests = data;
      });

      $scope.secondaryTestImages = [{ title: 'Smiley', src: 'http://i.imgur.com/J5YLlJv.png', index: 0 }];
      $scope.secondaryTestAnnotations = [{ title: 'Smiley', src: 'http://i.imgur.com/J5YLlJv.png', index: 0 }];

      /* Variables workspace pulls from */

      // define options
      $scope.opts = {
        // history & focus options are disabled on CodePen
        history: false,
        focus: false,

        showAnimationDuration: 0,
        hideAnimationDuration: 0
      };
      //ngFlowGrid Method (what does it do?)
      $scope.updateGrid = function() {
        var homePageGrid = fgDelegate.getFlow('ImageGrid');

        //homePageGrid.minItemWidth = 20;
        homePageGrid.refill(true);
      }

      $scope.refreshGrid = function() {
        var homePageGrid = fgDelegate.getFlow('ImageGrid');
        homePageGrid.itemsChanged();
        homePageGrid.refill(true);
      };


      //Attempting to use for indexing when focusing an image (image_info_Sidenav)
      $scope.image_index = -1

      //Options relating to photoswipe
      $scope.startEvent = 'START_GALLERY';

      $scope.showGallery = function(i) {
        $scope.opts.index = i || $scope.opts.index;
        $scope.$broadcast($scope.startEvent);
      };

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

      //Map
      $scope.currentMarker = null;
      $scope.clickMarker = function(id) {
        console.log("marker clicked");
        $scope.currentMarker = id;
        $scope.toggleSidenav('marker');
      };
      //what's this?
      $scope.testItems = Array.apply(null, {
        length: 100
      }).map(Number.call, Number);
      $scope.image_index = -1;
      $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };
      $scope.toggleImageSidenav = function(index) {
        $scope.image_index = index;
        $mdSidenav('image').toggle();

      }

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

      //TODO comment what this does
      function sanitizePosition() {
        var current = $scope.toastPosition;
        if (current.bottom && last.top) current.top = false;
        if (current.top && last.bottom) current.bottom = false;
        if (current.right && last.left) current.left = false;
        if (current.left && last.right) current.right = false;
        last = angular.extend({}, current);
      }
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
      //unfinished


      /* FILTERING */
      //used to catch all form data for filtering and send in for query
      $scope.filterData = [];
      $scope.submitFilters = function() {
        console.log($scope.filterData);
        $scope.close('filter');
      };


      /* SIDENAVS */
      $scope.close = function(id) {
        $mdSidenav(id).close();
        //sets image-focus to null.  If multiple sidenavs are toggled this could cause an issue (maybe).
        $scope.image_index = -1;
      };

      /* UPLOAD DIALOG */
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
      $scope.showUploadDialog = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
          clickOutsideToClose: false,
          scope: $scope,
          preserveScope: true,
          templateUrl: 'app/views/includes/workspace/upload.dialog.html',
          controller: function DialogController($scope, $mdDialog) {
            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
          },
          fullscreen: useFullScreen
        });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
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

      /* WORKSPACES */
      //to be deleted when we get real data
      $scope.chooseTestDatabase = function() {
        if ($scope.workspace == 'Secondary' && $scope.type == 'images') $scope.currentSlides = $scope.secondaryTestImages;
        else if ($scope.workspace == 'Secondary') $scope.currentSlides = $scope.secondaryTestAnnotations;
        else if ($scope.workspace == 'Primary' && $scope.type == 'images') $scope.currentSlides = $scope.fluke_data;
        else if ($scope.workspace == 'Primary') $scope.currentSlides = $scope.primaryTestAnnotations;

      }
      $scope.workspace = 'Primary';
      $scope.workspaces = ['Primary', 'Secondary'];
      $scope.setWorkspace = function(w) {
        $scope.workspace = w;
        //query new workspace to get data

        //set the view to the new data. In the future this will just be a 
        //"Are we viewing images, annotations, or animals, and set the view by that"
        //for now, these if statements deal with swapping test databases based on viewing selections    
        $scope.chooseTestDatabase();
      };
      //Used when new data needs to be requeried
      $scope.populateWorkspace = function() {
        //Decide what data to get
        //Get new Data
        //Parse Data?
        //set workspace to data
        $scope.refreshGrid();

      };

      /* TYPE MENU */
      $scope.types = ['images', 'annotations', 'animals'];
      $scope.type = $scope.types[0];
      //This runs on first page load.This just sets the proper workspace to load
      $scope.chooseTestDatabase();

      $scope.setType = function(t) {
        if ($scope.type != t) {
          $scope.type = t;
          $scope.chooseTestDatabase();
          $scope.populateWorkspace();
        }
      };

      /* VIEW MENU */
      $scope.views = ['thumbnails', 'table', 'map'];
      $scope.view = $scope.views[0];
      $scope.setView = function(v) {
        $scope.view = v;
        // $(window).trigger('resize');
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

      $scope.logoVisible = function() {
        var logo = $('#logo');
        if (logo.css('display') === 'none') {
          return false;
        } else {
          return true;
        }
      }
      $scope.sex = { name: 'Sex', dataType: 'string', tag: 'sex' };

    }
  ])
  .directive('ibsFiltering', function() {
    return {
      scope: {
        name: '='
      },
      templateUrl: 'assets/directives/ibs-filtering-iso.html'
    };
  });;
