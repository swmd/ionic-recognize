/**
 * Created by Hero on 2016-02-08.
 */
appControllers
  .controller('ChooseBadgeCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicPopup', '$ionicHistory','$ionicNavBarDelegate', 'User', 'AccessToken',
    function ($scope, $rootScope,  $state, $http, $ionicPopup, $ionicHistory, $ionicNavBarDelegate, User, AccessToken) {
      $scope.noMoreBadges = false;
      $scope.badges = [];

      $scope.loadMore = function() {
        var url = API_URL + "badges?access_token=" + AccessToken.get() + "&page=1&per_page=30";
        $http({
          method: 'GET',
          timeout: 10000,
          url: url
        }).then(function (response) {
          var badges = response.data.badges.filter(function(badge) {
            if (!badge.is_nomination) {
              return badge;
            }
          });

          $scope.badges = badges;

          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.noMoreBadges = true;
        }, function() {
          $ionicPopup.alert({
            title: "No connection",
            template: "Network connection lost!"
          }).then(function(res){
            setTimeout(function(){
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 3000);
          });
        });
      };

      $scope.chooseBadge = function(badge)
      {
        $rootScope.$broadcast('badge:selected', badge);
        $state.go('app.sendrecognition');
      };
      $scope.backToSendPage = function()
      {
        $ionicHistory.goBack();
      };
    }]);
