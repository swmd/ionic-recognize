// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

function goToRecognitionPage(id, Recognitions, $state) {
  Recognitions.receiveRecognition(id).then(function(result){
    if(result === 'success') {
      $state.go('app.recognition');
    }
  });
}

var app = angular.module('app', ['ionic', 'ionic.service.core', 'ionic.service.push', 'app.controllers',
  'app.services', 'app.push', 'ngCordova', 'angularValidator', 'ion-autocomplete', 'yaru22.angular-timeago', 'app.constants', 'ngCordovaOauth'])
.run(function($ionicPlatform, $rootScope, $location, $window, User, Recognitions, $state, $cordovaBadge, push, $cordovaOauth) {
  $ionicPlatform.on('resume', function() {
    console.log('app resume');
    $cordovaBadge.hasPermission().then(function(result) {
      $cordovaBadge.clear();
    }, function(error) {
      alert(error);
    });

    // var data,
    //     key = "lastPushPayload";

    // console.log('push payload: ', $window.localStorage[key]);
    // if ($window.localStorage[key]) {
    //   data = JSON.parse($window.localStorage[key]);
    //   goToRecognitionPage(data.userdata.custom.id, Recognitions, $state);
    //   delete $window.localStorage[key];
    // }
  });

  function initPush() {
    var deviceTokenPromise = push.getDeviceToken();

    if (deviceTokenPromise) {
      deviceTokenPromise.done(function(token) {
        console.log('push token: ', token);
        User.setDeviceData(ionic.Platform.platform(), token);
      });

      deviceTokenPromise.fail(function(error) {
        console.log('pushwoosh register failed: ', error);
      });
    }
  }

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;
  }

  $ionicPlatform.ready(function() {
    window.open = cordova.InAppBrowser.open;
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.oauth = function(type) {
      $cordovaOauth.recognize(type).then(function(result) {
        console.log("Response Object -> " + JSON.stringify(result));
        $window.localStorage.access_token = result.access_token;
        $state.go('app.stream');
      }, function(error) {
        console.log("Error -> " + error);
      });
    };

    $rootScope.user = JSON.parse($window.localStorage.user || "{}");
    User.data = $rootScope.user;

    if (ionic.Platform.isIOS()) {
      $('html').addClass("ios");
    }

    if ($window.localStorage["recognize-browser-mode"] === "true") {
      $rootScope.browserMode = true;
    } else {
      $rootScope.browserMode = false;
    }

    initPush();

    $rootScope.$on("receiveRecognition", function(e, id) {
      goToRecognitionPage(id, Recognitions, $state);
    });
  });
})

.config(function($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider, $ionicConfigProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $ionicConfigProvider.navBar.alignTitle('center');
  $stateProvider

  // setup an abstract state for the tabs directive

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'dist/sidebar/sidebar.html',
      controller: 'SidebarCtrl'
    })
  // Each tab has its own nav history stack:
    .state('login', {
      url: '/login',
      templateUrl: 'dist/login/login.html',
      controller : 'LoginCtrl'
    })
    .state('app.stream', {
      url: '/stream',
      views: {
        'menuContent': {
          templateUrl: 'dist/stream/stream.html',
          controller: 'StreamCtrl'
        }
      }
    })
    .state('app.sendrecognition', {
      url: '/sendrecognition',
      views: {
        'menuContent': {
          templateUrl: 'dist/sendrecognition/sendrecognition.html',
          controller: 'SendRecognitionCtrl'
        }
      }
    })
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'dist/about/about.html',
          controller: 'AboutCtrl'
        }
      }
    })
    .state('choosebadge', {
      url: '/choosebadge',
      cache: false,
      templateUrl: 'dist/choosebadge/choosebadge.html',
      controller: 'ChooseBadgeCtrl'
    })

    .state('app.recognition', {
      url: '/recognition',
      views: {
        'menuContent': {
          templateUrl: 'dist/recognition/recognition.html',
          controller: 'RecognitionCtrl'
        }
      }
    }
  );

  if (window.localStorage && window.localStorage.access_token) {
    $urlRouterProvider.otherwise('/app/stream');
  } else {
    $urlRouterProvider.otherwise('/login');
  }
})
.filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  };
})
.constant('SERVER', {
  // if using local server
  //url: 'http://localhost:3000'

  // if using our public heroku server
  api_url: API_URL,
  client_id : CLIENT_ID
});
