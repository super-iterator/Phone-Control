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

                switch (state.state) {
                    case "RINGING":
                        alert("Phone is ringing: " + state.number);

                        try {
                            // Event handler on any database error
                            db.on('error', function (err) { console.log('debug error: ' + err); });

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

                                    /// works
                                    params.webService.get()
                                        .success(function  (data, status, headers, config) {
                                            console.log('Got response from server');
                                            console.log(data);
                                            console.log(status);

                                        })
                                        .error(function  (data, status, headers, config) {
                                            console.log('Error on Webservice');
                                            console.log(data);
                                            console.log(status);
                                        })

                                    /// works
                                    // var promise = params.http.get('http://192.168.0.3:1337/users')
                                    //
                                    // promise
                                    //     .success(function  (data, status, headers, config) {
                                    //         console.log('loggging web service: ');
                                    //         console.log('Got response from server');
                                    //         console.log(status);
                                    //         // console.log(response);
                                    //     })
                                    //     .error(function  (data, status, headers, config) {
                                    //         console.log('Error on Webservice');
                                    //         console.log(status); // 0 for error, 200 for success
                                    //     })


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




      $ionicPlatform.on('pause', function() {
                 alert("App Is Paused");

                 var db = new PouchDB('callersDB');

                 //////// phone call trap works anywhere in the code, but must be insdie $ionicPlatform.ready(...)
                 PhoneCallTrap.onCall(function(state) {

                     switch (state.state) {
                         case "RINGING":
                             alert("Phone is ringing: " + state.number);

                             try {
                                 // Event handler on any database error
                                 db.on('error', function (err) { console.log('debug error: ' + err); });

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

                                         /// works
                                         params.webService.get()
                                             .success(function  (data, status, headers, config) {
                                                 console.log('Got response from server');
                                                 console.log(data);
                                                 console.log(status);

                                             })
                                             .error(function  (data, status, headers, config) {
                                                 console.log('Error on Webservice');
                                                 console.log(data);
                                                 console.log(status);
                                             })

                                         /// works
                                         // var promise = params.http.get('http://192.168.0.3:1337/users')
                                         //
                                         // promise
                                         //     .success(function  (data, status, headers, config) {
                                         //         console.log('loggging web service: ');
                                         //         console.log('Got response from server');
                                         //         console.log(status);
                                         //         // console.log(response);
                                         //     })
                                         //     .error(function  (data, status, headers, config) {
                                         //         console.log('Error on Webservice');
                                         //         console.log(status); // 0 for error, 200 for success
                                         //     })


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



    webService.get()
        .success(function  (data, status, headers, config) {
            console.log('Got response from server');

        })
        .error(function  (data, status, headers, config) {
            console.log('Error on Webservice');
            console.log(data);
            console.log(status);
        })




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


    $scope.addDevice = function  () {

        $scope.device = {};

        $ionicPopup.show({
            title    : 'Raspberry Pi Device',
            //templateUrl : 'deviceIP.html',
            template : '<input type="text" placeholder="192.168.0.3" ng-model="device.ip">',
            subTitle : "Enter the IP address",
            scope    : $scope,

            buttons : [
                {
                    text : "<b>Save</b>",
                    type : "button-calm",
                    onTap: function  (event) {

                        var db = new PouchDB('DeviceDB');

                        db.get('deviceIp',function  (err , doc) {
                            if(!err){
                                db.put({
                                    _id :'deviceIp',
                                    _rev: doc._rev,  // must be added in updates
                                    ip  : $scope.device.ip
                                },function  (error , response) {
                                    if(! error){
                                        console.log('device ip insert/update is done.');
                                        console.log(response);
                                    } else {
                                        console.log('Devicd error: ' + error);
                                    }
                                })
                            } else {
                                console.log('Cant get an element from DB: ' + err);
                                console.log('putting a value in device IP ...');
                                db.put({
                                    _id :'deviceIp',
                                    ip  : $scope.device.ip
                                },function  (err,response) {
                                    if(!err){
                                        console.log('successfully put document ..' + response);
                                    } else {
                                        console.log('Problem putting a document .. ');
                                    }
                                })
                            }
                        })

                    },
                },
                {
                    text : 'Cancel',
                    type : 'button-royal',
                }]

        }).then(function(res) {
          console.log('Popup window result: ',res);
        });
    }

}])



.factory('webService',['$http', '$q', function ($http, $q) {

    console.log('Calling a webserive from factory: ');
    console.log('Getting device IP from DB, DeviceDB');

    var db = new PouchDB('DeviceDB');

    // Default values if not filled by user from popup menu
    var myFactory = {}
    var ip = '192.168.0.3'
    var port = '1337'
    var location = '/'

    db.get('deviceIp',function  (err , doc) {
        if(!err){
            console.log('Got a device IP');
            console.log(doc);
            console.log(doc._id);
            ip = doc.ip
        } else {
            console.log('Cant get IP address from DeviceDB');
        }
    })

    var URL = 'http://' + ip + ':' +port + location

    req = {
         method: 'GET',
         url: URL,
         headers: {
             'Access-Control-Allow-Origin' : '*',
  			 'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            //  'Content-Type': 'application/json',
			//  'Accept': 'application/json'
         }
         //data: { test: 'test' }
        }

    myFactory.get = function  () {
        // return $http(req)
        return $http.get(URL)
    }
    return myFactory
}])
