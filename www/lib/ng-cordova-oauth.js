(function() {
  'use strict';

  angular.module("oauth.providers", [
    "oauth.utils",
    "oauth.recognize"])
    .factory("$cordovaOauth", cordovaOauth);

  function cordovaOauth(
    $q, $http, $cordovaOauthUtility, $ngCordovaRecognize) {

    return {
      recognize: $ngCordovaRecognize.signin
    };
  }

  cordovaOauth.$inject = [
    "$q", '$http', "$cordovaOauthUtility",
    "$ngCordovaRecognize"
  ];
})();

(function() {
  'use strict';

  angular.module('oauth.recognize', ['oauth.utils'])
    .factory('$ngCordovaRecognize', recognize);

  function recognize($q, $http, $cordovaOauthUtility) {
    return { signin: oauthRecognize };

    /*
     * Sign into the Recognize service
     *
     * @param    string clientId
     * @param    object options
     * @return   promise
     */
    function oauthRecognize(type, options) {
      var deferred = $q.defer();
      if(window.cordova) {
        if($cordovaOauthUtility.isInAppBrowserInstalled()) {
          var redirect_uri = "http://localhost/callback";
          if(options !== undefined) {
            if(options.hasOwnProperty("redirect_uri")) {
              redirect_uri = options.redirect_uri;
            }
          }
          var browserRef = window.cordova.InAppBrowser.open('https://recognizeapp.com/auth/'+type+'?mobile=true&redirect_uri=' + redirect_uri + '&response_type=token', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
          browserRef.addEventListener('loadstart', function(event) {
            if((event.url).indexOf(redirect_uri) === 0) {
              browserRef.removeEventListener("exit",function(event){});
              browserRef.close();
              var callbackResponse = (event.url).split("#")[1];
              var responseParameters = (callbackResponse).split("&");
              var parameterMap = [];

              for(var i = 0; i < responseParameters.length; i++) {
                parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
              }

              if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                deferred.resolve({ access_token: parameterMap.access_token });
              } else {
                deferred.reject("Problem authenticating");
              }
            }
          });
          browserRef.addEventListener('exit', function(event) {
            deferred.reject("The sign in flow was canceled");
          });
        } else {
          deferred.reject("Could not find InAppBrowser plugin");
        }
      } else {
        deferred.reject("Cannot authenticate via a web browser");
      }

      return deferred.promise;
    }
  }

  recognize.$inject = ['$q', '$http', '$cordovaOauthUtility'];
})();

/*
 * Cordova AngularJS Oauth
 *
 * Created by Nic Raboy
 * http://www.nraboy.com
 *
 *
 *
 * DESCRIPTION:
 *
 * Use Oauth sign in for various web services.
 *
 *
 * REQUIRES:
 *
 *    Apache Cordova 3.5+
 *    Apache InAppBrowser Plugin
 *    Apache Cordova Whitelist Plugin
 *
 */

angular.module("ngCordovaOauth", [
  "oauth.providers",
  "oauth.utils"
]);

(function() {
  angular.module("oauth.utils", [])
    .factory("$cordovaOauthUtility", cordovaOauthUtility);

  function cordovaOauthUtility($q) {
    return {
      isInAppBrowserInstalled: isInAppBrowserInstalled,
      createSignature: createSignature,
      createNonce: createNonce,
      generateUrlParameters: generateUrlParameters,
      parseResponseParameters: parseResponseParameters,
      generateOauthParametersInstance: generateOauthParametersInstance
    };

    /*
     * Check to see if the mandatory InAppBrowser plugin is installed
     *
     * @param
     * @return   boolean
     */
    function isInAppBrowserInstalled() {
      var cordovaPluginList = cordova.require("cordova/plugin_list");
      var inAppBrowserNames = ["cordova-plugin-inappbrowser", "cordova-plugin-inappbrowser.inappbrowser", "org.apache.cordova.inappbrowser"];

      if (Object.keys(cordovaPluginList.metadata).length === 0) {
        var formatedPluginList = cordovaPluginList.map(
          function(plugin) {
            return plugin.id || plugin.pluginId;
          });

        return inAppBrowserNames.some(function(name) {
          return formatedPluginList.indexOf(name) != -1 ? true : false;
        });
      } else {
        return inAppBrowserNames.some(function(name) {
          return cordovaPluginList.metadata.hasOwnProperty(name);
        });
      }
    }

    /*
     * Sign an Oauth 1.0 request
     *
     * @param    string method
     * @param    string endPoint
     * @param    object headerParameters
     * @param    object bodyParameters
     * @param    string secretKey
     * @param    string tokenSecret (optional)
     * @return   object
     */
    function createSignature(method, endPoint, headerParameters, bodyParameters, secretKey, tokenSecret) {
      if(typeof jsSHA !== "undefined") {
        var headerAndBodyParameters = angular.copy(headerParameters);
        var bodyParameterKeys = Object.keys(bodyParameters);

        for(var i = 0; i < bodyParameterKeys.length; i++) {
          headerAndBodyParameters[bodyParameterKeys[i]] = encodeURIComponent(bodyParameters[bodyParameterKeys[i]]);
        }

        var signatureBaseString = method + "&" + encodeURIComponent(endPoint) + "&";
        var headerAndBodyParameterKeys = (Object.keys(headerAndBodyParameters)).sort();

        for(i = 0; i < headerAndBodyParameterKeys.length; i++) {
          if(i == headerAndBodyParameterKeys.length - 1) {
            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]]);
          } else {
            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]] + "&");
          }
        }

        var oauthSignatureObject = new jsSHA(signatureBaseString, "TEXT");

        var encodedTokenSecret = '';
        if (tokenSecret) {
          encodedTokenSecret = encodeURIComponent(tokenSecret);
        }

        headerParameters.oauth_signature = encodeURIComponent(oauthSignatureObject.getHMAC(encodeURIComponent(secretKey) + "&" + encodedTokenSecret, "TEXT", "SHA-1", "B64"));
        var headerParameterKeys = Object.keys(headerParameters);
        var authorizationHeader = 'OAuth ';

        for(i = 0; i < headerParameterKeys.length; i++) {
          if(i == headerParameterKeys.length - 1) {
            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '"';
          } else {
            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '",';
          }
        }

        return { signature_base_string: signatureBaseString, authorization_header: authorizationHeader, signature: headerParameters.oauth_signature };
      } else {
        return "Missing jsSHA JavaScript library";
      }
    }

    /*
     * Create Random String Nonce
     *
     * @param    integer length
     * @return   string
     */
    function createNonce(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    }

    function generateUrlParameters(parameters) {
      var sortedKeys = Object.keys(parameters);
      sortedKeys.sort();

      var params = "";
      var amp = "";

      for (var i = 0 ; i < sortedKeys.length; i++) {
        params += amp + sortedKeys[i] + "=" + parameters[sortedKeys[i]];
        amp = "&";
      }

      return params;
    }

    function parseResponseParameters(response) {
      if (response.split) {
        var parameters = response.split("&");
        var parameterMap = {};

        for(var i = 0; i < parameters.length; i++) {
          parameterMap[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
        }

        return parameterMap;
      }
      else {
        return {};
      }
    }

    function generateOauthParametersInstance(consumerKey) {
      var nonceObj = new jsSHA(Math.round((new Date()).getTime() / 1000.0), "TEXT");
      var oauthObject = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonceObj.getHash("SHA-1", "HEX"),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
        oauth_version: "1.0"
      };
      return oauthObject;
    }
  }

  cordovaOauthUtility.$inject = ['$q'];
})();
