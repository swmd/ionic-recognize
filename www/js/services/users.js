appServices.factory('User', function($http, SERVER, $window, $rootScope, AccessToken) {
    var device_platform, device_token;
    var isLoggedIn = false;
    var o = {
        data: null
    };

    o.getUserData = function() {
        if (!o.data) {
            o.data = JSON.parse($window.localStorage.user);
        }
        return o.data;
    };
    o.setDeviceData = function(platform, token) {
        var oldToken;

        device_platform = platform;
        device_token = token;
        console.log(device_platform, device_token);

        if ($window.localStorage.deviceToken != token) {
            oldToken = $window.localStorage.deviceToken;
            $window.localStorage.deviceToken = token;

            if (isLoggedIn) {
                var url = SERVER.api_url + "users/device_tokens";
                return $http({
                    method: 'POST',
                    data: {
                        id: User.id,
                        old_token: oldToken,
                        new_token: token
                    },
                    url: url,
                    headers: {
                        Authorization: "Bearer " + AccessToken.get()
                    }
                });
            }
        }
    };
    o.signIn = function(email, password) {
        var clientId = SERVER.client_id;
        var apiURL = SERVER.api_url;
        device_token = $window.localStorage.deviceToken;

        // @if NODE_ENV!='production'
        if ($rootScope.browserMode) {
            apiURL = SERVER.api_url = "https://l.recognizeapp.com:50000/api/v2/";
            clientId = SERVER.client_id = "a2aa1cd437b9b6e0bb6ac07fea569459c95771efbbef9d87d393ac9a46d7a110";
        }
        // @endif


        return $http({
            method: "POST",
            url: apiURL + 'auth',
            timeout: 10000,
            data: {
                email: email,
                password: password,
                client_id: clientId,
                device_platform: device_platform,
                device_token: device_token
            }
        }).then(function(response) {
            console.log(response.data.auth.access_token);
            AccessToken.set(response.data.auth.access_token);
            o.data = response.data.auth.user;
            $window.localStorage.user = JSON.stringify(o.data);
            console.log("login success");
            isLoggedIn = true;
        }, function(response) {
            o.data = null;
            console.log("login fail");
            console.log(response);
        });
    };
    o.signOut = function() {
        o.data = null;
        AccessToken.delete();
        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('latest_recognitions');
    };
    return o;
});
