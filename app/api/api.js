app.factory('api', function($http){
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
            return $http.get( baseUrl + '/image' , { params: { "q" : param}});
        },
        getOfferingsOfWantPost: function(id){
            return $http.get( baseUrl + '/wantposts/:' + id + '/offers');
        },
        createOfferingToWantPost: function(id,dataObj){
            return $http.post( baseUrl + '/wantposts/:' + id + '/offers', dataObj);
        },


        
         
    };
});