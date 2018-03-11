/**
 * Created by Hero on 2016-02-23.
 */
appControllers
    .controller('RecognitionCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory',
         '$ionicViewSwitcher', '$cordovaSocialSharing', '$ionicLoading', '$ionicPopup', 'Recognitions',
        function ($scope, $rootScope,  $state, $ionicHistory,
                  $ionicViewSwitcher, $cordovaSocialSharing, $ionicLoading, $ionicPopup, Recognitions) {
            $scope.toStream = function()
            {
                $state.go('app.stream');
            };
            $scope.toSendRecognition = function()
            {
                $state.go('app.sendrecognition');
            };
            $rootScope.$on('recognitions:received', function(event, data){
              $scope.recognition = data;
            });
            $scope.shareFacebook = function()
            {
                var link = $scope.recognition.web_url;

                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });
                window.plugins.socialsharing.shareViaFacebook(
                    getTitleText($scope.recognition),
                    $scope.recognition.badge.image_url /* img */,
                    link /* url */,
                    function() {
                        $ionicLoading.hide();
                        console.log("Facebook share success");
                    }, function(errormsg) {
                        $ionicLoading.hide();
                        console.log("Facebook share fail");
                        if(errormsg !== 'cancel') {
                            $ionicPopup.alert({
                                title: "Failed",
                                template: "You need to get Facebook app for this feature."
                            });
                        }
                    });
            };
            $scope.shareTwitter = function()
            {
                var link = $scope.recognition.web_url;

                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });
                window.plugins.socialsharing.shareViaTwitter(
                    getTitleText($scope.recognition),
                    $scope.recognition.badge.image_url /* img */,
                    link,
                    function() {
                        $ionicLoading.hide();
                        console.log("Twitter share success");
                    }, function(errormsg) {
                        $ionicLoading.hide();
                        console.log("Twitter share fail");
                        if(errormsg !== 'cancel') {
                            $ionicPopup.alert({
                                title: "Failed",
                                template: "You need to get Twitter app for this feature."
                            });
                        }
                    });
            };
            $scope.shareLinkedin = function()
            {
                var link = $scope.recognition.web_url;
                var title = getTitleText($scope.recognition);

                var url = "https://www.linkedin.com/shareArticle?" +
                    "mini=true" +
                    "&url=" + link +
                    "&locale=en-GB" +
                    "&title=" + title +
                    "&summary=" + $scope.recognition.message +
                    "&source=Recognize";
                window.open(url, '_blank', 'location=no');
            };

            $scope.deleteRecognition = function()
            {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner><div>Deleting recognition...</div>'
                });
                Recognitions.deleteRecognition($scope.recognition).then(function(result){
                    console.log("recognition delete", result);
                    $ionicLoading.hide();
                    if(result == 'success') {
                        $state.go('app.stream');
                    } else if(result == 'fail'){
                        $ionicPopup.alert({
                            title: "Failed",
                            template: "Could not delete recognition."
                        });
                    }
                });
            };

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $scope.recognition = Recognitions.selected;
            });
        }]);

function getTitleText(recognition)
{
    var str = recognition.sender.label + " " +
        "recognized";
    recognition.user_recipients.forEach(
        function(element, index, array){
            str = str + " " + element.label;
            if(index == array.length - 1) str = str + ".";
            else str = str + ",";

        });
    return str;
}
function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}