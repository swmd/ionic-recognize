// describe('LoginCtrl', function() {

//     var controller, scope, rootScope, async, 
//         deferredLogin,
//         userServiceMock,
//         stateMock,
//         ionicPopupMock;

//     beforeEach(module('app'));

//     beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
//         userServiceMock = {
//             signIn: jasmine.createSpy('login spy').and.returnValue(deferredLogin.promise)
//         };
//         async = _$q_;
//         scope = _$rootScope_.$new();
//         deferredLogin = async.defer();
        
//         controller = _$controller_('LoginCtrl', {
//             $scope: scope,
//             User: userServiceMock
//         });
//         scope.onGo();
//     }));

//     it('#onGo should call signIn on User service', function() {
        
//         expect(userServiceMock.signIn).toHaveBeenCalledWith('test1', 'password1');
//     });
    
// });

describe("LoginCtrl", function () {

    var $scope, ctrl, $timeout;

    beforeEach(function () {

        module("app");

        // INJECT! This part is critical
        // $rootScope - injected to create a new $scope instance.
        // $controller - injected to create an instance of our controller.
        // $q - injected so we can create promises for our mocks.
        // _$timeout_ - injected to we can flush unresolved promises.
        inject(function ($rootScope, $controller, $q) {
            deferredLogin = $q.defer();
            userServiceMock = {
                signIn: jasmine.createSpy('login spy').and.returnValue(deferredLogin.promise)
            };
            // create a scope object for us to use.
            $scope = $rootScope.$new();

            // now run that scope through the controller function,
            // injecting any services or other injectables we need.
            // **NOTE**: this is the only time the controller function
            // will be run, so anything that occurs inside of that
            // will already be done before the first spec.
            controller = $controller("LoginCtrl", {
                $scope: $scope,
                User: userServiceMock
            });
        });

    });


    // Test 1: The simplest of the simple.
    // here we're going to make sure the $scope variable
    // exists evaluated.
    it("should have a $scope variable", function() {
        expect($scope).toBeDefined();
    });

});
