app.factory('api', function($http,userService){
    var baseUrl = '/api';
    
    
    function basicOptions(){
        var options = {};
        if(!!userService.user.token){
            options.headers = {
                'Authorization' : 'Zotago ' + userService.user.token
            };
        }    
        return options;
    }

    function withBasicOptions(extraOptions){
        return angular.merge(basicOptions(),extraOptions);
    }


    return {

        getWantPosts: function() {
            console.log('boom');
            return $http.get( baseUrl + '/wantposts', basicOptions());
        },
        getSellPosts: function() {
            return $http.get( baseUrl + '/sellposts',basicOptions());
        },
        getQueriedWantPosts : function(param){
            console.log('/wantposts',withBasicOptions({ params: {"tags": param} }));
            return $http.get( baseUrl + '/wantposts' , withBasicOptions({ params: {"tags": param} }));
        },
        getTags: function(){
        	return $http.get( baseUrl + '/tags',basicOptions());
        },
        createWantPost: function(dataObj){	
			console.log('config: ', basicOptions());
            return $http.post(baseUrl + '/wantposts', dataObj,basicOptions());
        },
        createSellPost: function(dataObj){  
            return $http.post(baseUrl + '/sellposts', dataObj,basicOptions());
        },
        deleteWantPost: function(){
        	return;
        },
        getImage : function(param){
            return $http.get( baseUrl + '/image' , withBasicOptions({ params: { "q" : param} }));
        },

        getWantPost : function(id){
            return $http.get(baseUrl + '/wantposts/' + id,basicOptions());
        },

        getWantPostsOfUser : function(id){
            return $http.get( baseUrl + '/wantposts' , withBasicOptions({ params: { "creator" : id} }));
        },
        getSellPostsOfUser : function(id){
            return $http.get( baseUrl + '/sellposts' , withBasicOptions({ params: { "creator" : id} }));
        },


        getOfferingsOfWantPost: function(id){
            return $http.get( baseUrl + '/wantposts/' + id + '/offers',basicOptions());
        },
        createOfferingToWantPost: function(id,dataObj){
            return $http.post( baseUrl + '/wantposts/' + id + '/offers', dataObj,basicOptions());
        },

        followWantPost : function(id){
            return $http(withBasicOptions({
                method: "put",
                url: baseUrl + '/wantposts/' + id + '/followers/' + userService.user.id
            }));
        },
        unfollowWantPost : function(id){
            return $http(withBasicOptions({
                method: "delete",
                url: baseUrl + '/wantposts/' + id + '/followers/' + userService.user.id
            }));
        },

        /**
         * Registers a new account.
         *
         * @param {object} data - The registration data.
         * @param {string} data.method - The authentication method to use
         * for registration. Currently, only the "facebook" method is
         * supported.
         * @param {string} data.username - (All methods.) The username to
         * register the account with.
         * @param {string} data.shortToken - (Facebook only.) The Facebook
         * browser token that's obtained a priori by the client.
         * @return {Promise.<string|null>} - The Zotago token authorizing the
         * client to perform API calls on behalf of the authenticated account,
         * or null in case of failure.
         */
        register: function(data) {
            return $http.post(baseUrl + '/auth/register', data,basicOptions());
        },

        /**
         * Logs in.
         *
         * @param {object} data - The login data.
         * @param {string} data.method - The authentication method to use
         * for login. Currently, only the "facebook" method is supported.
         * @param {string} data.shortToken - (Facebook only.) The Facebook
         * browser token that's been obtained a prior by the client.
         * @return {Promise.<string|null>} - The Zotago token authorizing the
         * client to perform API calls on behalf of the authenticated account,
         * or null in case of failure.
         */
        login: function(data) {
            return $http.post(baseUrl + '/auth/login', data,basicOptions());
        },

        
        me : function(){
            // var options = {}
            // if(!!userService.user.token){
            //     options.headers = {
            //         'Authorization' : 'Zotago ' + userService.user.token,
            //     };
            // }
            return $http.get(baseUrl + '/me', basicOptions());
        }
    };
});
