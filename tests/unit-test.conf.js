1// Karma configuration
// Generated on Mon Mar 20 2017 21:15:52 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'www/lib/ionic/js/angular/angular.js',
        'www/lib/ionic/js/angular/angular-animate.js',
        'www/lib/ionic/js/angular/angular-sanitize.js',
        'www/lib/angular-mocks/angular-mocks.js',
        'www/lib/ionic/js/angular/angular-resource.js',
        'www/lib/ionic/js/angular-ui/angular-ui-router.js',
        'www/lib/ionic/js/ionic.js',
        'www/lib/ionic-platform-web-client/dist/ionic.io.bundle.min.js',
        'www/lib/ionic/js/ionic-angular.js',
        'www/lib/tg-angular-validator/dist/angular-validator.min.js',
        'www/lib/ngCordova/dist/ng-cordova.min.js',
        'www/lib/ion-autocomplete/dist/ion-autocomplete.js',
        'www/lib/angular-timeago/dist/angular-timeago.js',
        'www/lib/ng-cordova-oauth.js',
        
        'www/dist/ngConstants.js',
        'www/js/controllers.js',
        'www/js/services/services.js',
        'www/js/app.js',
        'www/js/**/*.js',
        'www/app/**/*.js',
        'www/js/*.spec.js',
        'www/app/**/*.spec.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    plugins: [
        'karma-chrome-launcher',
        'karma-jasmine'
    ],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
