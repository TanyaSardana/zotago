app.factory('facebookService', function($q) {
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
        }
    }
});