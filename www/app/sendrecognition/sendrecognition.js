
appControllers
  .controller('SendRecognitionCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicPopup',
    '$ionicLoading', '$ionicViewSwitcher', '$ionicNavBarDelegate', 'User', 'Recognitions', 'AccessToken',
    function ($scope, $rootScope, $state, $http, $ionicPopup, $ionicLoading, $ionicViewSwitcher, $ionicNavBarDelegate,
    User, Recognitions, AccessToken) {

      setDefaultValues();

      function setDefaultValues() {
        $scope.data = {
          recipients: [],
          message: '',
          badge: {
            name: 'Choose a badge',
            image_url: 'img/choose.png'
          }
        };
      }

      $scope.submitForm = function() {
        $("#submit-button").click();
      };

      $scope.onChooseBadge = function()
      {
        $state.go('choosebadge');
      };

      $scope.sendRecognition = function(badge, recipients, message) {

        if (badge.name === 'Choose a badge') {
          $ionicPopup.alert({
            title: "Let's give em a badge",
            template: "Choose a badge to send to your colleage."
          });
          return;
        }

        if (recipients.length <= 0) {
          $ionicPopup.alert({
            title: "No recipient",
            template: "Please add recipients"
          });
          return;
        }

        $ionicLoading.show(
            {
              template: '<ion-spinner></ion-spinner><div>Sending Recognition...</div>'
            }
        );

        Recognitions.sendRecognition($scope.data.badge, $scope.data.recipients, $scope.data.message).then(function(result) {
          var ionAutocompleteElement;

          $ionicLoading.hide();

          if (result === 'success'){

            setDefaultValues();
            $state.go('app.recognition');
            ionAutocompleteElement = document.getElementsByClassName("ion-autocomplete");
            angular.element(ionAutocompleteElement).controller('ionAutocomplete').selectedItems = [];

          } else if(result === 'fail') {
            console.log(Recognitions.response);
            var errors = Recognitions.response.data.errors;
            var alert_msg="";
            console.log(alert_msg);
            for(var key in errors) {
              if(errors.hasOwnProperty(key))
              {
                var error_item = errors[key];
                console.log(error_item);
                var i = 0;
                for(i=0; i< error_item.length; i++)
                {
                  var item = error_item[i];
                  alert_msg = alert_msg + "<div>" + item + "</div>";
                }
              }
            }

            console.log(alert_msg);

            $ionicPopup.alert({
              title: "Send Recognition Failed",
              template: alert_msg
            });
          }
        });
      };

      $scope.getRecipients = function(query, isInitializing) {
        var items = [];
        //
        //if (navigator.connection && navigator.connection.type === Connection.NONE) {
        //  return $ionicPopup.alert({
        //    title: "It's all about being connected",
        //    template: "Check your internet connection, because if you are not online we can't show you your colleagues."
        //  });
        //}

        if(!isInitializing){
          var url = API_URL + "users/search?query=" + query + "&page=1";
          console.log(url);
          return $http({
            method: "Get",
            url: url,
            headers: {
              Authorization: "Bearer "+ AccessToken.get()
            }
          }).then(function(response){
            console.log(response);
            items = response.data.users;
            if(items.length <= 0)
            {
              items = [{
                label: query,
                email: query,
                avatar_url: "img/anonymous.png"
              }];
            }
            return {items: items};
          },function(response){
            items = [{
              label: query,
              email: query,
              img_url: "img/anonymous.png"
            }];
            console.log(response);
            return {items: items};
          });
        }
        return {items: items};
      };

      $rootScope.$on('badge:selected', function(event, data) {
        $scope.data.badge = data;
      });
    }]);