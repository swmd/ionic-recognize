app.service('loadWebsite', function() {
    var iabRef = null;

    function iabLoadStart(event) {
      console.log(event.type + ' - ' + event.url);
    }

    function iabLoadStop(event) {
      console.log(event.type + ' - ' + event.url);
    }

    function iabLoadError(event) {
      console.log(event.type + ' - ' + event.message);
    }

    function iabClose(event) {
      iabRef.removeEventListener('loadstart', iabLoadStart);
      iabRef.removeEventListener('loadstop', iabLoadStop);
      iabRef.removeEventListener('loaderror', iabLoadError);
      iabRef.removeEventListener('exit', iabClose);
    }

    function loadWebpage(destination) {
      iabRef = window.open(destination, '_blank', 'location=yes');
      iabRef.addEventListener('loadstart', iabLoadStart);
      iabRef.addEventListener('loadstop', iabLoadStop);
      iabRef.addEventListener('loaderror', iabLoadError);
      iabRef.addEventListener('exit', iabClose);
    }
    return {
      open: loadWebpage
    };
});