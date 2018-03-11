// @if NODE_ENV='production'
API_URL = "https://recognizeapp.com/api/v2/";
CLIENT_ID = "5e568d3f90915896e44fae62b480a6748cb2cc8b65b1c4e6a54bc4a1604148c2";

// @endif
// @if NODE_ENV!='production'
if (window.localStorage["recognize-browser-mode"]) {
  API_URL = "https://l.recognizeapp.com:50000/api/v2/";
  CLIENT_ID = "20d4d75d4f45a127cdca2813ec0ec2ec096afe104614812ca4519bf3b1826f41";
} else {
  API_URL = "http://demo.recognizeapp.com/api/v2/";
  CLIENT_ID = "37c8498d90d8678c3e83c5d60f52ee7c1e2570ceb9ae85dfce20c628b892aae2";
}
// @endif

var appControllers = angular.module('app.controllers', []);