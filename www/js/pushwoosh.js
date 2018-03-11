function initPushwoosh() {
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    var PW_APPID = '9D81E-0C7CC';
 
 	if ( device.platform == 'android' || device.platform == 'Android' ) {	// For Android device
	    //set push notifications handler
	    document.addEventListener('push-notification', function(event) {
	        var title = event.notification.title;
	        var userData = event.notification.userdata;
	                                 
	        if(typeof(userData) != "undefined") {
	            console.warn('user data: ' + JSON.stringify(userData));
	        }
	        // navigator.notification.alert(title, null, 'Recognize');
	    });
	 
	    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
	    pushNotification.onDeviceReady({ projectid: "970576322874", pw_appid : PW_APPID });
	 
	    //register for pushes
	    pushNotification.registerDevice(
	        function(status) {
	            var pushToken = status;
	            console.warn('push token: ' + pushToken);
	        },
	        function(status) {
	            console.warn(JSON.stringify(['failed to register ', status]));
	        }
	    );
	} else {									// For iOS device

	    //set push notification callback before we initialize the plugin
	    document.addEventListener('push-notification', function(event) {
					//get the notification payload
					var notification = event.notification;

					//display alert to the user for example
					// navigator.notification.alert(notification.aps.alert, null, 'Recognize');

					//clear the app badge
					pushNotification.setApplicationIconBadgeNumber(0);
			});

	    //initialize the plugin
	    pushNotification.onDeviceReady({pw_appid: PW_APPID});
	     
	    //register for pushes
	    pushNotification.registerDevice(
	        function(status) {
	            var deviceToken = status.deviceToken;
	            console.warn('registerDevice: ' + deviceToken);
	        },
	        function(status) {
	            console.warn('failed to register : ' + JSON.stringify(status));
	            // navigator.notification.alert(JSON.stringify(['failed to register ', status]), null, 'Recognize');
	        }
	    );
	    
	    //reset badges on app start
	    pushNotification.setApplicationIconBadgeNumber(0);
	}

}
