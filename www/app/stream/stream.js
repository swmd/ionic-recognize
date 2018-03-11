/**
 * Created by Hero on 2016-02-08.
 */
appControllers
  .controller('StreamCtrl', ['$scope', '$rootScope', '$state', '$ionicViewSwitcher',
     'User', 'Recognitions', '$ionicScrollDelegate', 'AccessToken',
    function ($scope, $rootScope, $state,  $ionicViewSwitcher, User, Recognitions, $ionicScrollDelegate, AccessToken) {

      function getRecognitions() {
        Recognitions.loadMore().then(function(result) {

          if (Recognitions.recognitions.length === 0) {
            $(".no-recognitions").show();
            $(".hidden-if-recognitions").hide();
          } else {
            $(".no-recognitions").hide();
          }

          $scope.recognitions = Recognitions.recognitions;

          if(result === 'success'){
            console.log('stream-load-more-success');
          } else if(result === 'fail') {
            console.log("stream-load-more-failed");
          } else if (result === 'end') {
            $scope.noMoreRecognitions = true;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      $scope.recognitions = Recognitions.recognitions;
      $scope.noMoreRecognitions = false;

      $scope.loadMore = function() {
        console.log('running load more');
        if(!AccessToken.get()) {
          return $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        getRecognitions();
      };

      $scope.doRefresh = function()
      {
        Recognitions.clear();
        getRecognitions();
      };

      $scope.toSendRecognition = function()
      {
        $state.go('app.sendrecognition');
      };
      $scope.showRecognition = function(recognition)
      {
        Recognitions.selected = recognition;
        $state.go("app.recognition");
      };
      $rootScope.$on('recognitions:updated', function(event, data){
        console.log(data);
        $scope.recognitions = data;
      });
      $rootScope.$on('recognitions:refresh', function(event, data){
        console.log('recognitions:refresh');
        $scope.recognitions = Recognitions.recognitions;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        init();
      });

      function init() {
        $scope.recognitions = Recognitions.recognitions;

        if(Recognitions.recognitions.length === 0) {
          $scope.loadMore();
        } else {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      }
    }
]);
