// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [ 'ionic'])

.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              StatusBar.styleDefault();
            }

            //////// phone call trap works anywhere in the code, but must be insdie $ionicPlatform.ready(...)
            PhoneCallTrap.onCall(function(state) {
            // alert("CHANGE STATE: " + state.state);

                switch (state.state) {
                    case "RINGING":
                        alert("Phone is ringing: " + state.number);
                        break;
                    case "OFFHOOK":
                        alert("Phone is off-hook");
                        break;

                    case "IDLE":
                        alert("Phone is idle");
                        break;
                    }
            });





      });

      var db = new PouchDB('callersDB');

      db.put( {_id:'father', phone: "1111"}).then( function (r) {
                                              console.log('A document inserted: ' + Object.keys(r) + 'ok: ' + r.ok + 'rev: ' + r.rev + 'id: ' + r.id);
                                          }).catch(function (err) {
                                            console.log('Error on Puch: ' , err);
                                          });;
      db.put( {_id:'mom', phone: "2222"}).then( function (r) {
                                              console.log('A document inserted: ' + r);
                                          }).catch(function (err) {
                                            console.log('Error on Puch: ' , err);
                                          });;
      db.put( {_id:'lola', phone: "3333"}).then( function (r) {
                                              console.log('A document inserted: ' + r);
                                          }).catch(function (err) {
                                            console.log('Error on Puch: ' , err);
                                          });
})

.controller('myController',['$scope','$ionicPopup',function ( $scope , $ionicPopup ) {


    var db = new PouchDB('callersDB');

    db.allDocs({
                include_docs: true,
                attachments: true
            }).then(function (result) {
                console.log('Getting all fields');

                $scope.$apply(function  () {
                    $scope.$broadcast('getAll',result.rows)
                    console.log('Broadcating');
                    // $scope .test = 'test value'
                });

            }).catch(function (err) {
              console.log('Error' + err);
            });


    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true

    $scope.$on('getAll',function  (event,items) {
        $scope.items = items
    });

    $scope.addContact = function  () {
            $ionicPopup.alert({
                  title: 'Dont eat that!',
                  templateUrl: 'inputForm.html',
                  buttons: [
                      {
                        text: '<b>Save</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                          if (!$scope.data.wifi){}
                        }
                      },

                      { text: 'Cancel' },
                   ]
            })
            .then(function(res) {
              console.log('Thank you for not eating my delicious ice cream cone');
            });
    };

    $scope.removeContact = function  () {

    };


}])
