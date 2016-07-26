module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],
    client: {
      mocha: {
        timeout: 500
      }
    },
    files: [
      // bower:js
      'public/bower_components/jquery/dist/jquery.js',
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-animate/angular-animate.js',
      'public/bower_components/angular-aria/angular-aria.js',
      'public/bower_components/angular-messages/angular-messages.js',
      'public/bower_components/angular-material/angular-material.js',
      'public/bower_components/angular-smart-table/dist/smart-table.js',
      'public/bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'public/bower_components/lodash/lodash.js',
      'public/bower_components/markerclustererplus/src/markerclusterer.js',
      'public/bower_components/google-maps-utility-library-v3-markerwithlabel/dist/markerwithlabel.js',
      'public/bower_components/google-maps-utility-library-v3-infobox/dist/infobox.js',
      'public/bower_components/google-maps-utility-library-v3-keydragzoom/dist/keydragzoom.js',
      'public/bower_components/js-rich-marker/src/richmarker.js',
      'public/bower_components/angular-google-maps/dist/angular-google-maps.js',
      'public/bower_components/flow.js/dist/flow.js',
      'public/bower_components/aws-sdk/dist/aws-sdk.js',
      'public/bower_components/underscore/underscore.js',
      'public/bower_components/d3/d3.js',
      'public/bower_components/leaflet/dist/leaflet-src.js',
      'public/bower_components/ui-leaflet/dist/ui-leaflet.js',
      'public/bower_components/angular-route/angular-route.js',
      'public/bower_components/jquery-alphanum/jquery.alphanum.js',
      'public/bower_components/exif-js/exif.js',
      'public/bower_components/ng-exif/ng-exif.js',
      'public/bower_components/angular-lazy-img/release/angular-lazy-img.js',
      'public/bower_components/lazysizes/lazysizes.js',
      // endbower
      "public/app/ibeis.js",
      "public/app/ibeis.routes.js",
      "public/{app,components}/**/*.js",
      "public/{app,components}/**/*.controller.js",
      "public/{app,components}/**/**.html",
      // tests
      'public/{app,components}/**/*.{spec,mock}.js'
    ],
    exclude: [],
    port: 9090,
    logLevel: config.LOG_INFO,
    reporters: ['spec', 'coverage'],
    preprocessors: {
      'public/{app,components}/**/!(*.spec|*.mock).js': ['coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
