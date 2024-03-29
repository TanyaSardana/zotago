app.factory('facebookService', function($q,$cookieStore,$window,api,userService,$timeout) {
    //this method will fire when the user status changes i.e. login/logout
    
    function init(callback){

        $window.fbAsyncInit = function() {
            FB.init({ 
                  appId: '923132421099770',
                  status: true, 
                  cookie: true, 
                  xfbml: true,
                  version: 'v2.4'
            });
            //Quick check
            FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token and signed
                // request each expire
                api.login({
                  method: "facebook",
                  shortToken: response.authResponse.accessToken
                })
                .then(function(response){
                  userService.setToken(response.data.accessToken);
                  console.log('boom ', response);
                  api.me().then(function(response){
                    console.log('me: ', response);
                    userService.user.id  = response.data.id;
                  });
                });
              } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, but has not
                // authenticated your app
                console.log('not authorized');
              } else { 
                //the user isn't logged in to Facebook.
                console.log('the user isn\'t logged in to facebook');
              }
            });
            
            callback();
        };
    };



    return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        getProfilePic: function(userId){
            var deferred = $q.defer();
            FB.api(
                "/"+userId+"/picture",
                function (response) {
                  if (response && !response.error) {
                    /* handle the result */
                    console.log('fb image: ', response.data.url);
                    deferred.resolve(response);                    
                  }
                }
            );
            return deferred.promise;
        },
        login: function(){
            var deferred = $q.defer();
            FB.login(function(response){
                deferred.resolve(response);


            });
            return deferred.promise;
        },
        
        load : function(d,callback){
            // load the Facebook javascript SDK
            var js, 
            id = 'facebook-jssdk', 
            ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
              return;
            }

            js = d.createElement('script'); 
            js.id = id; 
            js.async = true;
            js.src = "//connect.facebook.net/en_US/sdk.js";

            ref.parentNode.insertBefore(js, ref);
            init(callback);
        },
        
                
                    
    }
});
