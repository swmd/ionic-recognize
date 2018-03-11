appServices.factory('AccessToken', function($http, SERVER, $window, $rootScope) {
	var accessTokenObject = {
	    get: function() {
	        return window.localStorage.access_token;
	    },
	    set: function(token) {
	        return window.localStorage.access_token = token;
	    },
	    delete: function() {
	        delete window.localStorage.access_token;
	    }
	};
	return accessTokenObject;
});