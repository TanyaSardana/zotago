app.factory('api', function($http,userService){
    var baseUrl = '/api';
    


    return {

        getWantPosts: function() {
            console.log('boom');
            return $http.get( baseUrl + '/wantposts');
        },
        getSellPosts: function() {
            console.log('getSellPosts');
            return $http.get( baseUrl + '/sellposts');
        },
        getQueriedWantPosts : function(param){
            return $http.get( baseUrl + '/wantposts' , { params: {"tags": param} });
        },
        getTags: function(){
        	return $http.get( baseUrl + '/tags');
        },
        createWantPost: function(dataObj){	
			return $http.post(baseUrl + '/wantposts', dataObj);
        },
        createSellPost: function(dataObj){  
            return $http.post(baseUrl + '/sellposts', dataObj);
        },
        deleteWantPost: function(){
        	return;
        },
        getImage : function(param){
            return $http.get( baseUrl + '/image' , { params: { "q" : param} });
        },

        getWantPost : function(id){
            return $http.get(baseUrl + '/wantposts/' + id);
        },

        getWantPostsOfUser : function(id){
            return $http.get( baseUrl + '/wantposts' , { params: { "creator" : id} });
        },
        getSellPostsOfUser : function(id){
            return $http.get( baseUrl + '/sellposts' , { params: { "creator" : id} });
        },


        getOfferingsOfWantPost: function(id){
            return $http.get( baseUrl + '/wantposts/' + id + '/offers');
        },
        createOfferingToWantPost: function(id,dataObj){
            return $http.post( baseUrl + '/wantposts/' + id + '/offers', dataObj);
        },

        /**
         * Registers a new account.
         *
         * @param {object} options - The registration options.
         * @param {string} options.method - The authentication method to use
         * for registration. Currently, only the "facebook" method is
         * supported.
         * @param {string} options.username - (All methods.) The username to
         * register the account with.
         * @param {string} options.shortToken - (Facebook only.) The Facebook
         * browser token that's obtained a priori by the client.
         * @return {Promise.<string|null>} - The Zotago token authorizing the
         * client to perform API calls on behalf of the authenticated account,
         * or null in case of failure.
         */
        register: function(options) {
            return $http.post(baseUrl + '/auth/register', options);
        },

        /**
         * Logs in.
         *
         * @param {object} options - The login options.
         * @param {string} options.method - The authentication method to use
         * for login. Currently, only the "facebook" method is supported.
         * @param {string} options.shortToken - (Facebook only.) The Facebook
         * browser token that's been obtained a prior by the client.
         * @return {Promise.<string|null>} - The Zotago token authorizing the
         * client to perform API calls on behalf of the authenticated account,
         * or null in case of failure.
         */
        login: function(options) {
            return $http.post(baseUrl + '/auth/login', options);
        },

        
        me : function(){
            var options = {}
            if(!!userService.user.token){
                options.headers = {
                    'Authorization' : 'Zotago ' + userService.user.token,
                };
            }
            return $http.get(baseUrl + '/me', options);
        }
    };
});
