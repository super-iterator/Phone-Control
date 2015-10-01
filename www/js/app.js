// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [ 'ionic'])

.run(function($ionicPlatform , $rootScope, $http, webService) {
      $ionicPlatform.ready(function() {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              StatusBar.styleDefault();
            }

            var db = new PouchDB('callersDB');

            //////// phone call trap works anywhere in the code, but must be insdie $ionicPlatform.ready(...)
            PhoneCallTrap.onCall(function(state) {

                // console.log('logging state: ..');
                // console.log(Object.keys(state));
                // console.log(state.state);
                // console.log(state.number);

                switch (state.state) {
                    case "RINGING":
                        alert("Phone is ringing: " + state.number);

                        try {

                            db.on('error', function (err) { console.log('debug error: ' + err); });

                            // incoming_number = state.number

                            params = {
                                incoming_number : state.number,
                                webService      : webService,
                                http            : $http
                            }

                            db.query(function  (doc) {

                                console.log('INITIALIZING PouchDB');

                                // Check if we have the incoming number in the database
                                if(doc.phone == params.incoming_number){

                                    console.log('Found the document: ' + doc._id);

                                    /////////  Couldn't make the factory working inside the query
                                    ////////   gives me error everytime
                                    // params.webService.get()
                                    //     .success(function  (data, status, headers, config) {
                                    //         console.log('loggging web service: ');
                                    //         console.log('Got response from server');
                                    //         console.log(status);
                                    //         // console.log(response);
                                    //     })
                                    //     .error(function  (data, status, headers, config) {
                                    //         console.log('Error on Webservice');
                                    //         console.log(status);
                                    //     })

                                    console.log('Invoking a web service .. ');
                                    var promise = params.http.get('http://localhost:1337/users')

                                    promise
                                        .success(function  (data, status, headers, config) {
                                            console.log('loggging web service: ');
                                            console.log('Got response from server');
                                            console.log(status);
                                            // console.log(response);
                                        })
                                        .error(function  (data, status, headers, config) {
                                            console.log('Error on Webservice');
                                            console.log(status);
                                        })


                                    }
                            });

                        } catch(e) {
                            console.log('PouchDB Error caught: ' + e);
                        }


                        break;
                    case "OFFHOOK":
                        console.log("Phone is off-hook");
                        break;

                    case "IDLE":
                        console.log("Phone is idle");
                        break;
                    }
            });

      });

})

.controller('myController',['$scope','$ionicPopup','webService',function ( $scope , $ionicPopup , webService) {


    $scope.data = {
        showDelete : false,
        showReorder : false,
        listCanSwipe : true,
    };



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


    $scope.$on('getAll' , function(event,items) {
        console.log('ITEMS POPULATED TYPE AND VALUE');
        console.log(items);
        $scope.items = items
    });

    $scope.$on('updateContacts' , function(event,items) {
        console.log('Contacts update');
        console.log(items);
        $scope.items = items
    });






    $scope.removeContact = function (item) {

        console.log('Incoming value: ' + item);
        console.log(Object.keys(item)); //["id", "key", "value", "doc", "$$hashKey"]

        console.log(item.id);
        console.log(item.key);
        console.log(item.doc.phone);

        db.get(item.id).then(function  (element) {
            console.log('Removing .. ' + element);
            console.log(Object.keys(element));
            db.remove(element);
        }).then(function  (result) {
            console.log('Removed with DB response: ' + result);
        }).catch(function  (err) {
            console.error('Error on removing contact: ' + err);
        })


       //     db.remove(entry.doc._id , entry.doc._rev , function  (entry){
       //         //{"status":404,"name":"not_found","message":"missing"}


    }

    $scope.addContact = function  () {

            $scope.user_input = {};

            $ionicPopup.show({
                  title: 'Data Entry',
                  templateUrl: 'inputForm.html',
                  subTitle: 'Please enter user Data',
                  scope: $scope,

                  buttons: [
                      {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                          if ($scope.user_input){
                              var user_input = $scope.user_input

                              db.put( {_id:user_input.name , phone: user_input.phone}).then( function (item) {
                                              console.log('A document inserted. ');

                                              console.log('a new item inserted: ' + item);

                                              // only id and revision are returned from a put/post operation
                                              // either we manually add the values we want to show in the list
                                              // or, make a get operation from DB to retreive all the fields
                                              // we want --> I'll go for the first
                                              item.doc = {
                                                            phone : user_input.phone,
                                                            _id   : item.id,
                                                         }

                                              // We have to broadcase it inside an apply service,
                                              // that's because we are inside an async operation
                                              $scope.$apply(function () {
                                                  $scope.items.push(item)
                                                  $scope.$broadcast('updateContacts',$scope.items)
                                              })
                                          }).catch(function (err) {
                                            console.log('Error on Puch: ' , err);
                                          })
                          }
                      } // End of "onTap"
                      },

                      { text: 'Cancel',
                        type: 'button-assertive'
                      },
                   ]
            })
            .then(function(res) {
              console.log('Popup window result: ',res);
            });
    };




}])


.factory('webService',['$http', '$q', function ($http, $q) {
    console.log('Calling a webserive from factory: ');

    req = {
         method: 'GET',
         url: 'http://www.google.com',
         headers: {
             'Access-Control-Allow-Origin' : '*',
  			 'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            //  'Content-Type': 'application/json',
			//  'Accept': 'application/json'
         }
         //data: { test: 'test' }
        }
    var myFactory = {}
    myFactory.get = function  () {
        // return $http(req)
        return $http.get('http://www.google.com')
    }
    return myFactory

    // return $http(req)

    // console.log('Google Returend ..' + returned.$$state);
    // console.log('Google Returend ..' + returned.success);
    // console.log('Google Returend ..' + returned.error);
    // return returned
}])
