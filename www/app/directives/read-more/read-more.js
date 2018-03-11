app.directive('hmRead', function () {
  return {
    restrict:'AE',
    scope:{
      hmtext : '@',
      hmlimit : '@',
      hmfulltext:'@',
      hmMoreText:'@',
      hmLessText:'@',
      hmMoreClass:'@',
      hmLessClass:'@'
    },
    templateUrl: 'dist/directives/read-more/template.html',
    controller : function($scope){
      $scope.toggleValue = function(){

        if($scope.hmfulltext === true)
          $scope.hmfulltext=false;
        else if($scope.hmfulltext === false)
          $scope.hmfulltext=true;
        else
          $scope.hmfulltext=true;
      };
    }
  };
});
