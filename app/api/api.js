app.factory('api', function($http){
    var baseUrl = '/api';
    return {
        
        getWantPosts: function() {
            console.log('boom');
            return $http.get( baseUrl + '/wantposts');
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
        }
        
         
    };
});