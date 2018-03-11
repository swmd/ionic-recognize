(function() {
  var pushNotification;

  var app = angular.module('app.push', []);

  var requestDeviceToken = function(deferred) {
    var PW_APPID = '9D81E-0C7CC';
    var FIREBASE_SENDER_ID = 455047296961;

    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({
      projectid: FIREBASE_SENDER_ID,
      appid : PW_APPID
    });

    //register for pushes
    pushNotification.registerDevice(
      function(status) {
        var deviceToken = status.pushToken;
        // console.warn('registered device: ' +deviceToken);
        window.localStorage.deviceToken = deviceToken;
        deferred.resolve(deviceToken);
      },
      function(status) {
        console.warn(JSON.stringify(['failed to register ', status]));
        deferred.reject(status);
      }
    );
  };

  app.provider('push', function() {
    this.$get = function($rootScope, $ionicPlatform) {

      function registerEvents() {
        $ionicPlatform.on('push-notification', function(event) {
          console.log('push received: ' + JSON.stringify(event));
          // window.localStorage["lastPushPayload"] = JSON.stringify(event.notification);
          $rootScope.$emit("receiveRecognition", event.notification.userdata.custom.id);
          pushNotification.setApplicationIconBadgeNumber(0);
        });

        pushNotification.getLaunchNotification(function(payload) {
          console.log('payload content: ' + JSON.stringify(payload));
          if (payload && payload.userdata && payload.userdata.custom && payload.userdata.custom.id) {
            $rootScope.$emit("receiveRecognition", payload.userdata.custom.id);
            pushNotification.setApplicationIconBadgeNumber(1);
          }
        });

        pushNotification.setApplicationIconBadgeNumber(0);
        registerEvents.attached = true;
      }

      return {
        getDeviceToken: function() {
          var deferred = $.Deferred();

          pushNotification = pushNotification || cordova.require("pushwoosh-cordova-plugin.PushNotification");

          if (!registerEvents.attached) {
            registerEvents();
          }

          requestDeviceToken(deferred);

          return deferred.promise();
        }
      }
    };
  });

})();