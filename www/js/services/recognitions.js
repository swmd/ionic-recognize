appServices.factory('Recognitions', function($rootScope, $http, SERVER, $window, User, AccessToken) {
    var offlineMode = false;
    var has_more = true;
    var o = {
        recognitions: [],
        selected: null,
        response: null
    };
    var storedRecognitions = $window.localStorage.latest_recognitions;
    var read_count = 0;

    o.loadMore = function() {
        var url = SERVER.api_url + "recognitions?page=" + (read_count + 1) + "&per_page=10";

        checkConnection();

        return $http({
            method: 'GET',
            url: url,
            headers: {
                Authorization: "Bearer " + AccessToken.get()
            }
        }).then(function(response) {
            var map = {};

            if (read_count === 0) {
                $window.localStorage.latest_recognitions = JSON.stringify(response.data.recognitions);
            }

            o.recognitions = o.recognitions.concat(response.data.recognitions);

            o.recognitions = o.recognitions.filter(function(recognition) {
                var shouldAdd = true;

                if (map[recognition.id]) {
                    shouldAdd = false;
                } else {
                    map[recognition.id] = recognition;
                }

                return shouldAdd;
            });

            for (var item in o.recognitions) {

                if (map[o.recognitions[item].id]) {

                } else {

                    map[o.recognitions[item].id] = o.recognitions[item];
                }
            }

            read_count++;

            if (read_count >= response.data.total_pages) {
                has_more = false;
            }
            console.log('read more success');
            $rootScope.$broadcast('scroll.refreshComplete');
            return 'success';
        }, function(response) {
            console.log('read more fail');
            return 'fail';
        });
    };

    o.sendRecognition = function(badge, recipients, message) {
        checkConnection();
        return $http({
            method: "POST",
            url: SERVER.api_url + "recognitions",
            data: {
                badge: badge.id,
                message: message,
                recipients: getRecipientStr(recipients)
            },
            timeout: 15000,
            headers: {
                Authorization: "Bearer " + AccessToken.get()
            }
        }).then(function(response) {
            console.log(response.data.recognition);
            o.selected = response.data.recognition;
            o.refresh();
            return 'success';
        }, function(response) {
            o.response = response;
            checkConnection();
            return 'fail';
        });
    };

    function getRecipientStr(recipients) {
        var strRecipients = recipients[0].email;

        for (var i = 1; i < recipients.length; i++) {
            strRecipients = strRecipients + "," + recipients[i].email;
        }

        console.log(strRecipients);
        return strRecipients;
    }
    o.deleteRecognition = function(recognition) {
        checkConnection();
        return $http({
            method: "DELETE",
            url: SERVER.api_url + 'recognitions/' + recognition.id,
            headers: {
                Authorization: "Bearer " + AccessToken.get()
            }
        }).then(function(response) {
            console.log("delete success!!!");
            o.refresh();
            return 'success';
        }, function(response) {
            console.log("delete failed!!!");
            return 'fail';
        });
    };
    o.receiveRecognition = function(recognitionId) {
        checkConnection();

        return $http({
            method: 'GET',
            url: SERVER.api_url + 'recognitions/' + recognitionId,
            headers: {
                Authorization: "Bearer " + AccessToken.get()
            }
        }).then(function(response) {
            console.log('read success');
            o.selected = response.data.recognition;
            $rootScope.$broadcast('recognitions:received', o.selected);
            o.refresh();
            return 'success';
        }, function(response) {
            console.log('read fail');
            return 'fail';
        });
    };

    o.clear = function() {
        o.recognitions = [];
        read_count = 0;
        has_more = true;
    };

    o.refresh = function() {
        if (navigator.connection && navigator.connection.type === Connection.NONE) {
            return;
        }

        o.clear();
        $rootScope.$broadcast('recognitions:refresh');
    };

    function checkConnection() {
        var connectionNone = window.Connection ? window.Connection.NONE : "none";

        if (!offlineMode && navigator.connection && navigator.connection.type === connectionNone) {
            offlineMode = true;
            if (storedRecognitions) {
                o.recognitions = JSON.parse(storedRecognitions);
            } else {
                $ionicPopup.alert({
                    title: "Houston We Have a Problem",
                    template: "Please check your internet connection."
                });
            }
        } else {
            offlineMode = false;
        }
    }

    return o;
})
