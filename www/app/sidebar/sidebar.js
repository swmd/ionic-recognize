appControllers.controller('SidebarCtrl',
  ['$scope', '$rootScope', '$state', '$window', '$ionicModal', '$timeout', 'User', 'Recognitions',
      function($scope, $rootScope, $state, $window, $ionicModal, $timeout, User, Recognitions) {
          $scope.logout = function () {
              User.signOut();
              Recognitions.clear();
              $state.go('login');
              $rootScope.$broadcast('logout');
          };
}]);
