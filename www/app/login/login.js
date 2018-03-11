/**
 * Created by Hero on 2016-02-08.
 */

appControllers
  .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicLoading', '$ionicPopup', '$cordovaInAppBrowser', '$window', 'User', 'loadWebsite', 'AccessToken',
    function ($scope, $rootScope,  $state, $http, $ionicLoading, $ionicPopup, $cordovaInAppBrowser, $window, User, loadWebsite, AccessToken) {
      var timeoutSignIn = 0;
      var isiOs = "ios";

      // @if NODE_ENV!='production'
      $scope.data = {
        username: "foo1@recognizeapp.com",
        password: "asdfasdf",
        passwordType: "password"
      };
      // @endif

      // @if NODE_ENV='production'
      $scope.data = {
        username: null,
        password: null,
        passwordType: "password"
      };
      // @endif

      $scope.onGo = loginFormSubmit;
      
      // @if NODE_ENV!='production'
      $scope.isBrowserModeOn = function() {
        return localStorage["recognize-browser-mode"] === "true";
      };

      $scope.triggerBrowseMode = function(bTrigger) {
        localStorage["recognize-browser-mode"] = bTrigger;
        $rootScope.browserMode = bTrigger;
      };
      // @endif


      $scope.oauth = function(type) {
        $rootScope.oauth(type);
      };

      $scope.showPassword = function(bShow)
      {
        console.log(bShow);
        if(bShow) {
          $scope.data.passwordType = "text";
        } else {
          $scope.data.passwordType = "password";
        }
      };

      $scope.toForgetPassword = function()
      {
        isiOs = ionic.Platform.isIOS() ? "ios" : "android";
        loadWebsite.open("https://recognizeapp.com/password_resets/new?viewer="+isiOs);
      };

      function loginFormSubmit() {
        var username = $scope.data.username;
        var password = $scope.data.password;

        $ionicLoading.show(
          {
            template: '<ion-spinner></ion-spinner><div>Signing In...</div>'
          }
        );

        timeoutSignIn = setTimeout(function() {
          $ionicLoading.hide();

          $ionicPopup.alert({
            title: "No connection",
            template: "Network connection lost!"
          });
        }, 10000);
        //var platform = "";
        //if(ionic.Platform.isIOS()) platform = "ios";
        //else if(ionic.Platform.isAndroid()) platform = "android";
        //else if(ionic.Platform.isWindowsPhone()) platform = "windows";
        User.signIn(username, password).then(function(){
          $ionicLoading.hide();
          clearTimeout(timeoutSignIn);
          console.log(User.data);
          if(User.data) {
            $state.go('app.stream');
          } else {
            $("body").focus();
            if (navigator.connection && navigator.connection.type === Connection.NONE) {
              $ionicPopup.alert({
                title:"Ground control to Major Tom",
                template: "We can\'t log you in because your internet connection is down."
              });
            } else {
              $ionicPopup.alert({
                title:"Sign in did not go as planned",
                template: "Check your credentials, or contact support@recognizeapp.com."
              });
            }
          }
        });
      }
    }
  ]
);