app.directive("websiteLinks", ["loadWebsite", function(loadWebsite) {
  return {
    scope: {
    },
    templateUrl: 'dist/directives/website-links/website-links.html',
    controller : function($scope) {
      $scope.openWebsite = function(url) {

        if (ionic.Platform.isIOS()) {
          url += "?viewer=ios";
        } else if (ionic.Platform.isAndroid()) {
          url += "?viewer=android";
        }

        loadWebsite.open(url);
      }
    }
  };
}]);