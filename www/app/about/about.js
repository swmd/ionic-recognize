appControllers
  .controller('AboutCtrl', ['$scope', '$rootScope', '$state', '$cordovaAppVersion', 'loadWebsite', "VERSION",
    function ($scope, $rootScope,  $state, $cordovaAppVersion, loadWebsite, VERSION) {

      $scope.resources = [
        {
          title: "Support",
          url: getUrl("https://recognize.zendesk.com")
        },
        {
          title: "Contact",
          url: getUrl("https://recognizeapp.com/contact")
        },
        {
          title: "Recognize's homepage",
          url: getUrl("https://recognizeapp.com")
        },
        {
          title: "Tour",
          url: getUrl("https://recognizeapp.com/tour")
        }
      ];

      if (ionic.Platform.isIOS()) {
        $scope.resources.pop();
        $scope.resources.pop();
      }

      $scope.appVersion = VERSION;

      $scope.openWebsite = loadWebsite.open;
  }]);

function getUrl(url) {
  var platform = ionic.Platform.isIOS() ? "ios" : "android";
  return url+"?viewer="+platform;
}